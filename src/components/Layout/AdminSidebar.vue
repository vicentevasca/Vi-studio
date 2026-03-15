<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { destroyAdminStore } from '../../store/admin'

const router = useRouter()
const route = useRoute()

const isMenuOpen = ref(false)
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }

watch(() => route.path, () => { isMenuOpen.value = false })

const adminLinks = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    name: 'Pipeline CRM',
    path: '/admin/pipeline',
    icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
  },
  {
    name: 'Directorio',
    path: '/admin/expediente',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    name: 'Backlog',
    path: '/admin/backlog',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
  },
  {
    name: 'Mesa de Ayuda',
    path: '/admin/soporte',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
  },
]

const handleLogout = async () => {
  try {
    if (typeof destroyAdminStore === 'function') destroyAdminStore()
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Error en logout:', error)
  }
}

const isActive = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>

<template>
  <!-- Botón hamburguesa móvil -->
  <button
    @click="toggleMenu"
    class="fixed top-6 right-6 z-[60] md:hidden bg-[#D8B4FE] text-black w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center transition-transform active:scale-90"
  >
    <svg v-if="!isMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
    </svg>
  </button>

  <!-- Backdrop móvil -->
  <Transition name="fade">
    <div
      v-if="isMenuOpen"
      @click="isMenuOpen = false"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[50] md:hidden"
    ></div>
  </Transition>

  <!-- Sidebar -->
  <aside
    class="fixed md:sticky top-0 left-0 z-[55] w-full md:w-64 h-[90vh] md:h-screen bg-[#050508] border-r border-white/5 flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
    :class="[
      isMenuOpen
        ? 'translate-y-0 opacity-100 rounded-t-[40px] md:rounded-none mt-[10vh] md:mt-0'
        : 'translate-y-full md:translate-y-0 opacity-0 md:opacity-100'
    ]"
  >
    <div class="overflow-y-auto">
      <!-- Logo -->
      <div class="p-8 border-b border-white/5 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-2xl text-[#D8B4FE]/70 font-['Great_Vibes']">VI</span>
          <span class="text-sm font-serif tracking-widest text-white">_Studio</span>
        </div>
        <span class="text-[8px] font-mono text-[#D8B4FE]/40 uppercase tracking-widest border border-[#D8B4FE]/10 px-2 py-1 rounded">Admin</span>
        <!-- Handle móvil -->
        <div class="md:hidden w-12 h-1.5 bg-white/10 rounded-full absolute top-4 left-1/2 -translate-x-1/2"></div>
      </div>

      <!-- Nav links -->
      <nav class="p-4 flex flex-col gap-1 mt-2">
        <router-link
          v-for="link in adminLinks"
          :key="link.path"
          :to="link.path"
          class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border"
          :class="isActive(link.path)
            ? 'bg-[#D8B4FE]/10 text-[#D8B4FE] border-[#D8B4FE]/20'
            : 'text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300'"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="link.icon"/>
          </svg>
          <span class="text-[10px] font-mono uppercase tracking-widest">{{ link.name }}</span>
        </router-link>
      </nav>
    </div>

    <!-- Logout -->
    <div class="p-4 border-t border-white/5 mb-10 md:mb-0">
      <button
        @click="handleLogout"
        class="w-full flex items-center justify-center gap-2 py-3 text-[9px] uppercase tracking-[0.2em] text-red-400/50 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Cerrar Terminal
      </button>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  aside { box-shadow: 0 -20px 50px rgba(0,0,0,0.5); }
}
</style>
