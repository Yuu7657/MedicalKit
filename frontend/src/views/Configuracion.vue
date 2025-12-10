<!-- frontend/src/views/Configuracion.vue -->
<template>
  <section class="wrap">
    <div class="grid">
      <!-- Panel de configuración -->
      <div class="card">
        <h2>Configuración</h2>
        <p class="sub">Gestiona tus notificaciones</p>

        <div class="row gap">
          <div class="status">
            Notificaciones:
            <b :class="enabled ? 'on' : 'off'">
              {{ enabled ? 'Activadas' : 'Desactivadas' }}
            </b>
          </div>

          <button class="btn" type="button" @click="toggle">
            {{ enabled ? 'Desactivar' : 'Activar' }}
          </button>

          <button
            class="btn ghost"
            type="button"
            @click="test"
            :disabled="!enabled || testing"
            :title="
              !enabled
                ? 'Activa primero las notificaciones'
                : 'Enviar notificación de prueba'
            "
          >
            {{ testing ? 'Enviando…' : 'Probar notificación' }}
          </button>
        </div>

        <p class="sub helper">
          Las notificaciones se muestran incluso con la app cerrada (según el
          soporte del navegador). La prueba de notificación también mostrará un
          aviso elegante en pantalla.
        </p>
      </div>

      <!-- Panel de dosis de hoy -->
      <div class="card">
        <h3>Dosis de Hoy</h3>

        <ul class="list">
          <li
            v-for="m in hoy"
            :key="m.id"
            class="dose"
          >
            <div>
              <div class="title">
                {{ m.name }}
                <span class="chip">{{ m.dose || '—' }}</span>
              </div>
              <div>
                <span
                  v-for="t in (m.times || [])"
                  :key="t"
                  class="pill"
                >
                  {{ t }}
                </span>
              </div>
            </div>

            <button class="btn small" type="button" @click="markTaken(m)">
              ✓ Marcar como Tomado
            </button>
          </li>

          <li v-if="!hoy.length" class="sub">
            Nada para hoy 🎉
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  getMeds,
  getNotificationsEnabled,
  setNotificationsEnabled
} from '../services/storage'

// 🟦 Notivue: función para disparar notificaciones
import { push } from 'notivue'

const enabled = ref(getNotificationsEnabled())
const meds = ref(getMeds())
const testing = ref(false)

const hoy = computed(() =>
  meds.value.filter((m) => dentroDelPeriodo(m, new Date()))
)

function dentroDelPeriodo(m, d) {
  const s = m.start ? new Date(m.start) : null
  const e = m.end ? new Date(m.end) : null
  if (s && d < s) return false
  if (e && d > e) return false
  return true
}

async function toggle() {
  // Si vamos a activar, pedimos permiso primero
  if (!enabled.value) {
    if (!('Notification' in window)) {
      push.error({
        title: 'Notificaciones no compatibles',
        message: 'Tu navegador no soporta notificaciones push.'
      })
      return
    }

    const perm = await Notification.requestPermission()
    if (perm !== 'granted') {
      push.warning({
        title: 'Permiso denegado',
        message:
          'No se concedió el permiso de notificaciones. Puedes cambiarlo desde la configuración del navegador.'
      })
      return
    }
  }

  enabled.value = !enabled.value
  setNotificationsEnabled(enabled.value)

  if (enabled.value) {
    push.success({
      title: 'Notificaciones activadas',
      message:
        'Recibirás recordatorios cuando llegue la hora de tus medicamentos.'
    })
  } else {
    push.info({
      title: 'Notificaciones desactivadas',
      message:
        'No recibirás nuevos recordatorios hasta que las vuelvas a activar.'
    })
  }
}

async function test() {
  if (!enabled.value) {
    push.warning({
      title: 'Activa las notificaciones',
      message: 'Primero debes activar las notificaciones para hacer la prueba.'
    })
    return
  }

  testing.value = true

  // Notificación visual dentro de la PWA
  push.info({
    title: 'Notificación de prueba',
    message: 'Así se verá tu recordatorio de dosis en la aplicación.'
  })

  try {
    // Y si hay Service Worker, también mandamos una real del navegador
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready
      await reg.showNotification('Recordatorio de prueba', {
        body: 'Así se verá tu recordatorio de dosis.',
        icon: '/icons/icon-192.png',
        tag: 'demo-medkit'
      })
    }
  } catch (e) {
    console.warn('Error al mostrar notificación con Service Worker:', e)
    push.error({
      title: 'No se pudo mostrar la notificación nativa',
      message: e?.message || 'Inténtalo de nuevo más tarde.'
    })
  } finally {
    testing.value = false
  }
}

function markTaken(med) {
  // Aquí en el futuro podrías persistir el estado en Supabase / localStorage
  push.success({
    title: 'Dosis registrada',
    message: `Marcaste como tomada la dosis de ${med.name}.`
  })
}
</script>

<style scoped>
.wrap {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1rem 1.2rem;
}

.row {
  display: flex;
  align-items: center;
}

.gap {
  gap: 0.5rem;
}

.status b.on {
  color: #16a34a;
}

.status b.off {
  color: #b91c1c;
}

.btn {
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-size: 0.92rem;
  transition: background 0.15s ease, transform 0.1s ease,
    box-shadow 0.15s ease;
}

.btn:hover:not(:disabled) {
  background: #020617;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.35);
}

.btn:disabled {
  opacity: 0.55;
  cursor: default;
  box-shadow: none;
}

.btn.ghost {
  background: #111827;
  color: #e5e7eb;
  opacity: 0.9;
}

.btn.small {
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dose {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 4px solid #fecaca;
  padding: 0.75rem;
  border-radius: 10px;
  margin: 0.5rem 0;
  background: #fff1f2;
}

.pill {
  display: inline-block;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  margin-right: 0.35rem;
  margin-top: 0.25rem;
}

.chip {
  background: #f1f5f9;
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  margin-left: 0.4rem;
  font-size: 0.85rem;
}

.title {
  font-weight: 600;
}

.sub {
  color: #64748b;
  font-size: 0.9rem;
}

.helper {
  margin-top: 0.8rem;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .wrap {
    margin: 1rem auto;
    padding: 0 0.75rem;
  }

  .card {
    padding: 0.9rem 1rem;
  }

  .card h2 {
    font-size: 1.3rem;
  }

  .card h3 {
    font-size: 1.1rem;
  }

  .row.gap {
    flex-direction: column;
    align-items: stretch;
  }

  .status {
    text-align: center;
  }

  .btn {
    width: 100%;
    padding: 0.7rem 1rem;
  }

  .dose {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  .dose .btn.small {
    width: 100%;
  }
}
</style>
