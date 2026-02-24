<script setup>
import { ref, computed } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase' // <-- CAMBIO: Importación directa de Firebase
import { useHead } from '@unhead/vue' // <-- CAMBIO: Importación para SEO

useHead({
  title: 'Auditoría Técnica | VI_CORE',
  meta: [
    { name: 'description', content: 'Inicie una auditoría técnica de su infraestructura digital. Analizamos su arquitectura actual y diseñamos una hoja de ruta.' }
  ]
})

const step = ref(1)
const isSubmitting = ref(false)

// --- 1. DATOS DE CHILE ---
const regionesData = {
  "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Vitacura", "Lo Barnechea", "Ñuñoa", "Maipú"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana"],
  "Biobío": ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante", "Los Ángeles"],
  "Los Lagos": ["Puerto Montt", "Puerto Varas", "Frutillar", "Osorno", "Castro"]
}
const regionesDisponibles = Object.keys(regionesData)
const comunasDisponibles = computed(() => formData.value.region ? regionesData[formData.value.region] : [])

// --- 2. ESTADO Y DATOS ---
const formData = ref({
  nombre: '',
  empresa: '',
  email: '',
  telefono: '+56 9 ',
  region: '',
  comuna: '', 
  redesWeb: '',
  desafio: ''
})

// --- 3. REGLAS DE VALIDACIÓN ESTRICTA ---
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email))
const isPhoneValid = computed(() => formData.value.telefono.length >= 12)

const canProceedToStep2 = computed(() => {
  return formData.value.nombre.length > 2 && 
         formData.value.empresa.length > 2 &&
         isEmailValid.value && 
         isPhoneValid.value &&
         formData.value.region &&
         formData.value.comuna
})

const canSubmit = computed(() => {
  return canProceedToStep2.value && formData.value.desafio.length > 20
})

