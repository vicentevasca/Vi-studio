<script setup>
import { ref } from 'vue'

const props = defineProps({
  clientName: String,
  industry: String,
  uiImage: String,
  techStack: Array
})

const isXRayActive = ref(false)
</script>

<template>
  <div 
    class="relative w-full aspect-[4/3] md:aspect-[16/9] border border-white/10 overflow-hidden group bg-[#08080A]"
    @mouseenter="isXRayActive = true"
    @mouseleave="isXRayActive = false"
  >
    <div class="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 border-b border-white/5 bg-black/40 backdrop-blur-md">
      <div class="flex flex-col">
        <span class="text-[8px] uppercase tracking-[0.3em] text-[#D8B4FE]">{{ industry }}</span>
        <span class="text-sm font-serif text-white">{{ clientName }}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-[9px] uppercase tracking-widest" :class="isXRayActive ? 'text-[#D8B4FE]' : 'text-gray-500'">
          {{ isXRayActive ? 'System View' : 'Surface View' }}
        </span>
        <div class="w-2 h-2 rounded-full transition-colors duration-300" :class="isXRayActive ? 'bg-[#D8B4FE] shadow-[0_0_10px_#D8B4FE]' : 'bg-white/20'"></div>
      </div>
    </div>

    <div 
      class="absolute inset-0 z-10 transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] bg-cover bg-center"
      :style="{ backgroundImage: `url(${uiImage})` }"
      :class="isXRayActive ? 'opacity-10 scale-105 filter blur-sm grayscale' : 'opacity-100 scale-100'"
    ></div>

    <div 
      class="absolute inset-0 z-0 p-8 pt-24 flex flex-col justify-end transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"
      :class="isXRayActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
    >
      <div class="font-mono text-[10px] text-gray-500 leading-relaxed max-w-lg opacity-60">
        <p><span class="text-[#D8B4FE]">import</span> { onCall } <span class="text-[#D8B4FE]">from</span> "firebase-functions/v2";</p>
        <p><span class="text-[#D8B4FE]">const</span> TELEGRAM_API = <span class="text-green-400">"https://api.telegram.org/bot..."</span>;</p>
      </div>
    </div>
  </div>
</template>