<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase' 
import { useHead } from '@unhead/vue' 
import gsap from 'gsap'

useHead({
  title: 'Auditoría Técnica | VI_CORE',
  meta: [
    { name: 'description', content: 'Inicie una auditoría técnica de su infraestructura digital. Analizamos su arquitectura actual y diseñamos una hoja de ruta.' }
  ]
})

const mainContainer = ref(null)
const step = ref(1)
const isSubmitting = ref(false)

// --- 1. CLASES TAILWIND (Solución al error de Vite) ---
const groupClass = "flex flex-col gap-2"
const labelClass = "text-[10px] font-mono text-gray-400 uppercase tracking-widest pl-1"
const inputClass = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#D8B4FE] focus:bg-black/60 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:border-white/20 placeholder:text-gray-600 placeholder:font-light placeholder:font-sans"
const selectClass = "custom-select cursor-pointer appearance-none w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#D8B4FE] focus:bg-black/60 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:border-white/20"
const textareaClass = "resize-none leading-relaxed w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#D8B4FE] focus:bg-black/60 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:border-white/20 placeholder:text-gray-600 placeholder:font-light placeholder:font-sans"

// --- 2. DATOS GEOGRÁFICOS ---
const regionesData = {
  "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Vitacura", "Lo Barnechea", "Ñuñoa", "Maipú"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana"],
  "Biobío": ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante", "Los Ángeles"],
  "Los Lagos": ["Puerto Montt", "Puerto Varas", "Frutillar", "Osorno", "Castro"]
}
const regionesDisponibles = Object.keys(regionesData)
const comunasDisponibles = computed(() => formData.value.region ? regionesData[formData.value.region] : [])

// --- 3. ESTADO Y DATOS ---
const formData = ref({
  nombre: '', empresa: '', email: '', telefono: '+56 9 ', region: '', comuna: '', redesWeb: '', desafio: ''
})

// --- 4. REGLAS DE VALIDACIÓN ---
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email))
const isPhoneValid = computed(() => formData.value.telefono.length >= 12)

const canProceedToStep2 = computed(() => {
  return formData.value.nombre.length > 2 && formData.value.empresa.length > 2 &&
         isEmailValid.value && isPhoneValid.value && formData.value.region && formData.value.comuna
})
const canSubmit = computed(() => canProceedToStep2.value && formData.value.desafio.length >= 20)

// --- 5. TERMINAL REACTIVA ---
const systemLogs = computed(() => {
  const logs = ['> Inicializando protocolo de conexión segura...', '> Handshake SSL/TLS: Establecido.']
  if (formData.value.nombre.length > 2) logs.push(`> Identidad temporal asignada: ${formData.value.nombre.toUpperCase()}`)
  if (formData.value.empresa.length > 2) logs.push(`> Perfilando arquitectura base para: ${formData.value.empresa.toUpperCase()}`)
  if (isEmailValid.value) logs.push(`> Canal de encriptación validado: ${formData.value.email}`)
  if (step.value === 2) logs.push(`> [FASE 2] Analizando vectores de desafío operativo...`)
  if (isSubmitting.value) {
    logs.push(`> Empaquetando payload...`)
    logs.push(`> Transmitiendo a servidores centrales VI_CORE...`)
  }
  if (step.value === 3) {
    logs.push(`> STATUS 200: Operación exitosa.`)
    logs.push(`> Desconectando terminal...`)
  }
  return logs
})