// --- 4. ENVÍO AL SISTEMA ---
const submitForm = async () => {
  if (!canSubmit.value) return
  
  isSubmitting.value = true
  try {
    // CAMBIO: Usamos 'db' en lugar de '$firestore'
    await addDoc(collection(db, "leads"), {
      ...formData.value,
      createdAt: serverTimestamp(),
      status: "nuevo",
      source: "Web Contact Form"
    })
    step.value = 3 // Pantalla de éxito
  } catch (error) {
    console.error("Error en la transmisión:", error)
    alert("Surgió una anomalía en la red. Por favor, intente nuevamente o envíenos un correo directo.")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="pt-32 pb-20 min-h-screen flex items-center justify-center px-6 md:px-12 font-sans selection:bg-[#D8B4FE] selection:text-black">
    <div class="max-w-4xl w-full grid md:grid-cols-2 gap-12 bg-[#0B0B0E]/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
      
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D8B4FE]/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div class="relative z-10 flex flex-col justify-center">
        <p class="text-[10px] font-mono text-[#D8B4FE] uppercase tracking-widest mb-4 flex items-center gap-3">
          <span class="w-8 h-px bg-[#D8B4FE]/50"></span>
          Canal Seguro
        </p>
        <h1 class="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
          Solicitar<br>
          <span class="italic text-gray-400">Auditoría.</span>
        </h1>
        <p class="text-sm text-gray-400 leading-relaxed mb-8">
          Nuestro equipo evaluará la viabilidad de su proyecto. Operamos exclusivamente mediante evaluación previa para garantizar resultados de élite.
        </p>
        
        <div class="space-y-4 border-t border-white/10 pt-8">
          <div class="flex items-center gap-4 text-sm text-gray-400">
            <span class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#D8B4FE]">🛡️</span>
            Confidencialidad Estricta (NDA)
          </div>
          <div class="flex items-center gap-4 text-sm text-gray-400">
            <span class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#D8B4FE]">⚡</span>
            Respuesta en 24h hábiles
          </div>
        </div>
      </div>

      <div class="relative z-10 bg-black/40 border border-white/5 p-8 rounded-3xl backdrop-blur-sm">
        
        <div v-if="step < 3" class="flex gap-2 mb-8">
          <div class="h-1 flex-1 rounded-full transition-all duration-500" :class="step >= 1 ? 'bg-[#D8B4FE]' : 'bg-white/10'"></div>
          <div class="h-1 flex-1 rounded-full transition-all duration-500" :class="step >= 2 ? 'bg-[#D8B4FE]' : 'bg-white/10'"></div>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          
          <div v-show="step === 1" class="space-y-5 animate-fade-in">
            <h2 class="text-lg font-serif text-white mb-4">Credenciales Base</h2>
            
            <div class="input-group">
              <input v-model="formData.nombre" type="text" placeholder="Nombre Completo" required>
            </div>
            <div class="input-group">
              <input v-model="formData.empresa" type="text" placeholder="Nombre de la Empresa" required>
            </div>
            <div class="input-group">
              <input v-model="formData.email" type="email" placeholder="Correo Corporativo" required>
            </div>
            <div class="input-group">
              <input v-model="formData.telefono" type="tel" placeholder="Teléfono" required>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <select v-model="formData.region" required class="style-select">
                <option value="" disabled>Región...</option>
                <option v-for="reg in regionesDisponibles" :key="reg" :value="reg">{{ reg }}</option>
              </select>
              
              <select v-model="formData.comuna" :disabled="!formData.region" required class="style-select disabled:opacity-50">
                <option value="" disabled>Comuna...</option>
                <option v-for="com in comunasDisponibles" :key="com" :value="com">{{ com }}</option>
              </select>
            </div>

            <button type="button" @click="step = 2" :disabled="!canProceedToStep2" 
                    class="w-full mt-4 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#D8B4FE] transition-colors disabled:opacity-50 disabled:hover:bg-white">
              Siguiente Fase →
            </button>
          </div>

          <div v-show="step === 2" class="space-y-5 animate-fade-in">
            <h2 class="text-lg font-serif text-white mb-4">Contexto Operativo</h2>
            
            <div class="input-group">
              <input v-model="formData.redesWeb" type="text" placeholder="Sitio Web o Redes Sociales (Opcional)">
            </div>
            
            <div class="input-group">
              <textarea v-model="formData.desafio" rows="4" placeholder="Describa el desafío principal de su infraestructura actual o el sistema que desea construir..." required class="style-textarea"></textarea>
              <p class="text-[9px] text-gray-500 mt-2 font-mono text-right">{{ formData.desafio.length }} / Min 20 chars</p>
            </div>

            <div class="flex gap-4 mt-4">
              <button type="button" @click="step = 1" class="px-6 py-4 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 transition-colors">
                ←
              </button>
              <button type="submit" :disabled="!canSubmit || isSubmitting" 
                      class="flex-1 py-4 bg-[#D8B4FE] text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-colors disabled:opacity-50 relative overflow-hidden">
                <span :class="{'opacity-0': isSubmitting}">Transmitir Solicitud</span>
                <span v-if="isSubmitting" class="absolute inset-0 flex items-center justify-center">Procesando...</span>
              </button>
            </div>
          </div>

          <div v-show="step === 3" class="text-center py-10 animate-fade-in">
            <div class="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400 text-3xl">
              ✓
            </div>
            <h2 class="text-2xl font-serif text-white mb-4">Transmisión Exitosa</h2>
            <p class="text-sm text-gray-400 leading-relaxed mb-8">
              Sus credenciales han sido encriptadas y enviadas a nuestra central. Un arquitecto revisará su perfil y le contactará en breve.
            </p>
            <router-link to="/" class="inline-block border border-white/20 text-white px-8 py-3 rounded-full text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors">
              Volver a la Base →
            </router-link>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.font-serif { font-family: 'Cormorant Garamond', 'Playfair Display', serif; }

.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Estilos de Inputs unificados */
.input-group input { 
  @apply w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D8B4FE] focus:bg-black/60 transition-all font-sans text-sm shadow-inner; 
}
.input-group input::placeholder { @apply text-gray-600 font-light; }

/* Estilos de Select y Textarea */
.style-select { 
  @apply w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D8B4FE] focus:bg-black/60 transition-all font-sans text-sm shadow-inner cursor-pointer appearance-none; 
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.3)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-position: right 1rem center;
  background-repeat: no-repeat;
  background-size: 1em;
}
.style-select option { @apply bg-[#0B0B0E] text-white; }

.style-textarea {
  @apply w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D8B4FE] focus:bg-black/60 transition-all font-sans text-sm shadow-inner resize-none;
}
.style-textarea::placeholder { @apply text-gray-600 font-light; }
</style>