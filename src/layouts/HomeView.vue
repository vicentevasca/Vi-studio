<script setup>
import Navbar from '../components/Layout/Navbar.vue';
import Footer from '../components/Layout/Footer.vue';
import BlueprintGrid from '../components/BlueprintGrid.vue';
import TransitionOverlay from '../components/TransitionOverlay.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#050508] text-white selection:bg-[#D8B4FE] selection:text-black">
    <div>
      <BlueprintGrid />
      <TransitionOverlay />
    </div>

    <Navbar />

    <main class="flex-grow relative z-10">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer />
  </div>
</template>