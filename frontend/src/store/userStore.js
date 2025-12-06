// frontend/src/store/userStore.js
import { reactive } from 'vue'

export const userStore = reactive({
  state: {
    user: null
  },

  // Guardar usuario en memoria + localStorage
  login(userData) {
    this.state.user = userData
    localStorage.setItem('user', JSON.stringify(userData))
  },

  // Limpiar usuario de memoria + localStorage
  logout() {
    this.state.user = null
    localStorage.removeItem('user')
  },

  // ¿Hay sesión activa?
  isLogged() {
    return !!this.state.user
  },

  // Cargar usuario desde localStorage (en arranque)
  loadFromStorage() {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      this.state.user = JSON.parse(storedUser)
    }
  }
})
