<script setup>
import { ref, onMounted } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase' 
import { leads, initAdminStore } from '../../store/admin'

const searchQuery = ref('')

const stages = [
  { id: 'radar', title: 'Radar', icon: '📡', color: 'text-gray-400', border: 'border-gray-500/30' },
  { id: 'auditoria', title: 'Auditoría', icon: '🗓️', color: 'text-blue-400', border: 'border-blue-500/30' },
  { id: 'laboratorio', title: 'Laboratorio', icon: '🧪', color: 'text-yellow-400', border: 'border-yellow-500/30' },
  { id: 'negociacion', title: 'Negociación', icon: '📄', color: 'text-orange-400', border: 'border-orange-500/30' },
  { id: 'despliegue', title: 'Despliegue', icon: '🚀', color: 'text-green-400', border: 'border-green-500/30' }
]

onMounted(() => { initAdminStore() })

const getLeadsByStage = (stageId) => {
  return leads.value.filter(lead => {
    const statusMatch = lead.clientStatus === stageId
    const searchMatch = (lead.empresa || lead.nombre)?.toLowerCase().includes(searchQuery.value.toLowerCase())
    return statusMatch && searchMatch
  })
}

const getStageValue = (stageId) => {
  const total = leads.value
    .filter(lead => lead.clientStatus === stageId)
    .reduce((sum, lead) => sum + (Number(lead.projectValue) || 0), 0)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(total)
}

const moveLead = async (leadId, newStageId) => {
  try {
    const leadRef = doc(db, "leads", leadId)
    await updateDoc(leadRef, { clientStatus: newStageId, updatedAt: new Date() }) // Sincronizado correctamente
  } catch (error) { console.error("Error al mover lead:", error) }
}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden animate-fade-in">
    <header class="mb-8 flex justify-between items-center border-b border-white/5 pb-6">
      <div>
        <h1 class="text-3xl font-serif text-white mb-2">Pipeline (CRM)</h1>
        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Gestión de Flujo</p>
      </div>
      <input v-model="searchQuery" type="text" placeholder="Buscar empresa..." class="bg-[#0B0B0E] border border-white/10 text-white rounded-xl py-2 px-4 outline-none focus:border-[#D8B4FE] text-xs">
    </header>

    <div class="flex-grow flex gap-6 overflow-x-auto pb-6 custom-scrollbar px-2">
      <div v-for="stage in stages" :key="stage.id" class="flex-shrink-0 w-80 flex flex-col bg-[#0B0B0E] rounded-2xl border border-white/5">
        <div class="p-4 border-b border-white/5 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span>{{ stage.icon }}</span>
            <h2 class="text-xs font-mono uppercase tracking-widest" :class="stage.color">{{ stage.title }}</h2>
            <span class="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{{ getLeadsByStage(stage.id).length }}</span>
          </div>
          <span class="text-[9px] text-gray-500 font-mono">{{ getStageValue(stage.id) }}</span>
        </div>
        
        <div class="flex-grow p-4 space-y-3 overflow-y-auto custom-scrollbar-vertical">
          <div v-for="lead in getLeadsByStage(stage.id)" :key="lead.id" class="bg-black border p-4 rounded-xl group" :class="stage.border">
            <h3 class="text-sm font-bold text-white mb-1">{{ lead.empresa || 'Sin Empresa' }}</h3>
            <p class="text-[10px] text-gray-500 font-mono mb-3">{{ lead.nombre }}</p>
            <div class="mt-3 pt-3 border-t border-white/5 flex gap-1">
              <button v-for="targetStage in stages" :key="targetStage.id" v-show="targetStage.id !== stage.id" @click="moveLead(lead.id, targetStage.id)" class="flex-1 py-1 text-[8px] bg-white/5 hover:bg-[#D8B4FE] hover:text-black rounded transition-colors">
                {{ targetStage.icon }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { height: 8px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb, .custom-scrollbar-vertical::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>