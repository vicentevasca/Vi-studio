<script setup>
import { useConfirm } from '../../composables/useConfirm'
const { confirmState, respond } = useConfirm()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="confirmState.open" class="fixed inset-0 z-[300] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="respond(false)"></div>
        <div class="relative z-10 bg-[#0B0B0E] border border-white/10 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
          <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-sm">!</div>
            <p class="text-sm text-white font-sans leading-relaxed">{{ confirmState.message }}</p>
          </div>
          <div class="flex gap-3">
            <button
              @click="respond(false)"
              class="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              Cancelar
            </button>
            <button
              @click="respond(true)"
              class="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-[10px] font-mono uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
</style>
