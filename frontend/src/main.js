// frontend/src/main.js
import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { userStore } from './store/userStore'
import { authService } from './services/authService'

// 🟦 Notivue (notificaciones premium)
import { createNotivue } from 'notivue'
import 'notivue/notifications.css'
import 'notivue/animations.css'

const app = createApp(App)

// Sesión guardada
userStore.loadFromStorage?.()

// Mantener store sincronizado con Supabase
authService.onAuthChange((user) => {
  if (user) {
    userStore.login(user)
  } else {
    userStore.logout()
  }
})

// ⚙️ Config básica de Notivue (puedes ajustar posición, límite, etc.)
const notivue = createNotivue({
  position: 'top-center',
  limit: 4,
  enqueue: true
})

app.use(router)
app.use(notivue)
app.mount('#app')

// 👉 Registro del Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => {
        console.log('✅ Service Worker registrado con scope:', reg.scope)
      })
      .catch((err) => {
        console.error('❌ Error al registrar el Service Worker', err)
      })
  })
}
