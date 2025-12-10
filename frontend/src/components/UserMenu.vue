<!-- src/components/UserMenu.vue -->
<template>
  <div 
    class="user-menu"
    :class="{ dragging: isDragging }"
    :style="menuStyle"
  >
    <!-- Botón flotante / icono -->
    <button
      @click="handleClick"
      @touchstart.passive="handleTouchStart"
      @touchmove.prevent="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
      class="user-icon"
      :title="user ? 'Cuenta' : 'Iniciar sesión'"
    >
      <UserCircleIcon v-if="user" class="user-icon-svg" />
      <KeyIcon v-else class="user-icon-svg" />
    </button>

    <!-- Card de sesión -->
    <transition name="fade">
      <div v-if="menuOpen" class="menu-dropdown">
        <!-- SIN sesión -->
        <template v-if="!user">
          <h3 class="title">Iniciar sesión</h3>
          <form @submit.prevent="login" class="form">
            <input
              v-model="email"
              type="email"
              placeholder="Correo electrónico"
              required
            />
            <input
              v-model="password"
              type="password"
              placeholder="Contraseña"
              required
            />
            <button type="submit" class="btn primary">Entrar</button>
          </form>

          <p class="small">
            ¿No tienes cuenta?
            <a @click.prevent="goRegister">Regístrate aquí</a>
          </p>
        </template>

        <!-- CON sesión -->
        <template v-else>
          <div class="session-header">
            <div class="avatar">
              <UserCircleIcon class="avatar-icon" />
            </div>
            <div class="session-text">
              <span class="hello">Hola,</span>
              <span class="email">{{ user.email }}</span>
              <span class="hint">
                Tu sesión está activa. Puedes cerrar sesión cuando quieras.
              </span>
            </div>
          </div>

          <button class="btn danger full" @click="logout">
            Cerrar sesión
          </button>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { userStore } from '../store/userStore'
import {
  UserCircleIcon,
  KeyIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const menuOpen = ref(false)
const email = ref('')
const password = ref('')

const user = computed(() => userStore.state.user)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const login = async () => {
  try {
    const logged = await authService.login(email.value, password.value)
    userStore.login(logged)
    menuOpen.value = false
    router.push({ name: 'inicio' })
  } catch (err) {
    alert('Error al iniciar sesión: ' + err.message)
  }
}

const logout = async () => {
  await authService.logout()
  userStore.logout()
  menuOpen.value = false
  router.push({ name: 'login' })
}

const goRegister = () => {
  menuOpen.value = false
  router.push({ name: 'registro' })
}

/* ----------------- Draggable (solo desktop) ----------------- */
const isDragging = ref(false)
const position = ref({ x: 18, y: 18 }) // top-left default
const touchStart = ref({ x: 0, y: 0 })
const hasMoved = ref(false)

// Computed CSS variables
const menuStyle = computed(() => {
  if (window.innerWidth > 640) {
    // Desktop/tablet: usa posición dinámica
    return {
      left: `${position.value.x}px`,
      top: `${position.value.y}px`,
      right: 'auto',
      bottom: 'auto'
    }
  }
  // Mobile: oculto
  return {}
})

function handleClick() {
  if (!hasMoved.value) {
    toggleMenu()
  }
}

function handleTouchStart(e) {
  if (window.innerWidth <= 640) return // Solo en desktop
  
  hasMoved.value = false
  isDragging.value = true
  const touch = e.touches[0]
  touchStart.value.x = touch.clientX - position.value.x
  touchStart.value.y = touch.clientY - position.value.y
  
  menuOpen.value = false // Cerrar menú al arrastrar
}

function handleTouchMove(e) {
  if (!isDragging.value) return
  
  hasMoved.value = true
  
  const touch = e.touches[0]
  let newX = touch.clientX - touchStart.value.x
  let newY = touch.clientY - touchStart.value.y
  
  // Límites de pantalla
  const maxX = window.innerWidth - 42
  const maxY = window.innerHeight - 42
  
  position.value.x = Math.max(0, Math.min(newX, maxX))
  position.value.y = Math.max(0, Math.min(newY, maxY))
}

function handleTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  
  // Guardar posición
  localStorage.setItem('user_menu_position', JSON.stringify(position.value))
}

// Cargar posición guardada
if (typeof window !== 'undefined' && window.innerWidth > 640) {
  try {
    const saved = localStorage.getItem('user_menu_position')
    if (saved) {
      const parsed = JSON.parse(saved)
      position.value = parsed
    }
  } catch {}
}
</script>

<style scoped>
.user-menu {
  position: fixed;
  top: 1.1rem;
  left: 1.1rem;
  z-index: 1000;
}

/* Botón flotante */
.user-icon {
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 999px;
  width: 42px;
  height: 42px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(14, 165, 233, 0.35);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.2s;
  touch-action: none; /* Permitir drag */
}
.user-icon:hover {
  transform: translateY(-1px) scale(1.03);
  background: #0284c7;
  box-shadow: 0 14px 32px rgba(14, 165, 233, 0.45);
}
.user-icon-svg {
  width: 22px;
  height: 22px;
}

/* Card */
.menu-dropdown {
  position: absolute;
  top: 3.4rem;
  left: 0;
  background: #ffffff;
  padding: 0.9rem 1rem 1rem;
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  width: 270px;
  border: 1px solid #e5e7eb;
}

/* Header sesión */
.session-header {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  width: 18px;
  height: 18px;
  color: #0369a1;
}

.session-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.hello {
  font-size: 0.78rem;
  color: #6b7280;
}

.email {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
  word-break: break-all;
}

.hint {
  font-size: 0.78rem;
  color: #6b7280;
  line-height: 1.3;
  margin-top: 0.15rem;
}

/* Login */
.title {
  margin: 0 0 0.4rem;
  font-size: 0.98rem;
  font-weight: 600;
  color: #111827;
}

.form {
  display: grid;
  gap: 0.45rem;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.45rem 0.55rem;
  border-radius: 9px;
  border: 1px solid #d1d5db;
  font-size: 0.85rem;
}

.small {
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: #64748b;
}
.small a {
  color: #0f172a;
  font-weight: 500;
  cursor: pointer;
}

/* Botones */
.btn {
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s ease, transform 0.12s ease,
    box-shadow 0.18s ease;
}

.btn.full {
  width: 100%;
}

.btn.primary {
  background: #0ea5e9;
  color: #f9fafb;
}
.btn.primary:hover {
  background: #0284c7;
}

.btn.danger {
  background: #ef4444;
  color: #fef2f2;
  box-shadow: 0 10px 24px rgba(248, 113, 113, 0.4);
}
.btn.danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 14px 32px rgba(248, 113, 113, 0.5);
}

/* Animación */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 640px) {
  .user-menu {
    display: none; /* Ocultar en mobile para no estorbar */
  }
}
</style>
