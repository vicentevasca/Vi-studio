<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
  title: 'Stack & Tecnologías | Vi_Studio',
  meta: [
    { name: 'description', content: 'Stack tecnológico de Vi_Studio: frontend, backend, bases de datos, DevOps y lenguajes seleccionados por proyecto. Vue 3, Node.js, Go, Python, PostgreSQL, Firebase y más.' }
  ]
})

const mainContainer = ref(null)
let ctx

// Dominio activo para expandir
const activeDomain = ref(null)
const toggleDomain = (id) => {
  activeDomain.value = activeDomain.value === id ? null : id
}

// ── DOMINIOS TECNOLÓGICOS ────────────────────────────────────
const domains = [
  {
    id: 'frontend',
    label: 'Frontend',
    desc: 'Interfaces reactivas, experiencias cinematográficas, SEO y performance de primer nivel.',
    color: 'text-blue-400',
    border: 'hover:border-blue-500/30 group-open:border-blue-500/30',
    glow: 'bg-blue-500',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    techs: [
      { name: 'Vue 3',       role: 'Framework principal',      note: 'Composable API, reactividad fina, ideal para SPAs y paneles internos' },
      { name: 'Nuxt 3',      role: 'SSR / SSG / Full-stack',   note: 'SEO nativo, ISR, file-based routing — producción por defecto' },
      { name: 'React',       role: 'Alternativa enterprise',    note: 'Ecosistema más amplio, elegido cuando el cliente ya tiene equipo React' },
      { name: 'Next.js',     role: 'React + SSR',              note: 'Vercel ecosystem, RSC, edge-first — para proyectos React-first' },
      { name: 'Vite',        role: 'Bundler & Dev Server',     note: 'HMR instantáneo, build en <500ms — el estándar moderno' },
      { name: 'Tailwind CSS',role: 'Utilidades CSS',           note: 'Design system sin CSS custom, consistencia garantizada' },
      { name: 'GSAP',        role: 'Animaciones',              note: 'Motor de animación profesional — ScrollTrigger, timelines, física' },
      { name: 'Pinia',       role: 'Estado global (Vue)',       note: 'Sucesor oficial de Vuex, composable y type-safe' },
    ]
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
    desc: 'Servicios rápidos, seguros y escalables. Desde serverless hasta microservicios de alto rendimiento.',
    color: 'text-green-400',
    border: 'hover:border-green-500/30',
    glow: 'bg-green-500',
    icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2',
    techs: [
      { name: 'Node.js',          role: 'Runtime JavaScript',      note: 'Mismo lenguaje que el frontend, ecosystem enorme, I/O no bloqueante' },
      { name: 'Hono',             role: 'Framework ultrarrápido',  note: 'Edge-native, <1ms cold start, ideal para Cloud Workers y Functions' },
      { name: 'Express.js',       role: 'Framework clásico',       note: 'Battle-tested, minimalista, amplio soporte de middleware' },
      { name: 'FastAPI (Python)', role: 'APIs asíncronas',         note: 'OpenAPI auto-generado, validación con Pydantic, excelente para AI backends' },
      { name: 'Go (net/http)',    role: 'Alto rendimiento',        note: 'Concurrencia nativa (goroutines), latencia <1ms, binarios pequeños' },
      { name: 'Firebase Functions',role: 'Serverless',             note: 'Triggers de Firestore, webhooks, cron — sin gestión de servidores' },
      { name: 'tRPC',             role: 'Type-safe RPC',           note: 'Contrato TypeScript end-to-end, cero codegen, ideal en monorepos' },
    ]
  },
  {
    id: 'database',
    label: 'Bases de Datos',
    desc: 'La persistencia correcta para cada modelo de datos. Relacional, documental, caché y tiempo real.',
    color: 'text-orange-400',
    border: 'hover:border-orange-500/30',
    glow: 'bg-orange-500',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
    techs: [
      { name: 'PostgreSQL', role: 'Relacional — estándar de producción', note: 'ACID, JSON nativo, extensiones (PostGIS, pgvector para IA)' },
      { name: 'Firestore',  role: 'NoSQL en tiempo real',                note: 'Sync en milisegundos, reglas por documento, serverless-native' },
      { name: 'MySQL',      role: 'Relacional — alta compatibilidad',    note: 'Amplio soporte de hostings, confiable en proyectos legacy' },
      { name: 'MongoDB',    role: 'Documental flexible',                 note: 'Esquema libre, ideal para datos heterogéneos o catálogos complejos' },
      { name: 'Redis',      role: 'Caché / Pub-Sub / Sesiones',          note: 'Estructuras de datos en memoria, sub-millisecond, colas de trabajo' },
      { name: 'Supabase',   role: 'PostgreSQL + Auth + Realtime',        note: 'Alternativa open-source a Firebase, SQL sobre WebSocket' },
      { name: 'SQLite',     role: 'Embedded / Prototipado',              note: 'Zero setup, perfecto para CLIs, apps locales y MVPs rápidos' },
    ]
  },
  {
    id: 'devops',
    label: 'DevOps & Infraestructura',
    desc: 'Deploy continuo, observabilidad y zero-downtime. El sistema debe ser tan confiable como el código.',
    color: 'text-[#D8B4FE]',
    border: 'hover:border-[#D8B4FE]/30',
    glow: 'bg-[#D8B4FE]',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    techs: [
      { name: 'Firebase Hosting', role: 'CDN + Hosting estático',    note: 'Deploy en <30s, CDN global, reglas de rewrite para SPAs' },
      { name: 'Vercel',           role: 'Frontend + Edge Functions',  note: 'Git-push-to-deploy, preview URLs, excelente DX' },
      { name: 'Railway / Render', role: 'Backend hosting',            note: 'Contenedores gestionados, DB managed, sin configurar servers' },
      { name: 'Docker',           role: 'Containerización',           note: '"Funciona en mi máquina" resuelto para siempre' },
      { name: 'GitHub Actions',   role: 'CI/CD',                     note: 'Tests + lint + deploy automatizados en cada push' },
      { name: 'Cloudflare',       role: 'DNS + WAF + CDN',           note: 'Protección DDoS, Workers en el edge, cache universal' },
    ]
  },
  {
    id: 'apis',
    label: 'Integraciones & APIs',
    desc: 'Conectores de primera línea para pagos, notificaciones, IA y comunicación en tiempo real.',
    color: 'text-yellow-400',
    border: 'hover:border-yellow-500/30',
    glow: 'bg-yellow-500',
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    techs: [
      { name: 'Stripe',         role: 'Pagos globales',                note: 'Checkout, suscripciones, webhooks, el estándar para SaaS' },
      { name: 'MercadoPago',    role: 'Pagos LATAM',                   note: 'Cuotas, transferencias, QR — cobertura nativa en Chile/Argentina/México' },
      { name: 'OpenAI API',     role: 'IA generativa',                 note: 'GPT, embeddings, vision — integrado en flujos de negocio reales' },
      { name: 'Telegram Bot API',role:'Notificaciones y automatización',note: 'Alertas críticas, comandos remotos, inline keyboards para Firestore' },
      { name: 'Twilio',         role: 'SMS / WhatsApp / Voz',          note: 'Comunicación programática multicanal' },
      { name: 'SendGrid / Resend',role:'Email transaccional',          note: 'Plantillas, entregabilidad alta, webhooks de tracking' },
    ]
  },
  {
    id: 'testing',
    label: 'Testing & Calidad',
    desc: 'Código que sobrevive al tiempo. Testing automatizado como primera línea de defensa.',
    color: 'text-red-400',
    border: 'hover:border-red-500/30',
    glow: 'bg-red-500',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    techs: [
      { name: 'Vitest',       role: 'Unit / Integration testing', note: 'Reemplaza Jest en proyectos Vite, rapidísimo, compatible con Jest API' },
      { name: 'Playwright',   role: 'Testing E2E',                note: 'Simula al usuario real en Chromium/Firefox/WebKit, screenshots automáticos' },
      { name: 'Testing Library',role:'DOM Testing',               note: '"Test como el usuario lo usa" — foco en comportamiento, no implementación' },
      { name: 'Zod',          role: 'Validación de esquemas',     note: 'TypeScript-first, parse > validate, ideal en API boundaries' },
      { name: 'ESLint + Prettier',role:'Lint & Formato',          note: 'Estilo consistente en el equipo, errores antes del runtime' },
    ]
  },
]

