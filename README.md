# Vi_Studio — Web

Sitio web institucional y panel de administración interno de **Vi_Studio**, firma de Arquitectura de Software & Venture Studio fundada por Vicente Vásquez.

El proyecto opera bajo un modelo dual: **División A** (servicios de ingeniería para clientes externos) y **División B** (construcción de productos propios con modelo build-to-sell).

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Vue 3 (`<script setup>`, Composition API) |
| Build / SSG | Vite 7 + `vite-ssg` |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Animaciones | GSAP 3 + ScrollTrigger |
| Router | Vue Router 4 |
| Base de datos | Firebase Firestore (real-time `onSnapshot`) |
| Auth | Firebase Authentication |
| Hosting | Firebase Hosting (CDN global) |
| Backend | Firebase Cloud Functions v2 (Node.js) |
| Head management | `@unhead/vue` |

---

## Estructura del Proyecto

```
vi-studio-web/
├── src/
│   ├── App.vue                        # Root component — monta router-view
│   ├── main.js                        # Entry point — ViteSSG bootstrap
│   ├── router.js                      # Rutas, guards de auth, lazy imports
│   ├── firebase.js                    # Inicialización Firebase (guarded SSR)
│   ├── style.css                      # Estilos globales + fuentes
│   │
│   ├── layouts/
│   │   ├── HomeView.vue               # Layout público: Navbar + router-view + Footer
│   │   └── AdminView.vue              # Layout admin: sidebar + auth guard (3 capas)
│   │
│   ├── pages/
│   │   ├── index.vue                  # Landing page — hero, métricas, División A/B
│   │   ├── servicios.vue              # Servicios — modelo de negocio dual
│   │   ├── tecnologias.vue            # Arsenal tecnológico — dominios, lenguajes, stacks
│   │   ├── nosotros.vue               # Manifiesto — filosofía "Arte y Capital"
│   │   ├── contacto.vue               # Formulario de contacto → Firestore + Telegram
│   │   ├── playground.vue             # Lab interactivo: demos de CRM, ERP, BI, DMS
│   │   ├── conocimiento.vue           # Base de conocimiento: arquitectura, metodologías
│   │   ├── diagnostico.vue            # Diagnóstico técnico
│   │   └── admin/
│   │       ├── login.vue              # Login Firebase Auth con redirect preservado
│   │       ├── index.vue              # Dashboard: KPIs, pipeline, alertas, prospectos
│   │       ├── pipeline.vue           # CRM Kanban — 5 etapas, modal expediente, tareas
│   │       ├── backlog.vue            # Backlog global — prioridades, fechas límite
│   │       ├── soporte.vue            # Service Desk — tickets por estado
│   │       └── expediente/
│   │           ├── index.vue          # Directorio de clientes con filtros
│   │           └── [id].vue           # Modal expediente: dashboard, cliente, backlog,
│   │                                  #   actividad (timeline), infra, pagos
│   │
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Navbar.vue             # Navbar auth-aware: distinto estado logueado/no
│   │   │   ├── AdminSidebar.vue       # Sidebar del panel admin con navegación
│   │   │   └── Footer.vue
│   │   ├── UI/
│   │   │   ├── ToastContainer.vue     # Sistema de notificaciones (Teleport a body)
│   │   │   └── ConfirmDialog.vue      # Modal de confirmación destructiva
│   │   ├── BlueprintGrid.vue          # Fondo animado tipo blueprint
│   │   ├── CustomCursor.vue           # Cursor personalizado
│   │   ├── TransitionOverlay.vue      # Overlay de transición de rutas
│   │   └── XRayCard.vue               # Tarjeta con efecto de rayos X
│   │
│   ├── composables/
│   │   ├── useAuth.js                 # Singleton reactivo: undefined/null/user
│   │   ├── useToast.js                # Singleton: toasts con auto-dismiss
│   │   ├── useConfirm.js              # Singleton: Promise-based confirm dialog
│   │   └── useNotes.js                # Per-lead: timeline de actividad (Firestore)
│   │
│   ├── store/
│   │   └── admin.js                   # Store singleton: leads, tasks, tickets (onSnapshot)
│   │                                  # + updateLeadData, logNote
│   │
│   └── services/
│       ├── automationUtils.js         # notifyAdmin, createAutoTask, logSystemEvent
│       ├── pipelineAutomation.js      # handlePipelineTransition → Telegram + Firestore
│       ├── financeAutomation.js       # processNewPayment → notificación + actualiza DB
│       ├── supportAutomation.js       # Lógica de tickets de soporte
│       └── systemHealthAutomation.js  # Monitoreo de salud del sistema
│
├── functions/
│   └── index.js                       # Cloud Functions v2:
│                                      #   - api: webhook handler (POST /api)
│                                      #   - notifyNewLead: trigger Firestore → Telegram
│                                      #   - notifyNewTicket: trigger Firestore → Telegram
│                                      #   - handleBotCallbacks: inline keyboard actions
│                                      #   - systemGuardian: cron 24h (leads >7 días sin mover)
│
├── vite.config.js                     # SSG route exclusion + plugins
├── firebase.json                      # Hosting rewrites + Functions config
└── package.json
```

---

## Páginas Públicas

| Ruta | Descripción |
|---|---|
| `/` | Landing page con hero, KPIs (TTM, exits, uptime), División A & B |
| `/servicios` | Servicios de ingeniería — modelo de negocio dual |
| `/tecnologias` | Stack completo: dominios, lenguajes, stacks por tipo de proyecto |
| `/nosotros` | Manifiesto — filosofía "Arte y Capital", Vicente Vásquez |
| `/contacto` | Formulario → Firestore lead + notificación Telegram automática |
| `/playground` | Lab interactivo: demos reales de CRM, ERP, BI y DMS con GSAP |
| `/conocimiento` | Fundamentos: metodologías, arquitectura, buenas prácticas + quiz |

