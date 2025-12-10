<!-- src/components/AccessibilityMenu.vue -->
<template>
  <div 
    class="a11y-wrapper" 
    :class="{ dragging: isDragging }"
    :style="fabStyle"
  >
    <!-- FAB: solo abre/cierra el panel -->
    <button
      class="a11y-fab"
      type="button"
      @click="handleClick"
      @touchstart.passive="handleTouchStart"
      @touchmove.prevent="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
      :aria-expanded="open ? 'true' : 'false'"
      aria-haspopup="true"
      aria-label="Menú de accesibilidad"
    >
      <span class="fab-icon">
        <!-- Icono serio de Heroicons -->
        <AdjustmentsHorizontalIcon class="icon-main" />
      </span>
    </button>

    <!-- Panel (solo ajustes de texto + reset) -->
    <transition name="fade-scale">
      <div
        v-if="open"
        class="a11y-panel"
        role="menu"
        @click.stop
      >
        <button
          class="a11y-item"
          type="button"
          role="menuitem"
          @click="increaseFont"
          :disabled="baseFontSize >= MAX_FONT"
        >
          <SquaresPlusIcon class="a11y-icon" />
          <span>Aumentar texto</span>
        </button>

        <button
          class="a11y-item"
          type="button"
          role="menuitem"
          @click="decreaseFont"
          :disabled="baseFontSize <= MIN_FONT"
        >
          <Squares2X2Icon class="a11y-icon" />
          <span>Reducir texto</span>
        </button>

        <button
          class="a11y-item"
          type="button"
          role="menuitem"
          @click="resetAll"
        >
          <ArrowPathIcon class="a11y-icon" />
          <span>Restablecer</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import {
  AdjustmentsHorizontalIcon, // FAB
  SquaresPlusIcon,
  Squares2X2Icon,
  ArrowPathIcon
} from "@heroicons/vue/24/outline"

/* ----------------- Constantes ----------------- */
const STORAGE_FONT_KEY = "mk_font_percent"
const STORAGE_POS_KEY = "mk_fab_position"
const DEFAULT_FONT = 100
const MIN_FONT = 80
const MAX_FONT = 140

/* ----------------- Estado ----------------- */
const open = ref(false)
const baseFontSize = ref(DEFAULT_FONT) // porcentaje

/* ----------------- Draggable (solo mobile) ----------------- */
const isDragging = ref(false)
const position = reactive({ x: 16, y: 16 }) // top-right default
const touchStart = reactive({ x: 0, y: 0 })

// Computed CSS variables
const fabStyle = computed(() => {
  if (window.innerWidth > 640) {
    // Desktop/tablet: posición fija original
    return {}
  }
  // Mobile: usa posición dinámica
  return {
    left: `${position.x}px`,
    top: `${position.y}px`,
    right: 'auto',
    bottom: 'auto'
  }
})

/* ----------------- Helpers DOM ----------------- */
function applyFontSize() {
  document.documentElement.style.fontSize = `${baseFontSize.value}%`
}

/* ----------------- Acciones Panel ----------------- */
function togglePanel() {
  open.value = !open.value
}

function increaseFont() {
  if (baseFontSize.value >= MAX_FONT) return
  baseFontSize.value = Math.min(baseFontSize.value + 10, MAX_FONT)
  applyFontSize()
  localStorage.setItem(STORAGE_FONT_KEY, String(baseFontSize.value))
}

function decreaseFont() {
  if (baseFontSize.value <= MIN_FONT) return
  baseFontSize.value = Math.max(baseFontSize.value - 10, MIN_FONT)
  applyFontSize()
  localStorage.setItem(STORAGE_FONT_KEY, String(baseFontSize.value))
}

function resetAll() {
  baseFontSize.value = DEFAULT_FONT
  applyFontSize()
  localStorage.removeItem(STORAGE_FONT_KEY)
}

/* ----------------- Draggable Handlers ----------------- */
const dragStartTime = ref(0)
const hasMoved = ref(false)

function handleClick() {
  // Solo abrir panel si NO fue un drag
  if (!hasMoved.value) {
    togglePanel()
  }
}

