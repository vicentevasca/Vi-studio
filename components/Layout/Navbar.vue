<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const handleScroll = () => { 
    isScrolled.value = window.scrollY > 20; 
};
const closeMobileMenu = () => { isMobileMenuOpen.value = false; };

watch(isMobileMenuOpen, (val) => { 
  if (import.meta.client) {
    document.body.style.overflow = val ? 'hidden' : ''; 
  }
});

// Variables de estado
const pendingCount = ref(0);
const isLoggedIn = ref(false);
const router = useRouter(); // Nuxt lo auto-importa mágicamente

// Lógica de Cliente (DOM y Firebase)
onMounted(async () => {
  window.addEventListener('scroll', handleScroll);

  // Cargamos Firebase SOLO en el cliente para no crashear el servidor SEO
  try {
    const { $auth, $db } = useNuxtApp();
    if ($auth && $db) {
      const { onAuthStateChanged } = await import('firebase/auth');
      const { collection, query, where, onSnapshot } = await import('firebase/firestore');

      onAuthStateChanged($auth, (user) => {
        isLoggedIn.value = !!user;
        if (user) {
          const q = query(collection($db, 'leads'), where('status', '==', 'pending'));
          onSnapshot(q, (snapshot) => {
            pendingCount.value = snapshot.size;
          });
        }
      });
    }
  } catch (error) {
    console.warn("Aviso: Firebase inicializando en background...");
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll);
    document.body.style.overflow = '';
  }
});

const navLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Insumos', path: '/insumos' },
  { name: 'Contacto', path: '/contacto' },
];

const goToAdmin = () => {
  isMobileMenuOpen.value = false;
  router.push('/admin');
};
</script>

<template>
  <header 
    :class="[
      'fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b',
      isScrolled ? 'bg-[#0B0B0E]/80 backdrop-blur-lg border-white/5 py-3' : 'bg-transparent border-transparent py-6',
      isMobileMenuOpen ? 'bg-[#0B0B0E] border-white/5' : ''
    ]"
  >
    <div class="container mx-auto px-6 lg:px-12 flex justify-between items-center">
      
      <NuxtLink to="/" class="relative z-50 group flex items-center gap-3" @click="closeMobileMenu">
        <span class="text-3xl font-serif text-[#D8B4FE] tracking-wider group-hover:scale-105 transition-transform duration-500">
          VI-STUDIO
        </span>
      </NuxtLink>

      <nav class="hidden md:flex items-center space-x-10">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.name" 
          :to="link.path"
          class="text-xs uppercase tracking-[0.2em] text-gray-300 hover:text-[#D8B4FE] transition-colors relative group"
        >
          {{ link.name }}
          <span class="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#D8B4FE] transition-all duration-300 group-hover:w-full"></span>
        </NuxtLink>

        <NuxtLink 
          to="/contacto" 
          class="px-6 py-2 border border-[#D8B4FE]/30 text-[#D8B4FE] text-xs uppercase tracking-widest hover:bg-[#D8B4FE] hover:text-[#0B0B0E] transition-all duration-300 rounded-sm"
        >
          Agendar
        </NuxtLink>
      </nav>

      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen" 
        class="md:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5"
      >
        <span :class="['w-6 h-[1px] bg-[#D8B4FE] transition-all duration-300', isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : '']"></span>
        <span :class="['w-6 h-[1px] bg-[#D8B4FE] transition-all duration-300', isMobileMenuOpen ? 'opacity-0' : '']"></span>
        <span :class="['w-6 h-[1px] bg-[#D8B4FE] transition-all duration-300', isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : '']"></span>
      </button>

    </div>

    <Transition name="fade">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-[#0B0B0E] z-40 flex flex-col items-center justify-center min-h-screen">
        <nav class="flex flex-col items-center gap-8">
          <NuxtLink 
            v-for="link in navLinks" 
            :key="link.name" 
            :to="link.path"
            @click="closeMobileMenu"
            class="text-2xl font-serif text-white hover:text-[#D8B4FE] transition-colors"
          >
            {{ link.name }}
          </NuxtLink>
          <div class="w-12 h-[1px] bg-white/20 my-4"></div>
          <p class="text-[10px] text-gray-500 cursor-pointer uppercase tracking-widest hover:text-white" @click="goToAdmin">
            Acceso CRM
          </p>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>