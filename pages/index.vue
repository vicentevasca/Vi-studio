<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger)
}

// REFERENCIAS PARA ANIMACIONES
const heroContainer = ref(null)
const titleLine1 = ref(null)
const titleLine2 = ref(null)
const subtitle = ref(null)
const cta = ref(null)
const cards = ref([])
const powerSection = ref(null)
const powerImage = ref(null)
const powerContent = ref(null)

const systems = [
  {
    tag: 'Ecosistema 01',
    title: 'Health & Wellness Engine',
    description: 'Optimizado para clínicas de alta gama. Incluye diagnóstico interactivo, gestión de citas en tiempo real y ROI tracking automático.',
    features: ['Telegram Remote Control', 'Biometric Lead Magnet', 'High-Conversion Funnels'],
  },
  {
    tag: 'Ecosistema 02',
    title: 'Real Estate Boutique',
    description: 'Para firmas que no venden propiedades, sino exclusividad. CRM de alta velocidad y filtrado de leads por capacidad de inversión.',
    features: ['Ultra-fast SSR Catalog', 'Investor Dashboard', 'Instant Bot Alerts'],
  },
  {
    tag: 'Ecosistema 03',
    title: 'Professional Services Hub',
    description: 'Arquitectura para firmas de abogados o consultorías. Gestión de expedientes, portales privados y automatización de reportes.',
    features: ['Secure Client Portal', 'Automated Workflows', 'SEO Authority Core'],
  }
]

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

  // 1. ANIMACIÓN HERO
  gsap.set([titleLine1.value, titleLine2.value, subtitle.value, cta.value], { 
    opacity: 0, y: 40, filter: 'blur(10px)' 
  })

  tl.to(titleLine1.value, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, delay: 0.5 })
    .to(titleLine2.value, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5 }, "-=1.2")
    .to(subtitle.value, { opacity: 0.7, y: 0, filter: 'blur(0px)', duration: 1.2 }, "-=1")
    .to(cta.value, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }, "-=0.8")

  // 2. ANIMACIÓN SISTEMAS (SCROLL)
  cards.value.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      opacity: 0, y: 60, duration: 1.2, ease: "power3.out", delay: index * 0.1
    })
  })

  // 3. ANIMACIÓN INVISIBLE POWER
  gsap.from(powerContent.value, {
    scrollTrigger: {
      trigger: powerSection.value,
      start: "top 70%",
    },
    opacity: 0, x: -50, duration: 1.5, ease: "power4.out"
  })

  gsap.from(powerImage.value, {
    scrollTrigger: {
      trigger: powerSection.value,
      start: "top 70%",
    },
    opacity: 0, scale: 0.9, filter: 'blur(20px)', duration: 2, ease: "power2.out"
  })
})
</script>

