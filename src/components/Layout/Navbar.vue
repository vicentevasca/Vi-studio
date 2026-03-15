<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { useAuth } from '../../composables/useAuth'

const route  = useRoute()
const router = useRouter()
const { isAuthenticated, isLoading } = useAuth()

const isScrolled      = ref(false)
const isMobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Inicio',        path: '/' },
  { name: 'Playground',    path: '/playground' },
  { name: 'Conocimiento',  path: '/conocimiento' },
  { name: 'Servicios',     path: '/servicios' },
  { name: 'Tecnologías',   path: '/tecnologias' },
  { name: 'Filosofía',     path: '/nosotros' },
]

const handleScroll  = () => { isScrolled.value = window.scrollY > 20 }
const toggleMobile  = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }
const closeMobile   = () => { isMobileMenuOpen.value = false }

watch(isMobileMenuOpen, (val) => {
  if (import.meta.env.SSR) return
  document.body.style.overflow = val ? 'hidden' : ''
})

const handleLogout = async () => {
  closeMobile()
  await signOut(auth)
  router.push('/')
}

if (!import.meta.env.SSR) {
  window.addEventListener('scroll', handleScroll)
}
</script>

<template>
  <header
    class="fixed top-0 left-0 w-full z-50 transition-all duration-500"
    :class="isScrolled ? 'bg-[#050508]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'"
  >
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">

      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 group z-50">
        <span class="text-3xl md:text-4xl text-[#D8B4FE]/60 font-['Great_Vibes'] select-none transition-all duration-500 group-hover:text-[#D8B4FE] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(216,180,254,0.5)]">
          VI
        </span>
        <span class="text-xl font-serif tracking-widest text-white group-hover:text-[#D8B4FE] transition-colors">_Studio</span>
      </router-link>

      <!-- Nav links (desktop) -->
      <nav class="hidden md:flex items-center gap-8">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
          :class="{ 'text-[#D8B4FE]': route.path === link.path }"
        >
          {{ link.name }}
        </router-link>
      </nav>

      <!-- CTA área (desktop) — cambia según auth -->
      <div class="hidden md:flex items-center gap-4">

        <!-- === LOGUEADO === -->
        <template v-if="!isLoading && isAuthenticated">
          <span class="text-[8px] font-mono text-[#D8B4FE]/40 uppercase tracking-[0.2em] border border-[#D8B4FE]/10 px-2 py-1 rounded">
            Admin
          </span>
          <router-link
            to="/admin"
            class="flex items-center gap-2 bg-[#D8B4FE]/10 text-[#D8B4FE] border border-[#D8B4FE]/20 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#D8B4FE] hover:text-black transition-all"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Panel
          </router-link>
          <button
            @click="handleLogout"
            class="text-[9px] font-mono text-gray-600 uppercase tracking-widest hover:text-red-400 transition-colors"
          >
            Salir
          </button>
        </template>

        <!-- === NO LOGUEADO === -->
        <template v-else-if="!isLoading">
          <router-link
            to="/login"
            class="text-[9px] font-mono text-gray-600 uppercase tracking-widest hover:text-[#D8B4FE] transition-colors"
          >
            Vi_Admin
          </router-link>
          <router-link
            to="/contacto"
            class="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#D8B4FE] hover:text-black hover:border-[#D8B4FE] transition-all"
          >
            Iniciar Auditoría
          </router-link>
        </template>
      </div>

      <!-- Hamburguesa (móvil) -->
      <button @click="toggleMobile" class="md:hidden flex flex-col gap-1.5 z-50 p-2">
        <span class="block w-6 h-0.5 bg-white transition-transform duration-300" :class="isMobileMenuOpen ? 'rotate-45 translate-y-[8px] bg-[#D8B4FE]' : ''" />
        <span class="block w-6 h-0.5 bg-white transition-opacity duration-300" :class="isMobileMenuOpen ? 'opacity-0' : ''" />
        <span class="block w-6 h-0.5 bg-white transition-transform duration-300" :class="isMobileMenuOpen ? '-rotate-45 -translate-y-[8px] bg-[#D8B4FE]' : ''" />
      </button>
    </div>
  </header>

  <!-- Menú móvil -->
  <Transition name="fade-blur">
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-[#050508]/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center min-h-screen"
    >
      <nav class="flex flex-col items-center gap-8 text-center w-full px-6">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          @click="closeMobile"
          class="text-3xl font-serif text-white hover:text-[#D8B4FE] transition-colors"
        >
          {{ link.name }}
        </router-link>

        <!-- Logueado (móvil) -->
        <template v-if="!isLoading && isAuthenticated">
          <router-link
            to="/admin"
            @click="closeMobile"
            class="mt-6 w-full max-w-xs bg-[#D8B4FE] text-black px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Ir al Panel
          </router-link>
          <button
            @click="handleLogout"
            class="mt-2 text-[10px] font-mono text-red-400/60 uppercase tracking-widest hover:text-red-400 transition-colors"
          >
            Cerrar Sesión
          </button>
        </template>

        <!-- No logueado (móvil) -->
        <template v-else-if="!isLoading">
          <router-link
            to="/contacto"
            @click="closeMobile"
            class="mt-8 w-full max-w-xs bg-[#D8B4FE] text-black px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
          >
            Iniciar Auditoría
          </router-link>
          <router-link
            to="/login"
            @click="closeMobile"
            class="mt-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest hover:text-[#D8B4FE] transition-colors"
          >
            Vi_Admin
          </router-link>
        </template>
      </nav>
    </div>
  </Transition>
</template>

<style scoped>
@reference "tailwindcss";
.fade-blur-enter-active, .fade-blur-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-blur-enter-from, .fade-blur-leave-to { opacity: 0; backdrop-filter: blur(0px); }
</style>
