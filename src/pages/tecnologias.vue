<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useHead } from '@unhead/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
  title: 'Arsenal Tecnológico | VI_CORE',
  meta: [
    { name: 'description', content: 'No usamos plantillas genéricas. Desarrollamos software a medida con Nuxt, Rust, Go y Vue para máxima escalabilidad.' }
  ]
})

const mainContainer = ref(null)

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  
  const ctx = gsap.context(() => {
    // Animación de entrada del Hero
    gsap.fromTo('.hero-text', 
      { y: 40, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, stagger: 0.2, ease: 'power3.out' }
    )

    // Animación de las tarjetas de tecnología
    gsap.fromTo('.tech-card',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.tech-grid', start: 'top 80%' }
      }
    )

    // Animación de los casos de estudio (Escenarios)
    gsap.fromTo('.scenario-card',
      { x: -30, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, stagger: 0.3, ease: 'power2.out',
        scrollTrigger: { trigger: '.scenarios-section', start: 'top 75%' }
      }
    )
  }, mainContainer.value)

  onUnmounted(() => ctx.revert())
})

const technologies = [
  { name: 'Nuxt 3', role: 'Fullstack Framework', desc: 'El núcleo de nuestras aplicaciones web. Permite Renderizado del Lado del Servidor (SSR), lo que significa tiempos de carga casi instantáneos y un posicionamiento SEO militarmente preciso.', color: 'text-green-400' },
  { name: 'Vue.js', role: 'Frontend Reactivo', desc: 'Diseñamos interfaces de usuario fluidas y reactivas sin recargar la página. Es ligero, elegante y permite interacciones complejas con un rendimiento impecable.', color: 'text-emerald-400' },
  { name: 'Go (Golang)', role: 'Backend Concurrente', desc: 'Desarrollado por Google. Lo utilizamos cuando el sistema necesita procesar miles de transacciones simultáneas (como en Fintechs) sin consumir exceso de memoria RAM.', color: 'text-cyan-400' },
  { name: 'Rust', role: 'Core Systems', desc: 'Garantiza seguridad de memoria y rendimiento puro. Lo empleamos para algoritmos críticos y motores de cálculo donde un fallo o caída del sistema es inaceptable.', color: 'text-orange-400' },
  { name: 'Vite 3+', role: 'Build Tool', desc: 'Nuestra herramienta de ensamblaje. Permite tiempos de compilación ultrarrápidos, optimizando el código final para que su aplicación pese lo mínimo posible.', color: 'text-purple-400' },
  { name: 'Ionic / Angular', role: 'Ecosistemas Móviles', desc: 'Construimos aplicaciones nativas para iOS y Android desde una única base de código. Reducimos el tiempo de desarrollo manteniendo acceso total al hardware del dispositivo.', color: 'text-blue-400' }
]

const scenarios = [
  {
    title: 'Plataforma Web de Alta Conversión (SEO Core)',
    stack: ['Nuxt 3', 'Vue.js', 'Vite'],
    desc: 'Si su objetivo es dominar los motores de búsqueda y convertir visitantes en clientes, un WordPress genérico es lento y pesado. Usamos Nuxt 3 para pre-renderizar la página en el servidor. El resultado: su sitio carga en milisegundos, Google lo posiciona en la cima, y el usuario experimenta una navegación sin fricciones.'
  },
  {
    title: 'Sistema Financiero o de Procesamiento Masivo',
    stack: ['Go', 'Rust', 'PostgreSQL'],
    desc: 'Para un sistema que maneja facturación, bases de datos masivas o algoritmos de alta concurrencia, JavaScript puede quedarse corto. Aquí inyectamos Go o Rust en el backend. Estos lenguajes compilados aseguran que el servidor soporte picos de miles de usuarios simultáneos sin colapsar ni aumentar excesivamente sus costos de nube.'
  },
  {
    title: 'Ecosistema Corporativo Multi-Plataforma',
    stack: ['Ionic', 'Angular', 'Node.js'],
    desc: 'Cuando necesita que su equipo interno tenga una App en su iPhone, una en Android, y además un panel web de administración. En lugar de cobrarle por tres desarrollos distintos, unificamos la lógica con Ionic y Angular, entregando una experiencia nativa en todos los dispositivos en la mitad del tiempo.'
  }
]
</script>

