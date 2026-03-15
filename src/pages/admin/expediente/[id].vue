<script setup>
import { ref, computed, watch } from 'vue'
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../firebase'
import { leads, tasks, updateLeadData } from '../../../store/admin'
import { financeAutomation } from '../../../services/financeAutomation'
import { handlePipelineTransition } from '../../../services/pipelineAutomation'
import { useToast } from '../../../composables/useToast'
import { useNotes } from '../../../composables/useNotes'

const props = defineProps({ leadId: { type: String, required: true } })
const emit = defineEmits(['close'])

const toast = useToast()
const { notes, addNote } = useNotes(props.leadId)

const lead = computed(() => leads.value.find(l => l.id === props.leadId))
const localLead = ref(null)
const isSaving = ref(false)
const activeTab = ref('resumen')

const newTaskTitle    = ref('')
const newTaskPriority = ref('medium')
const newTaskDueDate  = ref('')
const newPaymentAmount = ref(0)
const newNote = ref('')

watch(lead, (newVal) => {
  if (newVal && !localLead.value) localLead.value = JSON.parse(JSON.stringify(newVal))
}, { immediate: true })

const leadTasks = computed(() => tasks.value.filter(t => t.leadId === props.leadId))

const paymentProgress = computed(() => {
  const paid  = Number(localLead.value?.amountPaid || 0)
  const total = Number(localLead.value?.value || 0)
  if (!total) return 0
  return Math.min(100, Math.round((paid / total) * 100))
})

const daysSinceCreation = computed(() => {
  const ts = localLead.value?.createdAt
  if (!ts) return null
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
})

const pendingTasks = computed(() => leadTasks.value.filter(t => t.status !== 'done').length)

const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'done') return false
  return new Date(task.dueDate) < new Date()
}

// ── Stage change ──────────────────────────────────────────────
const stageOptions = [
  { id: 'radar',       title: 'Radar' },
  { id: 'auditoria',   title: 'Auditoría' },
  { id: 'laboratorio', title: 'Lab' },
  { id: 'negociacion', title: 'Negoc.' },
  { id: 'despliegue',  title: 'Deploy' },
]

const changeStage = async (newStage) => {
  if (!localLead.value || localLead.value.clientStatus === newStage) return
  const oldStage = localLead.value.clientStatus
  localLead.value.clientStatus = newStage
  try {
    await updateLeadData(props.leadId, { clientStatus: newStage })
    await addNote(`Etapa cambiada: ${oldStage} → ${newStage}`, 'stage_change')
    if (lead.value) await handlePipelineTransition(lead.value, newStage)
    toast.success(`Movido a "${newStage}"`)
  } catch {
    toast.error('Error al cambiar la etapa.')
  }
}

// ── Save / Notes / Tasks / Payments ──────────────────────────
const saveChanges = async () => {
  isSaving.value = true
  await updateLeadData(props.leadId, localLead.value)
  isSaving.value = false
  toast.success('Cambios sincronizados correctamente.')
}

const addManualNote = async () => {
  if (!newNote.value.trim()) return
  await addNote(newNote.value.trim(), 'manual')
  newNote.value = ''
  toast.success('Nota añadida a la línea de tiempo.')
}

const addQuickTask = async () => {
  if (!newTaskTitle.value.trim()) {
    toast.error('El título de la tarea no puede estar vacío.')
    return
  }
  await addDoc(collection(db, 'tasks'), {
    leadId:   props.leadId,
    title:    newTaskTitle.value.trim(),
    status:   'pending',
    priority: newTaskPriority.value,
    dueDate:  newTaskDueDate.value || null,
    createdAt: serverTimestamp(),
  })
  toast.success('Tarea añadida al Backlog.')
  newTaskTitle.value    = ''
  newTaskPriority.value = 'medium'
  newTaskDueDate.value  = ''
}

const changeTaskStatus = async (taskId, newStatus) => {
  await updateDoc(doc(db, 'tasks', taskId), { status: newStatus, updatedAt: serverTimestamp() })
}

