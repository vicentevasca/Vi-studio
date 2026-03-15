<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useHead } from '@unhead/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
  title: 'Manifiesto & Filosofía | Vi_Studio',
  meta: [
    { name: 'description', content: 'Arte y Capital. Transformamos lógicas de negocio fragmentadas en ecosistemas digitales automatizados. Nuestro código no solo es elegante — se paga a sí mismo.' }
  ]
})

const mainContainer = ref(null)
let ctx;

// 1. Generar Estrellas para el Cielo (Ligeras para el DOM)
const stars = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  size: Math.random() * 2.5 + 1,
  top: Math.random() * 100,
  left: Math.random() * 100,
  delay: Math.random() * 5,
  duration: Math.random() * 3 + 2
}))

const pillars = [
  {
    title: 'División A — Cliente',
    subtitle: 'Soluciones a Medida',
    desc: 'Desarrollamos infraestructura tecnológica (CRM, ERP, plataformas operativas) para empresas que lo genérico no puede cubrir. Generamos capital a corto plazo y descubrimos fricciones de industria que inspiran nuestros productos propios.'
  },
  {
    title: 'División B — Studio',
    subtitle: 'Build to Sell',
    desc: 'La Fábrica. Ideamos, construimos y rentabilizamos Micro-SaaS en ciclos de 4 a 8 semanas usando Vi_Boilerplate. Operamos de forma Faceless con IA y automatizaciones hasta demostrar MRR — luego vendemos en múltiplos de 3x a 5x ARR.'
  },
  {
    title: 'Ingeniería Financiera',
    subtitle: 'El Código que se Paga',
    desc: 'Cada línea de código que escribimos debe cumplir estándares de Due Diligence para alto rendimiento o futura adquisición (M&A). La elegancia de un sistema se mide en su ROI, no solo en su interfaz.'
  }
]

onMounted(async () => {
  if (!import.meta.client) return
  
  await nextTick()
  gsap.registerPlugin(ScrollTrigger)
  
  ctx = gsap.context(() => {
    // 1. Animaciones Infinitas (Cielo y Estrellas)
    // Usamos rotaciones simples y opacidades para mantener 60fps sin forzar la GPU
    gsap.to('.swirl-1', { rotation: 360, duration: 60, repeat: -1, ease: 'linear' })
    gsap.to('.swirl-2', { rotation: -360, duration: 80, repeat: -1, ease: 'linear' })
    
    gsap.utils.toArray('.digital-star').forEach(star => {
      gsap.to(star, { 
        opacity: 0.1, 
        duration: gsap.getProperty(star, '--duration'), 
        delay: gsap.getProperty(star, '--delay'), 
        repeat: -1, 
        yoyo: true, 
        ease: 'sine.inOut' 
      })
    })

    // 2. Parallax de Fondo Suave
    // Al hacer scroll, el cielo baja ligeramente y se oscurece, dando sensación de inmersión
    gsap.to('.sky-layer', {
      yPercent: 15,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: mainContainer.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    })

    // 3. Revelado de los textos estéticos (Efecto Pincelada)
    gsap.utils.toArray('.brush-line').forEach(line => {
      gsap.fromTo(line, 
        { y: 40, opacity: 0, filter: 'blur(4px)' }, 
        { 
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: line, start: 'top 85%' }
        }
      )
    })

  }, mainContainer.value)
})

onUnmounted(() => { if (ctx) ctx.revert() })
</script>

