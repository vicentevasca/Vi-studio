<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
  title: 'Vi_Studio | Arquitectura de Software & Venture Studio',
  meta: [
    { name: 'description', content: 'Firma de arquitectura de software y fábrica de activos digitales de alto rendimiento. Diseñamos ecosistemas a medida para clientes corporativos y construimos SaaS propios bajo el modelo Venture Studio.' }
  ]
})

// REFERENCIAS PARA ANIMACIONES
const heroContext = ref(null)
const systemsGrid = ref(null)

const systems = [
  {
    tag: 'Ecosistema 01',
    title: 'Health & Wellness Engine',
    description: 'Optimizado para clínicas de alta gama. Incluye diagnóstico interactivo, gestión de citas en tiempo real y ROI tracking automático.',
    features: ['Dashboard Analítico', 'Gestión de Pacientes', 'High-Conversion Funnel'],
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
    description: 'Arquitectura para firmas de abogados o consultorías. Centralice documentos, facturación y comunicación con clientes VIP.',
    features: ['Client Portal', 'Automated Billing', 'Secure File Vault'],
  }
]

// Datos para el Carrusel Infinito
const trustMetrics = [
  "🎯 +400% ROI Promedio",
  "⚡ TTM < 60 Días a Producción",
  "🔒 Encriptación E2E Nivel Militar",
  "🚀 Exits 3x–5x ARR",
  "🤖 Automatización con IA",
  "📊 Dashboards en Tiempo Real",
  "🏗️ Vi_Boilerplate Modular",
  "🌎 Operación Faceless LATAM"
]

let ctx;

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger)
    
    ctx = gsap.context(() => {
      // 1. Animación del Hero
      const tl = gsap.timeline()
      tl.fromTo('.hero-badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo('.hero-title', { y: 30, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }, '-=0.4')
        .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
        .fromTo('.hero-btns', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
        .fromTo('.hero-glass-widget', { x: 50, opacity: 0, rotationY: 15 }, { x: 0, opacity: 1, rotationY: 0, duration: 1.2, ease: 'expo.out' }, '-=0.8')

      // 2. Animación de las Tarjetas de Sistemas (Stagger)
      gsap.fromTo('.system-card', 
        { y: 60, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: systemsGrid.value, start: 'top 80%' }
        }
      )
    })
  }
})

onUnmounted(() => {
  if (ctx) ctx.revert() // Limpieza de GSAP
})
</script>

