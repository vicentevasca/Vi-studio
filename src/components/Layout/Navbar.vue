<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const route = useRoute()

const navLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Tecnologías', path: '/tecnologias' },
  { name: 'Filosofía', path: '/nosotros' }
]

const handleScroll = () => { isScrolled.value = window.scrollY > 20 }
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }
const closeMobileMenu = () => { isMobileMenuOpen.value = false }

// Bloquear scroll de la página de fondo cuando el menú móvil está abierto
watch(isMobileMenuOpen, (val) => { 
  if (import.meta.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

onMounted(() => {
  if (import.meta.client) window.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="fixed top-0 left-0 w-full z-50 transition-all duration-500" :class="isScrolled ? 'bg-[#050508]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'">
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
      
      <router-link to="/" class="flex items-center gap-2 group z-50">
        <span class="text-3xl md:text-4xl text-[#D8B4FE]/60 font-['Great_Vibes'] select-none transition-all duration-500 group-hover:text-[#D8B4FE] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(216,180,254,0.5)]">
            VI
          </span>
        <span class="text-xl font-serif tracking-widest text-white group-hover:text-[#D8B4FE] transition-colors">_Studio</span>
      </router-link>

      <nav class="hidden md:flex items-center gap-8">
        <router-link v-for="link in navLinks" :key="link.path" :to="link.path" class="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors" :class="{'text-[#D8B4FE]': route.path === link.path}">
          {{ link.name }}
        </router-link>
      </nav>

      <div class="hidden md:flex items-center gap-6">
        <router-link to="/login" class="text-[9px] font-mono text-gray-600 uppercase tracking-widest hover:text-[#D8B4FE] transition-colors">
          VI_Core
        </router-link>
        
        <router-link to="/contacto" class="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#D8B4FE] hover:text-black hover:border-[#D8B4FE] transition-all">
          Iniciar Auditoría
        </router-link>
      </div>

      <button @click="toggleMobileMenu" class="md:hidden flex flex-col gap-1.5 z-50 p-2">
        <span class="block w-6 h-0.5 bg-white transition-transform duration-300" :class="isMobileMenuOpen ? 'rotate-45 translate-y-[8px] bg-[#D8B4FE]' : ''"></span>
        <span class="block w-6 h-0.5 bg-white transition-opacity duration-300" :class="isMobileMenuOpen ? 'opacity-0' : ''"></span>
        <span class="block w-6 h-0.5 bg-white transition-transform duration-300" :class="isMobileMenuOpen ? '-rotate-45 -translate-y-[8px] bg-[#D8B4FE]' : ''"></span>
      </button>

    </div>
  </header>

  <Transition name="fade-blur">
    <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-[#050508]/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center min-h-screen">
      <nav class="flex flex-col items-center gap-8 text-center w-full px-6">
        <router-link v-for="link in navLinks" :key="link.path" :to="link.path" @click="closeMobileMenu" class="text-3xl font-serif text-white hover:text-[#D8B4FE] transition-colors">
          {{ link.name }}
        </router-link>
        
        <router-link to="/contacto" @click="closeMobileMenu" class="mt-8 w-full max-w-xs bg-[#D8B4FE] text-black px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
          Iniciar Auditoría
        </router-link>

        <router-link to="/login" @click="closeMobileMenu" class="mt-10 text-[10px] font-mono text-gray-600 uppercase tracking-widest hover:text-[#D8B4FE] transition-colors">
          VI_Core Access
        </router-link>
      </nav>
    </div>
  </Transition>
</template>

<style scoped>
@reference "tailwindcss";

.fade-blur-enter-active, .fade-blur-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-blur-enter-from, .fade-blur-leave-to { opacity: 0; backdrop-filter: blur(0px); }
</style>