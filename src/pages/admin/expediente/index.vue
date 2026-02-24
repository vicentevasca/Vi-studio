<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebase'
import ExpedienteModal from './[id].vue' // <-- Importamos el archivo como Modal

const leads = ref([])
const searchQuery = ref('')
let unsubLeads = null

// --- LÓGICA DEL MODAL ---
const selectedLeadId = ref(null)
const isModalOpen = ref(false)

const openModal = (id) => {
  selectedLeadId.value = id
  isModalOpen.value = true
  document.body.style.overflow = 'hidden' // Evita que la página de fondo haga scroll
}

const closeModal = () => {
  isModalOpen.value = false
  selectedLeadId.value = null
  document.body.style.overflow = 'auto' // Restaura el scroll
}

// --- CONEXIÓN A FIREBASE ---
onMounted(() => {
  const q = query(collection(db, "leads"), orderBy("createdAt", "desc"))
  unsubLeads = onSnapshot(q, (snapshot) => {
    leads.value = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      clientStatus: doc.data().clientStatus || 'radar' 
    }))
  }, (error) => {
    console.error("Error al cargar directorio:", error)
  })
})

onUnmounted(() => {
  if (unsubLeads) unsubLeads()
})

// --- SISTEMA DE CLASIFICACIÓN Y BÚSQUEDA ---
const filteredLeads = computed(() => {
  if (!searchQuery.value) return leads.value
  const q = searchQuery.value.toLowerCase()
  return leads.value.filter(l => 
    l.nombre?.toLowerCase().includes(q) || 
    l.empresa?.toLowerCase().includes(q)
  )
})

const activeLeads = computed(() => filteredLeads.value.filter(l => l.clientStatus !== 'archivo'))
</script>

<template>
  <div class="max-w-7xl mx-auto animate-fade-in relative">
    
    <header class="mb-10 border-b border-white/5 pb-6">
      <h1 class="text-3xl font-serif text-white mb-2">Directorio de Clientes</h1>
      <p class="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Expedientes, infraestructura y finanzas</p>
    </header>

    <div class="mb-8 relative">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Buscar por cliente o empresa..." 
        class="w-full bg-[#0B0B0E] border border-white/10 text-white rounded-xl py-4 px-6 outline-none focus:border-[#D8B4FE] transition-colors font-mono text-sm"
      >
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="lead in activeLeads" :key="lead.id" class="bg-[#0B0B0E] border border-white/5 p-6 rounded-2xl hover:border-[#D8B4FE]/30 transition-colors flex flex-col justify-between group">
        
        <div>
          <h3 class="text-xl font-serif text-white group-hover:text-[#D8B4FE] transition-colors">{{ lead.empresa || 'Sin Empresa' }}</h3>
          <p class="text-xs text-gray-500 font-mono mt-2">👤 {{ lead.nombre }}</p>
          
          <div class="mt-4 flex flex-wrap gap-2">
            <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono uppercase tracking-widest text-gray-400">
              Etapa: {{ lead.clientStatus }}
            </span>
          </div>
        </div>
        
        <div class="pt-6 mt-6 border-t border-white/5">
          <button @click="openModal(lead.id)" class="block w-full text-center py-3 bg-[#D8B4FE]/10 text-[#D8B4FE] border border-[#D8B4FE]/20 hover:bg-[#D8B4FE] hover:text-black rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
            Abrir Expediente
          </button>
        </div>

      </div>
    </div>

    <Transition name="fade-modal">
      <ExpedienteModal 
        v-if="isModalOpen" 
        :leadId="selectedLeadId" 
        @close="closeModal" 
      />
    </Transition>

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Animación de entrada/salida para el Modal */
.fade-modal-enter-active, .fade-modal-leave-active { transition: opacity 0.3s ease; }
.fade-modal-enter-from, .fade-modal-leave-to { opacity: 0; }
</style>