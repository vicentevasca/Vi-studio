// src/store/admin.js
import { ref } from 'vue'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

// Variables reactivas globales (El cerebro de tu app)
export const leads = ref([])
export const tasks = ref([])
export const tickets = ref([])

let isInitialized = false
let unsubs = []

export const initAdminStore = () => {
  if (isInitialized) return // Si ya está conectado, no gastes lecturas de Firebase
  isInitialized = true

  // 1. Escuchar Expedientes (Leads)
  const qLeads = query(collection(db, "leads"), orderBy("createdAt", "desc"))
  unsubs.push(onSnapshot(qLeads, (snap) => {
    leads.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data(), clientStatus: doc.data().clientStatus || 'radar' }))
  }))

  // 2. Escuchar Backlog Maestro (Tasks)
  const qTasks = query(collection(db, "tasks"), orderBy("createdAt", "desc"))
  unsubs.push(onSnapshot(qTasks, (snap) => {
    tasks.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }))

  // 3. Escuchar Mesa de Ayuda (Tickets)
  const qTickets = query(collection(db, "tickets"), orderBy("createdAt", "desc"))
  unsubs.push(onSnapshot(qTickets, (snap) => {
    tickets.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }))
}

// Se llama cuando el administrador Cierra Sesión
export const destroyAdminStore = () => {
  unsubs.forEach(unsub => unsub())
  unsubs = []
  isInitialized = false
  leads.value = []
  tasks.value = []
  tickets.value = []
}