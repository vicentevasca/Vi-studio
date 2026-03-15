<script setup>
import { ref, onMounted } from 'vue'
import { doc, deleteDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { leads, tasks, initAdminStore, updateLeadData, logNote } from '../../store/admin'
import { handlePipelineTransition } from '../../services/pipelineAutomation'
import { useConfirm } from '../../composables/useConfirm'
import { useToast } from '../../composables/useToast'
import ExpedienteModal from './expediente/[id].vue'

const { ask } = useConfirm()
const toast = useToast()

const searchQuery   = ref('')
const showCreateForm = ref(false)
const selectedLeadId = ref(null)
const isModalOpen   = ref(false)

const newLead = ref({ nombre: '', empresa: '', email: '', telefono: '' })

const stages = [
  { id: 'radar',       title: 'Radar',     icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
  { id: 'auditoria',   title: 'Auditoría', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'laboratorio', title: 'Lab',        icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { id: 'negociacion', title: 'Negoc.',     icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'despliegue',  title: 'Deploy',     icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
]

onMounted(() => initAdminStore())

const getLeadsByStage = (stageId) =>
  leads.value.filter(l =>
    l.clientStatus === stageId &&
    (l.empresa || l.nombre || '').toLowerCase().includes(searchQuery.value.toLowerCase())
  )

const getStageValue = (stageId) =>
  getLeadsByStage(stageId)
    .reduce((acc, curr) => acc + (Number(curr.value) || 0), 0)
    .toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })

const getLeadTaskCount = (leadId) =>
  tasks.value.filter(t => t.leadId === leadId && t.status !== 'done').length

const openModal = (leadId) => {
  selectedLeadId.value = leadId
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}
const closeModal = () => {
  isModalOpen.value = false
  selectedLeadId.value = null
  document.body.style.overflow = 'auto'
}

const moveLead = async (id, stage) => {
  const lead = leads.value.find(l => l.id === id)
  if (!lead) return
  const oldStage = lead.clientStatus
  await updateLeadData(id, { clientStatus: stage })
  await logNote(id, `Etapa cambiada: ${oldStage} → ${stage}`, 'stage_change')
  await handlePipelineTransition(lead, stage)
  toast.success(`Lead movido a ${stage}`)
}

const deleteLead = async (id, name) => {
  const ok = await ask(`¿Eliminar permanentemente a "${name}"? Esta acción no se puede deshacer.`)
  if (!ok) return
  await deleteDoc(doc(db, 'leads', id))
  toast.success(`"${name}" eliminado del sistema.`)
}

const createLead = async () => {
  if (!newLead.value.nombre && !newLead.value.empresa) {
    toast.error('Ingresa al menos un nombre o empresa.')
    return
  }
  await addDoc(collection(db, 'leads'), {
    ...newLead.value,
    clientStatus: 'radar',
    source: 'Pipeline Manual',
    createdAt: serverTimestamp(),
  })
  toast.success(`Lead "${newLead.value.empresa || newLead.value.nombre}" creado en Radar.`)
  newLead.value = { nombre: '', empresa: '', email: '', telefono: '' }
  showCreateForm.value = false
}

const formatDate = (ts) => {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="h-full flex flex-col p-4 md:p-8">
    <header class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif text-white">Pipeline CRM</h1>
        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Flujo de Conversión</p>
      </div>
      <div class="flex gap-3 flex-wrap">
        <input v-model="searchQuery" type="text" placeholder="Buscar cliente..."
          class="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-mono text-white outline-none focus:border-[#D8B4FE]/50 transition-all w-full md:w-56" />
        <button @click="showCreateForm = true"
          class="flex items-center gap-2 bg-[#D8B4FE] text-black px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Lead
        </button>
      </div>
    </header>

    <!-- Kanban -->
    <div class="flex overflow-x-auto gap-4 pb-8 custom-scrollbar snap-x">
      <div v-for="stage in stages" :key="stage.id"
        class="min-w-[260px] md:flex-1 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col snap-center">

        <!-- Header columna -->
        <div class="p-4 border-b border-white/5">
          <div class="flex justify-between items-center mb-1">
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-[#D8B4FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="stage.icon"/>
              </svg>
              <span class="text-[10px] font-mono uppercase text-[#D8B4FE] tracking-tighter">{{ stage.title }}</span>
            </div>
            <span class="bg-white/5 text-[9px] px-2 py-0.5 rounded-full text-white">{{ getLeadsByStage(stage.id).length }}</span>
          </div>
          <p class="text-[9px] text-gray-500 font-mono">{{ getStageValue(stage.id) }}</p>
        </div>

        <!-- Cards -->
        <div class="p-3 space-y-3 overflow-y-auto max-h-[65vh] custom-scrollbar flex-1">

          <!-- Empty state -->
          <div v-if="getLeadsByStage(stage.id).length === 0" class="flex flex-col items-center justify-center py-10 text-center">
            <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
            </div>
            <p class="text-[8px] font-mono text-gray-700 uppercase tracking-widest">Vacío</p>
          </div>

          <div v-for="lead in getLeadsByStage(stage.id)" :key="lead.id"
            class="bg-[#0B0B0E] border border-white/5 p-4 rounded-2xl group hover:border-[#D8B4FE]/40 transition-all relative overflow-hidden cursor-pointer"
            @click="openModal(lead.id)">

            <!-- Delete btn -->
            <button @click.stop="deleteLead(lead.id, lead.empresa || lead.nombre)"
              class="absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded-full text-gray-600 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <!-- Info -->
            <h3 class="text-sm font-bold text-white leading-tight pr-5 mb-1">{{ lead.empresa || lead.nombre }}</h3>
            <p v-if="lead.empresa && lead.nombre" class="text-[9px] text-gray-500 font-mono mb-2">{{ lead.nombre }}</p>

            <div class="space-y-1 mt-3">
              <p v-if="lead.email" class="text-[9px] font-mono text-gray-600 truncate">{{ lead.email }}</p>
              <p v-if="lead.telefono" class="text-[9px] font-mono text-gray-600">{{ lead.telefono }}</p>
              <div class="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <span v-if="lead.value" class="text-[9px] font-mono text-[#D8B4FE]">${{ Number(lead.value).toLocaleString() }}</span>
                <span v-else class="text-[9px] text-gray-700 font-mono">Sin valor</span>
                <span class="text-[8px] font-mono text-gray-600">{{ formatDate(lead.createdAt) }}</span>
              </div>
            </div>

            <!-- Task count badge -->
            <div v-if="getLeadTaskCount(lead.id) > 0"
              class="mt-2 flex items-center gap-1.5 text-[8px] font-mono text-yellow-500/70">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              {{ getLeadTaskCount(lead.id) }} tarea{{ getLeadTaskCount(lead.id) > 1 ? 's' : '' }} pendiente{{ getLeadTaskCount(lead.id) > 1 ? 's' : '' }}
            </div>

            <!-- Move buttons -->
            <div class="flex gap-1 mt-3 pt-3 border-t border-white/5" @click.stop>
              <button v-for="s in stages.filter(s => s.id !== stage.id)" :key="s.id"
                @click="moveLead(lead.id, s.id)"
                class="flex-1 py-1.5 bg-white/5 hover:bg-[#D8B4FE] hover:text-black rounded-lg transition-colors group/btn"
                :title="s.title">
                <svg class="w-3 h-3 mx-auto text-gray-500 group-hover/btn:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="s.icon"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal crear lead -->
    <Transition name="fade">
      <div v-if="showCreateForm" class="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="showCreateForm = false"></div>
        <div class="relative z-10 bg-[#0B0B0E] border border-white/10 rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
          <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D8B4FE]/50 to-transparent"></div>
          <h2 class="text-lg font-serif text-white mb-6">Nuevo Lead</h2>

          <div class="space-y-4">
            <div class="input-group">
              <label>Empresa</label>
              <input v-model="newLead.empresa" placeholder="Acme Corp." @keydown.enter="createLead" />
            </div>
            <div class="input-group">
              <label>Contacto</label>
              <input v-model="newLead.nombre" placeholder="Nombre del contacto" @keydown.enter="createLead" />
            </div>
            <div class="input-group">
              <label>Email</label>
              <input v-model="newLead.email" type="email" placeholder="correo@empresa.cl" @keydown.enter="createLead" />
            </div>
            <div class="input-group">
              <label>Teléfono</label>
              <input v-model="newLead.telefono" placeholder="+56 9..." @keydown.enter="createLead" />
            </div>
          </div>

          <div class="flex gap-3 mt-8">
            <button @click="showCreateForm = false"
              class="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-all">
              Cancelar
            </button>
            <button @click="createLead"
              class="flex-1 py-3 rounded-xl bg-[#D8B4FE] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">
              Crear en Radar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Expediente -->
    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
        <div @click="closeModal" class="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-5xl max-h-full overflow-hidden bg-[#050508] border border-white/10 rounded-[50px] shadow-2xl">
          <ExpedienteModal :leadId="selectedLeadId" @close="closeModal" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.input-group { @apply flex flex-col gap-2; }
.input-group label { @apply text-[9px] text-gray-500 font-mono uppercase tracking-widest; }
.input-group input { @apply bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D8B4FE]/50 transition-all; }
.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
