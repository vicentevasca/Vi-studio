<template>
  <div class="bg-[#0B0B0E] min-h-screen">
    <TransitionOverlay />

    <header>
      <Navbar />
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>