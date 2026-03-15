import { ref, computed } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

// Singleton — se crea una sola vez y se comparte en toda la app.
// undefined = Firebase aún resolviendo (loading)
// null      = no hay sesión activa
// object    = usuario autenticado
const user = ref(undefined)

// Solo se suscribe en el cliente. En SSR/SSG (Node.js) no hay auth real,
// por lo que dejamos user como undefined y no bloqueamos el build.
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (u) => {
    user.value = u
  })
}

export function useAuth() {
  return {
    user,
    isLoading:       computed(() => user.value === undefined),
    isAuthenticated: computed(() => !!user.value),
  }
}
