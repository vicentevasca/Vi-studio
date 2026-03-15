<script setup>
import { onMounted, computed, ref } from 'vue'
import { leads, tasks, tickets, initAdminStore } from '../../store/admin'
import ExpedienteModal from './expediente/[id].vue'

const selectedLeadId = ref(null)
const isModalOpen = ref(false)

onMounted(async () => {
  await initAdminStore()
})

const openModal = (id) => {
  selectedLeadId.value = id
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}
const closeModal = () => {
  isModalOpen.value = false
  selectedLeadId.value = null
  document.body.style.overflow = 'auto'
}

const stats = computed(() => {
  const mrr = leads.value
    .filter(l => l.clientStatus === 'despliegue')
    .reduce((acc, curr) => acc + (Number(curr.monthlyFee) || 0), 0)
  return [
    { key: 'MRR Actual',         value: mrr.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) },
    { key: 'Clientes Activos',   value: leads.value.filter(l => l.clientStatus !== 'archivo').length },
    { key: 'Backlog Pendiente',  value: tasks.value.filter(t => t.status !== 'done').length },
    { key: 'Tickets Abiertos',   value: tickets.value.filter(t => t.status !== 'resuelto').length },
  ]
})

const pipelineStages = [
  { id: 'radar',       label: 'Radar' },
  { id: 'auditoria',   label: 'Auditoría' },
  { id: 'laboratorio', label: 'Lab' },
  { id: 'negociacion', label: 'Negoc.' },
  { id: 'despliegue',  label: 'Deploy' },
]

const pipelineCounts = computed(() =>
  pipelineStages.map(s => ({
    ...s,
    count: leads.value.filter(l => l.clientStatus === s.id).length,
  }))
)

const pipelineTotal = computed(() => leads.value.length || 1)

