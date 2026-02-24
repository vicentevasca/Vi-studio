<script setup>
import { ref, onMounted } from 'vue'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase' 
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loadingAuth = ref(true) // Empieza en true mientras revisa si ya hay sesión

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push('/admin')
    } else {
      loadingAuth.value = false
    }
  })
})

const handleLogin = async () => {
  loadingAuth.value = true
  errorMsg.value = ''
  try { 
    await signInWithEmailAndPassword(auth, email.value, password.value) 
    router.push('/admin') 
  } catch (e) { 
    errorMsg.value = "Acceso Denegado. Credenciales inválidas." 
    loadingAuth.value = false 
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#050508] text-white flex items-center justify-center px-6 selection:bg-[#D8B4FE] selection:text-black">
    <div class="w-full max-w-sm border border-white/10 p-10 rounded-3xl bg-black shadow-2xl relative overflow-hidden animate-fade-in">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D8B4FE] to-transparent opacity-50"></div>
      
      <h2 class="text-xs font-mono text-[#D8B4FE] uppercase tracking-[0.4em] mb-8 text-center">Root Access</h2>
      
      <form v-if="!loadingAuth" @submit.prevent="handleLogin" class="space-y-6">
        <input v-model="email" type="email" placeholder="System Email" required class="w-full bg-transparent border-b border-white/10 py-3 focus:border-[#D8B4FE] outline-none transition-colors text-sm font-mono text-center">
        <input v-model="password" type="password" placeholder="Passkey" required class="w-full bg-transparent border-b border-white/10 py-3 focus:border-[#D8B4FE] outline-none transition-colors text-sm font-mono text-center">
        
        <p v-if="errorMsg" class="text-red-400 text-[9px] uppercase tracking-widest text-center">{{ errorMsg }}</p>
        
        <button type="submit" class="w-full bg-[#D8B4FE] text-black text-[10px] uppercase tracking-[0.2em] font-bold py-4 rounded-xl hover:bg-white transition-all mt-4 shadow-[0_0_20px_rgba(216,180,254,0.15)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Desencriptar
        </button>
      </form>

      <div v-else class="flex flex-col items-center justify-center py-10 opacity-50">
        <span class="text-2xl mb-4 animate-spin">⚙️</span>
        <p class="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400">Verificando tokens...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>