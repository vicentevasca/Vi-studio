<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const step = ref(1)
const selectedDate = ref('')
const isFrequentClient = ref(false)

// Horarios dinámicos según el tipo de cliente
const getTimeSlots = () => {
  const start = 8.5 // 8:30 AM
  const end = isFrequentClient.value ? 17 : 12 // 5:00 PM o 12:00 PM
  const slots = []
  for (let h = start; h < end; h += 0.75) { // Slots de 45 min aprox
    const hours = Math.floor(h)
    const minutes = (h % 1) * 60 === 0 ? '00' : '30'
    slots.push(`${hours}:${minutes}`)
  }
  return slots.slice(0, 5) // Siempre limitamos a 5 cupos reales disponibles
}

onMounted(() => {
  gsap.from(".form-container", {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power4.out",
    delay: 0.5
  })
})

const nextStep = () => step.value++
</script>

<template>
  <div class="min-h-screen pt-32 pb-20 px-6 lg:px-24 bg-[#0B0B0E]">
    <div class="max-w-4xl mx-auto form-container">
      
      <header class="mb-16">
        <h1 class="text-xs uppercase tracking-[0.5em] text-[#D8B4FE] mb-6 font-mono">Protocolo de Aplicación</h1>
        <h2 class="text-4xl md:text-6xl font-serif leading-tight">
          Buscamos partners, <br> <span class="italic text-gray-500">no solo clientes.</span>
        </h2>
        <p class="mt-8 text-gray-400 font-light max-w-2xl leading-relaxed">
          Nuestra capacidad de desarrollo está limitada a 5 sesiones diarias para garantizar la excelencia. 
          La primera reunión tiene como objetivo evaluar la viabilidad técnica y estratégica de su visión.
        </p>
      </header>

      <div class="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-2xl relative overflow-hidden">
        
        <div v-if="step === 1" class="space-y-10 animate-in">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] uppercase tracking-widest text-gray-500">Nombre Completo</label>
              <input type="text" placeholder="Ej. Alexander von Humboldt" class="bg-transparent border-b border-white/10 py-3 focus:border-[#D8B4FE] outline-none transition-colors font-light">
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[10px] uppercase tracking-widest text-gray-500">Empresa / Rubro</label>
              <input type="text" placeholder="Ej. Real Estate Boutique" class="bg-transparent border-b border-white/10 py-3 focus:border-[#D8B4FE] outline-none transition-colors font-light">
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[10px] uppercase tracking-widest text-gray-500">El Desafío Principal</label>
            <textarea rows="3" placeholder="Describa el cuello de botella actual de su sistema o proceso..." class="bg-transparent border-b border-white/10 py-3 focus:border-[#D8B4FE] outline-none transition-colors font-light resize-none"></textarea>
          </div>

          <div class="flex items-center gap-4 py-4">
            <input type="checkbox" v-model="isFrequentClient" id="vip" class="accent-[#D8B4FE]">
            <label for="vip" class="text-xs text-gray-400 uppercase tracking-widest cursor-pointer">Soy cliente frecuente o colaborador directo</label>
          </div>

          <button @click="nextStep" class="group flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-[#D8B4FE]">
            Continuar al Calendario
            <svg class="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-width="1.5"></path></svg>
          </button>
        </div>

        <div v-if="step === 2" class="animate-in">
          <h3 class="text-xl font-serif mb-8 italic">Seleccione un cupo de auditoría disponible</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="bg-white/[0.03] p-6 rounded-xl border border-white/5">
                <input type="date" v-model="selectedDate" class="w-full bg-transparent text-white outline-none invert brightness-200">
                <p class="text-[9px] text-gray-500 mt-4 leading-relaxed font-mono uppercase">
                  * Horario General: 08:30 - 12:00 <br>
                  * Horario Partner: 08:30 - 17:00
                </p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button 
                v-for="time in getTimeSlots()" 
                :key="time"
                class="py-3 border border-white/10 rounded-lg text-xs font-mono hover:border-[#D8B4FE] hover:text-[#D8B4FE] transition-all"
              >
                {{ time }}
              </button>
            </div>
          </div>

          <div class="mt-12 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p class="text-[10px] text-gray-500 uppercase tracking-widest max-w-sm">
              Al solicitar esta cita, usted entiende que la sesión es una auditoría técnica y no garantiza el inicio de una relación comercial.
            </p>
            <button class="px-10 py-4 bg-white text-black text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#D8B4FE] transition-colors rounded-sm">
              Confirmar Aplicación
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.font-serif { font-family: 'Cormorant Garamond', serif; }
.animate-in {
  animation: fadeInBlur 0.8s ease-out forwards;
}

@keyframes fadeInBlur {
  from { opacity: 0; filter: blur(10px); transform: translateY(10px); }
  to { opacity: 1; filter: blur(0px); transform: translateY(0); }
}
</style>