<script setup>
import { ref, onMounted, computed } from 'vue'
import { leads, initAdminStore } from '../../../store/admin'
import ExpedienteModal from './[id].vue'

const searchQuery = ref('')
const selectedLeadId = ref(null)
const isModalOpen = ref(false)

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

onMounted(() => initAdminStore())

const filteredLeads = computed(() =>
  leads.value.filter(l =>
    (l.empresa || l.nombre || '').toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const statusConfig = {
  radar:       { label: 'Radar',     classes: 'text-gray-400 bg-gray-500/10 border-gray-500/20',        dot: 'bg-gray-500' },
  auditoria:   { label: 'Auditoría', classes: 'text-blue-400 bg-blue-500/10 border-blue-500/20',          dot: 'bg-blue-500' },
  laboratorio: { label: 'Lab',       classes: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',    dot: 'bg-yellow-500' },
  negociacion: { label: 'Negoc.',    classes: 'text-orange-400 bg-orange-500/10 border-orange-500/20',    dot: 'bg-orange-500' },
  despliegue:  { label: 'Deploy',    classes: 'text-green-400 bg-green-500/10 border-green-500/20',       dot: 'bg-green-500' },
  archivo:     { label: 'Archivo',   classes: 'text-gray-600 bg-gray-700/10 border-gray-700/20',          dot: 'bg-gray-700' },
}

const getStatusConfig = (status) => statusConfig[status] || statusConfig.radar

const borderAccent = {
  radar:       'hover:border-gray-500/30',
  auditoria:   'hover:border-blue-500/30',
  laboratorio: 'hover:border-yellow-500/30',
  negociacion: 'hover:border-orange-500/30',
  despliegue:  'hover:border-green-500/30',
  archivo:     'hover:border-gray-700/30',
}
</script>

<template>
  <div class="p-6 md:p-12 max-w-7xl mx-auto animate-fade-in">
    <header class="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
      <div>
        <h1 class="text-4xl font-serif text-white italic">Directorio</h1>
        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em] mt-2">
          Expedientes de la Firma · {{ leads.length }} clientes
        </p>
      </div>
      <div class="relative w-full md:w-80">
        <input v-model="searchQuery" type="text" placeholder="BUSCAR CLIENTE..."
          class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-[10px] font-mono text-white outline-none focus:border-[#D8B4FE]/50 transition-all" />
      </div>
    </header>

    <!-- Empty state -->
    <div v-if="filteredLeads.length === 0" class="flex flex-col items-center justify-center py-32 text-center">
      <div class="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <svg class="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </div>
      <p class="text-sm font-serif text-white mb-2">Sin expedientes</p>
      <p class="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
        {{ searchQuery ? 'Sin resultados para esa búsqueda' : 'Los contactos del formulario aparecerán aquí' }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="lead in filteredLeads" :key="lead.id"
        class="bg-[#0B0B0E] border border-white/5 p-8 rounded-[40px] transition-all group relative overflow-hidden cursor-pointer"
        :class="borderAccent[lead.clientStatus] || 'hover:border-[#D8B4FE]/30'"
        @click="openModal(lead.id)">

        <!-- Status badge top-right -->
        <div class="absolute top-6 right-6">
          <span
            class="text-[8px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border"
            :class="getStatusConfig(lead.clientStatus).classes">
            <span class="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle" :class="getStatusConfig(lead.clientStatus).dot"></span>
            {{ getStatusConfig(lead.clientStatus).label }}
          </span>
        </div>

        <h3 class="text-xl font-serif text-white mb-1 pr-24 group-hover:text-[#D8B4FE] transition-colors">
          {{ lead.empresa || 'Sin Empresa' }}
        </h3>
        <p class="text-[10px] text-gray-500 font-mono mb-6 uppercase tracking-widest">{{ lead.nombre }}</p>
        <p v-if="lead.email" class="text-[9px] text-gray-600 font-mono mb-4 truncate">{{ lead.email }}</p>

        <div class="flex items-center justify-between pt-5 border-t border-white/5">
          <div class="flex flex-col">
            <span class="text-[8px] text-gray-600 uppercase font-mono">Valor Proyecto</span>
            <span class="text-sm text-white font-mono">${{ (lead.value || 0).toLocaleString() }}</span>
          </div>
          <div class="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:bg-[#D8B4FE] group-hover:text-black group-hover:border-[#D8B4FE] transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
        <div @click="closeModal" class="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-5xl max-h-full overflow-hidden bg-[#050508] border border-white/10 rounded-[50px] shadow-2xl animate-scale-up">
          <ExpedienteModal :leadId="selectedLeadId" @close="closeModal" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleUp { from { transform: scale(0.9) translateY(30px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
</style>
