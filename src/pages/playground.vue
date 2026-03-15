<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import gsap from 'gsap'

useHead({
  title: 'Laboratorio de Arquitectura | Vi_Studio',
  meta: [
    { name: 'description', content: 'Simulador de ecosistemas empresariales. Opere módulos CRM, ERP, BI y DMS en tiempo real.' }
  ]
})

// ==========================================
// 1. BASE NARRATIVA
// ==========================================
const activeTab = ref('crm')

const modulesData = {
  crm: {
    title: 'CRM & Asistente Ejecutivo',
    subtitle: 'Omnicanalidad en Tiempo Real',
    desc: 'La velocidad de respuesta define el cierre. Nuestro CRM se conecta con Bots para inyectar prospectos. Gestione el pipeline y observe cómo impacta sus ingresos.',
    problems: 'Mitiga la pérdida de leads por respuestas tardías y la fricción de tener que acceder a plataformas pesadas.',
    benefits: 'El sistema trabaja para usted. Ingrese prospectos, muévalos de fase y cierre tratos con un toque.',
    quote: '"El servicio al cliente no debe ser un departamento, debe ser toda la empresa." — Tony Hsieh'
  },
  erp: {
    title: 'ERP & Rentabilidad (P&L)',
    subtitle: 'Control de Fugas de Capital',
    desc: 'Este módulo audita la salud financiera de sus proyectos. Juegue con las variables operativas y observe cómo el software detecta fugas de dinero en tiempo real.',
    problems: 'Elimina proyectos "zombis" que consumen horas no facturables y costos ocultos.',
    benefits: 'Visibilidad quirúrgica. El sistema alerta y corrige antes de que la fuga de capital sea irreversible.',
    quote: '"El tiempo es el único capital de cualquier ser humano y el único que no puede permitirse perder." — Thomas Edison'
  },
  bi: {
    title: 'Inteligencia de Negocios (BI)',
    subtitle: 'El Oráculo de Datos',
    desc: 'Transformamos datos crudos en conocimiento. Pase el cursor sobre los gráficos para ver la granularidad de la información y cambie de trimestre al instante.',
    problems: 'Erradica la toma de decisiones basada en intuición y los reportes mensuales estáticos.',
    benefits: 'Proyección estratégica con desgloses en tiempo real (Drill-down).',
    quote: '"En Dios confiamos. Todos los demás deben traer datos." — W. Edwards Deming'
  },
  dms: {
    title: 'Gestión Documental (DMS)',
    subtitle: 'Auditoría Zero-Trust',
    desc: 'Bóveda criptográfica. Filtre documentos al instante y observe el "Audit Trail" (Bitácora), que registra cada interacción para garantizar seguridad total.',
    problems: 'Elimina el caos de versiones y el acceso no autorizado a información confidencial sin dejar rastro.',
    benefits: 'Trazabilidad inmutable. Sabrá exactamente quién vio qué, cuándo y desde dónde.',
    quote: '"La información es poder, pero solo si puedes encontrarla con absoluta seguridad." — Vi_Studio'
  }
}

// ==========================================
// 2. ESTADOS INTERACTIVOS (SANDBOX)
// ==========================================

// --- ESTADO CRM ---
const crmLeads = ref([
  { id: 1, name: 'Empresa Alpha', value: 45000, status: 'Auditoría', date: 'Hoy, 10:30' },
  { id: 2, name: 'Corporación Beta', value: 80000, status: 'Negociación', date: 'Ayer, 16:45' }
])
const telegramLeadWaiting = ref(true)
const totalClosedRevenue = ref(150000)

const acceptTelegramLead = () => {
  telegramLeadWaiting.value = false
  const newId = Date.now()
  crmLeads.value.unshift({ id: newId, name: 'Grupo Gamma (Nuevo)', value: 120000, status: 'Radar', date: 'Justo ahora' })
  nextTick(() => {
    gsap.fromTo(`.lead-${newId}`, { scale: 0.9, opacity: 0, x: -20 }, { scale: 1, opacity: 1, x: 0, duration: 0.5 })
  })
}

const advanceLead = (lead) => {
  if (lead.status === 'Radar') lead.status = 'Auditoría'
  else if (lead.status === 'Auditoría') lead.status = 'Negociación'
}

