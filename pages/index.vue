<script setup>
import { ref, onMounted } from "vue";

// ¡Mira qué limpio! Nuxt auto-importa el composable
const content = useSiteContent(); 

// 🚀 MAGIA SEO (Server-Side Rendering)
useSeoMeta({
  title: `${content.brand.name} | ${content.brand.tagline}`,
  description: content.hero.subtitle,
  ogTitle: content.brand.name,
  ogDescription: content.hero.subtitle,
  // ogImage: '/tu-imagen-para-whatsapp.jpg' // Opcional, para cuando compartan el link
})

// Referencias para tus videos
const videoMobileRef = ref(null);
const videoDesktopRef = ref(null);

// 🛡️ REGLA DE ORO: Todo lo que toque el DOM (videos, animaciones GSAP) va en onMounted
onMounted(() => {
  const safePlay = async (videoElement) => {
    if (!videoElement) return;
    videoElement.muted = true;
    videoElement.playsInline = true;
    try {
      await videoElement.play();
    } catch (err) {
      console.warn("Autoplay bloqueado, esperando interacción.");
    }
  };

  safePlay(videoMobileRef.value);
  safePlay(videoDesktopRef.value);
});
</script>

<template>
  <main class="bg-[#0B0B0E] min-h-screen text-white relative selection:bg-[#D8B4FE] selection:text-[#0B0B0E]">
    
    <header class="relative h-[100dvh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <video ref="videoMobileRef" class="w-full h-full object-cover md:hidden opacity-40" loop muted playsinline>
          <source src="/videos/oscar_bg_opt.mp4" type="video/mp4" />
        </video>
        <video ref="videoDesktopRef" class="hidden md:block w-full h-full object-cover opacity-40" loop muted playsinline>
          <source src="/videos/oscar_bg_opt.mp4" type="video/mp4" />
        </video>
        <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B0E]/60 via-[#0B0B0E]/40 to-[#0B0B0E]"></div>
      </div>

      <div class="relative z-10 text-center px-4 w-full max-w-5xl mx-auto flex flex-col items-center">
        <span class="text-[#D8B4FE] font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-6 block">
          {{ content.brand.specialty }}
        </span>
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 leading-[1.1] tracking-tight">
          {{ content.hero.title }}
        </h1>
        <p class="text-gray-300 font-sans text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12">
          {{ content.hero.subtitle }}
        </p>
      </div>
    </header>

    </main>
</template>

<style scoped>
/* Pega aquí tus clases CSS personalizadas si las tenías en el HomeView viejo */
.font-serif { font-family: 'Cormorant Garamond', serif; }
.font-sans { font-family: 'Lato', sans-serif; }
</style>