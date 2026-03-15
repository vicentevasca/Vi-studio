import { createRouter, createWebHistory } from 'vue-router'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Layouts
import HomeView  from './layouts/HomeView.vue'
import AdminView from './layouts/AdminView.vue'

// Páginas públicas
import Index      from './pages/index.vue'
import Servicios  from './pages/servicios.vue'
import Tecnologias from './pages/tecnologias.vue'
import Contacto   from './pages/contacto.vue'
import Nosotros   from './pages/nosotros.vue'
import playground    from './pages/playground.vue'
import Conocimiento  from './pages/conocimiento.vue'

// Páginas admin (lazy — no se cargan hasta que el usuario está autenticado)
const Login          = () => import('./pages/admin/login.vue')
const IndexAdmin     = () => import('./pages/admin/index.vue')
const Pipeline       = () => import('./pages/admin/pipeline.vue')
const ExpedienteIndex = () => import('./pages/admin/expediente/index.vue')
const ExpedienteId   = () => import('./pages/admin/expediente/[id].vue')
const Backlog        = () => import('./pages/admin/backlog.vue')
const Soporte        = () => import('./pages/admin/soporte.vue')

// Espera a que Firebase resuelva el estado de auth real.
// Se llama una vez por navegación — usa la caché interna de Firebase
// en visitas subsecuentes (< 5ms).
const getCurrentUser = () =>
  new Promise((resolve) => {
    // Si ya hay un valor en caché, Firebase lo resuelve síncronamente
    const removeListener = onAuthStateChanged(auth, (user) => {
      removeListener()
      resolve(user)
    })
  })

export const routes = [
  {
    path: '/',
    component: HomeView,
    children: [
      { path: '',           component: Index },
      { path: 'servicios',  component: Servicios },
      { path: 'tecnologias', component: Tecnologias },
      { path: 'nosotros',   component: Nosotros },
      { path: 'contacto',   component: Contacto },
      { path: 'playground',   component: playground },
      { path: 'conocimiento', component: Conocimiento },
    ]
  },
  {
    path: '/login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/admin',
    component: AdminView,
    meta: { requiresAuth: true },
    children: [
      { path: '',                component: IndexAdmin },
      { path: 'pipeline',        component: Pipeline },
      { path: 'backlog',         component: Backlog },
      { path: 'expediente',      component: ExpedienteIndex },
      { path: 'expediente/:id',  component: ExpedienteId },
      { path: 'soporte',         component: Soporte },
    ]
  },
  // Captura cualquier ruta desconocida y redirige al inicio
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard principal — primera línea de defensa
router.beforeEach(async (to, _from, next) => {
  const requiresAuth  = to.matched.some(r => r.meta.requiresAuth)
  const requiresGuest = to.matched.some(r => r.meta.requiresGuest)

  // En contexto SSR/SSG no hay Firebase Auth real — dejamos pasar
  // (las rutas admin están excluidas del build SSG de todas formas)
  if (typeof window === 'undefined') return next()

  try {
    const user = await getCurrentUser()

    if (requiresAuth && !user) {
      // Ruta protegida sin sesión → login
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }

    if (requiresGuest && user) {
      // Ya está logueado → panel
      return next('/admin')
    }

    next()
  } catch {
    // Si Firebase falla por cualquier razón, mandamos al login de forma segura
    if (requiresAuth) return next('/login')
    next()
  }
})

export default router
