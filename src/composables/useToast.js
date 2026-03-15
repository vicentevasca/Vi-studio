import { ref } from 'vue'

// Singleton global — compartido por todas las páginas del admin
const toasts = ref([])
let _id = 0

export function useToast() {
  const remove = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const add = (message, type = 'info', duration = 3500) => {
    const id = _id++
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
  }

  return {
    toasts,
    remove,
    success: (msg) => add(msg, 'success'),
    error:   (msg) => add(msg, 'error', 5000),
    info:    (msg) => add(msg, 'info'),
  }
}
