<script setup>
import { onMounted } from 'vue'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { tickets, initAdminStore } from '../../store/admin'
import { handleTicketTriage } from '../../services/supportAutomation'
import { useConfirm } from '../../composables/useConfirm'
import { useToast } from '../../composables/useToast'

const { ask } = useConfirm()
const toast = useToast()

onMounted(() => initAdminStore())

const triage = [
  { id: 'nuevo',    label: 'Bandeja',  color: 'text-white',       dot: 'bg-white/40' },
  { id: 'progreso', label: 'Análisis', color: 'text-blue-400',    dot: 'bg-blue-500' },
  { id: 'resuelto', label: 'Cerrados', color: 'text-green-400',   dot: 'bg-green-500' },
]

const getTickets = (status) => tickets.value.filter(t => (t.status || 'nuevo') === status)

const updateStatus = async (id, status) => {
  const ticket = tickets.value.find(t => t.id === id)
  await updateDoc(doc(db, 'tickets', id), { status })
  if (status === 'progreso' && ticket) await handleTicketTriage(ticket)
  toast.info(`Ticket movido a "${triage.find(t => t.id === status)?.label}"`)
}

const deleteTicket = async (id) => {
  const ok = await ask('¿Borrar este ticket del historial permanentemente?')
  if (!ok) return
  await deleteDoc(doc(db, 'tickets', id))
  toast.success('Ticket eliminado del historial.')
}
</script>

<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
    <header class="mb-10 border-b border-white/5 pb-6">
      <h1 class="text-3xl font-serif text-white">Service Desk</h1>
      <div class="flex items-center gap-2 mt-2">
        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Sistemas Operativos · {{ tickets.length }} tickets
        </span>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <section v-for="step in triage" :key="step.id" class="space-y-4">
        <h2 class="text-[9px] font-mono uppercase tracking-widest border-b border-white/10 pb-4 flex items-center gap-2" :class="step.color">
          <span class="w-1.5 h-1.5 rounded-full" :class="step.dot"></span>
          {{ step.label }}
          <span class="ml-auto text-gray-600">{{ getTickets(step.id).length }}</span>
        </h2>

        <!-- Empty state -->
        <div v-if="getTickets(step.id).length === 0"
          class="bg-white/[0.01] border border-dashed border-white/5 rounded-2xl py-10 text-center">
          <p class="text-[8px] font-mono text-gray-700 uppercase tracking-widest">Sin tickets</p>
        </div>

        <div v-for="ticket in getTickets(step.id)" :key="ticket.id"
          class="bg-[#0B0B0E] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-all">

          <!-- Barra urgencia -->
          <div v-if="ticket.severity === 'high' || ticket.priority === 'urgent'"
            class="absolute top-0 left-0 w-1.5 h-full bg-red-500/80"></div>

          <!-- Delete (solo en resueltos) -->
          <button v-if="step.id === 'resuelto'" @click="deleteTicket(ticket.id)"
            class="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full text-gray-600 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <h3 class="text-sm font-bold text-white mb-1 pr-6 leading-snug">{{ ticket.issue }}</h3>
          <p class="text-[10px] text-gray-500 font-mono mb-5 uppercase tracking-wider">{{ ticket.clientName }}</p>

          <div class="flex gap-2 flex-wrap">
            <button v-if="step.id === 'nuevo'"
              @click="updateStatus(ticket.id, 'progreso')"
              class="flex-1 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-[8px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
              Iniciar Revisión
            </button>
            <button v-if="step.id !== 'resuelto'"
              @click="updateStatus(ticket.id, 'resuelto')"
              class="flex-1 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-[8px] font-bold uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">
              Resolver
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