// ── STACKS POR TIPO DE PROYECTO ─────────────────────────────
const scenarios = [
  {
    type: 'MVP / Startup',
    headline: 'Velocidad sobre perfección',
    badge: 'badge-purple',
    desc: 'El objetivo es validar hipótesis, no construir la arquitectura definitiva. Stack opinado que permite desplegar en días.',
    stack: [
      { name: 'Nuxt 3',      why: 'SSG + SSR en un framework, sin configuración' },
      { name: 'Firebase',    why: 'Auth + DB + Hosting sin gestionar servidores' },
      { name: 'Tailwind CSS',why: 'UI consistente sin diseñador dedicado' },
      { name: 'TypeScript',  why: 'Previene bugs en equipos pequeños sin QA' },
    ],
    avoid: 'Microservicios, PostgreSQL gestionado propio, Docker en esta etapa'
  },
  {
    type: 'SaaS B2B',
    headline: 'Escala sin reescribir',
    badge: 'badge-blue',
    desc: 'Múltiples tenants, permisos granulares, facturación recurrente. La arquitectura debe sostener el crecimiento.',
    stack: [
      { name: 'Vue 3 + Nuxt', why: 'SSR para marketing, SPA para el app' },
      { name: 'PostgreSQL',   why: 'Multi-tenant con Row-Level Security nativo' },
      { name: 'Hono / Node',  why: 'API layer con validación Zod + tRPC' },
      { name: 'Stripe',       why: 'Suscripciones, portales de billing, webhooks' },
      { name: 'Railway',      why: 'DB + backend managed, sin DevOps day 1' },
    ],
    avoid: 'Firebase para datos relacionales complejos — SQL wins here'
  },
  {
    type: 'E-Commerce',
    headline: 'Conversión y confianza',
    badge: 'badge-green',
    desc: 'Performance de carga, SEO y experiencia de checkout definen los ingresos. El stack debe priorizar el Core Web Vitals.',
    stack: [
      { name: 'Nuxt 3',     why: 'SSG para catálogo — 0ms TTFB desde CDN' },
      { name: 'Stripe',     why: 'Checkout hosted o Payment Element embebido' },
      { name: 'PostgreSQL', why: 'Inventario, órdenes, relaciones transaccionales' },
      { name: 'Redis',      why: 'Caché de catálogo, sesiones de carrito' },
      { name: 'Cloudflare', why: 'CDN de imágenes, WAF, DDoS protection' },
    ],
    avoid: 'NoSQL para inventario — las transacciones ACID son necesarias'
  },
  {
    type: 'Sistema Interno / CRM',
    headline: 'Usabilidad sobre arquitectura',
    badge: 'badge-yellow',
    desc: 'El usuario final es el propio equipo. La velocidad de desarrollo y la UX operacional pesan más que el SEO.',
    stack: [
      { name: 'Vue 3 (SPA)',    why: 'No se necesita SSR — UX reactiva, sin page reload' },
      { name: 'Firestore',      why: 'Sync en tiempo real sin polling, multi-device' },
      { name: 'Firebase Auth',  why: 'SSO con Google, roles, sesiones gestionadas' },
      { name: 'Cloud Functions',why: 'Automatizaciones: Telegram alerts, crons, triggers' },
    ],
    avoid: 'SSR complejo o CDN edge para apps que requieren auth inmediato'
  },
  {
    type: 'API de Alto Rendimiento',
    headline: 'Latencia y concurrencia',
    badge: 'badge-red',
    desc: 'Miles de requests concurrentes, procesamiento intensivo o latencia sub-milisegundo. El lenguaje importa aquí.',
    stack: [
      { name: 'Go',         why: 'Goroutines nativas, 100k+ requests concurrentes, binarios de 10MB' },
      { name: 'PostgreSQL', why: 'Connection pooling (pgBouncer), índices avanzados, JSONB' },
      { name: 'Redis',      why: 'Rate limiting, caché L2, pub/sub para WebSockets' },
      { name: 'Docker',     why: 'Escala horizontal sin overhead de runtime' },
    ],
    avoid: 'Node.js single-threaded para CPU-intensive workloads'
  },
  {
    type: 'Producto con IA',
    headline: 'Datos + Modelos + UX',
    badge: 'badge-purple',
    desc: 'Integración de LLMs, embeddings semánticos o pipelines de ML en un producto de usuario final.',
    stack: [
      { name: 'FastAPI (Python)',why: 'Endpoints async, validación Pydantic, OpenAPI auto' },
      { name: 'OpenAI / Anthropic',why:'GPT-4o, Claude, embeddings text-embedding-3' },
      { name: 'PostgreSQL + pgvector',why:'Búsqueda vectorial nativa sin Pinecone externo' },
      { name: 'Vue 3 + Nuxt',   why: 'Streaming de respuestas con SSE, UX fluida' },
    ],
    avoid: 'Modelos on-premise day 1 — la API-first approach reduce tiempo a producción en 10x'
  },
]