<template>
  <div ref="mainContainer" class="pt-32 pb-24 min-h-screen bg-[#050508] text-white relative overflow-hidden font-sans">
    
    <div class="absolute top-[20%] right-[0%] w-[30%] h-[30%] bg-[#D8B4FE]/5 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
      
      <div class="max-w-4xl mb-24 md:mb-32">
        <p class="hero-text text-[10px] font-mono text-[#D8B4FE] uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
          <span class="w-8 h-px bg-[#D8B4FE]/50"></span>
          Ingeniería de Precisión
        </p>
        <h1 class="hero-text text-5xl md:text-7xl font-serif text-white leading-tight mb-8">
          No usamos plantillas.<br>
          <span class="italic text-gray-400">Forjamos herramientas.</span>
        </h1>
        <div class="hero-text text-sm md:text-base text-gray-400 leading-relaxed space-y-4 max-w-2xl">
          <p>
            En la industria actual, la norma es ensamblar componentes prefabricados y gestores de contenido genéricos (como WordPress) que resultan en sistemas lentos, vulnerables y difíciles de escalar.
          </p>
          <p class="text-white">
            Nosotros operamos diferente. Seleccionamos el lenguaje, el framework y la arquitectura exacta que demanda la anatomía de su proyecto para garantizar máxima velocidad, ligereza y escalabilidad a nivel corporativo.
          </p>
        </div>
      </div>

      <div class="tech-grid mb-32">
        <h2 class="text-2xl font-serif italic text-white mb-10 border-b border-white/10 pb-4">El Arsenal Técnico.</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="tech in technologies" :key="tech.name" class="tech-card bg-black border border-white/5 p-8 rounded-2xl hover:border-[#D8B4FE]/30 hover:bg-[#0B0B0E] transition-all group">
            <h3 class="text-2xl font-mono font-bold mb-1 group-hover:text-[#D8B4FE] transition-colors" :class="tech.color">{{ tech.name }}</h3>
            <p class="text-[10px] uppercase tracking-widest text-gray-500 mb-4 font-mono">{{ tech.role }}</p>
            <p class="text-sm text-gray-400 leading-relaxed">{{ tech.desc }}</p>
          </div>
        </div>
      </div>

      <div class="scenarios-section mb-32">
        <h2 class="text-3xl md:text-5xl font-serif text-white mb-6">Arquitectura Aplicada.</h2>
        <p class="text-sm text-gray-400 max-w-2xl mb-16">Cada requerimiento exige una receta tecnológica distinta. Entender el "por qué" de cada herramienta es lo que garantiza el éxito a largo plazo de su inversión.</p>

        <div class="space-y-12">
          <div v-for="(scenario, idx) in scenarios" :key="idx" class="scenario-card flex flex-col md:flex-row gap-8 md:gap-12 p-8 md:p-12 border border-white/10 rounded-3xl bg-gradient-to-r from-[#0B0B0E] to-black relative overflow-hidden group">
            
            <div class="absolute left-0 top-0 w-1 h-full bg-white/5 group-hover:bg-[#D8B4FE] transition-colors duration-500"></div>

            <div class="md:w-1/3 flex flex-col justify-between">
              <div>
                <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Caso de Estudio 0{{ idx + 1 }}</p>
                <h3 class="text-2xl font-serif text-white leading-tight mb-6">{{ scenario.title }}</h3>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="tool in scenario.stack" :key="tool" class="text-[9px] font-mono text-[#D8B4FE] bg-[#D8B4FE]/10 px-3 py-1.5 rounded-full border border-[#D8B4FE]/20">
                  {{ tool }}
                </span>
              </div>
            </div>

            <div class="md:w-2/3 md:border-l md:border-white/10 md:pl-12 flex items-center">
              <p class="text-sm md:text-base text-gray-400 leading-relaxed">{{ scenario.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center py-20 border-t border-white/5">
        <h2 class="text-3xl font-serif italic mb-6">¿Dudas sobre qué arquitectura necesita su idea?</h2>
        <NuxtLink to="/contacto" class="inline-block border border-white/20 text-white px-8 py-4 rounded-full text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-all">
          Solicitar Auditoría Técnica →
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
.tech-card {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
}
</style>