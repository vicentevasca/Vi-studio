import { ref } from 'vue'

// Singleton global — un solo dialog activo a la vez
const state = ref({ open: false, message: '', resolve: null })

export function useConfirm() {
  const ask = (message) => new Promise((resolve) => {
    state.value = { open: true, message, resolve }
  })

  const respond = (answer) => {
    if (state.value.resolve) state.value.resolve(answer)
    state.value = { open: false, message: '', resolve: null }
  }

  return { confirmState: state, ask, respond }
}