const registerPayment = async () => {
  if (newPaymentAmount.value <= 0) {
    toast.error('El monto debe ser mayor a 0.')
    return
  }
  isSaving.value = true
  try {
    const result = await financeAutomation.processNewPayment(lead.value, newPaymentAmount.value)
    const amount = newPaymentAmount.value
    if (result?.success) {
      localLead.value.amountPaid    = result.newTotal
      localLead.value.paymentHistory = [
        ...(localLead.value.paymentHistory || []),
        { amount, date: new Date() },
      ]
      await addNote(`Abono registrado: $${Number(amount).toLocaleString()}`, 'payment')
      toast.success(`Abono de $${Number(amount).toLocaleString()} registrado y notificado.`)
      newPaymentAmount.value = 0
    } else {
      localLead.value.amountPaid = Number(localLead.value.amountPaid || 0) + amount
      await addNote(`Abono registrado: $${Number(amount).toLocaleString()}`, 'payment')
      await saveChanges()
      toast.info('Abono registrado localmente (sin notificación).')
      newPaymentAmount.value = 0
    }
  } catch (error) {
    toast.error('Error al registrar el pago.')
    console.error(error)
  }
  isSaving.value = false
}

// ── Helpers ───────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return '—'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

const taskStatusLabel  = { pending: 'To Do', progress: 'En Curso', done: 'Check' }
const taskStatusColors = {
  pending:  'text-gray-400 bg-gray-500/10',
  progress: 'text-blue-400 bg-blue-500/10',
  done:     'text-green-400 bg-green-500/10',
}
const priorityDot = {
  high:   'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.6)]',
  medium: 'bg-yellow-500',
  low:    'bg-gray-600',
}
const noteTypeLabel = {
  manual:       'Nota',
  stage_change: 'Cambio de Etapa',
  payment:      'Pago',
  task:         'Tarea',
  system:       'Sistema',
}
const noteDot = {
  manual:       'bg-[#D8B4FE]',
  stage_change: 'bg-blue-400',
  payment:      'bg-green-400',
  task:         'bg-yellow-400',
  system:       'bg-gray-500',
}