<template>
  <main ref="mainContainer" class="relative text-white selection:bg-[#D8B4FE] selection:text-black font-sans bg-[#050508]">
    
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050508]">
      <div class="sky-layer absolute inset-0 w-full h-full">
        <div class="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] swirl-1 bg-[radial-gradient(circle,rgba(216,180,254,0.12)_0%,transparent_70%)] mix-blend-screen"></div>
        <div class="absolute top-[10%] right-[-20%] w-[60vw] h-[60vw] swirl-2 bg-[radial-gradient(circle,rgba(37,99,235,0.12)_0%,transparent_70%)] mix-blend-screen"></div>
        
        <div v-for="star in stars" :key="star.id" class="digital-star absolute bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          :style="`width: ${star.size}px; height: ${star.size}px; top: ${star.top}%; left: ${star.left}%; --delay: ${star.delay}s; --duration: ${star.duration}s; opacity: 0.8;`">
        </div>
      </div>
    </div>

    <div class="relative z-10 w-full">
      
      <header class="min-h-screen flex items-center justify-center px-6 text-center pt-0">
        <div class="max-w-5xl mx-auto">
          <span class="inline-block text-[10px] font-mono text-[#D8B4FE] uppercase tracking-[0.4em] mb-8 border-b border-[#D8B4FE]/30 pb-2">
            Manifiesto Corporativo
          </span>
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] mb-8">
            <span class="brush-line block pb-2">No escribimos</span>
            <span class="brush-line block pb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D8B4FE] to-white/60 italic">líneas de código.</span>
            <span class="brush-line block pb-2">Esculpimos sistemas.</span>
          </h1>
        </div>
      </header>

      <section class="py-32 px-6">
        <div class="max-w-4xl mx-auto space-y-32">
          
          <div class="text-center brush-line">
            <h2 class="text-xs font-mono text-[#D8B4FE] uppercase tracking-[0.3em] mb-6">Arte y Capital</h2>
            <p class="text-2xl md:text-4xl text-gray-200 font-serif leading-relaxed">
              Creemos que el código es una expresión artística que debe pagarse a sí misma. En Vi_Studio, la fluidez de una interfaz y la solidez de una arquitectura backend <span class="text-white italic">son la misma pincelada.</span>
            </p>
          </div>

          <div class="text-center brush-line">
            <h2 class="text-xs font-mono text-blue-400 uppercase tracking-[0.3em] mb-6">Modelo de Negocio Dual</h2>
            <p class="text-lg md:text-2xl text-gray-400 font-serif leading-relaxed">
              Operamos como firma de arquitectura para clientes que exigen lo que ningún SaaS genérico puede ofrecer — y como Startup Foundry que construye sus propios activos digitales de alto valor. <span class="text-white font-light">Dos divisiones. Un solo estándar de excelencia.</span>
            </p>
          </div>

        </div>
      </section>

      <section class="min-h-screen px-6 py-32 flex flex-col justify-center">
        <div class="max-w-7xl mx-auto w-full">
          <div class="text-center mb-24 brush-line">
            <h2 class="text-4xl md:text-5xl font-serif text-white mb-6">El Modelo Dual</h2>
            <p class="text-gray-400 max-w-2xl mx-auto font-light">Dos divisiones que se retroalimentan técnica y financieramente. Así es como construimos y vendemos activos digitales de alto rendimiento.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(pillar, idx) in pillars" :key="pillar.title" 
              class="brush-line bg-[#0B0B0E]/80 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl hover:bg-white/[0.04] hover:border-[#D8B4FE]/40 transition-all duration-500 group relative overflow-hidden">
              
              <div class="absolute inset-0 bg-gradient-to-b from-[#D8B4FE]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div class="relative z-10">
                <span class="text-[10px] font-mono text-[#D8B4FE] uppercase tracking-widest mb-4 block group-hover:text-white transition-colors">0{{ idx + 1 }} // {{ pillar.title }}</span>
                <h3 class="text-3xl font-serif text-white mb-6">{{ pillar.subtitle }}</h3>
                <p class="text-sm text-gray-400 leading-relaxed">{{ pillar.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-3xl mx-auto text-center mt-40 pb-20 brush-line">
          <span class="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mb-4 block">Vi_Studio · Vicente Vásquez, Lead Architect</span>
          <h2 class="text-3xl md:text-5xl font-serif text-white mb-8">El estudio está a su disposición.</h2>
          <NuxtLink to="/contacto" class="group relative inline-flex items-center justify-center px-10 py-5 font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-black bg-white rounded-full hover:bg-[#D8B4FE] transition-colors duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(216,180,254,0.4)]">
            <span class="relative z-10 flex items-center gap-3">
              Iniciar Auditoría
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </span>
          </NuxtLink>
        </div>
      </section>

    </div>
  </main>
</template>

<style scoped>
/* Eliminas la necesidad de CSS pesado. 
   Todo el estilo fluye orgánicamente con Tailwind y GSAP en JS. */
</style>