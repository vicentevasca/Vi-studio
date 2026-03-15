<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar    from '../components/Layout/AdminSidebar.vue'
import ToastContainer  from '../components/UI/ToastContainer.vue'
import ConfirmDialog   from '../components/UI/ConfirmDialog.vue'
import { useAuth }     from '../composables/useAuth'

const router = useRouter()
const { isLoading, isAuthenticated } = useAuth()

// Segunda capa de protección: si el estado de auth resuelve como no autenticado
// (p.ej. la sesión expiró mientras el panel estaba abierto), redirigir de inmediato.
watch([isLoading, isAuthenticated], ([loading, auth]) => {
  if (!loading && !auth) {
    router.replace('/login')
  }
}, { immediate: true })
</script>

<template>
  <!-- Estado de carga mientras Firebase resuelve el auth -->
  <div v-if="isLoading" class="min-h-screen bg-[#050508] flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-8 h-8 border-2 border-[#D8B4FE]/20 border-t-[#D8B4FE] rounded-full animate-spin"></div>
      <p class="text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em]">Verificando acceso</p>
    </div>
  </div>

  <!-- Panel real — solo se monta cuando la autenticación está confirmada -->
  <div v-else-if="isAuthenticated" class="flex flex-col md:flex-row min-h-screen bg-[#050508]">
    <AdminSidebar />

    <main class="flex-1 w-full p-4 md:p-10 pt-24 md:pt-10">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <ToastContainer />
    <ConfirmDialog />
  </div>
  <!-- v-else: isLoading=false, !isAuthenticated → watch ya disparó el redirect, mostrar vacío -->
</template>

<style>
.page-enter-active, .page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-enter-from, .page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(216,180,254,0.3); }
</style>
