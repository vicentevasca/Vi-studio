<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { doc, onSnapshot, updateDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore'
import { db } from '../../../firebase'

const props = defineProps({ leadId: { type: String, required: true } })
const emit = defineEmits(['close'])

// --- ESTADOS DE DATOS ---
const lead = ref(null)      
const localLead = ref(null) 
const localTasks = ref([]) // Tareas en memoria
const newDraftTask = ref({ title: '', priority: 'medium' })

const loading = ref(true)
const isSaving = ref(false)
const hasChanges = ref(false)
let unsub = null

const activeTab = ref('resumen')

const tabs = [
  { id: 'resumen', label: 'Dashboard', icon: '📊' },
  { id: 'identidad', label: 'Cliente', icon: '👤' },
  { id: 'proyecto', label: 'Backlog', icon: '📋' },
  { id: 'devops', label: 'Infraestructura', icon: '☁️' },
  { id: 'finanzas', label: 'Finanzas', icon: '💎' }
]

const pipelineSteps = ['radar', 'auditoria', 'laboratorio', 'negociacion', 'despliegue']

// --- INICIALIZACIÓN Y LECTURA ÚNICA ---
onMounted(async () => {
  // 1. Escuchar el Lead
  const leadRef = doc(db, 'leads', props.leadId)
  unsub = onSnapshot(leadRef, (snapshot) => {
    if(snapshot.exists()) {
       lead.value = { id: snapshot.id, ...snapshot.data() }
       if(!localLead.value) {
          localLead.value = JSON.parse(JSON.stringify(lead.value)) // Copia profunda
       }
       loading.value = false
    } else {
       emit('close')
    }
  })

  // 2. Cargar tareas asociadas (1 sola lectura inicial para ahorrar)
  const qTasks = query(collection(db, 'tasks'), where('leadId', '==', props.leadId))
  const snapTasks = await getDocs(qTasks)
  localTasks.value = snapTasks.docs.map(d => ({ id: d.id, ...d.data() }))
})

onUnmounted(() => { if (unsub) unsub() })

// --- DETECCIÓN DE CAMBIOS (Para activar el botón Guardar) ---
watch(localLead, (newVal, oldVal) => { if(oldVal !== null) hasChanges.value = true }, { deep: true }) 
watch(localTasks, (newVal, oldVal) => { if(oldVal.length > 0) hasChanges.value = true }, { deep: true })

// --- LÓGICA DEL BACKLOG (En Memoria) ---
const addTaskToDraft = () => {
  if(!newDraftTask.value.title) return
  localTasks.value.push({
    id: `draft_${Date.now()}`, // ID temporal
    leadId: props.leadId,
    title: newDraftTask.value.title,
    priority: newDraftTask.value.priority,
    status: 'pending',
    isNew: true // Marca para saber que hay que crearla en Firebase
  })
  newDraftTask.value.title = ''
}

const removeTaskDraft = (taskId) => {
  localTasks.value = localTasks.value.filter(t => t.id !== taskId)
  hasChanges.value = true
}

// --- GRÁFICOS Y MÉTRICAS COMPUTADAS ---
const paymentProgress = computed(() => {
  if (!localLead.value?.projectValue) return 0
  const percent = (Number(localLead.value.amountPaid) / Number(localLead.value.projectValue)) * 100
  return Math.min(Math.round(percent), 100)
})

const currentStepIndex = computed(() => pipelineSteps.indexOf(localLead.value?.clientStatus || 'radar'))

// --- SINCRONIZACIÓN BATCH (Ahorro Máximo de Firebase) ---
const saveAllChanges = async () => {
    if(!hasChanges.value) return;
    isSaving.value = true;
    
    try {
        const batch = writeBatch(db)

        // 1. Actualizar Datos del Lead
        const leadRef = doc(db, 'leads', props.leadId)
        batch.update(leadRef, { ...localLead.value, updatedAt: new Date() })

        // 2. Procesar Tareas Nuevas
        const tasksCollection = collection(db, 'tasks')
        localTasks.value.forEach(task => {
          if (task.isNew) {
            const newTaskRef = doc(tasksCollection) // Genera ID automático
            const { id, isNew, ...taskData } = task // Quitamos las marcas temporales
            batch.set(newTaskRef, { ...taskData, createdAt: new Date() })
            task.id = newTaskRef.id // Actualizamos localmente
            task.isNew = false
          }
        })

        // Ejecutamos todo de un solo golpe (1 sola transacción)
        await batch.commit()
        hasChanges.value = false;

    } catch(error) {
        console.error('Error sincronizando:', error);
    } finally {
        isSaving.value = false;
    }
}

const discardChanges = () => {
   localLead.value = JSON.parse(JSON.stringify(lead.value));
   hasChanges.value = false;
   emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 md:p-6" @click.self="emit('close')">
    
    <div class="bg-[#050508] w-full max-w-5xl h-[95dvh] md:max-h-[85vh] rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl relative flex flex-col animate-scale-up overflow-hidden">
        
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-white/5 bg-[#0B0B0E] shrink-0 gap-4">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <span class="w-2 h-2 rounded-full" :class="localLead?.systemStatus === 'active' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'"></span>
              <h2 class="text-xl md:text-2xl font-serif text-white">{{ localLead?.empresa || 'Expediente Cliente' }}</h2>
            </div>
            <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest">ID: {{ leadId }} | {{ localLead?.nombre }}</p>
          </div>
          <button @click="emit('close')" class="absolute top-6 right-6 sm:static text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all border border-white/5">
            ✕
          </button>
        </div>

        <div v-if="!loading" class="flex gap-1 px-4 md:px-6 pt-2 bg-[#0B0B0E] border-b border-white/5 overflow-x-auto custom-scrollbar shrink-0">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
            class="px-4 py-3 text-[9px] md:text-[10px] font-mono uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors"
            :class="activeTab === tab.id ? 'border-[#D8B4FE] text-[#D8B4FE]' : 'border-transparent text-gray-500 hover:text-white'">
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>

        <div class="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-10 relative">
          
          <div v-if="loading" class="flex flex-col items-center justify-center h-40 opacity-50">
            <span class="text-3xl mb-4 animate-spin">⚙️</span>
            <p class="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">Desencriptando...</p>
          </div>

          <div v-else class="space-y-8 pb-10">
            
            <div v-show="activeTab === 'resumen'" class="animate-fade space-y-8">
              
              <div class="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                <h3 class="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mb-6">Estado en Pipeline</h3>
                <div class="flex justify-between items-center relative">
                  <div class="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10 -translate-y-1/2 rounded"></div>
                  <div class="absolute top-1/2 left-0 h-0.5 bg-[#D8B4FE] -z-10 -translate-y-1/2 rounded transition-all duration-500" :style="`width: ${(currentStepIndex / 4) * 100}%`"></div>
                  
                  <div v-for="(step, i) in pipelineSteps" :key="step" class="flex flex-col items-center gap-2 cursor-pointer group" @click="localLead.clientStatus = step">
                    <div class="w-4 h-4 rounded-full border-2 transition-colors duration-300" :class="i <= currentStepIndex ? 'bg-[#D8B4FE] border-[#D8B4FE] shadow-[0_0_15px_rgba(216,180,254,0.4)]' : 'bg-[#050508] border-white/20 group-hover:border-white/50'"></div>
                    <span class="text-[8px] font-mono uppercase tracking-widest hidden md:block" :class="i <= currentStepIndex ? 'text-[#D8B4FE]' : 'text-gray-500'">{{ step }}</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                  <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">MRR (Mensualidad)</p>
                  <h3 class="text-2xl font-serif text-white">${{ Number(localLead.monthlyFee || 0).toLocaleString() }} <span class="text-xs text-gray-500">USD</span></h3>
                </div>
                <div class="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                  <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Progreso de Pago</p>
                  <div class="flex items-center gap-4">
                    <h3 class="text-2xl font-serif text-white">{{ paymentProgress }}%</h3>
                    <div class="flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div class="h-full bg-green-400 transition-all duration-1000" :style="`width: ${paymentProgress}%`"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-show="activeTab === 'identidad'" class="animate-fade">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div class="input-group"><label>Empresa</label><input v-model="localLead.empresa" type="text" /></div>
                <div class="input-group"><label>Nombre Contacto</label><input v-model="localLead.nombre" type="text" /></div>
                <div class="input-group"><label>Email Corporativo</label><input v-model="localLead.email" type="email" /></div>
                <div class="input-group"><label>Teléfono</label><input v-model="localLead.telefono" type="text" /></div>
                <div class="input-group"><label>Región</label><input v-model="localLead.region" type="text" /></div>
                <div class="input-group"><label>Comuna</label><input v-model="localLead.comuna" type="text" /></div>
                <div class="input-group md:col-span-2"><label>Sector / Rubro</label><input v-model="localLead.rubro" type="text" /></div>
                <div class="input-group md:col-span-2"><label>Notas de Auditoría / Detalles</label><textarea v-model="localLead.descripcion" rows="3" class="bg-black/30 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#D8B4FE] text-sm custom-scrollbar"></textarea></div>
              </div>
            </div>

            <div v-show="activeTab === 'proyecto'" class="animate-fade space-y-6">
              <div class="flex gap-2">
                <input v-model="newDraftTask.title" @keyup.enter="addTaskToDraft" type="text" placeholder="Nueva tarea técnica..." class="flex-grow bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D8B4FE] text-sm font-mono">
                <select v-model="newDraftTask.priority" class="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-[10px] uppercase tracking-widest font-mono cursor-pointer">
                  <option value="low">Low</option><option value="medium">Med</option><option value="high">High</option>
                </select>
                <button @click="addTaskToDraft" class="bg-white/10 hover:bg-[#D8B4FE] hover:text-black text-white px-6 rounded-xl transition-colors text-xl font-bold">+</button>
              </div>

              <div class="space-y-2">
                <div v-for="task in localTasks" :key="task.id" class="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/20 transition-colors">
                  <div class="flex items-center gap-4">
                    <span class="w-2 h-2 rounded-full" :class="task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'"></span>
                    <span class="text-sm font-sans text-white" :class="{'line-through text-gray-500': task.status === 'done'}">{{ task.title }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span v-if="task.isNew" class="text-[8px] uppercase tracking-widest text-[#D8B4FE] border border-[#D8B4FE]/30 px-2 py-1 rounded bg-[#D8B4FE]/10">Borrador</span>
                    <button v-if="task.isNew" @click="removeTaskDraft(task.id)" class="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
                  </div>
                </div>
                <p v-if="localTasks.length === 0" class="text-[10px] text-gray-500 font-mono text-center py-6">No hay tareas en el backlog.</p>
              </div>
            </div>

            <div v-show="activeTab === 'devops'" class="animate-fade">
               <div class="grid grid-cols-1 gap-6">
                <div class="input-group">
                  <label>Estado del Servidor</label>
                  <select v-model="localLead.systemStatus" class="bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#D8B4FE] text-sm">
                    <option value="active">🟢 Operativo y En Línea</option>
                    <option value="maintenance">🟡 En Mantenimiento</option>
                    <option value="down">🔴 Caído / Suspendido</option>
                  </select>
                </div>
                <div class="input-group"><label>URL del Proyecto (Producción)</label><input v-model="localLead.prodUrl" type="text" placeholder="https://" /></div>
                <div class="input-group"><label>Repositorio Git</label><input v-model="localLead.gitRepo" type="text" placeholder="github.com/..." /></div>
               </div>
            </div>

            <div v-show="activeTab === 'finanzas'" class="animate-fade">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="input-group"><label>Valor Total del Proyecto (USD)</label><input v-model="localLead.projectValue" type="number" /></div>
                <div class="input-group"><label>Monto Pagado a la Fecha (USD)</label><input v-model="localLead.amountPaid" type="number" /></div>
                <div class="input-group md:col-span-2"><label>Mensualidad (MRR / Retención)</label><input v-model="localLead.monthlyFee" type="number" /></div>
              </div>
            </div>

          </div>
        </div>

        <div v-if="hasChanges" class="bg-[#0B0B0E] border-t border-white/10 p-4 md:p-6 flex justify-between items-center shrink-0 animate-slide-up z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <p class="text-[9px] font-mono text-yellow-500 uppercase tracking-widest hidden md:block">⚠️ Modificaciones en Borrador</p>
          <div class="flex gap-2 w-full md:w-auto">
            <button @click="discardChanges" class="flex-1 md:flex-none text-[9px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors py-3 px-6 rounded-xl hover:bg-white/5">
              Cerrar
            </button>
            <button @click="saveAllChanges" :disabled="isSaving" class="flex-1 md:flex-none bg-[#D8B4FE] text-black px-6 md:px-10 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(216,180,254,0.3)] disabled:opacity-50">
              {{ isSaving ? 'Ejecutando...' : 'Guardar y Sincronizar' }}
            </button>
          </div>
        </div>

    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }

.animate-fade { animation: fadeIn 0.4s ease forwards; }
.animate-slide-up { animation: slideUp 0.3s ease forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Inputs Unificados con contacto.vue */
.input-group { @apply flex flex-col gap-2; }
.input-group label { @apply text-[9px] uppercase tracking-[0.2em] text-gray-500 font-mono; }
.input-group input { 
  @apply w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D8B4FE] focus:bg-black/60 transition-all font-sans text-sm shadow-inner; 
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(216,180,254,0.2); border-radius: 10px; }
</style>