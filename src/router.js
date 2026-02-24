// --- LAYOUTS (Vistas Padre) ---
import HomeView from './layouts/HomeView.vue'
import AdminView from './layouts/AdminView.vue'

// --- PÁGINAS PÚBLICAS ---
import Index from './pages/index.vue'
import Nosotros from './pages/nosotros.vue'
import Servicios from './pages/servicios.vue'
import Tecnologias from './pages/tecnologias.vue'
import Contacto from './pages/contacto.vue'

// --- PÁGINAS PRIVADAS Y AUTH ---
import ExpedienteId from './pages/admin/expediente/[id].vue'
import ExpedienteIndex from './pages/admin/expediente/index.vue'
import Login from './pages/admin/login.vue'
import Pipeline from './pages/admin/pipeline.vue'
import Soporte from './pages/admin/soporte.vue'
import Diagnostico from './pages/diagnostico.vue'
import IndexAdmin from './pages/admin/index.vue'
import backlog from './pages/admin/backlog.vue'

// Exportamos DIRECTAMENTE el array de rutas (ViteSSG lo necesita así)
export const routes = [
  {
    // 🌐 VISTA PÚBLICA (Cliente)
    path: '/',
    component: HomeView, // El "molde" que tendrá el Navbar y Footer
    children: [
      { path: '', component: Index },
      { path: 'nosotros', component: Nosotros },
      { path: 'servicios', component: Servicios },
      { path: 'tecnologias', component: Tecnologias },
      { path: 'contacto', component: Contacto },
    ]
  },
  {
    // 🔐 LOGIN (Independiente, ocupa toda la pantalla)
    path: '/login',
    component: Login
  },
  {
    // 🛡️ VISTA ADMIN (Dashboard Privado)
    path: '/admin',
    component: AdminView, // El "molde" del panel de control
    children: [
      { path: '', component: IndexAdmin }, // Si entran a /admin, los lanza al pipeline
      { path: 'pipeline', component: Pipeline },
      { path: 'soporte', component: Soporte },
      { path : 'backlog', component: backlog },
      { path: 'diagnostico', component: Diagnostico },
      { path: 'expediente', component: ExpedienteIndex },
    { path: 'expediente/:id', component: ExpedienteId }
    ]
  },
  // 🚫 REDIRECCIÓN 404 (Si escriben una URL que no existe, van al inicio)
  { path: '/:pathMatch(.*)*', redirect: '/' }
]