const closeLead = (id, value) => {
  // Animación de cierre y suma de dinero
  gsap.to(`.lead-${id}`, { 
    x: 100, opacity: 0, duration: 0.4, 
    onComplete: () => {
      crmLeads.value = crmLeads.value.filter(l => l.id !== id)
      // Animación de contador de dinero
      const obj = { val: totalClosedRevenue.value }
      gsap.to(obj, {
        val: totalClosedRevenue.value + value,
        duration: 1,
        onUpdate: () => totalClosedRevenue.value = Math.floor(obj.val)
      })
      // Flash verde en el contador
      gsap.fromTo('.revenue-counter', { color: '#4ade80', scale: 1.1 }, { color: '#ffffff', scale: 1, duration: 1 })
    }
  })
}

// --- ESTADO ERP ---
const erpData = ref({ fixedPrice: 25000, hourlyRate: 45, estHours: 200, realHours: 180, extraCosts: 500 })
const erpCosts = computed(() => (erpData.value.realHours * erpData.value.hourlyRate) + erpData.value.extraCosts)
const erpProfit = computed(() => erpData.value.fixedPrice - erpCosts.value)
const isLosingMoney = computed(() => erpProfit.value < 0)

const optimizeERP = () => {
  // Simulamos que el sistema "optimiza" cortando costos
  gsap.to(erpData.value, { realHours: 200, extraCosts: 100, duration: 1.5, ease: 'power2.out' })
}

// --- ESTADO BI (Business Intelligence) ---
const biDataset = ref('q1')
const biData = computed(() => {
  if (biDataset.value === 'q1') return { rev: 120500, conv: 4.2, chart: [{h: 40, m: 'Ene', b2b: 25, b2c: 15}, {h: 60, m: 'Feb', b2b: 40, b2c: 20}, {h: 45, m: 'Mar', b2b: 30, b2c: 15}] }
  if (biDataset.value === 'q2') return { rev: 184000, conv: 6.8, chart: [{h: 70, m: 'Abr', b2b: 45, b2c: 25}, {h: 85, m: 'May', b2b: 55, b2c: 30}, {h: 100, m: 'Jun', b2b: 65, b2c: 35}] }
  return { rev: 250000, conv: 8.5, chart: [{h: 110, m: 'Jul', b2b: 70, b2c: 40}, {h: 130, m: 'Ago', b2b: 85, b2c: 45}, {h: 150, m: 'Sep', b2b: 100, b2c: 50}] }
})

// --- ESTADO DMS (Gestión Documental & Logs) ---
const dmsSearch = ref('')
const dmsFiles = ref([
  { id: 'F-102', name: 'Contrato_Soporte_VI.pdf', type: 'PDF', security: 'Alto', hash: 'e3b0c44298fc' },
  { id: 'F-103', name: 'Presupuesto_Anual_Q1.xlsx', type: 'XLSX', security: 'Medio', hash: '8f434346648f' },
  { id: 'F-104', name: 'Arquitectura_AWS.docx', type: 'DOCX', security: 'Bajo', hash: 'a1b2c3d4e5f6' }
])
const activeDmsFile = ref(dmsFiles.value[0])
const auditLogs = ref([
  `[10:00:01] Sistema iniciado. RBAC activo.`
])

const selectDocument = (file) => {
  activeDmsFile.value = file
  const time = new Date().toLocaleTimeString('es-CL', { hour12: false })
  auditLogs.value.unshift(`[${time}] User_Guest accedió a ${file.name}`)
  if(auditLogs.value.length > 6) auditLogs.value.pop() // Mantener log corto
}

const filteredDmsFiles = computed(() => dmsFiles.value.filter(f => f.name.toLowerCase().includes(dmsSearch.value.toLowerCase())))

// ==========================================
// 3. TRANSICIONES GLOBALES
// ==========================================
const systemContainer = ref(null)

watch(activeTab, async () => {
  await nextTick()
  gsap.fromTo(systemContainer.value, 
    { opacity: 0, y: 15, filter: 'blur(4px)' }, 
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power2.out' }
  )
})

onMounted(() => gsap.fromTo(systemContainer.value, { opacity: 0 }, { opacity: 1, duration: 1 }))
</script>

