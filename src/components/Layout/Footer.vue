<template>
  <footer class="bg-[#050508] text-white pt-32 pb-12 relative overflow-hidden selection:bg-[#D8B4FE] selection:text-[#0B0B0E] border-t border-white/5 font-sans">
    
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D8B4FE]/5 blur-[150px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

    <div class="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-24">
        
        <div class="md:col-span-2">
          <router-link to="/" class="inline-block mb-6 group">
            <span class="text-3xl md:text-4xl text-[#D8B4FE]/60 font-['Great_Vibes'] select-none transition-all duration-500 group-hover:text-[#D8B4FE] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(216,180,254,0.5)]">
            -VI-
          </span>
          </router-link>
          <p class="text-sm text-gray-400 leading-relaxed max-w-sm mb-8">
            Firma de ingeniería de software corporativo. Diseñamos infraestructuras digitales de alta precisión para empresas que buscan escalar sin fricción.
          </p>
          <div class="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-max">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="text-[9px] font-mono text-gray-300 uppercase tracking-widest">All systems operational</span>
          </div>
        </div>

        <div>
          <h4 class="text-[10px] font-mono text-white uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4">Ecosistema</h4>
          <ul class="space-y-4">
            <li><router-link to="/servicios" class="text-sm text-gray-500 hover:text-[#D8B4FE] transition-colors">Sistemas Core (ERP/CRM)</router-link></li>
            <li><router-link to="/tecnologias" class="text-sm text-gray-500 hover:text-[#D8B4FE] transition-colors">Arsenal Tecnológico</router-link></li>
            <li><router-link to="/nosotros" class="text-sm text-gray-500 hover:text-[#D8B4FE] transition-colors">Nuestra Filosofía</router-link></li>
            <li><router-link to="/contacto" class="text-sm text-gray-500 hover:text-[#D8B4FE] transition-colors">Solicitar Auditoría</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-[10px] font-mono text-white uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4">Central</h4>
          <ul class="space-y-4">
            <li class="text-sm text-gray-500 flex flex-col gap-1">
              <span class="text-[9px] font-mono uppercase tracking-widest text-gray-600">Base de Operaciones</span>
              Santiago, Chile
            </li>
            <li class="text-sm text-gray-500 flex flex-col gap-1 mt-4">
              <span class="text-[9px] font-mono uppercase tracking-widest text-gray-600">Canal Directo</span>
              <a href="mailto:contacto@vicore.com" class="hover:text-[#D8B4FE] transition-colors">contacto@vicore.com</a>
            </li>
          </ul>
        </div>

      </div>

      <div class="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-6">
        <p class="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
          &copy; {{ new Date().getFullYear() }} VI_CORE Architecture. Todos los derechos reservados.
        </p>
        <div class="flex gap-6">
          <router-link to="/login" class="text-[10px] font-mono text-gray-600 uppercase tracking-widest hover:text-white transition-colors">System Login</router-link>
        </div>
      </div>

    </div>
  </footer>
</template>