// ── LENGUAJES ────────────────────────────────────────────────
const languages = [
  {
    name: 'TypeScript',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    when: 'Todo proyecto que dure más de 3 meses o involucre más de 1 desarrollador',
    strength: 'Type safety en compile-time, refactoring seguro, DX excelente en IDEs',
    tags: ['Frontend', 'Backend', 'Full-stack', 'APIs'],
  },
  {
    name: 'JavaScript',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    when: 'Scripts rápidos, configuraciones de build, prototipado inicial',
    strength: 'Ubiquo en browsers y Node, sin setup, cero fricción para empezar',
    tags: ['Frontend', 'Scripting', 'Tooling'],
  },
  {
    name: 'Python',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    when: 'Integraciones de IA, data pipelines, automatizaciones y backends de análisis',
    strength: 'Ecosistema ML sin rival (PyTorch, LangChain, NumPy), legibilidad extrema',
    tags: ['AI / ML', 'Data', 'Backend', 'Automatización'],
  },
  {
    name: 'Go',
    color: 'text-[#79D4F5]',
    bg: 'bg-[#79D4F5]/10 border-[#79D4F5]/20',
    when: 'APIs críticas en latencia, servicios de alta concurrencia o CLIs de producción',
    strength: 'Goroutines nativas, compilado a binario único, memoria predecible',
    tags: ['Backend', 'Microservicios', 'CLI', 'Performance'],
  },
  {
    name: 'SQL',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    when: 'Siempre que la integridad de datos sea crítica — que es casi siempre',
    strength: 'Declarativo, universal, ACID compliant, 50 años de optimizaciones',
    tags: ['Bases de Datos', 'Analytics', 'Reportes', 'Migraciones'],
  },
  {
    name: 'Rust',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    when: 'WebAssembly, performance crítica en el navegador, herramientas de sistema',
    strength: 'Memory safety sin GC, velocidad comparable a C, cero undefined behavior',
    tags: ['Systems', 'WebAssembly', 'CLI', 'Performance crítica'],
  },
]

