<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const cursor = ref(null)
const cursorText = ref('')
const isHovering = ref(false)

let mouseX = 0
let mouseY = 0
let cursorX = 0
let cursorY = 0

const onMouseMove = (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

const updateCursor = () => {
  cursorX += (mouseX - cursorX) * 0.15
  cursorY += (mouseY - cursorY) * 0.15

  if (cursor.value) {
    gsap.set(cursor.value, { x: cursorX, y: cursorY })
  }
  requestAnimationFrame(updateCursor)
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  requestAnimationFrame(updateCursor)

  const hoverElements = document.querySelectorAll('a, button, .hover-trigger, router-link')
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      isHovering.value = true
      cursorText.value = el.getAttribute('data-cursor') || ''
    })
    el.addEventListener('mouseleave', () => {
      isHovering.value = false
      cursorText.value = ''
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
  <div 
    ref="cursor"
    class="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-300 mix-blend-difference"
    :class="isHovering ? 'w-20 h-20 bg-white rounded-full' : 'w-4 h-4 bg-white rounded-full'"
  >
    <span v-if="isHovering" class="text-black text-[8px] font-bold uppercase tracking-widest">{{ cursorText }}</span>
  </div>
</template>