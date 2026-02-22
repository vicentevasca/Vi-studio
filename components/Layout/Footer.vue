<script setup>
// Eliminamos la importación manual del JSON, usamos tu composable mágico
const content = useSiteContent();
</script>

<template>
  <footer class="bg-[#0B0B0E] text-white pt-24 pb-10 relative overflow-hidden selection:bg-[#D8B4FE] selection:text-[#0B0B0E]">
    <div class="container mx-auto px-6 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-20">
        <div class="md:col-span-5">
          <NuxtLink to="/" class="inline-block mb-6 group">
            <h3 class="text-3xl font-serif font-bold">{{ content.brand.shortName }}</h3>
          </NuxtLink>
        </div>
        </div>
    </div>
  </footer>
</template>