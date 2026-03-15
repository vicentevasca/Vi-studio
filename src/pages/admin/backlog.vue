<script setup>
import { onMounted, ref, computed } from 'vue'
import { doc, updateDoc, deleteDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { leads, tasks, initAdminStore } from '../../store/admin'
import { useConfirm } from '../../composables/useConfirm'
import { useToast } from '../../composables/useToast'

const { ask } = useConfirm()
const toast = useToast()

onMounted(() => initAdminStore())

const taskColumns = [
  { id: 'pending',  title: 'To Do',    color: 'text-gray-400',  dot: 'bg-gray-500' },
  { id: 'progress', title: 'En Curso', color: 'text-blue-400',  dot: 'bg-blue-500' },
  { id: 'done',     title: 'Check',    color: 'text-green-400', dot: 'bg-green-500' },
]

const newTask       = ref({ title: '', priority: 'medium', leadId: '', dueDate: '' })
const showForm      = ref(false)
const priorityFilter = ref('all')

const getClientName = (leadId) => {
  const lead = leads.value.find(l => l.id === leadId)
  return lead ? (lead.empresa || lead.nombre) : 'Sistema Interno'
}

const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'done') return false
  return new Date(task.dueDate) < new Date()
}

const getTasksByStatus = (statusId) =>
  tasks.value.filter(t =>
    t.status === statusId &&
    (priorityFilter.value === 'all' || t.priority === priorityFilter.value)
  )

const changeTaskStatus = async (taskId, newStatus) => {
  await updateDoc(doc(db, 'tasks', taskId), { status: newStatus, updatedAt: serverTimestamp() })
  toast.success(`Tarea movida a "${taskColumns.find(c => c.id === newStatus)?.title}"`)
}

const deleteTask = async (taskId) => {
  const ok = await ask('¿Eliminar esta tarea del registro permanentemente?')
  if (!ok) return
  await deleteDoc(doc(db, 'tasks', taskId))
  toast.success('Tarea eliminada.')
}

const createTask = async () => {
  if (!newTask.value.title.trim()) {
    toast.error('El título de la tarea es obligatorio.')
    return
  }
  await addDoc(collection(db, 'tasks'), {
    title:    newTask.value.title.trim(),
    priority: newTask.value.priority,
    leadId:   newTask.value.leadId || null,
    dueDate:  newTask.value.dueDate || null,
    status:   'pending',
    createdAt: serverTimestamp(),
  })
  toast.success('Tarea añadida al backlog.')
  newTask.value = { title: '', priority: 'medium', leadId: '', dueDate: '' }
  showForm.value = false
}

const overdueCount = computed(() =>
  tasks.value.filter(t => isOverdue(t)).length
)

const priorityColors = {
  high:   'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]',
  medium: 'bg-yellow-500',
  low:    'bg-gray-600',
}
</script>

