<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { signOut } from 'firebase/auth'

import { auth } from '../../firebase' 

import { destroyAdminStore } from '../../store/admin'

const router = useRouter()
const route = useRoute()

const adminLinks = [
  { name: 'Dashboard', path: '/admin', icon: '📈' },
  { name: 'Pipeline (CRM)', path: '/admin/pipeline', icon: '📊' },
  { name: 'Directorio', path: '/admin/expediente', icon: '📂' },
  { name: 'Backlog Maestro', path: '/admin/backlog', icon: '📋' },
  { name: 'Mesa de Ayuda', path: '/admin/soporte', icon: '🎧' },
]

const handleLogout = async () => {
  try {
    destroyAdminStore() // 1. Matamos los listeners de Firebase (Costo 0)
    await signOut(auth) // 2. Destruimos el token de sesión
    router.push('/login') // 3. Echamos al usuario a la pantalla de login
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
  }
}

const isActive = (linkPath) => {
  if (linkPath === '/admin') return route.path === '/admin'
  return route.path.startsWith(linkPath) 
}
</script>

<template>
  <aside class="w-64 h-screen bg-[#050508] border-r border-white/5 flex flex-col justify-between flex-shrink-0 relative z-20">
    <div>
      <div class="p-8 border-b border-white/5">
        <router-link to="/" class="group flex flex-col">
          <h2 class="text-2xl font-serif italic text-white group-hover:text-[#D8B4FE] transition-colors tracking-widest">VI_CORE</h2>
          <span class="text-[8px] font-mono text-gray-500 uppercase tracking-[0.3em] mt-1">Command Center</span>
        </router-link>
      </div>

      <nav class="flex flex-col gap-2 p-4">
        <router-link 
          v-for="link in adminLinks" 
          :key="link.path" 
          :to="link.path"
          class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300"
          :class="isActive(link.path) ? 'bg-[#D8B4FE]/10 text-[#D8B4FE] border border-[#D8B4FE]/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'"
        >
          <span class="text-sm">{{ link.icon }}</span>
          <span class="text-[10px] font-mono uppercase tracking-[0.15em]">{{ link.name }}</span>
        </router-link>
      </nav>
    </div>

    <div class="p-4 border-t border-white/5">
      <div class="bg-[#0B0B0E] border border-white/5 p-4 rounded-xl flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D8B4FE] to-blue-500 flex items-center justify-center text-black text-xs font-bold">A</div>
          <div class="flex flex-col">
            <span class="text-[10px] font-bold uppercase tracking-widest text-white">Admin</span>
            <span class="text-[8px] font-mono text-green-400">Online</span>
          </div>
        </div>
        <button @click="handleLogout" class="w-full py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors rounded-lg text-[9px] font-mono uppercase tracking-widest">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </aside>
</template>