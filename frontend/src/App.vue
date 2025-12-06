<template>
  <div id="app">
    <header class="relative app-header w-full flex flex-col items-center mt-8">
      <!-- 👤 Menú de usuario -->
      <div class="absolute top-0 right-6">
        <UserMenu />
      </div>

      <!-- 🔹 Barra de navegación -->
      <nav class="tabs mt-4">
        <RouterLink
          class="tab"
          :class="{ active: is('/') }"
          to="/"
        >
          <Squares2X2Icon class="tab-icon" />
          <span>Inicio</span>
        </RouterLink>

        <RouterLink
          class="tab"
          :class="{ active: is('/calendario') }"
          to="/calendario"
        >
          <CalendarDaysIcon class="tab-icon" />
          <span>Calendario</span>
        </RouterLink>

        <RouterLink
          class="tab"
          :class="{ active: is('/medicamentos') }"
          to="/medicamentos"
        >
          <SquaresPlusIcon class="tab-icon" />
          <span>Medicamentos</span>
        </RouterLink>

        <RouterLink
          class="tab"
          :class="{ active: is('/notificaciones') }"
          to="/notificaciones"
        >
          <BellAlertIcon class="tab-icon" />
          <span>Notificaciones</span>
        </RouterLink>
      </nav>
    </header>

    <!-- Vista principal -->
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>

    <!-- ♿ Botón flotante de accesibilidad -->
    <AccessibilityMenu />

    <!-- 🟦 Contenedor global de notificaciones premium -->
    <Notivue v-slot="item">
      <Notifications :item="item" />
    </Notivue>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import UserMenu from './components/UserMenu.vue'
import AccessibilityMenu from './components/AccessibilityMenu.vue'

// Íconos outline negros
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  SquaresPlusIcon,
  BellAlertIcon
} from '@heroicons/vue/24/outline'

// 🟦 Notivue
import { Notivue, Notifications } from 'notivue'

const route = useRoute()

// ✅ Solo una pestaña activa
const is = (p) => {
  if (p === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(p)
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: linear-gradient(180deg, #f9fafb 0%, #f0fdf4 100%);
  color: #111827;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.app-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.75rem;
  background: #f1f5f9;
  border-radius: 999px;
  padding: 0.3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  color: #111827;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.25s ease;
}

.tab-icon {
  width: 18px;
  height: 18px;
  stroke-width: 1.8;
}

.tab:hover {
  background: white;
  color: #111827;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
}

.tab.active {
  background: white;
  color: #111827;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.18);
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
