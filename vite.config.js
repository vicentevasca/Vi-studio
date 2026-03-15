import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],

  // Excluir rutas privadas del pre-rendering SSG.
  // Si se pre-renderizaran, Firebase Hosting serviría el HTML estático
  // antes de que el rewrite rule entre en juego, bypasseando el guard del router.
  ssgOptions: {
    includedRoutes(paths) {
      return paths.filter(p => !p.startsWith('/admin') && p !== '/login')
    }
  }
})