<template>
  <main class="relative bg-[#050508] text-white overflow-hidden min-h-screen font-sans selection:bg-[#D8B4FE] selection:text-black">
    
    <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#D8B4FE]/15 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-40">
      
      <div class="flex flex-col md:flex-row items-center gap-16 mb-24" ref="heroContext">
        <div class="md:w-1/2 flex flex-col items-start z-10">
          <span class="hero-badge text-[10px] font-mono text-[#D8B4FE] uppercase tracking-[0.3em] bg-[#D8B4FE]/10 border border-[#D8B4FE]/20 px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            Firma de Arquitectura & Venture Studio
          </span>
          <h1 class="hero-title text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-8 tracking-tight">
            Arte y Capital <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D8B4FE] to-white/60">en un solo stack.</span>
          </h1>
          <p class="hero-desc text-base md:text-lg text-gray-400 leading-relaxed mb-10 max-w-lg">
            Diseñamos ecosistemas digitales a medida para empresas que exigen excelencia — construimos activos SaaS. 
          </p>
          <div class="hero-btns flex flex-wrap gap-4">
            <NuxtLink to="/contacto" class="group relative inline-flex items-center justify-center px-8 py-4 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-black bg-white overflow-hidden rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(216,180,254,0.4)]">
              <span class="relative z-10 flex items-center gap-2">
                Iniciar Auditoría
                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </span>
            </NuxtLink>
            <NuxtLink to="/playground" class="inline-flex items-center justify-center px-8 py-4 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 backdrop-blur-md transition-all duration-300">
              ⚡ Explorar Sandbox
            </NuxtLink>
          </div>
        </div>

        <div class="hero-glass-widget md:w-1/2 w-full perspective-1000">
          <div class="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-[#D8B4FE]/30 transition-colors duration-500">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D8B4FE] to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                <p class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Vi_Studio System Status</p>
              </div>
              <p class="text-[9px] font-mono text-[#D8B4FE] bg-[#D8B4FE]/10 px-2 py-1 rounded">V 3.1.0</p>
            </div>

            <div class="space-y-6">
              <div v-for="(val, label) in {'Time-to-Market': '< 60 días', 'Múltiplo de Exit': '3x – 5x ARR', 'Uptime Garantizado': '99.9%'}" :key="label" class="flex flex-col gap-2">
                <div class="flex justify-between items-end">
                  <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{{ label }}</p>
                  <p class="text-sm font-serif text-white">{{ val }}</p>
                </div>
                <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-white/20 to-[#D8B4FE]/60 rounded-full relative" :style="`width: ${Math.random() * 40 + 50}%`">
                    <div class="absolute top-0 right-0 w-4 h-full bg-white/50 blur-[2px] animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="w-full bg-white/[0.02] border-y border-white/5 py-6 overflow-hidden relative backdrop-blur-sm z-10">
      <div class="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#050508] to-transparent z-10"></div>
      <div class="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#050508] to-transparent z-10"></div>
      
      <div class="animate-marquee flex gap-16 whitespace-nowrap items-center">
        <span v-for="(metric, idx) in [...trustMetrics, ...trustMetrics]" :key="idx" class="text-xs font-mono text-gray-400 uppercase tracking-[0.2em] flex items-center gap-4">
          {{ metric }}
          <span class="w-1.5 h-1.5 rounded-full bg-[#D8B4FE]/30 inline-block"></span>
        </span>
      </div>
    </div>

    <section class="relative z-10 max-w-7xl mx-auto px-6 py-32" ref="systemsGrid">
      <div class="mb-16">
        <span class="text-[9px] font-mono text-[#D8B4FE] uppercase tracking-[0.3em] mb-4 block">División A — Soluciones a Medida</span>
        <h2 class="text-3xl md:text-5xl font-serif text-white mb-4">Ecosistemas Diseñados</h2>
        <p class="text-sm text-gray-400 font-sans max-w-xl">Arquitecturas probadas, adaptadas a la lógica y la escala de su negocio. Generamos capital a corto plazo con estándares Enterprise.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="sys in systems" :key="sys.title" 
          class="system-card bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.04] hover:-translate-y-2 hover:border-[#D8B4FE]/30 transition-all duration-500 group backdrop-blur-md">
          
          <span class="text-[9px] font-mono text-[#D8B4FE] uppercase tracking-[0.2em] mb-6 block">{{ sys.tag }}</span>
          <h3 class="text-2xl font-serif text-white mb-4 group-hover:text-[#D8B4FE] transition-colors">{{ sys.title }}</h3>
          <p class="text-sm text-gray-400 font-sans leading-relaxed mb-8">{{ sys.description }}</p>
          
          <ul class="space-y-3 border-t border-white/5 pt-6">
            <li v-for="feat in sys.features" :key="feat" class="flex items-center gap-3 text-xs text-gray-300 font-sans">
              <svg class="w-3 h-3 text-[#D8B4FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              {{ feat }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- División B: Venture Studio -->
    <section class="relative z-10 max-w-7xl mx-auto px-6 py-24">
      <div class="bg-white/[0.02] border border-white/10 p-12 md:p-20 rounded-[3rem] relative overflow-hidden group hover:border-[#D8B4FE]/20 transition-colors duration-700">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,180,254,0.07),transparent_60%)]"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-start gap-16">
          <div class="md:w-1/2">
            <span class="text-[9px] font-mono text-[#D8B4FE] uppercase tracking-[0.3em] mb-4 block">División B — Venture Studio</span>
            <h2 class="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
              Build to Sell.<br>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#D8B4FE] to-white/60 italic">La Fábrica.</span>
            </h2>
            <p class="text-sm text-gray-400 leading-relaxed max-w-md">
              Ideamos, diseñamos y construimos Micro-SaaS, Marketplaces y plataformas de IA en ciclos de 4 a 8 semanas usando nuestro <span class="text-white font-mono">Vi_Boilerplate</span>. Los operamos de forma <em>faceless</em> hasta demostrar MRR y los vendemos en múltiplos de 3x a 5x ARR.
            </p>
          </div>
          <div class="md:w-1/2 grid grid-cols-1 gap-4">
            <div v-for="phase in [{ step: '01', label: 'La Fábrica', desc: 'MVPs High-End en 4–8 semanas con Vi_Boilerplate.' }, { step: '02', label: 'La Tracción', desc: 'Operación Faceless con IA y automatizaciones. MRR demostrable.' }, { step: '03', label: 'El Exit', desc: 'Empaquetado del activo y venta en mercados de Micro-Acquisiciones (Acquire.com).' }]" :key="phase.step"
              class="flex items-start gap-4 bg-black/30 border border-white/5 p-6 rounded-2xl">
              <span class="text-[10px] font-mono text-[#D8B4FE] border border-[#D8B4FE]/30 px-2 py-1 rounded shrink-0">{{ phase.step }}</span>
              <div>
                <p class="text-sm font-serif text-white mb-1">{{ phase.label }}</p>
                <p class="text-xs text-gray-500 leading-relaxed">{{ phase.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
/* Animación infinita fluida para el Marquee */
.animate-marquee {
  width: max-content;
  animation: marquee 35s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); } /* -50% porque duplicamos el contenido */
}

/* Efecto 3D sutil para el Glass Widget */
.perspective-1000 {
  perspective: 1000px;
}
</style>