<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
    <header class="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif text-white">Backlog Maestro</h1>
        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Sincronización Global · {{ tasks.length }} tareas
          <span v-if="overdueCount > 0" class="text-red-400 ml-2">· {{ overdueCount }} vencida{{ overdueCount > 1 ? 's' : '' }}</span>
        </p>
      </div>
      <button @click="showForm = true"
        class="flex items-center gap-2 bg-[#D8B4FE] text-black px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors self-start">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
        </svg>
        Nueva Tarea
      </button>
    </header>

    <!-- Priority filter -->
    <div class="flex gap-2 mb-8 flex-wrap">
      <button v-for="p in ['all', 'high', 'medium', 'low']" :key="p"
        @click="priorityFilter = p"
        class="px-3 py-1.5 rounded-lg text-[8px] font-mono uppercase tracking-widest border transition-all"
        :class="priorityFilter === p
          ? p === 'high'   ? 'bg-red-500/20 border-red-500/40 text-red-300'
          : p === 'medium' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
          : p === 'low'    ? 'bg-gray-500/20 border-gray-500/40 text-gray-300'
                           : 'bg-[#D8B4FE]/15 border-[#D8B4FE]/30 text-[#D8B4FE]'
          : 'bg-white/5 border-white/10 text-gray-600 hover:text-white'">
        {{ p === 'all' ? 'Todas' : p }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="col in taskColumns" :key="col.id" class="flex flex-col gap-4">
        <h2 :class="col.color" class="text-[10px] font-mono uppercase tracking-[0.3em] flex items-center gap-2 border-b border-white/5 pb-3">
          <span class="w-1.5 h-1.5 rounded-full" :class="col.dot"></span>
          {{ col.title }}
          <span class="ml-auto text-gray-600">{{ getTasksByStatus(col.id).length }}</span>
        </h2>

        <!-- Empty state -->
        <div v-if="getTasksByStatus(col.id).length === 0"
          class="bg-white/[0.01] border border-dashed border-white/5 rounded-2xl py-10 flex flex-col items-center gap-2">
          <p class="text-[8px] font-mono text-gray-700 uppercase tracking-widest">Sin tareas</p>
        </div>

        <div v-for="task in getTasksByStatus(col.id)" :key="task.id"
          class="border p-5 rounded-2xl hover:border-white/20 transition-all group"
          :class="isOverdue(task) ? 'bg-red-950/10 border-red-500/20' : 'bg-[#0B0B0E] border-white/5'">

          <div class="flex justify-between items-start mb-3">
            <span class="text-[9px] font-mono text-[#D8B4FE] bg-[#D8B4FE]/10 px-2 py-1 rounded-md truncate max-w-[140px]">
              {{ getClientName(task.leadId) }}
            </span>
            <div class="w-2 h-2 rounded-full shrink-0 ml-2 mt-1" :class="priorityColors[task.priority] || priorityColors.medium"></div>
          </div>

          <h3 class="text-sm text-gray-200 leading-snug mb-3">{{ task.title }}</h3>

          <!-- Due date -->
          <div v-if="task.dueDate"
            class="flex items-center gap-1.5 mb-3 text-[8px] font-mono"
            :class="isOverdue(task) ? 'text-red-400' : 'text-gray-500'">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ isOverdue(task) ? 'Vencida · ' : '' }}{{ new Date(task.dueDate).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }) }}
          </div>

          <div class="flex gap-1 flex-wrap">
            <button v-for="c in taskColumns.filter(c => c.id !== col.id)" :key="c.id"
              @click="changeTaskStatus(task.id, c.id)"
              class="flex-1 bg-white/5 py-1.5 rounded-lg text-[8px] uppercase tracking-widest text-gray-500 hover:bg-white/10 hover:text-white transition-colors min-w-[60px]">
              {{ c.title }}
            </button>
            <button v-if="col.id === 'done'" @click="deleteTask(task.id)"
              class="flex-1 bg-red-500/10 text-red-400/60 py-1.5 rounded-lg text-[8px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors min-w-[60px]">
              Purgar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal nueva tarea -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="showForm = false"></div>
        <div class="relative z-10 bg-[#0B0B0E] border border-white/10 rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
          <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D8B4FE]/50 to-transparent"></div>
          <h2 class="text-lg font-serif text-white mb-6">Nueva Tarea</h2>

          <div class="space-y-4">
            <div class="input-group">
              <label>Título *</label>
              <input v-model="newTask.title" placeholder="Descripción de la tarea..." @keydown.enter="createTask" />
            </div>

            <div class="input-group">
              <label>Prioridad</label>
              <div class="flex gap-2">
                <button v-for="p in ['low', 'medium', 'high']" :key="p"
                  @click="newTask.priority = p"
                  class="flex-1 py-2 rounded-xl text-[9px] font-mono uppercase tracking-widest border transition-all"
                  :class="newTask.priority === p
                    ? p === 'high'   ? 'bg-red-500/20 border-red-500/50 text-red-300'
                    : p === 'medium' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                                     : 'bg-gray-500/20 border-gray-500/50 text-gray-300'
                    : 'bg-white/5 border-white/10 text-gray-600 hover:text-white'">
                  {{ p }}
                </button>
              </div>
            </div>

            <div class="input-group">
              <label>Fecha Límite (opcional)</label>
              <input v-model="newTask.dueDate" type="date"
                class="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D8B4FE]/50 transition-all" />
            </div>

            <div class="input-group">
              <label>Cliente (opcional)</label>
              <select v-model="newTask.leadId"
                class="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D8B4FE]/50 transition-all">
                <option value="">Sistema Interno</option>
                <option v-for="lead in leads" :key="lead.id" :value="lead.id">
                  {{ lead.empresa || lead.nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex gap-3 mt-8">
            <button @click="showForm = false"
              class="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-all">
              Cancelar
            </button>
            <button @click="createTask"
              class="flex-1 py-3 rounded-xl bg-[#D8B4FE] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">
              Añadir Tarea
            </button>
          </div>
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
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
