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
  padding-bottom: 0;
}

.app-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
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
  min-height: 44px; /* Mejor touch target */
}

.tab-icon {
  width: 22px;
  height: 22px;
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

/* ========== RESPONSIVE ========== */

/* Tablet */
@media (max-width: 880px) {
  .tab {
    padding: 0.5rem 0.9rem;
    font-size: 0.9rem;
  }
}

/* Mobile */
@media (max-width: 640px) {
  #app {
    padding-bottom: 80px; /* Espacio para nav bottom */
  }

  .app-header {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    margin-top: 0;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid #e5e7eb;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  }

  .app-header .absolute {
    display: none; /* Ocultar UserMenu en mobile */
  }

  .tabs {
    width: 100%;
    max-width: 100%;
    justify-content: space-around;
    gap: 0.25rem;
    padding: 0.25rem;
    background: transparent;
    box-shadow: none;
  }

  .tab {
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.7rem;
    min-width: 64px;
    text-align: center;
  }

  .tab span {
    font-size: 0.7rem;
    line-height: 1;
  }

  .tab-icon {
    width: 24px;
    height: 24px;
    margin-bottom: 2px;
  }

  .tab:hover {
    box-shadow: none;
    background: rgba(255, 255, 255, 0.5);
  }

  .tab.active {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.12);
  }
}
</style>
