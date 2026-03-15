<script setup>
import { useToast } from '../../composables/useToast'
const { toasts, remove } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 items-end pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl border shadow-2xl min-w-[280px] max-w-[380px] backdrop-blur-xl cursor-pointer"
          :class="{
            'bg-green-950/90 border-green-500/30 text-green-300': t.type === 'success',
            'bg-red-950/90   border-red-500/30   text-red-300':   t.type === 'error',
            'bg-[#0B0B0E]/90 border-white/10     text-gray-200':  t.type === 'info',
          }"
          @click="remove(t.id)"
        >
          <span class="text-base shrink-0 mt-px">
            <template v-if="t.type === 'success'">✓</template>
            <template v-else-if="t.type === 'error'">✕</template>
            <template v-else>◈</template>
          </span>
          <p class="text-[11px] font-mono leading-relaxed">{{ t.message }}</p>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active  { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-leave-active  { transition: all 0.25s ease; }
.toast-enter-from    { opacity: 0; transform: translateX(40px) scale(0.95); }
.toast-leave-to      { opacity: 0; transform: translateX(40px) scale(0.95); }
</style>
