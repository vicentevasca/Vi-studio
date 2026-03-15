<script setup>
import { ref, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

useHead({
  title: 'Conocimiento | Vi_Studio',
  meta: [
    { name: 'description', content: 'Arquitectura de software, metodologías de desarrollo y buenas prácticas explicadas con ejemplos reales. Conocimiento técnico de Vi_Studio.' }
  ]
})

const activeFilter = ref('all')
const expandedCard  = ref(null)

const toggleCard = (id) => {
  expandedCard.value = expandedCard.value === id ? null : id
}

// ── QUIZ ────────────────────────────────────────────────────────
const quizActive   = ref(false)
const quizStep     = ref(0)
const quizAnswers  = ref({})
const quizResult   = ref(null)

const quizQuestions = [
  {
    id: 'team',
    question: '¿Cuál es el tamaño del equipo?',
    options: [
      { value: 'solo',   label: '1–2 personas' },
      { value: 'small',  label: '3–8 personas' },
      { value: 'large',  label: '9+ personas' },
    ]
  },
  {
    id: 'scope',
    question: '¿Qué tan definidos están los requisitos?',
    options: [
      { value: 'fluid',  label: 'Cambian constantemente' },
      { value: 'partial',label: 'Parcialmente definidos' },
      { value: 'fixed',  label: 'Completamente definidos' },
    ]
  },
  {
    id: 'goal',
    question: '¿Cuál es el objetivo principal del proyecto?',
    options: [
      { value: 'mvp',        label: 'Lanzar un MVP rápido' },
      { value: 'product',    label: 'Desarrollar un producto iterativo' },
      { value: 'enterprise', label: 'Sistema enterprise / contrato cerrado' },
      { value: 'ops',        label: 'Mantenimiento / soporte continuo' },
    ]
  },
]

const answerQuestion = (questionId, value) => {
  quizAnswers.value[questionId] = value
  if (quizStep.value < quizQuestions.length - 1) {
    quizStep.value++
  } else {
    computeQuizResult()
  }
}

const computeQuizResult = () => {
  const { team, scope, goal } = quizAnswers.value
  let rec = { method: '', reason: '', arch: '' }

  if (goal === 'ops') {
    rec = { method: 'Kanban', reason: 'Flujo continuo sin sprints — ideal para mantenimiento y soporte donde las tareas llegan sin ritmo predecible.', arch: 'Monolito modular o Hexagonal si el sistema ya existe.' }
  } else if (goal === 'mvp' && team !== 'large') {
    rec = { method: 'Shape Up', reason: 'Ciclos de 6 semanas con scope fijo y sin backlog. Perfecto para MVPs donde velocidad y foco son críticos.', arch: 'Monolito o Jamstack. Sencillez sobre arquitectura distribuida.' }
  } else if (scope === 'fixed' && goal === 'enterprise') {
    rec = { method: 'Waterfall', reason: 'Contrato con scope cerrado = fases secuenciales bien documentadas. Cambios son formales y costosos.', arch: 'Arquitectura Hexagonal para separar dominio de infraestructura.' }
  } else if (team === 'large' || goal === 'enterprise') {
    rec = { method: 'Scrum + SAFe', reason: 'Equipos grandes necesitan sincronización entre squads. Scrum a nivel equipo + SAFe (Scaled Agile) para coordinación.', arch: 'Microservicios por dominio de negocio + Event-Driven para comunicación asíncrona.' }
  } else {
    rec = { method: 'Scrum', reason: 'El framework ágil más adoptado. Sprints de 2 semanas con ceremonias que fuerzan reflexión y ajuste continuo.', arch: 'Monolito bien estructurado primero. Extraer microservicios solo cuando haya un cuello de botella real.' }
  }

  quizResult.value = rec
}

const resetQuiz = () => {
  quizStep.value = 0
  quizAnswers.value = {}
  quizResult.value = null
}

// ── CONTENIDO ───────────────────────────────────────────────────
const concepts = [
  // ── METODOLOGÍAS ────────────────────────────
  {
    id: 'scrum',
    category: 'metodologia',
    title: 'Scrum',
    subtitle: 'Iteraciones cortas, entregas constantes',
    desc: 'Framework ágil centrado en sprints de 1–4 semanas. Cada sprint produce un incremento funcional. Las ceremonias (Planning, Daily, Review, Retro) fuerzan transparencia y mejora continua.',
    when: ['MVPs con requisitos cambiantes', 'Equipos de 3–9 personas con PO disponible', 'Proyectos donde el feedback del cliente moldea el producto'],
    avoid: ['Proyectos con scope 100% cerrado y sin margen de cambio', 'Equipos que no pueden comprometerse con ceremonias diarias'],
    code: `// Estructura de un Sprint en Scrum
const sprint = {
  duración: '2 semanas',           // Time-boxed, nunca se extiende
  artefactos: {
    productBacklog: 'Todo lo que el producto debe ser',
    sprintBacklog:  'Lo que el equipo se comprometió a entregar',
    incremento:     'Software funcional y entregable al final',
  },
  ceremonias: [
    'Sprint Planning   — ¿Qué hacemos este sprint?',
    'Daily Standup     — 15 min: ayer / hoy / bloqueos',
    'Sprint Review     — Demo al cliente o stakeholder',
    'Retrospectiva     — ¿Qué mejorar como equipo?',
  ],
}`,
    note: 'Scrum no es solo tablero Kanban. Sin las ceremonias y sin un Product Owner con autoridad, es teatro ágil.'
  },
  {
    id: 'kanban',
    category: 'metodologia',
    title: 'Kanban',
    subtitle: 'Flujo continuo sin sprints',
    desc: 'Sistema de gestión visual del trabajo en progreso (WIP). Las tareas fluyen de izquierda a derecha en un tablero. No hay sprints ni roles formales — solo el compromiso de limitar el WIP para aumentar el throughput.',
    when: ['Equipos de soporte, mantenimiento u operaciones', 'Cuando las tareas llegan de forma impredecible', 'Procesos continuos sin fechas de entrega fijas'],
    avoid: ['Proyectos con fechas de entrega comprometidas', 'Equipos que necesitan planificación y estimaciones formales'],
    code: `// Límites de WIP (Work In Progress)
// La regla de oro de Kanban: no empezar algo nuevo
// si ya tienes el máximo de tareas en progreso.

const tablero = {
  'To Do':      { max_wip: Infinity,  actual: 8  },
  'In Progress':{ max_wip: 3,         actual: 2  }, // ← límite crítico
  'Review':     { max_wip: 2,         actual: 1  },
  'Done':       { max_wip: Infinity,  actual: 12 },
}

// Si 'In Progress' llega a 3, NADA nuevo entra hasta
// que una tarea avance. Eso evita el multitasking y
// descubre cuellos de botella reales.`,
    note: 'Kanban es excelente para visualizar flujo. Su debilidad: sin límites de WIP estrictos, se convierte en un simple tablero decorativo.'
  },
  {
    id: 'shapeup',
    category: 'metodologia',
    title: 'Shape Up',
    subtitle: 'Ciclos de 6 semanas, sin backlog',
    desc: 'Metodología creada por Basecamp. Equipos pequeños reciben "apuestas" (pitches) de 6 semanas. Sin backlog: lo que no se hace en el ciclo se descarta o se re-evalúa. Énfasis en el "shaping" (dar forma al problema antes de asignar).',
    when: ['Startups con equipos de 2–4 personas', 'Productos donde velocidad y foco son más valiosos que el proceso', 'Liderazgo técnico que quiere controlar el scope sin microgestión'],
    avoid: ['Organizaciones grandes con múltiples dependencias entre equipos', 'Proyectos con stakeholders que requieren visibilidad semanal del progreso'],
    code: `// El ciclo Shape Up simplificado

// Fase 1: Shaping (responsabilidad del senior/founding)
const pitch = {
  problema:    'Los usuarios no encuentran sus archivos antiguos',
  solución:    'Buscador con filtro de fecha — no un explorador completo',
  apetito:     '2 semanas',  // ← tiempo máximo que vale la pena
  noScope:     ['Carpetas anidadas', 'Preview de archivos'],
}

// Fase 2: Betting Table — ¿apostar este ciclo o no?
// Fase 3: Building — equipo autónomo, 6 semanas, sin interrupciones
// Fase 4: Cool-down — 2 semanas libres para deuda técnica / exploración`,
    note: '"No hay backlog" es la parte más polémica y más poderosa. Si una idea es buena, vuelve. Si no, no valía la pena.'
  },
  {
    id: 'waterfall',
    category: 'metodologia',
    title: 'Waterfall',
    subtitle: 'Fases secuenciales, scope cerrado',
    desc: 'Modelo tradicional: Análisis → Diseño → Desarrollo → Testing → Deploy. Cada fase se cierra formalmente antes de iniciar la siguiente. Los cambios durante el desarrollo son costosos y formales.',
    when: ['Contratos con scope y precio completamente cerrado', 'Proyectos regulados (gobierno, salud) con documentación obligatoria', 'Cuando el cliente no puede participar activamente durante el desarrollo'],
    avoid: ['Productos digitales con usuarios reales que generan feedback', 'Cualquier proyecto donde "no sabemos exactamente qué necesitamos"'],
    code: `// Estructura documental típica en Waterfall
// Cada fase requiere aprobación formal (sign-off)

const proyecto = {
  fases: [
    {
      nombre: '1. Análisis de Requisitos',
      entregable: 'SRS — Software Requirements Specification',
      aprobación: 'Firma del cliente',
    },
    {
      nombre: '2. Diseño de Sistema',
      entregable: 'SAD — System Architecture Document',
      aprobación: 'Arquitecto + cliente',
    },
    {
      nombre: '3. Implementación',
      entregable: 'Código + unit tests',
      aprobación: 'Tech lead',
    },
    {
      nombre: '4. Testing & QA',
      entregable: 'Test report + UAT',
      aprobación: 'QA Manager + cliente',
    },
  ]
}`,
    note: 'Waterfall no es obsoleto — es inadecuado para ciertos contextos. En licitaciones públicas o contratos cerrados, sigue siendo la opción más honesta.'
  },
  // ── ARQUITECTURA ────────────────────────────
  {
    id: 'monolito',
    category: 'arquitectura',
    title: 'Arquitectura Monolítica',
    subtitle: 'Una sola unidad de despliegue',
    desc: 'Toda la aplicación se desarrolla y despliega como una unidad. El frontend, backend y base de datos son servidos desde el mismo proceso. Simple de desarrollar al inicio, complejo de escalar cuando crece.',
    when: ['Startups en etapa temprana (antes de product-market fit)', 'Equipos pequeños que no necesitan escalar componentes independientemente', '"Monolito modular" como paso previo antes de microservicios'],
    avoid: ['Cuando diferentes partes del sistema tienen requisitos de escala radicalmente distintos', 'Equipos grandes donde múltiples squads despliegan al mismo tiempo'],
    code: `// Monolito bien estructurado (Modular Monolith)
// No es "todo en un archivo" — es todo en un proceso,
// pero con módulos claramente delimitados.

src/
├── modules/
│   ├── billing/      # Facturación — módulo independiente
│   │   ├── routes.js
│   │   ├── service.js
│   │   └── repository.js
│   ├── users/        # Usuarios — módulo independiente
│   └── notifications/
├── shared/           # Código genuinamente compartido
│   ├── database.js
│   └── logger.js
└── server.js

// Cada módulo define su propia API interna.
// Si el día de mañana 'billing' necesita escalar,
// se extrae como microservicio con fricción mínima.`,
    note: '"Empieza monolito, extrae microservicios cuando el dolor es real." — la sabiduría de equipos que lo hicieron al revés primero.'
  },
  {
    id: 'microservicios',
    category: 'arquitectura',
    title: 'Microservicios',
    subtitle: 'Servicios independientes por dominio',
    desc: 'La aplicación se divide en servicios pequeños, autónomos, que se comunican por red (HTTP/gRPC/mensajería). Cada servicio tiene su propia base de datos y puede desplegarse, escalarse y fallar independientemente.',
    when: ['Equipos de 8+ personas trabajando en paralelo sobre el mismo producto', 'Dominios con requisitos de escala muy diferentes (billing vs. media streaming)', 'Organizaciones que necesitan despliegues independientes por equipo'],
    avoid: ['Startups sin product-market fit — la complejidad operacional mata la velocidad', 'Equipos pequeños: un monolito bien estructurado es más rápido y más barato'],
    code: `// Diseño por Bounded Context (DDD)
// Cada servicio es dueño de su dominio y sus datos.

// ❌ Anti-patrón: microservicios que comparten DB
SELECT u.name, o.total
FROM users_db.users u
JOIN orders_db.orders o ON u.id = o.user_id  -- ← NUNCA

// ✅ Correcto: comunicación por API o eventos
// orders-service → emite evento cuando se crea orden
orderCreatedEvent = {
  orderId: 'ord_123',
  userId:  'usr_456',
  total:   99900,
}

// users-service → escucha el evento y reacciona
// Cada uno mantiene su propia visión de la verdad.`,
    note: 'La regla de Conway: tu arquitectura refleja tu estructura organizacional. Si tu empresa no está organizada por dominios, los microservicios serán un desastre distribuido.'
  },
  {
    id: 'hexagonal',
    category: 'arquitectura',
    title: 'Arquitectura Hexagonal',
    subtitle: 'Separar el dominio de la infraestructura',
    desc: 'También llamada "Ports & Adapters". El núcleo de negocio (dominio) no depende de frameworks, bases de datos, ni HTTP. Los "puertos" son interfaces. Los "adaptadores" son las implementaciones concretas (Postgres, Express, Stripe).',
    when: ['Sistemas con lógica de negocio compleja que debe testearse sin infraestructura', 'Proyectos con alta probabilidad de cambiar de proveedor (DB, payment, email)', 'Cuando la mantenibilidad a largo plazo es más importante que la velocidad inicial'],
    avoid: ['CRUDs simples donde no hay lógica de negocio real', 'Prototipos o MVPs donde la velocidad importa más que la pureza arquitectural'],
    code: `// El dominio no sabe que existe Postgres ni Express.

// Puerto (interface pura — dominio)
interface UserRepository {
  findById(id: string): Promise<User | null>
  save(user: User): Promise<void>
}

// Adaptador (implementación — infraestructura)
class PostgresUserRepository implements UserRepository {
  async findById(id: string) {
    return db.query('SELECT * FROM users WHERE id = $1', [id])
  }
  async save(user: User) {
    await db.query('INSERT INTO users ...', [...])
  }
}

// Caso de uso (dominio puro, testeable en memoria)
class RegisterUser {
  constructor(private users: UserRepository) {}

  async execute(email: string, password: string) {
    const exists = await this.users.findById(email)
    if (exists) throw new Error('Email ya registrado')
    const user = User.create(email, password)
    await this.users.save(user)
    return user
  }
}`,
    note: 'Este es el patrón que Vi_Studio usa en sistemas que requieren longevidad. Separa lo que nunca cambia (reglas de negocio) de lo que siempre cambia (proveedores).'
  },
  {
    id: 'jamstack',
    category: 'arquitectura',
    title: 'Jamstack',
    subtitle: 'JavaScript · APIs · Markup pre-renderizado',
    desc: 'Desacopla el frontend del backend. El frontend se pre-renderiza como HTML estático (SSG) y se sirve desde un CDN. Toda la lógica dinámica va a APIs sin servidor. Resultado: velocidad extrema + seguridad por defecto.',
    when: ['Sitios de contenido (landing pages, blogs, docs)', 'Cuando la performance y el SEO son críticos', 'Equipos frontend que quieren desplegar sin coordinar con backend'],
    avoid: ['Aplicaciones con datos altamente personalizados en tiempo real por usuario', 'Sistemas con decenas de miles de páginas únicas (el build se vuelve lento)'],
    code: `// Este mismo sitio es Jamstack (ViteSSG + Firebase)

// 1. Build time: se generan todos los HTMLs estáticos
//    → ssg.config: includedRoutes filtra qué renderizar

// 2. Deploy: HTMLs estáticos al CDN (Firebase Hosting)
//    → tiempo al primer byte: <50ms desde cualquier lugar

// 3. Dinámico: solo cuando el usuario necesita datos reales
//    → Firebase Firestore, Cloud Functions, Auth

// El resultado: la landing page carga sin esperar al servidor.
// El panel admin, que requiere auth, NUNCA se pre-renderiza.

// firebase.json — rewrites para rutas dinámicas
{
  "hosting": {
    "rewrites": [
      { "source": "/admin/**", "function": "api" },
      { "source": "**",        "destination": "/index.html" }
    ]
  }
}`,
    note: 'La trampa del Jamstack: intentar volverlo "dinámico" en todas partes termina añadiendo la misma complejidad del monolito, pero distribuida.'
  },
  // ── BUENAS PRÁCTICAS ────────────────────────
  {
    id: 'solid',
    category: 'practica',
    title: 'Principios SOLID',
    subtitle: '5 reglas para código orientado a objetos',
    desc: 'Acrónimo de cinco principios de diseño OOP introducidos por Robert C. Martin. Siguen vigentes en 2025 porque atacan los síntomas del código que "funciona pero nadie quiere tocar": rigidez, fragilidad y viscosidad.',
    when: ['Diseño de clases, servicios o módulos en cualquier lenguaje OOP', 'Code reviews donde necesitas argumentar por qué un diseño es problemático', 'Refactorización de código legacy difícil de testear'],
    avoid: ['Aplicarlos como regla absoluta en scripts simples o prototipos — YAGNI gana aquí'],
    code: `// S — Single Responsibility: una clase, un motivo de cambio
// ❌ UserService que envía emails Y valida Y persiste
// ✅ UserService solo coordina. EmailService envía. UserRepository persiste.

// O — Open/Closed: abierto para extensión, cerrado para modificación
// ❌ if (type === 'paypal') ... else if (type === 'stripe') ...
// ✅ interface PaymentGateway { charge(amount): Promise<void> }
//    class StripeGateway implements PaymentGateway { ... }
//    class PaypalGateway implements PaymentGateway { ... }

// L — Liskov Substitution: subclases intercambiables con su padre
// I — Interface Segregation: interfaces pequeñas y específicas
// D — Dependency Inversion: depende de abstracciones, no implementaciones

class OrderService {
  // ✅ Depende de la interfaz, no de Stripe directamente
  constructor(private payment: PaymentGateway) {}

  async process(order: Order) {
    await this.payment.charge(order.total)
  }
}`,
    note: 'SOLID no es una lista de checks. Es un lenguaje común para detectar síntomas: "esto viola el SRP" es más preciso que "esto está mal".'
  },
  {
    id: 'dry-kiss',
    category: 'practica',
    title: 'DRY · KISS · YAGNI',
    subtitle: 'Los tres axiomas del código sano',
    desc: 'Tres principios complementarios que atacan los excesos más comunes en el código: duplicación innecesaria, complejidad artificial y funcionalidad especulativa.',
    when: ['En cada línea de código que escribes', 'Code reviews — son las más fáciles de argumentar', 'Refactorizaciones'],
    avoid: ['DRY mal aplicado crea abstracciones prematuras. "Tres usos antes de abstraer" es la regla práctica.'],
    code: `// DRY — Don't Repeat Yourself
// ❌ Copiar-pegar lógica de validación en 5 componentes
// ✅ Extraerla a un módulo compartido

// KISS — Keep It Simple, Stupid
// ❌ Solución de 80 líneas con recursión, generics y patrones
function calcularPrecioFinal(precio, descuento, iva) {
  return precio * (1 - descuento) * (1 + iva) // ✅ 1 línea
}

// YAGNI — You Aren't Gonna Need It
// El peor enemigo de la velocidad: código para requisitos futuros
// que nunca llegan.

// ❌ Añadir un sistema de plugins "por si acaso"
// ❌ Abstraer para "cuando tengamos múltiples providers"
// ✅ Resuelve el problema de hoy. Refactoriza cuando el dolor sea real.

// La regla de los tres:
// - 1 uso: escríbelo inline
// - 2 usos: duplica (por ahora)
// - 3 usos: abstrae`,
    note: 'YAGNI es el principio más violado por desarrolladores senior. A más experiencia, más tentación de diseñar para el futuro que no existe.'
  },
  {
    id: 'testing',
    category: 'practica',
    title: 'Pirámide de Testing',
    subtitle: 'Más unitarios, menos E2E',
    desc: 'Modelo de balanceo de tests propuesto por Mike Cohn. Los tests más rápidos y baratos (unitarios) van abajo y son la mayoría. Los más lentos y caros (E2E) van arriba y son pocos. Invertir la pirámide es el anti-patrón más costoso.',
    when: ['Diseñando la estrategia de QA de cualquier proyecto', 'Cuando los tests son lentos y el CI tarda 30+ minutos', 'Al convencer a stakeholders de que testing no es lujo'],
    avoid: ['No testees implementación — testea comportamiento. Si renombras una función, no deberías romper tests.'],
    code: `// La pirámide (de base a punta):

// 1. UNIT TESTS — mayoría (70-80%)
//    Rápidos (<1ms), sin I/O, sin DB, sin red
//    Prueban lógica de negocio en aislamiento
test('calcula descuento correctamente', () => {
  expect(calcularDescuento(100, 0.2)).toBe(80)
})

// 2. INTEGRATION TESTS — minoría (15-20%)
//    Prueban que los módulos se comunican bien
//    Pueden tocar DB real (en memoria o Docker)
test('guarda usuario y envía email de bienvenida', async () => {
  const user = await userService.register('test@email.com')
  expect(emailService.sent).toHaveBeenCalledWith(user.email)
})

// 3. E2E TESTS — muy pocos (5%)
//    Simulan al usuario real en el navegador (Playwright/Cypress)
//    Solo para flujos críticos: login, checkout, onboarding`,
    note: 'El "trophy" de Kent C. Dodds (Testing Library) propone que los tests de integración deberían ser la mayoría. Debate activo — lo importante es que tus tests den confianza real.'
  },
  {
    id: 'twelve-factor',
    category: 'practica',
    title: 'The Twelve-Factor App',
    subtitle: 'Metodología para SaaS escalable',
    desc: 'Manifiesto escrito por ingenieros de Heroku que define 12 principios para construir aplicaciones SaaS que escalan, se despliegan con consistencia y se mantienen sanas a lo largo del tiempo.',
    when: ['Diseñando la arquitectura de cualquier servicio en producción', 'Cuando tienes problemas de configuración entre entornos (dev/staging/prod)', 'Al preparar un sistema para escalar horizontalmente'],
    avoid: ['No es un checklist burocrático — prioriza los factores que resuelven tu dolor actual'],
    code: `// Los 12 factores más relevantes en la práctica:

// III — Config: en variables de entorno, NUNCA en el código
// ❌ const apiKey = 'sk-prod-abc123'
// ✅ const apiKey = process.env.OPENAI_API_KEY

// IV — Backing Services: DB, cache, email como "attached resources"
//      Dev usa SQLite, prod usa Postgres — mismo código, distinto env

// VI — Processes: sin estado local entre requests
//      La sesión va en Redis, no en memoria del proceso
//      Así puedes correr 10 instancias sin sincronización

// IX — Disposability: inicio rápido, apagado graceful
app.on('SIGTERM', async () => {
  await server.close()      // deja de aceptar conexiones
  await db.disconnect()     // cierra pool de DB
  process.exit(0)           // salida limpia
})

// XI — Logs: tratar logs como streams de eventos
//      console.log a stdout, el infra decide dónde va`,
    note: 'El factor más ignorado: el XII (Admin Processes). Las migraciones de BD corren como procesos de una sola vez — no en el startup de la app.'
  },
]

const categories = [
  { id: 'all',          label: 'Todos',             color: 'text-white' },
  { id: 'metodologia',  label: 'Metodologías',       color: 'text-blue-400' },
  { id: 'arquitectura', label: 'Arquitectura',        color: 'text-[#D8B4FE]' },
  { id: 'practica',     label: 'Buenas Prácticas',   color: 'text-green-400' },
]

const categoryMeta = {
  metodologia:  { label: 'Metodología',      dot: 'bg-blue-500',   badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  arquitectura: { label: 'Arquitectura',     dot: 'bg-[#D8B4FE]',  badge: 'text-[#D8B4FE] bg-[#D8B4FE]/10 border-[#D8B4FE]/20' },
  practica:     { label: 'Buenas Prácticas', dot: 'bg-green-500',  badge: 'text-green-400 bg-green-500/10 border-green-500/20' },
}

const filtered = computed(() =>
  activeFilter.value === 'all'
    ? concepts
    : concepts.filter(c => c.category === activeFilter.value)
)
</script>

<template>
  <main class="min-h-screen bg-[#050508] text-white selection:bg-[#D8B4FE] selection:text-black font-sans pt-24 pb-32 px-6 relative overflow-hidden">

    <!-- Ambient glow -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(216,180,254,0.07)_0%,transparent_65%)] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto relative z-10">

      <!-- Header -->
      <header class="text-center mb-20 max-w-3xl mx-auto">
        <p class="text-[9px] font-mono text-[#D8B4FE]/60 uppercase tracking-[0.4em] mb-6">Vi_Studio · Base de Conocimiento</p>
        <h1 class="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
          Fundamentos de<br><em class="text-[#D8B4FE]/80">Arquitectura</em>
        </h1>
        <p class="text-gray-400 font-light leading-relaxed text-base md:text-lg">
          Metodologías, patrones y buenas prácticas explicadas con ejemplos reales.
          Conocimiento que usamos en producción — no teoría de libro.
        </p>
      </header>

      <!-- Filter -->
      <div class="flex flex-wrap justify-center gap-3 mb-14">
        <button v-for="cat in categories" :key="cat.id"
          @click="activeFilter = cat.id; expandedCard = null"
          class="px-5 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] border transition-all"
          :class="activeFilter === cat.id
            ? 'bg-[#D8B4FE] text-black border-[#D8B4FE] shadow-[0_0_20px_rgba(216,180,254,0.25)]'
            : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'">
          {{ cat.label }}
          <span class="ml-1.5 opacity-50">{{ cat.id === 'all' ? concepts.length : concepts.filter(c => c.category === cat.id).length }}</span>
        </button>
      </div>

      <!-- Cards Grid -->
      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mb-24">
        <div v-for="concept in filtered" :key="concept.id"
          class="border rounded-3xl overflow-hidden transition-all duration-300"
          :class="expandedCard === concept.id
            ? 'md:col-span-2 xl:col-span-3 border-[#D8B4FE]/30 bg-[#0D0D10]'
            : 'border-white/5 bg-[#0B0B0E] hover:border-white/15'">

          <!-- Card header — always visible -->
          <div class="p-7 cursor-pointer" @click="toggleCard(concept.id)">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <span class="inline-flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-widest border px-2 py-1 rounded-full mb-4"
                  :class="categoryMeta[concept.category].badge">
                  <span class="w-1.5 h-1.5 rounded-full" :class="categoryMeta[concept.category].dot"></span>
                  {{ categoryMeta[concept.category].label }}
                </span>
                <h3 class="text-xl font-serif text-white mb-1">{{ concept.title }}</h3>
                <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{{ concept.subtitle }}</p>
              </div>
              <div class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 mt-1 transition-transform duration-300"
                :class="expandedCard === concept.id ? 'rotate-180 border-[#D8B4FE]/30' : ''">
                <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
            <p class="text-gray-400 text-sm font-light leading-relaxed mt-4">{{ concept.desc }}</p>
          </div>

          <!-- Expanded content -->
          <Transition name="expand">
            <div v-if="expandedCard === concept.id" class="border-t border-white/5">
              <div class="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">

                <!-- Left: use cases + note -->
                <div class="p-7 space-y-6">
                  <div>
                    <h4 class="text-[9px] font-mono text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      Úsalo cuando...
                    </h4>
                    <ul class="space-y-2">
                      <li v-for="w in concept.when" :key="w"
                        class="flex items-start gap-2.5 text-sm text-gray-300">
                        <span class="w-1 h-1 rounded-full bg-green-500 shrink-0 mt-2"></span>
                        {{ w }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="text-[9px] font-mono text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      Evítalo cuando...
                    </h4>
                    <ul class="space-y-2">
                      <li v-for="a in concept.avoid" :key="a"
                        class="flex items-start gap-2.5 text-sm text-gray-300">
                        <span class="w-1 h-1 rounded-full bg-red-500 shrink-0 mt-2"></span>
                        {{ a }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="concept.note" class="bg-[#D8B4FE]/5 border border-[#D8B4FE]/15 rounded-2xl p-5">
                    <p class="text-[9px] font-mono text-[#D8B4FE]/70 uppercase tracking-widest mb-2">Nota de campo</p>
                    <p class="text-xs text-gray-300 leading-relaxed italic">{{ concept.note }}</p>
                  </div>
                </div>

                <!-- Right: code example -->
                <div class="p-7">
                  <h4 class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-4">Ejemplo</h4>
                  <pre class="bg-black/60 border border-white/5 rounded-2xl p-5 text-[11px] font-mono text-gray-300 leading-relaxed overflow-x-auto whitespace-pre-wrap custom-scrollbar"><code>{{ concept.code }}</code></pre>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Quiz ─────────────────────────────────────────── -->
      <section class="max-w-3xl mx-auto">
        <div class="text-center mb-10">
          <p class="text-[9px] font-mono text-[#D8B4FE]/60 uppercase tracking-[0.3em] mb-4">Herramienta Interactiva</p>
          <h2 class="text-3xl md:text-4xl font-serif text-white mb-4">¿Qué metodología<br>necesita tu proyecto?</h2>
          <p class="text-gray-500 text-sm font-light">3 preguntas. Sin tecnicismos. Recomendación concreta.</p>
        </div>

        <div class="bg-[#0B0B0E] border border-white/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D8B4FE]/30 to-transparent"></div>

          <!-- Not started -->
          <div v-if="!quizActive && !quizResult" class="text-center py-4">
            <div class="w-14 h-14 rounded-full bg-[#D8B4FE]/10 border border-[#D8B4FE]/20 flex items-center justify-center mx-auto mb-6">
              <svg class="w-6 h-6 text-[#D8B4FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.5 3.5 0 01-4.95-4.95l.347-.347a3.5 3.5 0 014.95 0 5 5 0 01-7.072 7.072z"/>
              </svg>
            </div>
            <button @click="quizActive = true"
              class="bg-[#D8B4FE] text-black px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all">
              Iniciar Diagnóstico
            </button>
          </div>

          <!-- Questions -->
          <div v-else-if="quizActive && !quizResult">
            <div class="flex gap-1 mb-8">
              <div v-for="(q, i) in quizQuestions" :key="i"
                class="h-0.5 flex-1 rounded-full transition-colors"
                :class="i <= quizStep ? 'bg-[#D8B4FE]' : 'bg-white/10'"></div>
            </div>

            <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-4">
              Pregunta {{ quizStep + 1 }} de {{ quizQuestions.length }}
            </p>
            <h3 class="text-xl font-serif text-white mb-8">{{ quizQuestions[quizStep].question }}</h3>

            <div class="grid gap-3">
              <button v-for="opt in quizQuestions[quizStep].options" :key="opt.value"
                @click="answerQuestion(quizQuestions[quizStep].id, opt.value)"
                class="text-left px-6 py-4 rounded-2xl border border-white/10 text-sm text-gray-300 hover:border-[#D8B4FE]/50 hover:text-white hover:bg-[#D8B4FE]/5 transition-all">
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Result -->
          <div v-else-if="quizResult" class="space-y-6">
            <div class="text-center mb-8">
              <p class="text-[9px] font-mono text-green-400 uppercase tracking-widest mb-3">Diagnóstico completo</p>
              <h3 class="text-3xl font-serif text-white">{{ quizResult.method }}</h3>
            </div>

            <div class="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
              <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-3">Por qué esta metodología</p>
              <p class="text-gray-300 text-sm leading-relaxed">{{ quizResult.reason }}</p>
            </div>

            <div class="bg-[#D8B4FE]/5 border border-[#D8B4FE]/15 rounded-3xl p-6">
              <p class="text-[9px] font-mono text-[#D8B4FE]/70 uppercase tracking-widest mb-3">Arquitectura recomendada</p>
              <p class="text-gray-300 text-sm leading-relaxed">{{ quizResult.arch }}</p>
            </div>

            <div class="flex flex-col md:flex-row gap-3 pt-2">
              <button @click="resetQuiz(); quizActive = false"
                class="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                Repetir diagnóstico
              </button>
              <router-link to="/contacto"
                class="flex-1 py-3 rounded-2xl bg-[#D8B4FE] text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all text-center">
                Hablar con un arquitecto
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer CTA -->
      <div class="text-center mt-32">
        <p class="text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em] mb-6">¿Listo para aplicarlo?</p>
        <h3 class="text-3xl md:text-5xl font-serif text-white mb-8">El conocimiento sin ejecución<br>es solo teoría.</h3>
        <router-link to="/contacto"
          class="inline-flex items-center justify-center px-12 py-5 font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-black bg-white rounded-full hover:bg-[#D8B4FE] transition-colors duration-500">
          Diseñar mi Arquitectura →
        </router-link>
      </div>

    </div>
  </main>
</template>

<style scoped>
.expand-enter-active { transition: all 0.35s ease-out; }
.expand-leave-active { transition: all 0.25s ease-in; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-8px); }
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
</style>
