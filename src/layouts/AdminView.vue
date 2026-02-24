<script setup>
import AdminSidebar from '../components/Layout/AdminSidebar.vue'
</script>

<template>
  <div class="min-h-screen flex bg-[#050508] text-white selection:bg-[#D8B4FE] selection:text-black overflow-hidden">
    
    <AdminSidebar />
    
    <main class="flex-grow relative z-10 p-6 md:p-12 h-screen overflow-y-auto custom-scrollbar">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <div :key="route.path" class="w-full">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>
    
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(216,180,254,0.3); }

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>