<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { useRouter } from 'vue-router'

const overlayLayer1 = ref(null)
const overlayLayer2 = ref(null)
const logoContent = ref(null)
const router = useRouter()

const transitionEffect = () => {
  const tl = gsap.timeline()
  
  // Capa 1: Acento de color ultra rápido
  tl.to(overlayLayer1.value, { x: '0%', duration: 0.5, ease: "power4.inOut" })
  // Capa 2: Fondo negro principal siguiéndolo
  .to(overlayLayer2.value, { x: '0%', duration: 0.5, ease: "power4.inOut" }, "-=0.35")
  
  // Aparece el logo y texto tech
  .to(logoContent.value, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }, "-=0.1")
  .to(logoContent.value, { opacity: 0, y: -20, duration: 0.3, delay: 0.3 })
  
  // Se retiran las capas
  .to(overlayLayer1.value, { x: '-100%', duration: 0.5, ease: "power4.inOut" })
  .to(overlayLayer2.value, { x: '-100%', duration: 0.5, ease: "power4.inOut" }, "-=0.4")
  
  // Resetear posiciones
  .set([overlayLayer1.value, overlayLayer2.value], { x: '100%' })
}

onMounted(() => {
  router.beforeEach((to, from, next) => {
    transitionEffect()
    // Retraso ajustado perfectamente a la animación
    setTimeout(() => { next() }, 700)
  })
})
</script>

<template>
  <div class="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
    
    <div 
      ref="overlayLayer1" 
      class="absolute inset-0 bg-[#D8B4FE] translate-x-full"
    ></div>

    <div 
      ref="overlayLayer2" 
      class="absolute inset-0 bg-[#0B0B0E] translate-x-full flex items-center justify-center flex-col"
    >
      <div ref="logoContent" class="opacity-0 translate-y-10 flex flex-col items-center">
        
        <h2 class="text-4xl md:text-5xl font-serif italic text-white tracking-widest mb-4"><span class="text-3xl md:text-4xl text-[#D8B4FE]/60 font-['Great_Vibes'] select-none transition-all duration-500 group-hover:text-[#D8B4FE] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(216,180,254,0.5)]">
            VI
          </span>_Studio</h2>
        <div class="flex items-center gap-3">
          <span class="w-1.5 h-1.5 bg-[#D8B4FE] rounded-full animate-pulse"></span>
          <span class="text-[9px] font-mono text-[#D8B4FE] uppercase tracking-[0.3em]">Estableciendo Conexión Segura</span>
        </div>
      </div>
    </div>

  </div>
</template>