// --- 6. ENVÍO AL SISTEMA ---
const submitForm = async () => {
  if (!canSubmit.value) return
  isSubmitting.value = true
  try {
    await addDoc(collection(db, "leads"), {
      ...formData.value,
      createdAt: serverTimestamp(),
      status: "Radar",
      source: "Web Contact Form"
    })
    
    gsap.to('.form-card', { opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => {
      step.value = 3
      gsap.to('.form-card', { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' })
    }})
  } catch (error) {
    console.error("Error en la transmisión:", error)
    alert("Surgió una anomalía en la red. Por favor, intente nuevamente o envíenos un correo directo.")
  } finally {
    isSubmitting.value = false
  }
}

// --- 7. ANIMACIONES GSAP ---
onMounted(() => {
  if (import.meta.client) {
    const tl = gsap.timeline()
    tl.fromTo('.anim-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo('.anim-terminal', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4')
      .fromTo('.anim-form', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
  }
})

watch(step, async (newVal, oldVal) => {
  if (newVal === 2 && oldVal === 1) {
    await nextTick()
    gsap.fromTo('.step-2-content', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' })
  }
})
</script>

<template>
  <main ref="mainContainer" class="min-h-screen bg-[#050508] text-white selection:bg-[#D8B4FE] selection:text-black font-sans relative overflow-hidden flex items-center pt-24 pb-20">
    
    <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#D8B4FE]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

    <div class="max-w-7xl mx-auto px-6 w-full relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        <div class="lg:col-span-5 space-y-8">
          <div class="anim-title">
            <p class="text-[10px] font-mono text-[#D8B4FE] uppercase tracking-widest mb-4 flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-[#D8B4FE] animate-pulse"></span>
              Conexión Encriptada E2E
            </p>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight">
              Solicitar<br>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D8B4FE] to-white/60 italic">Auditoría.</span>
            </h1>
            <p class="text-sm md:text-base text-gray-400 leading-relaxed">
              Nuestro equipo evaluará la viabilidad de su proyecto. Operamos exclusivamente mediante evaluación previa para garantizar que nuestra arquitectura se ajusta a sus requerimientos.
            </p>
          </div>

          <div class="anim-terminal bg-black/50 border border-white/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden hidden md:block">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D8B4FE]/50 to-transparent opacity-50"></div>
            <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">System.Log // Audit_Request</p>
            <div class="space-y-2 h-32 overflow-hidden flex flex-col justify-end">
              <div v-for="(log, idx) in systemLogs" :key="idx" class="text-[10px] font-mono text-green-400 opacity-80 animate-fade-in-up">
                {{ log }}
              </div>
              <span class="inline-block w-2 h-3 bg-[#D8B4FE] animate-pulse mt-1"></span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 anim-form">
          <div class="form-card bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative">
            
            <div v-if="step < 3" class="absolute top-0 left-0 w-full flex h-1 rounded-t-[2.5rem] overflow-hidden">
              <div class="h-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-[#D8B4FE]" :style="`width: ${step === 1 ? '50%' : '100%'}`"></div>
              <div class="h-full bg-white/5 flex-1"></div>
            </div>

            <form @submit.prevent="submitForm" class="mt-2">
              
              <div v-show="step === 1" class="space-y-6">
                <div class="flex justify-between items-center mb-8">
                  <h2 class="text-2xl font-serif text-white">Credenciales Base</h2>
                  <span class="text-[10px] font-mono text-gray-500 border border-white/10 px-2 py-1 rounded">Paso 1 de 2</span>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                  <div :class="groupClass">
                    <label :class="labelClass">Nombre Completo</label>
                    <input v-model="formData.nombre" type="text" placeholder="Ej. Carlos Mendoza" required :class="inputClass">
                  </div>
                  <div :class="groupClass">
                    <label :class="labelClass">Empresa</label>
                    <input v-model="formData.empresa" type="text" placeholder="Ej. VI_CORE Inc." required :class="inputClass">
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div :class="groupClass">
                    <label :class="labelClass">Correo Corporativo</label>
                    <input v-model="formData.email" type="email" placeholder="carlos@empresa.com" required :class="inputClass">
                  </div>
                  <div :class="groupClass">
                    <label :class="labelClass">Teléfono de Contacto</label>
                    <input v-model="formData.telefono" type="tel" required :class="inputClass">
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <div :class="groupClass">
                    <label :class="labelClass">Región</label>
                    <select v-model="formData.region" required :class="selectClass">
                      <option value="" disabled>Seleccione...</option>
                      <option v-for="reg in regionesDisponibles" :key="reg" :value="reg">{{ reg }}</option>
                    </select>
                  </div>
                  <div :class="groupClass">
                    <label :class="labelClass">Comuna</label>
                    <select v-model="formData.comuna" :disabled="!formData.region" required :class="[selectClass, !formData.region ? 'opacity-30' : '']">
                      <option value="" disabled>Seleccione...</option>
                      <option v-for="com in comunasDisponibles" :key="com" :value="com">{{ com }}</option>
                    </select>
                  </div>
                </div>

                <button type="button" @click="step = 2" :disabled="!canProceedToStep2" 
                        class="w-full mt-8 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-[#D8B4FE] transition-colors disabled:opacity-30 disabled:hover:bg-white flex justify-center items-center gap-2 group">
                  Siguiente Fase
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
              </div>

              <div v-show="step === 2" class="step-2-content space-y-6">
                <div class="flex justify-between items-center mb-8">
                  <h2 class="text-2xl font-serif text-white">Contexto Operativo</h2>
                  <span class="text-[10px] font-mono text-[#D8B4FE] border border-[#D8B4FE]/30 bg-[#D8B4FE]/10 px-2 py-1 rounded">Paso 2 de 2</span>
                </div>
                
                <div :class="groupClass">
                  <label :class="labelClass">Activo Digital (Sitio Web/App) - Opcional</label>
                  <input v-model="formData.redesWeb" type="text" placeholder="https://www.suempresa.com" :class="inputClass">
                </div>
                
                <div :class="groupClass">
                  <label class="flex justify-between">
                    <span :class="labelClass">Requerimientos Arquitectónicos</span>
                    <span class="text-gray-500 font-mono text-[9px]">{{ formData.desafio.length }} / Min 20 chars</span>
                  </label>
                  <textarea v-model="formData.desafio" rows="5" placeholder="Describa los cuellos de botella de su infraestructura actual o la visión del sistema..." required :class="textareaClass"></textarea>
                </div>

                <div class="flex gap-4 mt-8">
                  <button type="button" @click="step = 1" class="px-6 py-4 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white/5 transition-colors">
                    Atrás
                  </button>
                  <button type="submit" :disabled="!canSubmit || isSubmitting" 
                          class="flex-1 py-4 bg-[#D8B4FE] text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white transition-colors disabled:opacity-50 relative overflow-hidden group">
                    <span :class="{'opacity-0': isSubmitting}" class="flex items-center justify-center gap-2">
                      Transmitir Protocolo
                      <svg class="w-4 h-4 group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </span>
                    <span v-if="isSubmitting" class="absolute inset-0 flex items-center justify-center bg-[#D8B4FE]">
                      <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Procesando...
                    </span>
                  </button>
                </div>
              </div>

              <div v-show="step === 3" class="text-center py-12">
                <div class="w-24 h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                  <div class="absolute inset-0 border border-green-400 rounded-full animate-ping opacity-20"></div>
                  <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 class="text-3xl font-serif text-white mb-4">Conexión Establecida</h2>
                <p class="text-gray-400 leading-relaxed mb-10 max-w-md mx-auto">
                  Sus requerimientos han sido encriptados y recibidos en nuestro nodo central. Un arquitecto evaluará su caso y le contactará en breve.
                </p>
                <router-link to="/" class="inline-flex items-center justify-center border border-white/20 text-white px-10 py-4 rounded-full text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors gap-2">
                  Volver a la Base
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </router-link>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<style scoped>
/* Icono limpio para los selects */
.custom-select { 
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-position: right 1rem center;
  background-repeat: no-repeat;
  background-size: 1em;
}
.custom-select option { 
  background-color: #0B0B0E; 
  color: white; 
  padding: 8px; 
}

/* Animaciones nativas */
.animate-fade-in-up { 
  animation: fadeInUp 0.4s ease-out forwards; 
}
@keyframes fadeInUp { 
  from { opacity: 0; transform: translateY(10px); } 
  to { opacity: 1; transform: translateY(0); } 
}
</style>