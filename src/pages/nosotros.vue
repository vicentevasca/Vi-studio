<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useHead } from '@unhead/vue' // <--- IMPORTACIÓN AGREGADA
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
  title: 'Filosofía y Arte Digital | VI_CORE',
  meta: [
    { name: 'description', content: 'Tratamos la informática como un arte. Diseñamos herramientas quirúrgicas para partners exclusivos.' }
  ]
})

// Referencias para GSAP
const mainContainer = ref(null)
const heroTitle = ref(null)
const heroSubtitle = ref(null)
const manifestoText = ref(null)
const cards = ref([])
const ctaSection = ref(null)

let ctx;

onMounted(() => {
  if (import.meta.client) {
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
        "-=0.6"
      )

      // 2. Revelación del Manifiesto al hacer Scroll
      gsap.fromTo(manifestoText.value,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1,
          scrollTrigger: {
            trigger: manifestoText.value,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // 3. Stagger de los Pilares (Tarjetas)
      gsap.fromTo(cards.value,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: {
            trigger: cards.value[0],
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // 4. Parallax suave en el CTA final
      gsap.fromTo(ctaSection.value,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 1.5, ease: 'expo.out',
          scrollTrigger: {
            trigger: ctaSection.value,
            start: "top 90%",
            end: "bottom center",
            scrub: 1
          }
        }
      )
    }, mainContainer.value)
  }
})

onUnmounted(() => {
  ctx?.revert() // Limpieza profunda de GSAP para evitar fugas de memoria
})

const pilares = [
  {
    num: '01',
    title: 'La Belleza del Core.',
    desc: 'La verdadera elegancia de un sistema reside en lo que no se ve. Un backend inmaculado, bases de datos que respiran al unísono y flujos automatizados que eliminan la fricción humana. Diseñamos desde el núcleo hacia afuera.'
  },
  {
    num: '02',
    title: 'Herramientas Quirúrgicas.',
    desc: 'Rechazamos el software genérico y las plantillas prefabricadas. Construimos bisturíes digitales: herramientas de alta precisión, afiladas específicamente para resolver la anatomía del problema de su empresa.'
  },
  {
    num: '03',
    title: 'Partners, no Clientes.',
    desc: 'No vendemos horas de programación; nos asociamos con su visión. Buscamos relaciones íntimas con los modelos de negocio de nuestros clientes para convertirnos en su brazo de ingeniería interno.'
  }
]
</script>

<template>
  <div ref="mainContainer" class="bg-[#050508] text-white min-h-screen relative overflow-hidden font-sans selection:bg-[#D8B4FE] selection:text-black">
    
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <div class="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(216,180,254,0.03)_0%,transparent_70%)] rounded-full"></div>
      <div class="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] rounded-full"></div>
      
      <div class="hidden md:block absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-x-1/2"></div>
    </div>

    <div class="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
      
      <section class="min-h-[80vh] flex flex-col justify-center pt-32 pb-20">
        <div class="max-w-5xl">
          <p ref="heroSubtitle" class="text-[10px] md:text-xs font-mono text-[#D8B4FE] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
            <span class="w-12 h-px bg-[#D8B4FE]/50"></span>
            Nuestra Ideología
          </p>
          <h1 ref="heroTitle" class="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] tracking-tight mb-12">
            No escribimos código.<br>
            <span class="italic text-gray-400">Esculpimos ecosistemas.</span>
          </h1>
        </div>
      </section>

      <section class="py-24 md:py-32 border-t border-white/5">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
          <div class="md:col-span-5">
            <h2 class="text-3xl md:text-5xl font-serif italic text-white sticky top-32">
              La Informática<br>como Arte.
            </h2>
          </div>
          <div ref="manifestoText" class="md:col-span-7 space-y-8 text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            <p>
              Creemos firmemente que la programación es una disciplina artística. Así como un arquitecto no solo apila ladrillos, nosotros no solo escribimos líneas de texto. 
            </p>
            <p>
              Diseñamos con intención. Cada función automatizada, cada base de datos estructurada y cada interfaz renderizada es una decisión consciente para crear <strong class="text-white font-normal">una herramienta en la que usted pueda confiar ciegamente</strong> para el progreso de su imperio.
            </p>
            <div class="pt-8 flex items-center gap-4 border-l border-[#D8B4FE]/30 pl-6">
              <span class="text-2xl font-serif italic text-[#D8B4FE]">"</span>
              <p class="text-sm font-mono uppercase tracking-widest text-gray-500">
                La perfección se alcanza no cuando no hay nada más que añadir, sino cuando no hay nada más que quitar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-24">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <div v-for="(pilar, index) in pilares" :key="pilar.num" 
               ref="cards"
               class="group relative bg-[#0B0B0E]/50 border border-white/5 p-10 md:p-14 hover:bg-[#0B0B0E] hover:border-[#D8B4FE]/20 transition-all duration-700">
            
            <div class="absolute top-0 right-0 p-8 text-6xl font-serif italic text-white/5 group-hover:text-[#D8B4FE]/10 group-hover:-translate-y-2 group-hover:translate-x-2 transition-all duration-700 pointer-events-none">
              {{ pilar.num }}
            </div>

            <div class="w-2 h-2 rounded-full bg-white/20 mb-10 group-hover:bg-[#D8B4FE] group-hover:shadow-[0_0_15px_rgba(216,180,254,0.5)] transition-all duration-500"></div>
            
            <h3 class="text-2xl font-serif text-white mb-6">{{ pilar.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed font-sans group-hover:text-gray-300 transition-colors duration-500">
              {{ pilar.desc }}
            </p>
          </div>
        </div>
      </section>

      <section class="py-32">
        <div ref="ctaSection" class="relative bg-gradient-to-b from-[#0B0B0E] to-black border border-white/10 p-12 md:p-24 text-center overflow-hidden">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,180,254,0.05),transparent_70%)]"></div>
          
          <div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 class="text-4xl md:text-6xl font-serif text-white mb-8">Diseñemos algo íntimo.</h2>
            <p class="text-sm md:text-base text-gray-400 font-sans leading-relaxed mb-12">
              Si está buscando una transacción rápida, no somos su equipo. Si está buscando un aliado tecnológico para delegar la arquitectura de su negocio y escalar con seguridad militar, nuestro laboratorio está abierto.
            </p>
            
            <NuxtLink to="/contacto" class="group relative inline-flex items-center justify-center px-10 py-5 font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-black bg-white overflow-hidden transition-all hover:scale-105 duration-500">
              <span class="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#D8B4FE] rounded-full group-hover:w-72 group-hover:h-72"></span>
              <span class="relative flex items-center gap-3">
                Ingresar al Laboratorio
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </span>
            </NuxtLink>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* Tipografías base (Asegúrate de tener fuentes Serif configuradas en tu Tailwind) */
.font-serif { font-family: 'Cormorant Garamond', 'Playfair Display', serif; }

/* Selección de texto personalizada para esta página */
::selection {
  background-color: #D8B4FE;
  color: #000;
}
</style>