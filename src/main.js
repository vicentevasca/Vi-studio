import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router.js' // <-- Importamos solo la lista de rutas
import './style.css' // Aquí es donde pusiste el @import "tailwindcss"

// Inicializamos la app con soporte para SSG (SEO Perfecto)
export const createApp = ViteSSG(
  App,
  { 
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { top: 0 }
      }
    }
  },
  ({ app, router, routes, isClient, initialState }) => {
    // Aquí puedes agregar plugins globales después si los necesitas
  }
)