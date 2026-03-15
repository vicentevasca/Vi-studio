// Per-lead activity timeline — reactive singleton per leadId
import { ref } from 'vue'
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const cache = {}

export function useNotes(leadId) {
  if (!cache[leadId]) {
    const notes = ref([])
    const q = query(
      collection(db, 'notes'),
      where('leadId', '==', leadId),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      notes.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    })
    cache[leadId] = { notes, unsub }
  }
  return {
    notes: cache[leadId].notes,
    addNote: (text, type = 'manual') =>
      addDoc(collection(db, 'notes'), {
        leadId,
        text,
        type, // 'manual' | 'stage_change' | 'payment' | 'task' | 'system'
        createdAt: serverTimestamp(),
      }),
  }
}