<template>
  <main class="min-h-screen bg-[#050508] text-white selection:bg-[#D8B4FE] selection:text-black font-sans pt-24 pb-20 px-6 relative overflow-hidden">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(216,180,254,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      
      <header class="text-center mb-16">
        <h1 class="text-4xl md:text-6xl font-serif mb-6">Laboratorio de Arquitectura</h1>
        <p class="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          Interactúe con ecosistemas simulados. Tome decisiones, altere datos y observe la reacción matemática del sistema en tiempo real.
        </p>
      </header>

      <div class="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
        <button v-for="(data, key) in modulesData" :key="key" @click="activeTab = key"
          :class="['px-6 py-3 rounded-full text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 border', activeTab === key ? 'bg-[#D8B4FE] text-black border-[#D8B4FE] shadow-[0_0_20px_rgba(216,180,254,0.3)]' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white']">
          {{ data.title.split(' ')[0] }}
        </button>
      </div>

      <div class="grid md:grid-cols-3 gap-8 mb-12 border-y border-white/5 py-10 bg-white/[0.01]">
        <div class="md:col-span-1">
          <span class="text-[#D8B4FE] text-[10px] font-mono uppercase tracking-widest block mb-2">{{ modulesData[activeTab].subtitle }}</span>
          <h2 class="text-3xl font-serif text-white">{{ modulesData[activeTab].title }}</h2>
        </div>
        <div class="md:col-span-2 space-y-6">
          <p class="text-gray-300 text-base md:text-lg font-light leading-relaxed">{{ modulesData[activeTab].desc }}</p>
          <div class="grid md:grid-cols-2 gap-6 text-sm">
            <div class="border-l border-red-500/50 pl-4"><h3 class="text-red-400 font-mono text-[10px] uppercase tracking-widest mb-2">Problemática Mitigada</h3><p class="text-gray-400 leading-relaxed">{{ modulesData[activeTab].problems }}</p></div>
            <div class="border-l border-green-500/50 pl-4"><h3 class="text-green-400 font-mono text-[10px] uppercase tracking-widest mb-2">Beneficio Real</h3><p class="text-gray-400 leading-relaxed">{{ modulesData[activeTab].benefits }}</p></div>
          </div>
        </div>
      </div>

      <div ref="systemContainer" class="bg-[#0B0B0E] border border-white/10 rounded-[2rem] p-6 md:p-12 shadow-2xl relative">
        
        <div v-if="activeTab === 'crm'" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-8 space-y-6">
            <div class="flex justify-between items-end border-b border-white/10 pb-4">
              <h3 class="text-xl font-serif text-white">Pipeline de Ventas</h3>
              <div class="text-right">
                <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Caja Cerrada (Revenue)</p>
                <p class="revenue-counter text-3xl font-serif text-white">${{ totalClosedRevenue.toLocaleString() }}</p>
              </div>
            </div>
            
            <div class="space-y-3 min-h-[300px]">
              <div v-if="crmLeads.length === 0" class="text-center py-10 text-gray-500 font-mono text-xs">Pipeline vacío. Inyecte leads usando el Bot.</div>
              <div v-for="lead in crmLeads" :key="lead.id" :class="[`lead-${lead.id}`, 'bg-black/50 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:border-white/20 transition-colors']">
                <div>
                  <h4 class="font-bold text-white text-sm flex items-center gap-2">
                    {{ lead.name }} <span class="text-[9px] font-mono bg-white/10 px-2 py-0.5 rounded">{{ lead.status }}</span>
                  </h4>
                  <p class="text-[10px] font-mono text-gray-500 mt-1">Valor Estimado: ${{ lead.value.toLocaleString() }}</p>
                </div>
                <div class="flex gap-2">
                  <button v-if="lead.status !== 'Negociación'" @click="advanceLead(lead)" class="px-3 py-1.5 text-[10px] font-mono bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-colors">Avanzar Fase</button>
                  <button v-if="lead.status === 'Negociación'" @click="closeLead(lead.id, lead.value)" class="px-3 py-1.5 text-[10px] font-mono bg-green-500/10 text-green-400 rounded hover:bg-green-500 hover:text-white transition-colors">Cerrar Ganado (+$)</button>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 bg-[#1E293B]/30 border border-blue-500/20 rounded-[2rem] p-4 relative h-full min-h-[400px]">
             <div class="absolute -top-4 right-4 bg-black/80 text-blue-400 text-[9px] font-mono px-3 py-1.5 border border-blue-400/30 rounded z-20">Telegram Webhook API</div>
            <div class="flex items-center gap-3 border-b border-white/5 pb-3 mb-4 mt-6">
              <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">VI</div>
              <div><p class="text-sm font-bold text-white">VI_CORE Assistant</p></div>
            </div>
            <div v-if="telegramLeadWaiting" class="bg-blue-600/20 border border-blue-500/30 p-3 rounded-xl rounded-tl-none w-full">
              <p class="text-xs text-white mb-2">⚡ <b>NUEVO PROSPECTO</b></p>
              <p class="text-[10px] font-mono text-gray-300 mb-3">Grupo Gamma - Presupuesto: $120k</p>
              <button @click="acceptTelegramLead" class="w-full bg-blue-500 hover:bg-blue-400 text-white text-[10px] font-bold py-2 rounded shadow-lg">INYECTAR A CRM</button>
            </div>
            <div v-else class="bg-white/5 border border-white/10 p-3 rounded-xl rounded-tl-none"><p class="text-[10px] font-mono text-gray-400">Esperando nuevos eventos...</p></div>
          </div>
        </div>

        <div v-if="activeTab === 'erp'" class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div class="space-y-6">
            <h3 class="text-xl font-serif text-white mb-6">Métricas de Proyecto</h3>
            
            <div>
              <label class="flex justify-between text-[10px] font-mono text-gray-400 uppercase mb-2">
                <span>Horas Invertidas (Retrasos)</span>
                <span class="text-white">{{ erpData.realHours }}h</span>
              </label>
              <input type="range" min="150" max="400" v-model.number="erpData.realHours" class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D8B4FE]">
            </div>
            
            <div>
              <label class="flex justify-between text-[10px] font-mono text-gray-400 uppercase mb-2">
                <span>Costos Extra (Servidores/API)</span>
                <span class="text-white">${{ erpData.extraCosts }}</span>
              </label>
              <input type="range" min="0" max="15000" step="100" v-model.number="erpData.extraCosts" class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-400">
            </div>

            <div class="bg-black/50 p-4 rounded-xl border border-white/5 text-xs font-mono text-gray-400 mt-6">
              <p class="flex justify-between mb-2"><span>Presupuesto Cliente:</span> <span class="text-white">${{ erpData.fixedPrice }}</span></p>
              <p class="flex justify-between mb-2"><span>Costo Equipo (${{ erpData.hourlyRate }}/h):</span> <span class="text-red-400">-${{ erpData.realHours * erpData.hourlyRate }}</span></p>
              <p class="flex justify-between border-t border-white/10 pt-2"><span>Gastos Adicionales:</span> <span class="text-red-400">-${{ erpData.extraCosts }}</span></p>
            </div>
          </div>

          <div class="flex flex-col justify-center relative">
            <div :class="['p-8 rounded-[2rem] border transition-colors duration-500 relative overflow-hidden', isLosingMoney ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30']">
              <p class="text-[10px] font-mono uppercase tracking-widest mb-2" :class="isLosingMoney ? 'text-red-400' : 'text-green-400'">Beneficio Neto Resultante</p>
              <p class="text-6xl font-serif transition-colors duration-500" :class="isLosingMoney ? 'text-red-400' : 'text-green-400'">${{ erpProfit.toLocaleString() }}</p>
              
              <div class="mt-8">
                <p v-if="isLosingMoney" class="text-xs text-red-400 font-mono mb-4 animate-pulse">⚠️ ALERTA: Proyecto en pérdida de capital.</p>
                <button v-if="isLosingMoney" @click="optimizeERP" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg text-xs tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all">
                  ACTIVAR AUTO-CORRECCIÓN
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'bi'" class="space-y-8">
          <div class="flex justify-center gap-4 border-b border-white/10 pb-6">
            <button @click="biDataset = 'q1'" :class="['px-4 py-2 text-xs font-mono border rounded', biDataset === 'q1' ? 'border-[#D8B4FE] text-[#D8B4FE] bg-[#D8B4FE]/10' : 'border-white/20 text-gray-400 hover:border-white/50']">Trimestre 1</button>
            <button @click="biDataset = 'q2'" :class="['px-4 py-2 text-xs font-mono border rounded', biDataset === 'q2' ? 'border-[#D8B4FE] text-[#D8B4FE] bg-[#D8B4FE]/10' : 'border-white/20 text-gray-400 hover:border-white/50']">Trimestre 2</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-1 space-y-4">
              <div class="bg-black/50 p-6 rounded-xl border border-white/5">
                <p class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Volumen Total (Proyectado)</p>
                <p class="text-4xl font-serif text-white">${{ biData.rev.toLocaleString() }}</p>
              </div>
            </div>

            <div class="md:col-span-2 bg-white/[0.02] border border-white/5 rounded-xl p-6 flex flex-col justify-end h-64 relative">
              <p class="absolute top-4 left-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Desglose de Ingresos Mensuales</p>
              <div class="flex items-end justify-between h-40 gap-4 w-full px-4">
                <div v-for="(bar, i) in biData.chart" :key="i" class="w-full bg-gradient-to-t from-[#D8B4FE]/20 to-[#D8B4FE] rounded-t-sm transition-all duration-700 relative group/bar hover:opacity-80" :style="`height: ${bar.h}%`">
                  
                  <div class="absolute -top-16 left-1/2 -translate-x-1/2 bg-black/90 border border-[#D8B4FE]/50 p-2 rounded shadow-xl opacity-0 group-hover/bar:opacity-100 transition-opacity z-20 pointer-events-none w-32">
                    <p class="text-[9px] font-mono text-white mb-1 border-b border-white/20 pb-1">{{ bar.m }}</p>
                    <p class="text-[9px] font-mono text-[#D8B4FE]">B2B: ${{ bar.b2b }}k</p>
                    <p class="text-[9px] font-mono text-blue-400">B2C: ${{ bar.b2c }}k</p>
                  </div>
                  
                  <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-500">{{ bar.m }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'dms'" class="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div class="lg:col-span-4 bg-black/30 border border-white/5 p-4 rounded-xl">
            <input v-model="dmsSearch" type="text" placeholder="Buscar ID o Hash..." class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none mb-4 font-mono">
            <div class="space-y-2">
              <div v-for="file in filteredDmsFiles" :key="file.id" @click="selectDocument(file)" :class="['p-3 rounded-lg border cursor-pointer transition-colors', activeDmsFile.id === file.id ? 'bg-[#D8B4FE]/10 border-[#D8B4FE]' : 'bg-black/50 border-white/5 hover:border-white/20']">
                <p class="text-xs text-white truncate font-bold">{{ file.name }}</p>
                <p class="text-[9px] font-mono text-gray-500 mt-1">Nivel: {{ file.security }}</p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 bg-[#050508] border border-white/10 p-6 rounded-xl">
            <p class="text-[10px] font-mono text-[#D8B4FE] uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Metadatos del Activo</p>
            <div class="space-y-3 text-xs font-mono">
              <p><span class="text-gray-500">Documento:</span> <br><span class="text-white">{{ activeDmsFile.name }}</span></p>
              <p><span class="text-gray-500">Hash de Bloque:</span> <br><span class="text-green-400 break-all opacity-80">{{ activeDmsFile.hash }}298fc1c149afb</span></p>
              <div class="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded">
                <p class="text-[9px] text-red-400">Documento Clasificado.</p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 bg-black/80 border border-red-500/20 rounded-xl p-4 font-mono text-[9px] flex flex-col relative overflow-hidden">
             <div class="absolute -top-0 right-4 bg-red-900/80 text-white text-[9px] font-mono px-2 py-1 border border-red-500/50 rounded-b z-20">Log del Servidor En Vivo</div>
             
            <p class="text-red-400 mb-4 mt-4 tracking-widest border-b border-red-500/20 pb-2">AUDIT TRAIL // ZERO-TRUST</p>
            <div class="space-y-2 flex-1 flex flex-col-reverse opacity-80">
              <div v-for="(log, idx) in auditLogs" :key="idx" class="text-gray-400">
                <span class="text-red-500">>_</span> {{ log }}
              </div>
            </div>
          </div>

        </div>

      </div>

      <div class="mt-24 text-center">
        <h3 class="text-2xl md:text-4xl font-serif mb-8">Esta es la diferencia entre operar a ciegas y liderar con datos.</h3>
        <router-link to="/contacto" class="inline-flex items-center justify-center px-12 py-5 font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-black bg-white rounded-full hover:bg-[#D8B4FE] transition-colors duration-500">
          Diseñar mi Arquitectura →
        </router-link>
      </div>

    </div>
  </main>
</template>