function handleTouchStart(e) {
  if (window.innerWidth > 640) return // Solo en mobile
  
  dragStartTime.value = Date.now()
  hasMoved.value = false
  isDragging.value = true
  const touch = e.touches[0]
  touchStart.x = touch.clientX - position.x
  touchStart.y = touch.clientY - position.y
  
  // Cerrar panel si está abierto
  open.value = false
}

function handleTouchMove(e) {
  if (!isDragging.value) return
  
  hasMoved.value = true // Marcamos que hubo movimiento
  
  const touch = e.touches[0]
  let newX = touch.clientX - touchStart.x
  let newY = touch.clientY - touchStart.y
  
  // Límites de pantalla (considerar tamaño del botón: 48px)
  const maxX = window.innerWidth - 48
  const maxY = window.innerHeight - 48
  
  position.x = Math.max(0, Math.min(newX, maxX))
  position.y = Math.max(0, Math.min(newY, maxY))
}

function handleTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  
  // Guardar posición en localStorage
  localStorage.setItem(STORAGE_POS_KEY, JSON.stringify({ x: position.x, y: position.y }))
}

/* ----------------- Eventos globales ----------------- */
function handleClickOutside(e) {
  const wrapper = document.querySelector(".a11y-wrapper")
  if (wrapper && !wrapper.contains(e.target)) {
    open.value = false
  }
}

function handleKeydown(e) {
  // Cerrar con ESC
  if (e.key === "Escape") {
    open.value = false
  }
}

onMounted(() => {
  // Cargar preferencias guardadas de tamaño de fuente
  try {
    const savedFont = parseInt(localStorage.getItem(STORAGE_FONT_KEY) ?? "", 10)
    if (!Number.isNaN(savedFont)) {
      baseFontSize.value = Math.min(Math.max(savedFont, MIN_FONT), MAX_FONT)
    }
  } catch {
    // ignoramos errores de localStorage
  }

  // Cargar posición guardada del FAB (solo mobile)
  if (window.innerWidth <= 640) {
    try {
      const savedPos = localStorage.getItem(STORAGE_POS_KEY)
      if (savedPos) {
        const parsed = JSON.parse(savedPos)
        position.x = parsed.x
        position.y = parsed.y
      }
    } catch {
      // ignorar errores
    }
  }

  applyFontSize()

  document.addEventListener("click", handleClickOutside)
  document.addEventListener("keydown", handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
  document.removeEventListener("keydown", handleKeydown)
})
</script>

<style scoped>
.a11y-wrapper {
  position: fixed;
  right: 1.4rem;
  bottom: 1.4rem;
  z-index: 60;
}

/* FAB (botón flotante) */
.a11y-fab {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: none;
  background: #0ea5e9;              /* Azul MedicalKit */
  color: #f9fafb;                   /* El Heroicon usa currentColor */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.45);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s;
}

.a11y-fab:hover {
  background: #0284c7;
  transform: translateY(-1px);
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.55);
}

.fab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-main {
  width: 24px;
  height: 24px;
}

/* Panel */
.a11y-panel {
  margin-top: 0.75rem;
  background: #ffffff;
  border-radius: 18px;
  padding: 0.75rem 0.9rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.22);
  min-width: 235px;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.a11y-item {
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.55rem 0.35rem;
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #111827;
  transition: background 0.15s ease, transform 0.1s ease, opacity 0.1s ease;
}

.a11y-item:hover:not(:disabled) {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.a11y-item:disabled {
  opacity: 0.45;
  cursor: default;
}

.a11y-icon {
  width: 22px;
  height: 22px;
}

/* Animación panel */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.98);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 640px) {
  .a11y-wrapper {
    right: auto;
    bottom: auto;
    /* left y top se controlan desde fabStyle computed */
    transition: none; /* Sin transición cuando se arrastra */
  }

  .a11y-wrapper.dragging {
    z-index: 70; /* Por encima de todo mientras arrastra */
  }

  .a11y-wrapper.dragging .a11y-fab {
    transform: scale(1.1);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.4);
    cursor: grabbing;
  }

  .a11y-fab {
    width: 48px;
    height: 48px;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.3);
    cursor: grab; /* Indicar que es arrastrable */
    touch-action: none; /* Permitir manipulación táctil */
  }

  .icon-main {
    width: 20px;
    height: 20px;
  }

  .a11y-panel {
    position: fixed;
    right: 1rem;
    top: 5rem;
    margin-top: 0;
  }
}
</style>
