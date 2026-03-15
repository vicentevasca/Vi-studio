<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const overlay = ref(null)
const logo = ref(null)
const { $router } = useNuxtApp()

// Esta función hará el barrido de entrada y salida
const transitionEffect = () => {
  const tl = gsap.timeline()

  // 1. Barrido de derecha a centro
  tl.to(overlay.value, {
    x: '0%',
    duration: 0.6,
    ease: "expo.inOut"
  })
  // 2. Aparece el logo sutilmente
  .to(logo.value, {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    ease: "power2.out"
  }, "-=0.2")
  // 3. Desaparece el logo
  .to(logo.value, {
    opacity: 0,
    scale: 1.1,
    duration: 0.3,
    delay: 0.2
  })
  // 4. Barrido de centro a izquierda
  .to(overlay.value, {
    x: '-100%',
    duration: 0.6,
    ease: "expo.inOut"
  })
  // 5. Resetear posición para la próxima vez (sin que se vea)
  .set(overlay.value, { x: '100%' })
}

// Escuchamos el cambio de ruta globalmente
onMounted(() => {
  $router.beforeEach((to, from, next) => {
    transitionEffect()
    // Retrasamos un poco el cambio de página interno para que ocurra 
    // justo cuando el overlay tapa la pantalla
    setTimeout(next, 600) 
  })
})
</script>

<template>
  <div 
    ref="overlay" 
    class="fixed inset-0 z-[9999] bg-[#0B0B0E] translate-x-full flex items-center justify-center pointer-events-none"
  >
    <div ref="logo" class="opacity-0 scale-90">
      <h2 class="text-[#D8B4FE] font-serif text-4xl italic tracking-tighter">VI</h2>
      <div class="w-full h-[1px] bg-white/10 mt-2"></div>
    </div>
  </div>
</template>