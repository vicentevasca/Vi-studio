<script setup>
import { useHead } from '@unhead/vue'

useHead({
  title: 'Ingeniería y Servicios | VI_CORE',
  meta: [
    { name: 'description', content: 'Soluciones de arquitectura de software, ecosistemas corporativos y automatización de procesos.' }
  ]
})

const services = [
  {
    id: '01',
    category: 'Sistemas Core',
    title: 'ERP & CRM a Medida',
    description: 'Desarrollo de centros de comando corporativos. Reemplazamos hojas de cálculo fragmentadas y software genérico por una infraestructura única que centraliza sus operaciones, ventas y finanzas en tiempo real.',
    features: ['Arquitectura Serverless', 'Bases de Datos en Tiempo Real', 'Dashboards Analíticos', 'Gestión de Permisos (RBAC)']
  },
  {
    id: '02',
    category: 'Presencia Digital',
    title: 'Ecosistemas Web High-End',
    description: 'No hacemos "páginas web". Construimos aplicaciones web ultrarrápidas con renderizado del lado del servidor (SSR) diseñadas para dominar el SEO y maximizar la tasa de conversión de usuarios de alto valor.',
    features: ['Nuxt 3 / Vue Framework', 'Optimización Core Web Vitals', 'CMS Headless', 'Diseño UI/UX Premium']
  },
  {
    id: '03',
    category: 'Startups & Productos',
    title: 'SaaS MVP Development',
    description: 'Ingeniería de producto para fundadores. Transformamos su visión en un Producto Mínimo Viable robusto, escalable y listo para ser comercializado y presentado a rondas de inversión en un tiempo récord.',
    features: ['Arquitectura Multi-Tenant', 'Pasarelas de Pago (Stripe)', 'Onboarding Automatizado', 'API RESTful / GraphQL']
  },
  {
    id: '04',
    category: 'Consultoría Especializada',
    title: 'Auditoría & Rescate Técnico',
    description: 'Intervenimos ecosistemas heredados o proyectos estancados. Auditamos su código base, identificamos cuellos de botella de rendimiento y trazamos una hoja de ruta para la refactorización y estabilización técnica.',
    features: ['Revisión de Arquitectura', 'Optimización de Consultas DB', 'Securización de Endpoints', 'Refactorización Limpia']
  }
]

const methodology = [
  { step: 'Fase I', title: 'Radar & Discovery', desc: 'Análisis profundo de su modelo de negocio y levantamiento de requerimientos técnicos sin compromiso.' },
  { step: 'Fase II', title: 'Auditoría & Blueprint', desc: 'Diseño de la arquitectura de datos, flujos de usuario (UX) y presupuesto exacto del ecosistema.' },
  { step: 'Fase III', title: 'Laboratorio Dev', desc: 'Programación ágil con entregas incrementales. Usted tiene acceso directo al entorno de Staging (Pruebas).' },
  { step: 'Fase IV', title: 'Despliegue & MRR', desc: 'Lanzamiento a producción, monitoreo 24/7 y mantenimiento continuo a través de nuestro plan de soporte.' }
]
</script>

<template>
  <div class="pt-32 pb-24 min-h-screen relative overflow-hidden">
    
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <div class="absolute top-[10%] right-[0%] w-[40%] h-[40%] bg-[#D8B4FE]/5 blur-[150px] rounded-full"></div>
      <div class="absolute bottom-[20%] left-[0%] w-[30%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full"></div>
    </div>

    <div class="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
      
      <div class="mb-24 md:mb-32 max-w-4xl animate-in">
        <p class="text-[10px] font-mono text-[#D8B4FE] uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
          <span class="w-8 h-px bg-[#D8B4FE]/50"></span>
          Divisiones Técnicas
        </p>
        <h1 class="text-5xl md:text-7xl font-serif text-white leading-tight mb-8">
          Arquitectura de software para <span class="italic text-gray-400">empresas que escalan.</span>
        </h1>
        <p class="text-sm md:text-base text-gray-400 font-sans leading-relaxed max-w-2xl">
          Construimos infraestructura digital de alto rendimiento. Nuestro enfoque se centra en resolver problemas de negocio complejos mediante código limpio, sistemas resilientes y diseño de interfaces de vanguardia.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-32">
        <div v-for="(service, index) in services" :key="service.id" 
             class="bg-[#0B0B0E]/80 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-[2rem] group hover:border-[#D8B4FE]/30 transition-all duration-500 relative overflow-hidden animate-in"
             :style="{ animationDelay: `${index * 150}ms` }">
          
          <div class="absolute top-0 right-0 p-12 opacity-5 text-8xl font-serif italic text-white group-hover:text-[#D8B4FE] group-hover:scale-110 transition-all duration-700 pointer-events-none">
            {{ service.id }}
          </div>

          <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-4">{{ service.category }}</p>
          <h2 class="text-3xl font-serif text-white mb-6 group-hover:text-[#D8B4FE] transition-colors">{{ service.title }}</h2>
          <p class="text-sm text-gray-400 leading-relaxed mb-10 font-sans">{{ service.description }}</p>
          
          <div class="pt-8 border-t border-white/5">
            <h4 class="text-[9px] font-mono text-gray-600 uppercase tracking-widest mb-4">Stack & Features:</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="feat in service.features" :key="feat" class="text-[10px] font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md">
                {{ feat }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-32 animate-in" style="animation-delay: 600ms;">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-serif text-white italic mb-4">Ingeniería Trazable.</h2>
          <p class="text-xs font-mono text-gray-500 uppercase tracking-widest">El Framework de Ejecución VI_CORE</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="(step, idx) in methodology" :key="step.step" class="relative group">
            <div class="hidden md:block absolute top-6 left-1/2 w-full h-[1px] bg-white/5 -z-10" v-if="idx !== 3"></div>
            
            <div class="bg-[#050508] w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:border-[#D8B4FE] group-hover:shadow-[0_0_20px_rgba(216,180,254,0.2)] transition-all">
              <span class="text-[10px] font-mono text-gray-400 group-hover:text-[#D8B4FE]">{{ '0' + (idx + 1) }}</span>
            </div>
            
            <div class="text-center px-4">
              <span class="text-[9px] font-mono text-[#D8B4FE] uppercase tracking-widest block mb-2">{{ step.step }}</span>
              <h3 class="text-lg font-serif text-white mb-3">{{ step.title }}</h3>
              <p class="text-xs text-gray-500 font-sans leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-[#0B0B0E] to-black border border-white/10 p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden animate-in" style="animation-delay: 800ms;">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(216,180,254,0.1),transparent_60%)]"></div>
        
        <div class="relative z-10 max-w-2xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-serif text-white mb-6">¿Listo para elevar su infraestructura?</h2>
          <p class="text-sm text-gray-400 font-sans leading-relaxed mb-10">
            Postule su proyecto a nuestro laboratorio. Evaluaremos la viabilidad arquitectónica de su requerimiento y le daremos una hoja de ruta clara.
          </p>
          <NuxtLink to="/contacto" class="inline-block bg-white text-black px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#D8B4FE] hover:shadow-[0_0_30px_rgba(216,180,254,0.3)] transition-all">
            Iniciar Auditoría Privada →
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-in { 
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
  opacity: 0;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>