<template>
  <router-view />
</template>

<style>
html {
  scroll-behavior: smooth;
}

/* Transición global de páginas */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, filter 0.4s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(8px);
}
</style>