const tabs = [
  { id: 'resumen',   label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'identidad', label: 'Cliente',   icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'proyecto',  label: 'Backlog',   icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { id: 'timeline',  label: 'Actividad', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'devops',    label: 'Infra',     icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2' },
  { id: 'finanzas',  label: 'Pagos',     icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]
</script>

<template>
  <div v-if="localLead" class="h-full flex flex-col max-h-[85vh]">

    <!-- Header -->
    <header class="p-6 md:p-8 border-b border-white/5 flex justify-between items-start bg-white/[0.01] shrink-0">
      <div>
        <div class="flex items-center gap-3 flex-wrap">
          <h2 class="text-xl md:text-2xl font-serif text-white italic">{{ localLead.empresa || localLead.nombre }}</h2>
          <span class="text-[8px] font-mono px-2 py-0.5 border border-[#D8B4FE]/30 text-[#D8B4FE] rounded-full uppercase">
            {{ localLead.clientStatus }}
          </span>
        </div>
        <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1">ID: {{ props.leadId }}</p>
      </div>
      <button @click="$emit('close')"
        class="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-all shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </header>

    <!-- Tabs -->
    <nav class="flex px-6 md:px-8 py-3 gap-1 border-b border-white/5 overflow-x-auto custom-scrollbar shrink-0">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-tighter transition-all whitespace-nowrap"
        :class="activeTab === tab.id ? 'bg-[#D8B4FE] text-black' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/8'">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="tab.icon"/>
        </svg>
        {{ tab.label }}
        <span v-if="tab.id === 'timeline' && notes.length > 0"
          class="ml-0.5 text-[7px] bg-white/20 px-1 rounded-full">{{ notes.length }}</span>
        <span v-if="tab.id === 'proyecto' && pendingTasks > 0"
          class="ml-0.5 text-[7px] bg-white/20 px-1 rounded-full">{{ pendingTasks }}</span>
      </button>
    </nav>

    <!-- Content -->
    <main class="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar bg-[#050508]">

      <!-- ── DASHBOARD ── -->
      <div v-if="activeTab === 'resumen'" class="space-y-6 animate-fade-in">

        <!-- Stage change -->
        <div class="bg-white/[0.02] border border-white/5 p-5 rounded-[2rem]">
          <p class="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-3">Etapa del Pipeline</p>
          <div class="flex gap-2 flex-wrap">
            <button v-for="stage in stageOptions" :key="stage.id"
              @click="changeStage(stage.id)"
              class="px-4 py-2 rounded-xl text-[9px] font-mono uppercase tracking-wider border transition-all"
              :class="localLead.clientStatus === stage.id
                ? 'bg-[#D8B4FE]/15 border-[#D8B4FE]/40 text-[#D8B4FE]'
                : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'">
              {{ stage.title }}
            </button>
          </div>
        </div>

        <!-- KPIs -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex flex-col">
            <p class="text-[8px] font-mono text-gray-500 uppercase mb-2">Recaudado</p>
            <p class="text-2xl font-serif text-white">${{ (localLead.amountPaid || 0).toLocaleString() }}</p>
          </div>
          <div class="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex flex-col">
            <p class="text-[8px] font-mono text-gray-500 uppercase mb-2">Contrato</p>
            <p class="text-2xl font-serif text-[#D8B4FE]">${{ (localLead.value || 0).toLocaleString() }}</p>
          </div>
          <div class="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex flex-col">
            <p class="text-[8px] font-mono text-gray-500 uppercase mb-2">Tareas Pendientes</p>
            <p class="text-2xl font-serif text-white">{{ pendingTasks }}</p>
          </div>
          <div class="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex flex-col">
            <p class="text-[8px] font-mono text-gray-500 uppercase mb-2">Días en Sistema</p>
            <p class="text-2xl font-serif text-white">{{ daysSinceCreation ?? '—' }}</p>
          </div>
        </div>

        <!-- Progress bar de cobranza -->
        <div class="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
          <div class="flex justify-between items-center mb-3">
            <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Progreso de Cobranza</p>
            <p class="text-sm font-serif text-white">{{ paymentProgress }}%</p>
          </div>
          <div class="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700"
              :class="paymentProgress >= 100 ? 'bg-green-500' : paymentProgress >= 50 ? 'bg-[#D8B4FE]' : 'bg-orange-500'"
              :style="{ width: `${paymentProgress}%` }"
            ></div>
          </div>
          <div class="flex justify-between mt-2">
            <span class="text-[8px] font-mono text-gray-600">${{ (localLead.amountPaid || 0).toLocaleString() }} pagado</span>
            <span class="text-[8px] font-mono text-gray-600">${{ (localLead.value || 0).toLocaleString() }} total</span>
          </div>
        </div>

        <!-- Mensualidad -->
        <div v-if="localLead.monthlyFee" class="bg-white/[0.02] border border-[#D8B4FE]/10 p-6 rounded-[2rem] flex items-center justify-between">
          <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Mensualidad MRR</p>
          <p class="text-lg font-serif text-[#D8B4FE]">${{ Number(localLead.monthlyFee).toLocaleString() }} / mes</p>
        </div>
      </div>

      <!-- ── CLIENTE ── -->
      <div v-if="activeTab === 'identidad'" class="space-y-6 animate-fade-in">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="input-group"><label>Nombre del Contacto</label><input v-model="localLead.nombre" type="text" /></div>
            <div class="input-group"><label>Correo Electrónico</label><input v-model="localLead.email" type="email" /></div>
            <div class="input-group"><label>Teléfono Corporativo</label><input v-model="localLead.telefono" type="text" /></div>
          </div>
          <div class="space-y-4">
            <div class="input-group"><label>Firma / Empresa</label><input v-model="localLead.empresa" type="text" /></div>
            <div class="input-group"><label>RUT / Tax ID</label><input v-model="localLead.rut" type="text" /></div>
            <div class="input-group"><label>Región / País</label><input v-model="localLead.region" type="text" /></div>
          </div>
        </div>

        <!-- Desafío y contexto del lead -->
        <div class="input-group">
          <label>Desafío / Problema Declarado</label>
          <textarea v-model="localLead.desafio" rows="3"
            class="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D8B4FE]/50 transition-all resize-none"></textarea>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="input-group">
            <label>Web(s) Actual(es)</label>
            <input v-model="localLead.redesWeb" type="text" placeholder="www.ejemplo.cl, app.ejemplo.cl" />
          </div>
          <div class="input-group">
            <label>Fuente del Lead</label>
            <input :value="localLead.source || '—'" type="text" readonly
              class="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-500 outline-none cursor-default" />
          </div>
        </div>
      </div>

      <!-- ── BACKLOG ── -->
      <div v-if="activeTab === 'proyecto'" class="space-y-6 animate-fade-in">
        <!-- Formulario nueva tarea -->
        <div class="bg-white/5 p-6 rounded-3xl border border-white/10">
          <h3 class="text-xs font-mono text-white mb-4 uppercase tracking-widest">Inyectar Tarea</h3>
          <div class="flex gap-2 mb-3">
            <input v-model="newTaskTitle" type="text" placeholder="Descripción de la tarea..."
              class="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D8B4FE]/50 transition-all"
              @keydown.enter="addQuickTask" />
            <button @click="addQuickTask" class="bg-[#D8B4FE] text-black px-5 rounded-xl font-bold text-[10px] uppercase hover:bg-white transition-colors">
              Añadir
            </button>
          </div>
          <div class="flex gap-2 flex-wrap items-center">
            <button v-for="p in ['low', 'medium', 'high']" :key="p"
              @click="newTaskPriority = p"
              class="px-3 py-1.5 rounded-lg text-[8px] font-mono uppercase tracking-widest border transition-all"
              :class="newTaskPriority === p
                ? p === 'high'   ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : p === 'medium' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                                 : 'bg-gray-500/20 border-gray-500/40 text-gray-300'
                : 'bg-white/5 border-white/10 text-gray-600 hover:text-white'">
              {{ p }}
            </button>
            <input v-model="newTaskDueDate" type="date"
              class="ml-auto bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-[9px] font-mono text-gray-400 outline-none focus:border-[#D8B4FE]/50 transition-all"
              title="Fecha límite (opcional)" />
          </div>
        </div>

        <!-- Lista de tareas -->
        <div v-if="leadTasks.length === 0" class="text-center py-8">
          <p class="text-[10px] font-mono text-gray-700 uppercase tracking-widest">Sin tareas para este cliente</p>
        </div>
        <div v-else class="space-y-3">
          <div v-for="task in leadTasks" :key="task.id"
            class="bg-[#0B0B0E] border p-4 rounded-2xl flex items-start gap-4 group transition-all"
            :class="isOverdue(task) ? 'border-red-500/30 bg-red-950/10' : 'border-white/5'">
            <div class="w-2 h-2 rounded-full shrink-0 mt-1.5" :class="priorityDot[task.priority] || priorityDot.medium"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white leading-snug mb-1">{{ task.title }}</p>
              <div class="flex items-center gap-2 flex-wrap mb-2">
                <span class="text-[8px] font-mono px-2 py-0.5 rounded-md" :class="taskStatusColors[task.status] || taskStatusColors.pending">
                  {{ taskStatusLabel[task.status] || task.status }}
                </span>
                <span v-if="task.dueDate"
                  class="text-[8px] font-mono px-2 py-0.5 rounded-md"
                  :class="isOverdue(task) ? 'text-red-400 bg-red-500/10' : 'text-gray-500 bg-white/5'">
                  {{ isOverdue(task) ? '⚠ ' : '' }}{{ new Date(task.dueDate).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }) }}
                </span>
              </div>
              <div class="flex gap-2 flex-wrap">
                <button v-for="status in ['pending', 'progress', 'done'].filter(s => s !== task.status)" :key="status"
                  @click="changeTaskStatus(task.id, status)"
                  class="text-[8px] font-mono text-gray-600 hover:text-[#D8B4FE] uppercase tracking-widest transition-colors">
                  → {{ taskStatusLabel[status] }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── ACTIVIDAD / TIMELINE ── -->
      <div v-if="activeTab === 'timeline'" class="space-y-6 animate-fade-in">

        <!-- Add note -->
        <div class="bg-white/5 p-6 rounded-3xl border border-white/10">
          <h3 class="text-xs font-mono text-white mb-4 uppercase tracking-widest">Añadir Nota</h3>
          <div class="flex gap-2">
            <textarea v-model="newNote"
              placeholder="Decisión tomada, reunión resumida, comentario interno..."
              rows="2"
              class="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D8B4FE]/50 transition-all resize-none"
              @keydown.ctrl.enter="addManualNote"></textarea>
            <button @click="addManualNote"
              class="bg-[#D8B4FE] text-black px-4 rounded-xl font-bold text-[10px] uppercase hover:bg-white transition-colors self-end py-3">
              Añadir
            </button>
          </div>
          <p class="text-[8px] font-mono text-gray-700 mt-2">Ctrl + Enter para añadir</p>
        </div>

        <!-- Timeline -->
        <div v-if="notes.length === 0" class="text-center py-10">
          <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-[10px] font-mono text-gray-700 uppercase tracking-widest">Sin actividad registrada</p>
        </div>
        <div v-else class="relative">
          <div class="absolute left-[5px] top-0 bottom-0 w-px bg-white/5"></div>
          <div class="space-y-0">
            <div v-for="note in notes" :key="note.id" class="flex gap-4 pb-6">
              <div class="w-3 h-3 rounded-full shrink-0 mt-0.5 border-2 border-[#050508] z-10"
                :class="noteDot[note.type] || 'bg-gray-500'"></div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <span class="text-[8px] font-mono text-gray-600 uppercase tracking-widest">
                    {{ formatDate(note.createdAt) }}
                  </span>
                  <span class="text-[7px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-500 uppercase">
                    {{ noteTypeLabel[note.type] || note.type }}
                  </span>
                </div>
                <p class="text-sm text-gray-300 leading-relaxed">{{ note.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── INFRA ── -->
      <div v-if="activeTab === 'devops'" class="space-y-6 animate-fade-in">
        <div class="grid md:grid-cols-2 gap-4">
          <div class="input-group"><label>Proveedor de Hosting</label><input v-model="localLead.hosting" placeholder="AWS, Vercel, VPS..." /></div>
          <div class="input-group"><label>Dominio Principal</label><input v-model="localLead.domain" placeholder="www.ejemplo.com" /></div>
          <div class="input-group md:col-span-2"><label>Repositorio GitHub/GitLab</label><input v-model="localLead.repo" /></div>
        </div>
      </div>

      <!-- ── FINANZAS ── -->
      <div v-if="activeTab === 'finanzas'" class="space-y-6 animate-fade-in">

        <!-- Mensualidad MRR -->
        <div class="bg-[#D8B4FE]/5 border border-[#D8B4FE]/15 p-6 rounded-[2rem]">
          <p class="text-[9px] font-mono text-[#D8B4FE]/70 uppercase tracking-widest mb-3">Mensualidad / MRR</p>
          <div class="flex items-center gap-2">
            <span class="text-gray-500 font-mono">$</span>
            <input v-model="localLead.monthlyFee" type="number" placeholder="0"
              class="flex-1 bg-transparent border-b border-white/20 py-2 text-xl text-white outline-none focus:border-[#D8B4FE] transition-colors font-mono" />
            <span class="text-[9px] text-gray-600 font-mono">/ mes</span>
          </div>
          <p class="text-[8px] text-gray-600 font-mono mt-2 uppercase">Afecta el cálculo de MRR en el Dashboard</p>
        </div>

        <!-- Registrar abono -->
        <div class="bg-green-950/30 border border-green-500/20 p-6 rounded-[2rem]">
          <h3 class="text-green-400/70 font-mono text-[9px] uppercase tracking-widest mb-4">Registrar Abono</h3>
          <div class="flex flex-col md:flex-row items-end gap-4">
            <div class="flex-grow w-full">
              <label class="text-[8px] text-gray-500 uppercase block mb-2 font-mono">Monto Recibido ($)</label>
              <input v-model="newPaymentAmount" type="number"
                class="w-full bg-white/5 border-b border-white/20 py-3 text-2xl text-white outline-none focus:border-green-400 transition-colors font-serif" />
            </div>
            <button @click="registerPayment" :disabled="isSaving"
              class="bg-green-500 text-black px-8 py-3.5 rounded-2xl font-bold uppercase text-[10px] hover:bg-white transition-all disabled:opacity-50 shrink-0">
              {{ isSaving ? 'Procesando...' : 'Registrar Abono' }}
            </button>
          </div>
        </div>

        <!-- Historial de pagos -->
        <div>
          <h3 class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-4">Historial de Pagos</h3>
          <div v-if="!localLead.paymentHistory || localLead.paymentHistory.length === 0"
            class="bg-white/[0.02] border border-dashed border-white/5 rounded-2xl py-8 text-center">
            <p class="text-[9px] font-mono text-gray-700 uppercase tracking-widest">Sin pagos registrados</p>
          </div>
          <div v-else class="space-y-2">
            <div v-for="(payment, idx) in [...localLead.paymentHistory].reverse()" :key="idx"
              class="flex items-center justify-between bg-white/[0.02] border border-white/5 px-5 py-4 rounded-2xl">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <span class="text-[9px] font-mono text-gray-400 uppercase">{{ formatDate(payment.date) }}</span>
              </div>
              <span class="text-sm font-serif text-white">+${{ Number(payment.amount).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- Footer -->
    <footer class="p-6 md:p-8 border-t border-white/5 bg-white/[0.01] flex justify-end gap-3 shrink-0">
      <button @click="$emit('close')"
        class="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-all">
        Cerrar
      </button>
      <button @click="saveChanges" :disabled="isSaving"
        class="bg-[#D8B4FE] text-black px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all disabled:opacity-50">
        {{ isSaving ? 'Guardando...' : 'Sincronizar Cambios' }}
      </button>
    </footer>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.input-group { @apply flex flex-col gap-2; }
.input-group label { @apply text-[9px] text-gray-500 font-mono uppercase tracking-widest; }
.input-group input { @apply bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D8B4FE]/50 transition-all; }
.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(216, 180, 254, 0.2); border-radius: 10px; }
.animate-fade-in { animation: fadeIn 0.35s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
</style>
