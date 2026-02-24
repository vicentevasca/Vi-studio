<template>
  <div class="fixed inset-0 z-0 pointer-events-none">
    <div class="absolute inset-0 opacity-[0.15]" :style="gridStyle"></div>
    
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D8B4FE]/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D8B4FE]/5 blur-[120px] rounded-full"></div>
  </div>
</template>

<script setup>
const gridStyle = {
  backgroundImage: `
    linear-gradient(to right, rgba(216, 180, 254, 0.2) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(216, 180, 254, 0.2) 1px, transparent 1px)
  `,
  backgroundSize: '40px 40px'
}
</script>

<style scoped>
/* Desvanecimiento en los bordes para que no sea infinito */
div {
  mask-image: radial-gradient(circle at center, black 30%, transparent 90%);
}
</style>