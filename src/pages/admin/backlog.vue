<script setup>
import { ref, onMounted, computed } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { leads, tasks, initAdminStore } from '../../store/admin'

onMounted(() => { initAdminStore() })

const taskColumns = [
  { id: 'pending', title: 'To Do', color: 'text-gray-400', border: 'border-white/10' },
  { id: 'progress', title: 'En Progreso', color: 'text-blue-400', border: 'border-blue-500/30' },
  { id: 'done', title: 'Completado', color: 'text-green-400', border: 'border-green-500/30' }
]

const getTasksByStatus = (statusId) => tasks.value.filter(t => t.status === statusId)

const changeTaskStatus = async (taskId, newStatus) => {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    await updateDoc(taskRef, { status: newStatus })
  } catch(e) { console.error(e) }
}

const getClientName = (leadId) => {
  const lead = leads.value.find(l => l.id === leadId)
  return lead ? (lead.empresa || lead.nombre) : 'Sistema'
}
</script>

<template>
  <div class="h-full flex flex-col animate-fade-in">
    <header class="mb-8 border-b border-white/5 pb-6">
      <h1 class="text-3xl font-serif text-white mb-2">Backlog Maestro</h1>
      <p class="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Registro global sincronizado con expedientes</p>
    </header>
    
    <div class="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
      
      <div v-for="col in taskColumns" :key="col.id" class="bg-[#0B0B0E] border border-white/5 rounded-3xl flex flex-col overflow-hidden">
        <div class="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 class="text-xs font-mono uppercase tracking-widest" :class="col.color">{{ col.title }}</h2>
          <span class="bg-white/5 text-gray-500 text-[10px] px-3 py-1 rounded-full">{{ getTasksByStatus(col.id).length }}</span>
        </div>
        
        <div class="p-4 flex-grow overflow-y-auto space-y-4 custom-scrollbar">
          <div v-for="task in getTasksByStatus(col.id)" :key="task.id" class="bg-black border p-5 rounded-2xl group" :class="col.border">
            <div class="flex items-center gap-2 mb-2">
               <span class="w-2 h-2 rounded-full" :class="task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'"></span>
               <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{{ getClientName(task.leadId) }}</p>
            </div>
            <h3 class="text-sm font-sans text-white mb-4">{{ task.title }}</h3>
            
            <div class="flex gap-2">
              <button v-if="col.id !== 'pending'" @click="changeTaskStatus(task.id, 'pending')" class="flex-1 py-2 bg-white/5 text-[9px] uppercase tracking-widest text-gray-400 rounded-lg hover:bg-white/10">To Do</button>
              <button v-if="col.id !== 'progress'" @click="changeTaskStatus(task.id, 'progress')" class="flex-1 py-2 bg-blue-500/10 text-[9px] uppercase tracking-widest text-blue-400 rounded-lg hover:bg-blue-500/20">Progreso</button>
              <button v-if="col.id !== 'done'" @click="changeTaskStatus(task.id, 'done')" class="flex-1 py-2 bg-green-500/10 text-[9px] uppercase tracking-widest text-green-400 rounded-lg hover:bg-green-500/20">Check</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>