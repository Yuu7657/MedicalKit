<!-- frontend/src/components/AddMedModal.vue -->
<template>
  <teleport to="body">
    <div v-if="open" class="overlay" @click.self="handleClose">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="add-title">
        <header class="modal-header">
          <h2 id="add-title">
            {{ editingId ? 'Editar Medicamento' : 'Agregar Nuevo Medicamento' }}
          </h2>
          <button class="icon" @click="handleClose" aria-label="Cerrar">✖</button>
        </header>

        <p class="sub">
          Completa la información del medicamento y sus horarios de toma
        </p>

        <!-- 🔽 Contenido scrolleable -->
        <form class="form" @submit.prevent="submit">
          <!-- Nombre -->
          <div class="field">
            <label>Nombre del Medicamento</label>
            <input
              v-model.trim="form.nombre"
              type="text"
              placeholder="Ej: Ibuprofeno"
              required
            />
            <small v-if="errors.nombre" class="err">{{ errors.nombre }}</small>
          </div>

          <div class="grid-2">
            <!-- Dosis -->
            <div class="field">
              <label>Dosis</label>
              <input v-model.trim="form.dosis" type="text" placeholder="Ej: 400mg" />
            </div>

            <!-- Frecuencia -->
            <div class="field">
              <label>Frecuencia</label>
              <input v-model.trim="form.frecuencia" type="text" placeholder="Ej: Cada 8 horas" />
            </div>
          </div>

          <!-- Horarios de toma -->
          <div class="field">
            <label>Horarios de Toma</label>
            <div class="horarios">
              <input
                v-model="tempHora"
                type="time"
                @keyup.enter.prevent="addHora"
              />
              <button type="button" class="btn ghost" @click="addHora">
                + Agregar Horario
              </button>
            </div>

            <div class="chips">
              <span v-for="(h, i) in form.horarios" :key="h" class="chip">
                {{ h }}
                <button
                  type="button"
                  class="chip-x"
                  @click="removeHora(i)"
                  aria-label="Quitar"
                >
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- Fechas -->
          <div class="grid-2">
            <div class="field">
              <label>Fecha de Inicio</label>
              <div class="input-icon">
                <span class="icon">📅</span>
                <input v-model="form.inicio" type="date" />
              </div>
            </div>

            <div class="field">
              <label>Fecha de Fin</label>
              <div class="input-icon">
                <span class="icon">📅</span>
                <input v-model="form.fin" type="date" />
              </div>
            </div>
          </div>

          <!-- Color (solo visual, no se guarda en Supabase) -->
          <div class="field">
            <label>Color de Identificación</label>
            <div class="colors">
              <button
                v-for="c in COLORS"
                :key="c"
                type="button"
                class="dot"
                :style="{
                  background: c,
                  outline:
                    form.color === c
                      ? '3px solid #c7d2fe'
                      : '3px solid transparent'
                }"
                @click="form.color = c"
                :aria-label="`Color ${c}`"
              />
            </div>
          </div>

          <!-- Notas -->
          <div class="field">
            <label>Notas (Opcional)</label>
            <textarea
              v-model.trim="form.notas"
              rows="3"
              placeholder="Ej: Tomar con comida"
            ></textarea>
          </div>

          <!-- Acciones -->
          <footer class="actions">
            <button type="button" class="btn ghost" @click="handleClose">
              Cancelar
            </button>
            <button type="submit" class="btn" :disabled="submitting || !isValid">
              {{ submitting ? 'Guardando…' : (editingId ? 'Guardar cambios' : 'Agregar Medicamento') }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { addMedicamento, updateMedicamento } from '../services/api'
import { authService } from '../services/authService'

const props = defineProps({
  open: { type: Boolean, default: false },
  editing: { type: Object, default: null } // medicamento a editar (o null)
})
const emit = defineEmits(['close', 'saved'])

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

function todayYMD() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

const form = reactive({
  nombre: '',
  dosis: '',
  frecuencia: '',
  horarios: [],
  inicio: todayYMD(),
  fin: todayYMD(),
  color: COLORS[0], // solo frontend
  notas: ''
})

const editingId = ref(null)
const tempHora = ref('')
const errors = reactive({ nombre: '', fechas: '' })
const submitting = ref(false)

const isValid = computed(() => {
  return form.nombre.trim().length > 0 && !errors.fechas
})

// Rellenar formulario cuando llegue un medicamento a editar
watch(
  () => props.editing,
  med => {
    if (med) {
      editingId.value = med.id
      form.nombre = med.name || ''
      form.dosis = med.dose || ''
      form.frecuencia = med.frequency || ''
      form.horarios = Array.isArray(med.times) ? [...med.times] : []
      form.inicio = med.start || todayYMD()
      form.fin = med.end || todayYMD()
      form.color = med.color || COLORS[0]
      form.notas = med.note || ''
      errors.nombre = ''
      errors.fechas = ''
    } else {
      editingId.value = null
      reset()
    }
  },
  { immediate: true }
)

// Validación de fechas
watch(
  () => [form.inicio, form.fin],
  () => {
    if (form.inicio && form.fin && new Date(form.inicio) > new Date(form.fin)) {
      errors.fechas = 'La fecha de inicio no puede ser posterior a la de fin.'
    } else {
      errors.fechas = ''
    }
  }
)

function addHora() {
  if (!tempHora.value) return
  if (!form.horarios.includes(tempHora.value)) {
    form.horarios.push(tempHora.value)
    form.horarios.sort()
  }
  tempHora.value = ''
}

function removeHora(i) {
  form.horarios.splice(i, 1)
}

function reset() {
  form.nombre = ''
  form.dosis = ''
  form.frecuencia = ''
  form.horarios = []
  form.inicio = todayYMD()
  form.fin = todayYMD()
  form.color = COLORS[0]
  form.notas = ''
  tempHora.value = ''
  errors.nombre = ''
  errors.fechas = ''
}

async function submit() {
  errors.nombre = form.nombre.trim() ? '' : 'El nombre es obligatorio.'
  if (errors.nombre || errors.fechas) return

  submitting.value = true
  try {
    const user = await authService.getUser()

    const payload = {
      nombre: form.nombre.trim(),
      dosis: form.dosis || null,
      frecuencia: form.frecuencia || null,
      horarios: form.horarios.join(','), // text
      fecha_inicio: form.inicio || null,
      fecha_fin: form.fin || null,
      nota: form.notas || null,
      user_id: user?.id ?? null,
      nombre_id: null
    }

    let result
    if (editingId.value) {
      // UPDATE
      result = await updateMedicamento(editingId.value, payload)
    } else {
      // CREATE
      result = await addMedicamento(payload)
    }

    const row = Array.isArray(result) ? result[0] : result

    const uiMed = {
      id: row.id,
      name: row.nombre,
      dose: row.dosis ?? '',
      frequency: row.frecuencia ?? '',
      times: (row.horarios ?? '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      start: row.fecha_inicio ?? '',
      end: row.fecha_fin ?? '',
      note: row.nota ?? '',
      color: form.color // solo frontend
    }

    emit('saved', uiMed)
    handleClose()
  } catch (e) {
    alert('No se pudo guardar: ' + (e?.message || e))
  } finally {
    submitting.value = false
  }
}

function handleClose() {
  reset()
  editingId.value = null
  emit('close')
}
</script>

<style scoped>
/* Overlay + modal */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 50;
}

.modal {
  width: 100%;
  max-width: 720px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 1.25rem 1.25rem 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);

  /* 🔹 alto máximo y layout en columna para scroll interno */
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.icon {
  background: transparent;
  border: none;
  font-size: 1.05rem;
  cursor: pointer;
  color: #111827;
}

/* Form */
.sub {
  color: #64748b;
  margin: 0.25rem 0 0.75rem;
}

/* 🔹 el formulario es el que scrollea */
.form {
  display: grid;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.25rem;   /* espacio para el scrollbar */
}

/* Scrollbar suave (opcional) */
.form::-webkit-scrollbar {
  width: 6px;
}
.form::-webkit-scrollbar-track {
  background: transparent;
}
.form::-webkit-scrollbar-thumb {
  background: #cbd5f5;
  border-radius: 999px;
}

.field {
  display: grid;
  gap: 0.45rem;
}

.field label {
  font-weight: 600;
}

input[type='text'],
input[type='date'],
input[type='time'],
textarea {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.65rem 0.8rem;
  outline: none;
}

textarea {
  resize: vertical;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 720px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

.horarios {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #f1f5f9;
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  font-size: 0.9rem;
}

.chip-x {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.input-icon {
  position: relative;
}

.input-icon .icon {
  position: absolute;
  left: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.input-icon input {
  padding-left: 2rem;
}

.colors {
  display: flex;
  gap: 0.6rem;
}

.dot {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.25rem;
}

.btn {
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.ghost {
  background: #111827;
  color: #e5e7eb;
}

.err {
  color: #dc2626;
}
</style>
