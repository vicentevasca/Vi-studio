<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route  = useRoute()

const email    = ref('')
const password = ref('')
const errorMsg = ref('')
const loading  = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    // Si el usuario intentaba acceder a una ruta protegida, volver a ella
    const redirect = route.query.redirect || '/admin'
    router.push(String(redirect))
  } catch {
    errorMsg.value = 'Credenciales inválidas o acceso bloqueado.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#050508] text-white flex items-center justify-center px-6 selection:bg-[#D8B4FE] selection:text-black">
    <div class="w-full max-w-sm border border-white/10 p-10 rounded-3xl bg-black shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D8B4FE]/50 to-transparent"></div>

      <div class="flex items-center justify-center gap-2 mb-10">
        <span class="text-3xl text-[#D8B4FE]/60 font-['Great_Vibes']">VI</span>
        <span class="text-lg font-serif tracking-widest text-white">_Studio</span>
      </div>

      <p class="text-[9px] font-mono text-gray-600 uppercase tracking-[0.4em] mb-8 text-center">Acceso Restringido</p>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          autocomplete="email"
          class="w-full bg-transparent border-b border-white/10 py-3 focus:border-[#D8B4FE] outline-none transition-colors text-sm font-mono text-center placeholder:text-gray-700"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          required
          autocomplete="current-password"
          class="w-full bg-transparent border-b border-white/10 py-3 focus:border-[#D8B4FE] outline-none transition-colors text-sm font-mono text-center placeholder:text-gray-700"
        />

        <Transition name="fade">
          <p v-if="errorMsg" class="text-red-400 text-[9px] uppercase tracking-widest text-center py-2">
            {{ errorMsg }}
          </p>
        </Transition>

        <button
          type="submit"
          :disabled="loading"
          class="w-full mt-6 bg-[#D8B4FE] text-black text-[10px] uppercase tracking-[0.2em] font-bold py-4 rounded-xl hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ loading ? 'Verificando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <router-link
        to="/"
        class="block text-center text-[8px] font-mono text-gray-700 uppercase tracking-widest mt-8 hover:text-gray-500 transition-colors"
      >
        ← Volver al sitio
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