const quickLinks = [
  { label: 'Pipeline',    path: '/admin/pipeline',    icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' },
  { label: 'Backlog',     path: '/admin/backlog',     icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { label: 'Soporte',     path: '/admin/soporte',     icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
]

const statusColors = {
  radar:       'text-gray-400',
  auditoria:   'text-blue-400',
  laboratorio: 'text-yellow-400',
  negociacion: 'text-orange-400',
  despliegue:  'text-green-400',
  archivo:     'text-gray-600',
}

// Requiere Atención: stale leads + urgent tasks + open tickets
const alertItems = computed(() => {
  const now     = Date.now()
  const fiveDays = 5 * 24 * 60 * 60 * 1000

  const stale = leads.value
    .filter(l => l.clientStatus !== 'despliegue' && l.clientStatus !== 'archivo')
    .filter(l => {
      const ts = l.updatedAt || l.createdAt
      if (!ts) return false
      const d = ts.toDate ? ts.toDate() : new Date(ts)
      return now - d.getTime() > fiveDays
    })
    .map(l => ({
      type: 'stale',
      label: `${l.empresa || l.nombre} · sin actividad >5 días`,
      leadId: l.id,
    }))

  const urgentTasks = tasks.value
    .filter(t => t.priority === 'high' && t.status !== 'done')
    .slice(0, 4)
    .map(t => ({ type: 'task', label: t.title, leadId: null }))

  const openTickets = tickets.value
    .filter(t => t.status !== 'resuelto')
    .slice(0, 3)
    .map(t => ({ type: 'ticket', label: t.subject || t.title || 'Ticket abierto', leadId: null }))

  return [...stale, ...urgentTasks, ...openTickets]
})
</script>

<template>
  <div class="p-6 md:p-12 max-w-7xl mx-auto space-y-10 animate-fade-in">

    <header class="mb-2">
      <h1 class="text-4xl font-serif text-white italic">Centro de Comando</h1>
      <p class="text-[10px] font-mono text-[#D8B4FE]/60 uppercase tracking-[0.3em] mt-2">Vi_Studio // Sistema Activo</p>
    </header>

    <!-- KPIs -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.key"
        class="bg-[#0B0B0E] border border-white/5 p-6 rounded-3xl group hover:border-[#D8B4FE]/30 transition-colors">
        <p class="text-[8px] font-mono text-gray-500 uppercase tracking-tighter mb-2 group-hover:text-[#D8B4FE] transition-colors">{{ stat.key }}</p>
        <p class="text-xl md:text-2xl font-serif text-white">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Pipeline Distribution -->
    <section class="bg-[#0B0B0E] border border-white/5 p-8 rounded-[40px]">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-white font-serif text-lg">Distribución del Pipeline</h2>
        <span class="text-[9px] font-mono text-gray-500 uppercase">{{ leads.length }} leads totales</span>
      </div>

      <div class="flex gap-1 h-2 rounded-full overflow-hidden mb-5 bg-white/5">
        <div
          v-for="s in pipelineCounts"
          :key="s.id"
          class="transition-all duration-700"
          :class="{
            'bg-gray-500':   s.id === 'radar',
            'bg-blue-500':   s.id === 'auditoria',
            'bg-yellow-500': s.id === 'laboratorio',
            'bg-orange-500': s.id === 'negociacion',
            'bg-green-500':  s.id === 'despliegue',
          }"
          :style="{ width: `${(s.count / pipelineTotal) * 100}%` }"
        ></div>
      </div>

      <div class="grid grid-cols-5 gap-2">
        <div v-for="s in pipelineCounts" :key="s.id" class="text-center">
          <p class="text-lg font-serif text-white">{{ s.count }}</p>
          <p class="text-[8px] font-mono text-gray-500 uppercase tracking-tighter mt-1">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- Requiere Atención -->
    <section v-if="alertItems.length > 0" class="bg-red-950/15 border border-red-500/20 p-8 rounded-[40px]">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
        <h2 class="text-white font-serif text-lg">Requiere Atención</h2>
        <span class="text-[9px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">{{ alertItems.length }}</span>
      </div>
      <div class="space-y-1">
        <div v-for="item in alertItems" :key="item.label"
          class="flex items-center gap-3 py-3 border-b border-white/5 last:border-0 group"
          :class="item.leadId ? 'cursor-pointer' : ''"
          @click="item.leadId ? openModal(item.leadId) : null">
          <div class="w-1.5 h-1.5 rounded-full shrink-0"
            :class="{
              'bg-orange-400': item.type === 'stale',
              'bg-red-400':    item.type === 'task',
              'bg-yellow-400': item.type === 'ticket',
            }"></div>
          <p class="flex-1 text-sm text-gray-400 group-hover:text-white transition-colors truncate">{{ item.label }}</p>
          <span class="text-[8px] font-mono text-gray-600 uppercase shrink-0">
            {{ item.type === 'stale' ? 'Lead' : item.type === 'task' ? 'Urgente' : 'Ticket' }}
          </span>
          <svg v-if="item.leadId" class="w-3.5 h-3.5 text-gray-600 group-hover:text-[#D8B4FE] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </div>
      </div>
    </section>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Últimos prospectos -->
      <section class="bg-[#0B0B0E] border border-white/5 p-8 rounded-[40px]">
        <h2 class="text-white font-serif text-xl mb-6">Últimos Prospectos</h2>

        <!-- Empty state -->
        <div v-if="leads.length === 0" class="text-center py-8">
          <div class="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <p class="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Sin prospectos aún</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="lead in leads.slice(0, 6)" :key="lead.id"
            class="flex justify-between items-center border-b border-white/5 pb-3 group cursor-pointer"
            @click="openModal(lead.id)">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-white group-hover:text-[#D8B4FE] transition-colors truncate">
                {{ lead.empresa || lead.nombre }}
              </p>
              <p class="text-[9px] font-mono uppercase tracking-widest" :class="statusColors[lead.clientStatus] || 'text-gray-500'">
                {{ lead.clientStatus }}
              </p>
            </div>
            <svg class="w-4 h-4 text-gray-600 group-hover:text-[#D8B4FE] group-hover:translate-x-1 transition-all shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- Accesos rápidos -->
      <section class="flex flex-col gap-4">
        <router-link v-for="link in quickLinks" :key="link.path" :to="link.path"
          class="bg-[#0B0B0E] border border-white/5 p-6 rounded-3xl hover:border-[#D8B4FE]/30 transition-colors flex justify-between items-center group">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-[#D8B4FE] group-hover:bg-[#D8B4FE]/10 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="link.icon"/>
              </svg>
            </div>
            <h3 class="text-sm font-mono text-white uppercase tracking-widest group-hover:text-[#D8B4FE] transition-colors">{{ link.label }}</h3>
          </div>
          <svg class="w-4 h-4 text-gray-600 opacity-30 group-hover:opacity-100 group-hover:text-[#D8B4FE] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </router-link>
      </section>
    </div>

    <!-- Modal Expediente -->
    <Transition name="fade-modal">
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
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fade-modal-enter-active, .fade-modal-leave-active { transition: opacity 0.3s; }
.fade-modal-enter-from, .fade-modal-leave-to { opacity: 0; }
</style>