<template>
  <div class="bg-[#0B0B0E] text-white overflow-hidden">
    
    <section ref="heroContainer" class="relative min-h-screen flex flex-col justify-center px-6 lg:px-24">
      <div class="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#D8B4FE]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div class="max-w-5xl z-10">
        <h1 class="text-5xl md:text-7xl lg:text-9xl font-serif leading-[1.1] tracking-tight">
          <span ref="titleLine1" class="block">Arquitectura</span>
          <span ref="titleLine2" class="block text-[#D8B4FE] italic">de Autor.</span>
        </h1>
        <p ref="subtitle" class="mt-8 max-w-xl text-lg md:text-xl text-gray-400 font-light leading-relaxed tracking-wide">
          Sistemas operativos de alta gama diseñados para empresas que demandan 
          <span class="text-white">autonomía, estabilidad y exclusividad</span>.
        </p>
        <div ref="cta" class="mt-12">
          <NuxtLink to="/contacto" class="group relative inline-flex items-center gap-4 px-8 py-4 border border-white/10 hover:border-[#D8B4FE]/50 transition-all duration-500 rounded-full">
            <span class="text-xs uppercase tracking-[0.3em]">Aplicar para Auditoría</span>
            <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4 text-[#D8B4FE] group-hover:translate-x-1 transition-transform"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="1.5"/></svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-32 px-6 lg:px-24 border-t border-white/5">
      <div class="mb-20">
        <h2 class="text-[10px] uppercase tracking-[0.5em] text-gray-500 mb-4 font-mono">Ecosistemas de Rendimiento</h2>
        <p class="text-3xl md:text-5xl font-serif max-w-2xl">Ingeniería para nichos <span class="italic text-[#D8B4FE]">exclusivos</span>.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(system, index) in systems" :key="index" ref="cards" class="group p-10 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#D8B4FE]/20 transition-all duration-700">
          <span class="text-[10px] uppercase tracking-widest text-gray-500 font-mono">{{ system.tag }}</span>
          <h3 class="text-2xl font-serif mt-6 mb-4 group-hover:text-[#D8B4FE] transition-colors">{{ system.title }}</h3>
          <p class="text-sm text-gray-400 font-light leading-relaxed mb-8">{{ system.description }}</p>
          <ul class="space-y-3">
            <li v-for="feat in system.features" :key="feat" class="flex items-center gap-3 text-[10px] uppercase tracking-widest text-gray-500">
              <span class="w-1.5 h-[1px] bg-[#D8B4FE]"></span>{{ feat }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section ref="powerSection" class="py-32 px-6 lg:px-24 bg-white/[0.01] border-y border-white/5 relative">
      <div class="flex flex-col lg:flex-row items-center gap-20">
        
        <div ref="powerContent" class="w-full lg:w-1/2">
          <h2 class="text-[10px] uppercase tracking-[0.5em] text-[#D8B4FE] mb-6 font-mono">Invisible Power</h2>
          <h3 class="text-4xl md:text-6xl font-serif mb-8 leading-tight">La complejidad detrás de la <span class="italic">simplicidad</span>.</h3>
          <p class="text-gray-400 text-lg font-light leading-relaxed mb-10">
            Mientras el mundo ve una interfaz minimalista, tú controlas un motor de alta precisión. Nuestra arquitectura basada en el sistema de la 
            <span class="text-white">Clínica Arellano</span> permite una gestión total sin fricciones.
          </p>
          
          <div class="space-y-8">
            <div class="flex gap-6">
              <div class="w-12 h-12 shrink-0 flex items-center justify-center border border-[#D8B4FE]/30 rounded-full text-[#D8B4FE] font-mono text-xs">01</div>
              <div>
                <h4 class="text-white uppercase tracking-widest text-sm mb-2">Control Remoto Total</h4>
                <p class="text-gray-500 text-sm font-light">Gestión de agenda, bloqueos y estados de pacientes directamente desde Telegram. Sin apps pesadas, sin esperas.</p>
              </div>
            </div>
            <div class="flex gap-6">
              <div class="w-12 h-12 shrink-0 flex items-center justify-center border border-white/10 rounded-full text-white font-mono text-xs">02</div>
              <div>
                <h4 class="text-white uppercase tracking-widest text-sm mb-2">Inteligencia ROI en Tiempo Real</h4>
                <p class="text-gray-500 text-sm font-light">Dashboards privados que transforman datos crudos en decisiones financieras. Sabes cuánto ganas antes de cerrar el día.</p>
              </div>
            </div>
          </div>
        </div>

        <div ref="powerImage" class="w-full lg:w-1/2 relative">
          <div class="relative z-10 p-4 bg-[#0B0B0E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-tr from-[#D8B4FE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div class="aspect-video bg-[#121216] rounded-lg border border-white/5 p-6 flex flex-col gap-4">
               <div class="flex justify-between items-center border-b border-white/5 pb-4">
                  <div class="flex gap-2 text-[8px] font-mono text-gray-500">
                    <span class="px-2 py-1 bg-white/5 rounded">LIVE_FEED</span>
                    <span class="px-2 py-1 bg-[#D8B4FE]/20 text-[#D8B4FE] rounded italic">CORE_V4</span>
                  </div>
                  <div class="w-2 h-2 rounded-full bg-[#D8B4FE] animate-pulse"></div>
               </div>
               <div class="grid grid-cols-3 gap-4 h-full">
                  <div class="bg-white/[0.02] border border-white/5 rounded p-4 flex flex-col justify-end">
                    <div class="text-[10px] text-gray-500 font-mono uppercase mb-1">Weekly ROI</div>
                    <div class="text-xl font-serif text-[#D8B4FE]">+248%</div>
                  </div>
                  <div class="col-span-2 bg-white/[0.02] border border-white/5 rounded p-4">
                    <div class="w-full h-full flex items-center justify-center">
                        <div class="w-full space-y-2">
                           <div class="h-1 bg-white/5 w-full rounded-full overflow-hidden"><div class="h-full bg-[#D8B4FE] w-3/4"></div></div>
                           <div class="h-1 bg-white/5 w-full rounded-full overflow-hidden"><div class="h-full bg-white/20 w-1/2"></div></div>
                           <div class="h-1 bg-white/5 w-full rounded-full overflow-hidden"><div class="h-full bg-[#D8B4FE] w-5/6"></div></div>
                        </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
          <div class="absolute -bottom-10 -right-10 w-64 h-64 bg-[#D8B4FE]/10 blur-[100px] rounded-full pointer-events-none"></div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.font-serif { font-family: 'Cormorant Garamond', serif; }
</style>