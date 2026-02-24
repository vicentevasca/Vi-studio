<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useHead } from '@unhead/vue' // <-- Importación para el SEO
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
  title: 'VI_CORE | Arquitectura de Software High-End',
  meta: [
    { name: 'description', content: 'Firma de ingeniería de software corporativo. Reemplazamos sistemas genéricos por ecosistemas digitales de alto rendimiento.' }
  ]
})

// REFERENCIAS PARA ANIMACIONES
const mainContainer = ref(null)
const heroTitle = ref(null)
const heroSubtitle = ref(null)
const heroCta = ref(null)
const cards = ref([])

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
    description: 'Arquitectura para firmas de abogados o consultorías. Gestión de expedientes, portales privados y automatización de reportes.',
    features: ['Secure Client Portal', 'Automated Workflows', 'SEO Authority Core'],
  }
]

let ctx;

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  
  ctx = gsap.context(() => {
    // 1. Animación del Hero (Entrada)
    const tl = gsap.timeline()
    
    tl.fromTo(heroTitle.value, 
      { y: 50, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
    )
    .fromTo(heroSubtitle.value,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
      "-=0.8"
    )
    .fromTo(heroCta.value,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' },
      "-=0.6"
    )

    // 2. Animación de las Cards (Sistemas)
    gsap.fromTo(cards.value,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.systems-section',
          start: "top 75%",
        }
      }
    )

    // 3. Animación de la sección "Power" (Filosofía)
    gsap.fromTo('.power-content',
      { x: -50, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.power-section',
          start: "top 70%",
        }
      }
    )
  }, mainContainer.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div ref="mainContainer" class="bg-[#050508] text-white min-h-screen relative overflow-hidden font-sans selection:bg-[#D8B4FE] selection:text-black z-10">
    
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <div class="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#D8B4FE]/5 blur-[150px] rounded-full"></div>
      <div class="absolute top-[40%] left-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 blur-[150px] rounded-full"></div>
    </div>

    <div class="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
      
      <section class="min-h-[90vh] flex flex-col justify-center pt-32 pb-20 border-b border-white/5 relative">
        <div class="max-w-5xl">
          <p class="text-[10px] md:text-xs font-mono text-[#D8B4FE] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
            <span class="w-12 h-px bg-[#D8B4FE]/50"></span>
            Firma de Ingeniería de Software
          </p>
          <h1 ref="heroTitle" class="text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.9] tracking-tight mb-10">
            Ecosistemas<br>
            <span class="italic text-gray-500">Corporativos.</span>
          </h1>
          <p ref="heroSubtitle" class="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mb-12">
            Reemplazamos sistemas genéricos y hojas de cálculo fragmentadas por infraestructuras digitales a medida. Operaciones de alta precisión para empresas que escalan.
          </p>
          
          <div ref="heroCta" class="flex flex-col sm:flex-row gap-6">
            <router-link to="/contacto" class="bg-white text-black px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#D8B4FE] hover:shadow-[0_0_30px_rgba(216,180,254,0.3)] transition-all text-center">
              Iniciar Auditoría Técnica →
            </router-link>
            <router-link to="/servicios" class="border border-white/20 text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all text-center flex items-center justify-center gap-3">
              Explorar Divisiones
            </router-link>
          </div>
        </div>
      </section>

      <section class="py-32 systems-section border-b border-white/5">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 class="text-4xl md:text-6xl font-serif text-white mb-4">Arquitecturas <span class="italic text-gray-500">Pre-Moduladas.</span></h2>
            <p class="text-sm font-mono text-gray-500 uppercase tracking-widest">Modelos base adaptables a su nicho de mercado.</p>
          </div>
          <router-link to="/tecnologias" class="text-[10px] font-mono text-[#D8B4FE] uppercase tracking-widest hover:text-white transition-colors border-b border-[#D8B4FE]/30 pb-1">
            Ver Arsenal Técnico ↗
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(sys, index) in systems" :key="sys.tag" 
               ref="cards"
               class="group relative bg-[#0B0B0E]/80 backdrop-blur-md border border-white/5 p-10 rounded-[2rem] hover:border-[#D8B4FE]/30 transition-all duration-500 overflow-hidden">
            
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D8B4FE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-bl-[100%]"></div>
            
            <p class="text-[9px] font-mono text-[#D8B4FE] uppercase tracking-widest mb-6 px-3 py-1 border border-[#D8B4FE]/20 rounded-full inline-block bg-[#D8B4FE]/5">
              {{ sys.tag }}
            </p>
            <h3 class="text-2xl font-serif text-white mb-4 group-hover:text-[#D8B4FE] transition-colors">{{ sys.title }}</h3>
            <p class="text-sm text-gray-400 font-sans leading-relaxed mb-8">{{ sys.description }}</p>
            
            <div class="space-y-3 border-t border-white/5 pt-6">
              <div v-for="feat in sys.features" :key="feat" class="flex items-center gap-3">
                <span class="w-1 h-1 bg-white/20 rounded-full group-hover:bg-[#D8B4FE] transition-colors"></span>
                <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{{ feat }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-32 power-section relative">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div class="power-content">
            <p class="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em] mb-6">El Manifiesto VI_CORE</p>
            <h2 class="text-4xl md:text-5xl font-serif text-white leading-tight mb-8">
              No vendemos horas.<br>
              <span class="italic text-gray-400">Nos asociamos con su visión.</span>
            </h2>
            <p class="text-base text-gray-400 font-sans leading-relaxed mb-8">
              Tratamos el desarrollo de software como una disciplina artística y matemática. Cada línea de código que desplegamos está diseñada para reducir fricción operativa, proteger sus datos y escalar sus ganancias netas.
            </p>
            <router-link to="/nosotros" class="inline-flex items-center gap-3 text-xs font-mono text-white uppercase tracking-widest group">
              <span class="w-8 h-px bg-white group-hover:w-16 group-hover:bg-[#D8B4FE] transition-all duration-300"></span>
              Conocer nuestra ideología
            </router-link>
          </div>

          <div class="relative h-[400px] md:h-[500px] bg-black border border-white/10 rounded-[3rem] overflow-hidden group">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,180,254,0.08),transparent_70%)] group-hover:opacity-50 transition-opacity duration-1000"></div>
            
            <div class="absolute inset-0 flex flex-col justify-between p-10">
              <div class="flex justify-between items-center border-b border-white/10 pb-4">
                <div class="flex gap-2">
                  <div class="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500/50 border border-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                </div>
                <span class="text-[9px] font-mono text-gray-600 uppercase tracking-widest">VI_CORE System Running</span>
              </div>
              
              <div class="space-y-4">
                <div class="h-2 w-3/4 bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-[#D8B4FE] w-[85%] relative"><div class="absolute top-0 right-0 w-4 h-full bg-white/50 blur-[2px]"></div></div>
                </div>
                <div class="h-2 w-1/2 bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-white/20 w-[60%]"></div>
                </div>
                <div class="h-2 w-5/6 bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-[#D8B4FE]/50 w-[90%] relative"><div class="absolute top-0 right-0 w-4 h-full bg-white/50 blur-[2px] animate-pulse"></div></div>
                </div>
              </div>

              <div class="flex justify-between items-end pt-4 border-t border-white/10">
                <div>
                  <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Carga de Red</p>
                  <p class="text-2xl font-serif text-white">99.9% Uptime</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Seguridad</p>
                  <p class="text-xl font-serif text-green-400">Encriptado E2E</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.font-serif { font-family: 'Cormorant Garamond', 'Playfair Display', serif; }

/* Aseguramos que el index nunca tape al navbar que tiene z-50 */
.z-10 { z-index: 10; }
</style>