---

## Panel de Administración (`/admin`)

Protegido por **3 capas de seguridad**:

1. **ViteSSG exclusion** — las rutas `/admin/**` y `/login` no se pre-renderizan, por lo que Firebase Hosting nunca sirve HTML estático que bypass el guard
2. **Router guard** (`beforeEach`) — `getCurrentUser()` espera la resolución real de Firebase Auth antes de permitir navegación
3. **AdminView watch** — si la sesión expira con el panel abierto, redirige a `/login` inmediatamente

| Ruta | Descripción |
|---|---|
| `/login` | Login con `signInWithEmailAndPassword`, preserva `?redirect=` |
| `/admin` | Dashboard: MRR, clientes activos, backlog, alertas, pipeline |
| `/admin/pipeline` | CRM Kanban — mover leads, abrir expediente, badges de tareas |
| `/admin/backlog` | Backlog global — filtro por prioridad, fechas límite, vencidas |
| `/admin/expediente` | Directorio de clientes — badges de estado, búsqueda |
| `/admin/soporte` | Service Desk — tickets por estado (abierto/en progreso/resuelto) |

### Modal Expediente (`/admin/expediente/:id`)

Abre como overlay. Tabs:

| Tab | Contenido |
|---|---|
| **Dashboard** | KPIs (recaudado, contrato, tareas, días), cobranza, cambio de etapa |
| **Cliente** | Datos de contacto + empresa + desafío + web + fuente del lead |
| **Backlog** | Crear tareas con prioridad y fecha límite, cambiar estado inline |
| **Actividad** | Timeline cronológico: notas manuales, cambios de etapa, pagos |
| **Infra** | Hosting, dominio, repositorio |
| **Pagos** | MRR, registrar abonos, historial de pagos |

---

## Colecciones Firestore

```
leads/          — prospectos y clientes (clientStatus = radar|auditoria|laboratorio|negociacion|despliegue)
tasks/          — tareas globales vinculadas a leadId (status = pending|progress|done)
tickets/        — tickets de soporte (status = abierto|en_progreso|resuelto)
notes/          — timeline de actividad por lead (type = manual|stage_change|payment|task|system)
system_logs/    — eventos de sistema (automationUtils.logSystemEvent)
```

---

## Composables Singleton

Todos usan estado a nivel de módulo para compartir estado entre componentes sin Vuex/Pinia:

```js
// useAuth — undefined=loading, null=no session, object=authenticated
const { user, isLoading, isAuthenticated } = useAuth()

// useToast — auto-dismiss configurable
const toast = useToast()
toast.success('Mensaje')
toast.error('Error', 5000)
toast.info('Info')

// useConfirm — Promise-based
const { ask } = useConfirm()
const ok = await ask('¿Confirmar eliminación?')

// useNotes — per-lead, cached
const { notes, addNote } = useNotes(leadId)
await addNote('Reunión realizada', 'manual')
```

---

## Cloud Functions

Endpoint único `POST /api` con routing interno por campo `type`:

| Tipo | Descripción |
|---|---|
| `system_alert` | Alertas de sistema al Telegram del admin |
| `telegram_webhook` | Recibe mensajes y comandos del bot |
| `telegram_callback` | Ejecuta acciones desde inline keyboards de Telegram |

**Triggers Firestore:**
- `notifyNewLead` — creación en `leads/` → Telegram con botones (WhatsApp, aceptar/rechazar, abrir expediente)
- `notifyNewTicket` — creación en `tickets/` → Telegram con botones de acción

**Cron:**
- `systemGuardian` — cada 24h, alerta sobre leads sin mover por más de 7 días

---

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (HMR instantáneo)
npm run dev

# Build de producción (SSG — genera HTML estático en /dist)
npm run build

# Preview del build
npm run preview
```

### Variables de Entorno

Crear `src/firebase.js` con la configuración del proyecto Firebase, o configurar las variables en `.env`:

```env
# Firebase config (ver src/firebase.js para la estructura completa)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Deploy

```bash
# Build + deploy a Firebase Hosting
npm run build && firebase deploy --only hosting

# Deploy solo Cloud Functions
firebase deploy --only functions

# Deploy completo
firebase deploy
```

---

## Notas de Arquitectura

**SSG + SPA híbrido:** ViteSSG pre-renderiza las rutas públicas en build-time (HTML estático servido desde CDN). El panel admin es una SPA pura (no se pre-renderiza). Firebase Hosting usa un rewrite `** → /index.html` para el fallback de Vue Router.

**Seguridad del panel:** La exclusión de rutas en `ssgOptions.includedRoutes` es la capa más importante — sin ella, Firebase Hosting serviría el HTML del panel sin pasar por el guard del router en la primera carga.

**Patrón de composables singleton:** `useAuth`, `useToast`, `useConfirm` y `useNotes` inicializan su estado a nivel de módulo (fuera del `export function`), lo que garantiza que todos los componentes compartan la misma instancia reactiva sin necesidad de un store global.

**Firestore real-time:** `initAdminStore()` en `src/store/admin.js` suscribe a tres colecciones simultáneamente con `onSnapshot`. El store es singleton y se inicializa una sola vez gracias al flag `isInitialized`.

---

## Autor

**Vicente Vásquez** — Lead Architect & Founder
Vi_Studio · Firma de Arquitectura de Software & Venture Studio
