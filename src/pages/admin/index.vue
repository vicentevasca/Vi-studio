<script setup>
import { onMounted, computed } from 'vue'
import { leads, initAdminStore } from '../../store/admin'

onMounted(() => {
  initAdminStore() // Enciende el cerebro (solo gastará Firebase la primera vez)
})

// --- SISTEMA DE CLASIFICACIÓN ---
const activeLeads = computed(() => leads.value.filter(l => l.clientStatus !== 'archivo'))
const radarLeads = computed(() => activeLeads.value.filter(l => l.clientStatus === 'radar'))
const auditoriaLeads = computed(() => activeLeads.value.filter(l => l.clientStatus === 'auditoria'))
const laboratorioLeads = computed(() => activeLeads.value.filter(l => l.clientStatus === 'laboratorio'))
const negociacionLeads = computed(() => activeLeads.value.filter(l => l.clientStatus === 'negociacion'))
const deployLeads = computed(() => activeLeads.value.filter(l => l.clientStatus === 'despliegue'))

// --- MOTOR DE ANALÍTICA FINANCIERA ---
const stats = computed(() => {
  let activeFleet = deployLeads.value.length
  let mrr = 0 
  let pipelineValue = 0
  let totalRevenue = 0
  let inNegotiation = negociacionLeads.value.length
  let systemAlerts = 0 

  leads.value.forEach(l => {
    totalRevenue += (Number(l.amountPaid) || 0)
    if (l.clientStatus === 'despliegue') {
      mrr += (Number(l.monthlyFee) || 0)
      if (l.systemStatus === 'down' || l.systemStatus === 'maintenance') systemAlerts++
    } else if (l.clientStatus !== 'archivo') {
      pipelineValue += (Number(l.projectValue) || 0)
    }
  })

  return { activeFleet, mrr, pipelineValue, totalRevenue, inNegotiation, systemAlerts }
})
</script>

<template>
  <div class="max-w-7xl mx-auto animate-fade-in">
    <header class="mb-10 flex flex-col justify-between items-start border-b border-white/5 pb-6">
      <h1 class="text-3xl font-serif text-white mb-2">Command Center</h1>
      <p class="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Visión Global y Analítica en Tiempo Real</p>
    </header>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      <div class="bg-[#0B0B0E] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-32 h-32 bg-[#D8B4FE]/5 blur-3xl rounded-full group-hover:bg-[#D8B4FE]/10 transition-colors"></div>
        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Ingreso Recurrente (MRR)</p>
        <h3 class="text-3xl font-serif text-white">${{ stats.mrr.toLocaleString() }} <span class="text-sm text-gray-500">USD</span></h3>
      </div>
      <div class="bg-[#0B0B0E] border border-white/5 p-6 rounded-2xl">
        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Valor del Pipeline</p>
        <h3 class="text-3xl font-serif text-white">${{ stats.pipelineValue.toLocaleString() }}</h3>
      </div>
      <div class="bg-[#0B0B0E] border border-white/5 p-6 rounded-2xl">
        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Flota Activa</p>
        <h3 class="text-3xl font-serif text-white">{{ stats.activeFleet }}</h3>
      </div>
      <div class="bg-[#0B0B0E] border border-white/5 p-6 rounded-2xl" :class="stats.systemAlerts > 0 ? 'border-red-500/30 bg-red-500/5' : ''">
        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Alertas</p>
        <h3 class="text-3xl font-serif" :class="stats.systemAlerts > 0 ? 'text-red-400' : 'text-white'">{{ stats.systemAlerts }}</h3>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-black border border-white/5 rounded-3xl p-8">
        <h2 class="text-sm font-mono text-gray-400 uppercase tracking-[0.2em] mb-8">Radar Táctico</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="p-4 border border-white/5 rounded-xl bg-white/[0.02]">
            <p class="text-2xl font-serif text-white mb-1">{{ radarLeads.length }}</p>
            <p class="text-[8px] font-mono text-gray-500 uppercase tracking-widest">En Radar</p>
          </div>
          <div class="p-4 border border-blue-500/10 rounded-xl bg-blue-500/5">
            <p class="text-2xl font-serif text-white mb-1">{{ auditoriaLeads.length }}</p>
            <p class="text-[8px] font-mono text-blue-400 uppercase tracking-widest">Auditoría</p>
          </div>
          <div class="p-4 border border-yellow-500/10 rounded-xl bg-yellow-500/5">
            <p class="text-2xl font-serif text-white mb-1">{{ laboratorioLeads.length }}</p>
            <p class="text-[8px] font-mono text-yellow-400 uppercase tracking-widest">Laboratorio</p>
          </div>
          <div class="p-4 border border-orange-500/10 rounded-xl bg-orange-500/5">
            <p class="text-2xl font-serif text-white mb-1">{{ stats.inNegotiation }}</p>
            <p class="text-[8px] font-mono text-orange-400 uppercase tracking-widest">Negociación</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <router-link to="/admin/pipeline" class="bg-[#0B0B0E] border border-white/5 p-6 rounded-3xl hover:border-[#D8B4FE]/30 transition-colors flex justify-between items-center group">
          <div><h3 class="text-sm font-serif text-white group-hover:text-[#D8B4FE] mb-1">Pipeline (CRM)</h3></div><span class="text-xl">📊</span>
        </router-link>
        <router-link to="/admin/backlog" class="bg-[#0B0B0E] border border-white/5 p-6 rounded-3xl hover:border-[#D8B4FE]/30 transition-colors flex justify-between items-center group">
          <div><h3 class="text-sm font-serif text-white group-hover:text-[#D8B4FE] mb-1">Backlog</h3></div><span class="text-xl">📋</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>