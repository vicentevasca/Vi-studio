<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
  title: 'Ingeniería & Venture Studio | Vi_Studio',
  meta: [
    { name: 'description', content: 'División A: soluciones a medida (ERP, CRM, ecosistemas web) para clientes corporativos. División B: construcción y venta de Micro-SaaS propios con exits de 3x a 5x ARR.' }
  ]
})

const services = [
  {
    id: '01',
    category: 'Sistemas Core',
    title: 'ERP & CRM a Medida',
    description: 'Desarrollo de centros de comando corporativos. Reemplazamos hojas de cálculo fragmentadas y software genérico por una infraestructura única que centraliza sus operaciones, ventas y finanzas en tiempo real.',
    features: ['Arquitectura Serverless', 'Bases de Datos Real-Time', 'Dashboards Analíticos', 'RBAC Security'],
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  },
  {
    id: '02',
    category: 'Presencia Digital',
    title: 'Ecosistemas Web High-End',
    description: 'No hacemos "páginas web". Construimos aplicaciones web ultrarrápidas con renderizado del lado del servidor (SSR) diseñadas para dominar el SEO y maximizar la tasa de conversión de usuarios de alto valor.',
    features: ['Nuxt 3 / Vue Framework', 'Core Web Vitals', 'CMS Headless', 'UI/UX Premium'],
    icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
  },
  {
    id: '03',
    category: 'Startups & Productos',
    title: 'SaaS MVP Development',
    description: 'Ingeniería de producto para fundadores. Transformamos su visión en un Producto Mínimo Viable robusto, escalable y listo para salir al mercado, diseñado para soportar picos de tráfico y levantar capital.',
    features: ['Go-to-Market Rápido', 'Cloud Hosting AWS/GCP', 'API REST/GraphQL', 'Stripe Integration'],
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  }
]

const processSteps = [
  { step: '01', title: 'Auditoría', desc: 'Analizamos su infraestructura actual, detectamos cuellos de botella y definimos el impacto en ROI.' },
  { step: '02', title: 'Arquitectura', desc: 'Diseñamos los planos del sistema usando Vi_Boilerplate. Stack definido para escalabilidad y futura Due Diligence.' },
  { step: '03', title: 'Ingeniería', desc: 'Sprints ágiles con entregas semanales. TTM objetivo: < 60 días desde ideación a producción.' },
  { step: '04', title: 'Despliegue', desc: 'Lanzamiento, monitorización y traspaso de llaves. Para División B: empaquetado para exit en Acquire.com.' }
]

