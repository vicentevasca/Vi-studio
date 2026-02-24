<script setup>
import { onMounted, computed } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { tickets, initAdminStore } from '../../store/admin'

onMounted(() => { initAdminStore() })

const newTickets = computed(() => tickets.value.filter(t => t.status === 'nuevo' || !t.status))
const inProgressTickets = computed(() => tickets.value.filter(t => t.status === 'progreso'))
const resolvedTickets = computed(() => tickets.value.filter(t => t.status === 'resuelto'))

const changeTicketStatus = async (ticketId, newStatus) => {
  try {
    const docRef = doc(db, 'tickets', ticketId)
    await updateDoc(docRef, { status: newStatus })
  } catch (error) { console.error(error) }
}
</script>

<template>
  <div class="h-full overflow-y-auto w-full max-w-7xl mx-auto animate-fade-in">
    <header class="mb-10 border-b border-white/5 pb-6">
      <h1 class="text-3xl font-serif text-white mb-2">Mesa de Ayuda</h1>
      <p class="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Soporte y Triage de Sistemas</p>
    </header>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="space-y-4">
        <h2 class="text-[10px] font-mono text-gray-400 uppercase tracking-widest border-b border-white/10 pb-3 mb-4">Bandeja de Entrada</h2>
        <div v-for="t in newTickets" :key="t.id" class="bg-[#0B0B0E] border border-white/5 p-5 rounded-xl">
          <h3 class="text-sm font-bold text-white mb-1">{{ t.issue }}</h3>
          <p class="text-[9px] text-gray-500 font-mono mb-4">{{ t.clientName }}</p>
          <button @click="changeTicketStatus(t.id, 'progreso')" class="w-full py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] uppercase tracking-widest rounded-lg">Iniciar Revisión</button>
        </div>
      </div>
      <div class="space-y-4">
        <h2 class="text-[10px] font-mono text-gray-400 uppercase tracking-widest border-b border-white/10 pb-3 mb-4">En Análisis</h2>
        <div v-for="t in inProgressTickets" :key="t.id" class="bg-[#0B0B0E] border border-blue-500/30 p-5 rounded-xl">
          <h3 class="text-sm font-bold text-white mb-1">{{ t.issue }}</h3>
          <p class="text-[9px] text-gray-500 font-mono mb-4">{{ t.clientName }}</p>
          <button @click="changeTicketStatus(t.id, 'resuelto')" class="w-full py-2 bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] uppercase tracking-widest rounded-lg">Marcar Resuelto</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>