const badgeClass = {
  'badge-purple': 'text-[#D8B4FE] bg-[#D8B4FE]/10 border-[#D8B4FE]/20',
  'badge-blue':   'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'badge-green':  'text-green-400 bg-green-500/10 border-green-500/20',
  'badge-yellow': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'badge-red':    'text-red-400 bg-red-500/10 border-red-500/20',
}

// ── GSAP ─────────────────────────────────────────────────────
onMounted(() => {
  if (typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // Hero reveal
    const tl = gsap.timeline()
    tl.fromTo('.hero-badge',      { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo('.hero-title-word',
        { y: 50, opacity: 0, rotationX: 45 },
        { y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, '-=0.4')
      .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.6')

    // Domain cards float
    const domainCards = gsap.utils.toArray('.domain-card')
    gsap.fromTo(domainCards,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.domains-grid', start: 'top 80%' },
      }
    )

    // Scenario cards reveal
    gsap.utils.toArray('.scenario-card').forEach((card, i) => {
      gsap.fromTo(card,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%' }
        }
      )
    })

    // Language pills reveal
    gsap.fromTo('.lang-card',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: '.langs-grid', start: 'top 85%' }
      }
    )

  }, mainContainer.value)
})

onUnmounted(() => { if (ctx) ctx.revert() })
</script>