let ctx;
const mainContainer = ref(null)

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger)
    
    ctx = gsap.context(() => {
      // 1. Animación del Hero (Text Reveal)
      const tl = gsap.timeline()
      tl.fromTo('.hero-badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo('.hero-title-word', 
          { y: 50, opacity: 0, rotationX: -45 }, 
          { y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, '-=0.4')
        .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.6')

      // 2. Animación de las Tarjetas de Servicios al hacer Scroll
      gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.fromTo(card,
          { y: 100, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%', // Se activa cuando la tarjeta llega al 85% de la pantalla
            }
          }
        )
      })

      // 3. Animación de los Pasos del Proceso
      gsap.fromTo('.process-step',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: {
            trigger: '.process-container',
            start: 'top 80%'
          }
        }
      )
    }, mainContainer.value)
  }
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <main ref="mainContainer" class="relative bg-[#050508] text-white min-h-screen overflow-hidden selection:bg-[#D8B4FE] selection:text-black font-sans pb-32">
    
    <div class="fixed top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-[#D8B4FE]/10 blur-[130px] rounded-full pointer-events-none mix-blend-screen z-0"></div>
    <div class="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

    <header class="relative z-10 pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
      <span class="hero-badge inline-block text-[10px] font-mono text-[#D8B4FE] uppercase tracking-[0.3em] bg-[#D8B4FE]/10 border border-[#D8B4FE]/20 px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
        Modelo de Negocio Dual
      </span>
      <h1 class="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-8 overflow-hidden flex flex-wrap justify-center gap-x-4">
        <span class="hero-title-word">Ingeniería</span>
        <span class="hero-title-word text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D8B4FE] to-white/60 italic">& Venture.</span>
      </h1>
      <p class="hero-desc text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
        División A: ecosistemas digitales a medida para empresas exigentes. División B: construcción de activos SaaS propios bajo el modelo Venture Studio para exits de 3x a 5x ARR.
      </p>
    </header>

    <section class="relative z-10 max-w-7xl mx-auto px-6 py-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        <div class="lg:col-span-5 lg:sticky lg:top-40">
          <span class="text-[9px] font-mono text-[#D8B4FE] uppercase tracking-[0.3em] mb-4 block">División A — Client-Facing</span>
          <h2 class="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">Soluciones<br>Arquitectónicas</h2>
          <p class="text-gray-400 font-sans leading-relaxed mb-8">
            Auditamos, diseñamos y desplegamos ecosistemas con estándar Enterprise. Esta división genera capital a corto plazo y descubre las fricciones de industria que inspiran nuestros productos propios.
          </p>
          <div class="hidden lg:block w-full h-[1px] bg-gradient-to-r from-[#D8B4FE]/50 to-transparent"></div>
        </div>

        <div class="lg:col-span-7 space-y-8">
          <div v-for="(service, index) in services" :key="service.id" 
            class="service-card bg-white/[0.02] border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl hover:bg-white/[0.04] hover:border-[#D8B4FE]/30 transition-colors duration-500 group">
            
            <div class="flex justify-between items-start mb-8">
              <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D8B4FE] group-hover:scale-110 group-hover:bg-[#D8B4FE]/10 transition-all duration-500">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="service.icon"></path></svg>
              </div>
              <span class="text-5xl font-serif text-white/5 group-hover:text-white/10 transition-colors">{{ service.id }}</span>
            </div>

            <span class="text-[9px] font-mono text-[#D8B4FE] uppercase tracking-[0.2em] mb-4 block">{{ service.category }}</span>
            <h3 class="text-3xl font-serif text-white mb-4">{{ service.title }}</h3>
            <p class="text-sm md:text-base text-gray-400 leading-relaxed mb-8">{{ service.description }}</p>

            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-8">
              <li v-for="feat in service.features" :key="feat" class="flex items-center gap-3 text-xs text-gray-300 font-mono tracking-tight">
                <span class="w-1.5 h-1.5 rounded-full bg-[#D8B4FE]/50"></span>
                {{ feat }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="relative z-10 max-w-7xl mx-auto px-6 py-32 process-container">
      <div class="text-center mb-20">
        <h2 class="text-3xl md:text-4xl font-serif text-white mb-4">Protocolo de Laboratorio</h2>
        <p class="text-sm text-gray-400">Nuestra metodología de ingeniería es precisa, transparente y auditable.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="step in processSteps" :key="step.step" class="process-step bg-black/40 border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#D8B4FE]/50 transition-colors"></div>
          <span class="text-[10px] font-mono text-[#D8B4FE] mb-6 block border border-[#D8B4FE]/20 w-max px-2 py-1 rounded">Fase {{ step.step }}</span>
          <h4 class="text-xl font-serif text-white mb-3">{{ step.title }}</h4>
          <p class="text-xs text-gray-500 leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <section class="relative z-10 max-w-5xl mx-auto px-6">
      <div class="bg-gradient-to-br from-[#0B0B0E] to-black border border-white/10 p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden shadow-2xl">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(216,180,254,0.15),transparent_60%)]"></div>
        
        <div class="relative z-10">
          <h2 class="text-4xl md:text-5xl font-serif text-white mb-6">¿Su proyecto merece arquitectura de nivel superior?</h2>
          <p class="text-sm text-gray-400 font-sans leading-relaxed mb-10 max-w-2xl mx-auto">
            Reserve una auditoría técnica confidencial con Vicente Vásquez y el equipo de Vi_Studio. Evaluaremos su stack, definiremos el ROI cuantificable y diseñaremos la hoja de ruta.
          </p>
          <NuxtLink to="/contacto" class="group relative inline-flex items-center justify-center px-10 py-5 font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-black bg-white rounded-full overflow-hidden hover:scale-105 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(216,180,254,0.4)]">
            <span class="relative z-10 flex items-center gap-2">
              Iniciar Auditoría Privada
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
/* Evitar problemas con Safari en el efecto Sticky */
@supports (-webkit-position: -webkit-sticky) {
  .sticky { position: -webkit-sticky; }
}
</style>