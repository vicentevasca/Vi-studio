// src/store/admin.js
import { ref } from 'vue'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export const leads = ref([])
export const tasks = ref([])
export const tickets = ref([])

let isInitialized = false
let unsubs = []

export const initAdminStore = () => {
  if (isInitialized) return
  isInitialized = true

  const qLeads = query(collection(db, "leads"), orderBy("createdAt", "desc"))
  unsubs.push(onSnapshot(qLeads, (snap) => {
    leads.value = snap.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(), 
      clientStatus: doc.data().clientStatus || 'radar' 
    }))
  }))

  const qTasks = query(collection(db, "tasks"), orderBy("createdAt", "desc"))
  unsubs.push(onSnapshot(qTasks, (snap) => {
    tasks.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }))

  const qTickets = query(collection(db, "tickets"), orderBy("createdAt", "desc"))
  unsubs.push(onSnapshot(qTickets, (snap) => {
    tickets.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }))
}

export const updateLeadData = async (id, data) => {
  const ref = doc(db, 'leads', id)
  return await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export const logNote = (leadId, text, type = 'system') =>
  addDoc(collection(db, 'notes'), {
    leadId,
    text,
    type,
    createdAt: serverTimestamp(),
  })

export const destroyAdminStore = () => {
  unsubs.forEach(u => u())
  isInitialized = false
  unsubs = []
}