<template>
  <main ref="mainContainer" class="relative bg-[#050508] text-white min-h-screen overflow-hidden selection:bg-[#D8B4FE] selection:text-black font-sans pb-32">

    <!-- Ambient glows -->
    <div class="fixed top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-[#D8B4FE]/8 blur-[160px] rounded-full pointer-events-none mix-blend-screen z-0"></div>
    <div class="fixed bottom-[10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/8 blur-[160px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

    <!-- ── HERO ── -->
    <header class="relative z-10 pt-40 pb-24 px-6 max-w-7xl mx-auto text-center">
      <span class="hero-badge inline-block text-[10px] font-mono text-[#D8B4FE] uppercase tracking-[0.3em] bg-[#D8B4FE]/10 border border-[#D8B4FE]/20 px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
        Stack & Herramientas
      </span>
      <h1 class="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-8 overflow-hidden flex flex-wrap justify-center gap-x-4">
        <span class="hero-title-word">Arsenal</span>
        <span class="hero-title-word text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D8B4FE] to-white/60 italic">Tecnológico.</span>
      </h1>
      <p class="hero-desc text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
        No elegimos tecnologías por tendencia — las elegimos por el problema. Cada stack es una decisión arquitectónica que afecta el costo, la velocidad y la longevidad del producto.
      </p>
    </header>

    <!-- ── DOMINIOS ── -->
    <section class="relative z-10 max-w-7xl mx-auto px-6 pb-24 domains-grid">
      <div class="text-center mb-14">
        <h2 class="text-3xl md:text-4xl font-serif text-white mb-3">Dominios de Especialización</h2>
        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Click en cualquier dominio para ver las herramientas</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <div v-for="domain in domains" :key="domain.id"
          class="domain-card border rounded-[2rem] overflow-hidden transition-all duration-300 cursor-pointer"
          :class="[
            activeDomain === domain.id
              ? 'border-white/15 bg-[#0D0D11] md:col-span-2 xl:col-span-3'
              : 'bg-[#0B0B0E] border-white/5 hover:border-white/15',
          ]"
          @click="toggleDomain(domain.id)">

          <!-- Header -->
          <div class="p-7 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 transition-colors"
                :class="activeDomain === domain.id ? domain.color.replace('text-', 'bg-').replace('400', '500/20') : ''">
                <svg class="w-5 h-5 transition-colors" :class="activeDomain === domain.id ? domain.color : 'text-gray-600'"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="domain.icon"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-serif text-white">{{ domain.label }}</h3>
                <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">{{ domain.techs.length }} herramientas</p>
              </div>
            </div>
            <div class="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-all duration-300"
              :class="activeDomain === domain.id ? 'rotate-180 border-white/20' : ''">
              <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>

          <!-- Preview (collapsed) -->
          <div v-if="activeDomain !== domain.id" class="px-7 pb-7">
            <p class="text-sm text-gray-400 leading-relaxed mb-4">{{ domain.desc }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in domain.techs.slice(0, 5)" :key="tech.name"
                class="text-[9px] font-mono text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/8">
                {{ tech.name }}
              </span>
              <span v-if="domain.techs.length > 5"
                class="text-[9px] font-mono text-gray-600 bg-white/[0.02] px-2.5 py-1 rounded-full border border-white/5">
                +{{ domain.techs.length - 5 }} más
              </span>
            </div>
          </div>

          <!-- Expanded -->
          <Transition name="expand">
            <div v-if="activeDomain === domain.id" class="border-t border-white/5">
              <div class="p-7">
                <p class="text-sm text-gray-400 leading-relaxed mb-8 max-w-2xl">{{ domain.desc }}</p>
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div v-for="tech in domain.techs" :key="tech.name"
                    class="bg-black/40 border border-white/5 rounded-2xl p-4 hover:border-white/15 transition-colors">
                    <div class="flex items-start justify-between mb-2">
                      <h4 class="text-sm font-bold text-white">{{ tech.name }}</h4>
                      <span class="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" :class="domain.glow"></span>
                    </div>
                    <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-2">{{ tech.role }}</p>
                    <p class="text-xs text-gray-400 leading-relaxed">{{ tech.note }}</p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- ── LENGUAJES ── -->
    <section class="relative z-10 max-w-7xl mx-auto px-6 pb-24">
      <div class="text-center mb-14">
        <h2 class="text-3xl md:text-4xl font-serif text-white mb-3">Lenguajes & Cuándo Elegir Cada Uno</h2>
        <p class="text-sm text-gray-500 font-light max-w-xl mx-auto">El lenguaje es un medio, no un fin. Lo que importa es la herramienta correcta para el problema correcto.</p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 langs-grid">
        <div v-for="lang in languages" :key="lang.name"
          class="lang-card bg-[#0B0B0E] border border-white/5 rounded-[2rem] p-7 hover:border-white/15 transition-all">

          <div class="flex items-center justify-between mb-5">
            <h3 class="text-2xl font-serif" :class="lang.color">{{ lang.name }}</h3>
            <div class="flex flex-wrap gap-1 justify-end max-w-[50%]">
              <span v-for="tag in lang.tags.slice(0, 2)" :key="tag"
                class="text-[7px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border"
                :class="lang.bg">{{ tag }}</span>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <p class="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-1.5">Elegimos este cuando</p>
              <p class="text-xs text-gray-300 leading-relaxed">{{ lang.when }}</p>
            </div>
            <div class="border-t border-white/5 pt-4">
              <p class="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-1.5">Fortaleza clave</p>
              <p class="text-xs text-gray-400 leading-relaxed">{{ lang.strength }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── STACKS POR ESCENARIO ── -->
    <section class="relative z-10 max-w-7xl mx-auto px-6 pb-24">
      <div class="text-center mb-14">
        <h2 class="text-3xl md:text-4xl font-serif text-white mb-3">Stack Recomendado por Tipo de Proyecto</h2>
        <p class="text-sm text-gray-500 font-light max-w-xl mx-auto">Decisiones arquitectónicas que aplicamos en producción, con el razonamiento detrás de cada elección.</p>
      </div>

      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="scenario in scenarios" :key="scenario.type"
          class="scenario-card bg-[#0B0B0E] border border-white/5 rounded-[2rem] p-7 hover:border-white/15 transition-all flex flex-col">

          <div class="flex items-start justify-between gap-3 mb-4">
            <div>
              <span class="inline-block text-[8px] font-mono uppercase tracking-widest px-2 py-1 rounded-full border mb-3"
                :class="badgeClass[scenario.badge]">
                {{ scenario.type }}
              </span>
              <h3 class="text-xl font-serif text-white leading-tight">{{ scenario.headline }}</h3>
            </div>
          </div>

          <p class="text-xs text-gray-400 leading-relaxed mb-6">{{ scenario.desc }}</p>

          <div class="space-y-2.5 flex-1">
            <div v-for="item in scenario.stack" :key="item.name"
              class="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3">
              <div class="w-1.5 h-1.5 rounded-full bg-[#D8B4FE] shrink-0 mt-1.5"></div>
              <div class="min-w-0">
                <p class="text-[10px] font-bold text-white font-mono">{{ item.name }}</p>
                <p class="text-[9px] text-gray-500 leading-relaxed mt-0.5">{{ item.why }}</p>
              </div>
            </div>
          </div>

          <div class="mt-5 pt-5 border-t border-white/5">
            <p class="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-1.5">Evitar en este contexto</p>
            <p class="text-[10px] text-gray-600 leading-relaxed italic">{{ scenario.avoid }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FILOSOFÍA ── -->
    <section class="relative z-10 max-w-4xl mx-auto px-6 pb-24">
      <div class="bg-gradient-to-br from-[#D8B4FE]/5 to-transparent border border-[#D8B4FE]/15 rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D8B4FE]/40 to-transparent"></div>
        <p class="text-[9px] font-mono text-[#D8B4FE]/60 uppercase tracking-[0.4em] mb-6">Filosofía de Stack</p>
        <h2 class="text-2xl md:text-3xl font-serif text-white mb-6 leading-relaxed">
          "La herramienta correcta para el problema correcto.<br>El lenguaje correcto para el equipo correcto."
        </h2>
        <p class="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-8">
          El universo tecnológico evoluciona más rápido de lo que cualquier equipo puede dominar.
          Por eso priorizamos los <strong class="text-white font-normal">fundamentos sólidos</strong> sobre las tendencias, y el
          <strong class="text-white font-normal">aprendizaje continuo</strong> sobre la zona de confort.
          Si el proyecto lo requiere, aprendemos lo necesario para construirlo bien — sin comprometer la calidad del resultado.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <span class="text-[9px] font-mono text-gray-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Aprendizaje continuo</span>
          <span class="text-[9px] font-mono text-gray-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Mejores prácticas primero</span>
          <span class="text-[9px] font-mono text-gray-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Performance sobre preferencia</span>
          <span class="text-[9px] font-mono text-gray-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Criterio sobre comodidad</span>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="relative z-10 max-w-4xl mx-auto px-6">
      <div class="border-t border-white/10 pt-20 text-center flex flex-col items-center">
        <div class="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-[#D8B4FE]">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
        </div>
        <h2 class="text-3xl md:text-4xl font-serif text-white mb-6">¿Necesita una arquitectura específica?</h2>
        <p class="text-gray-400 font-sans mb-10 max-w-xl mx-auto text-sm leading-relaxed">
          Podemos adaptarnos a su stack actual o diseñar uno desde cero enfocado en rendimiento, longevidad y facilidad de mantenimiento.
        </p>
        <router-link to="/contacto"
          class="group relative inline-flex items-center justify-center px-10 py-5 font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-black bg-white rounded-full overflow-hidden hover:scale-105 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(216,180,254,0.4)]">
          <span class="relative z-10 flex items-center gap-2">
            Discutir Requerimientos Técnicos
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </span>
        </router-link>
      </div>
    </section>

  </main>
</template>

<style scoped>
.expand-enter-active { transition: all 0.3s ease-out; }
.expand-leave-active { transition: all 0.2s ease-in; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
