<!-- frontend/src/views/Medicamentos.vue -->
<template>
  <section class="wrap">
    <div class="card">
      <div class="row between center">
        <h2>Tabla de Medicamentos</h2>

        <button class="btn" @click="nuevo">
          <PlusIcon class="btn-icon-left" />
          <span>Agregar Medicamento</span>
        </button>
      </div>

      <p v-if="loading" class="sub" style="padding:.5rem 0;">
        Cargando medicamentos…
      </p>
      <p
        v-if="error"
        class="sub"
        style="color:#dc2626;padding:.5rem 0;"
      >
        {{ error }}
      </p>

      <table v-if="!loading" class="table">
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Dosis</th>
            <th>Frecuencia</th>
            <th>Horarios</th>
            <th>Período</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="m in meds" :key="m.id">
            <!-- Medicamento -->
            <td>
              <div class="name-row">
                <span
                  class="color-dot"
                  :style="{ background: m.color || '#e5e7eb' }"
                ></span>

                <div>
                  <div class="name">{{ m.name }}</div>
                  <div class="sub">{{ m.note || '—' }}</div>
                </div>
              </div>
            </td>

            <!-- Dosis -->
            <td>{{ m.dose || '—' }}</td>

            <!-- Frecuencia -->
            <td>
              <span class="chip">
                {{ m.frequency || 'Personalizada' }}
              </span>
            </td>

            <!-- Horarios -->
            <td>
              <span
                v-for="t in m.times"
                :key="t"
                class="pill"
              >
                {{ t }}
              </span>
            </td>

            <!-- Período -->
            <td>
              <div>{{ format(m.start) }}</div>
              <div class="sub">hasta {{ format(m.end) }}</div>

              <div v-if="isExpired(m.end)" class="badge-exp">
                Vencido
              </div>
            </td>

            <!-- Acciones -->
            <td class="acciones">
              <button
                class="icon-btn"
                title="Editar"
                @click="editar(m)"
              >
                <PencilSquareIcon class="icon" />
              </button>

              <button
                class="icon-btn danger"
                title="Eliminar"
                @click="eliminar(m.id)"
              >
                <TrashIcon class="icon" />
              </button>
            </td>
          </tr>

          <tr v-if="!meds.length && !loading && !error">
            <td colspan="6" class="sub">
              Tu botiquín está vacío. Añade el primero.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 🔹 Misma modal para agregar / editar -->
    <AddMedModal
      :open="openAdd"
      :editing="editingMed"
      @close="handleClose"
      @saved="onSaved"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import AddMedModal from "../components/AddMedModal.vue"

import {
  getMedicamentos as getMedicamentosFromAPI,
  deleteMedicamento as deleteMedicamentoFromAPI,
} from "../services/api"

import {
  getMeds,
  saveMeds,
  removeMed,
} from "../services/storage"

import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline"

const meds = ref([])
const openAdd = ref(false)
const loading = ref(false)
const error = ref("")

// 👉 aquí guardamos el medicamento que se está editando (o null si es nuevo)
const editingMed = ref(null)

function format(iso) {
  return iso ? new Date(iso).toLocaleDateString("es-MX") : "—"
}

function isExpired(endDate) {
  if (!endDate) return false
  const hoy = new Date()
  const fin = new Date(endDate)

  const todayOnly = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate()
  )
  const endOnly = new Date(
    fin.getFullYear(),
    fin.getMonth(),
    fin.getDate()
  )
  return endOnly < todayOnly
}

function mapDbToUi(row) {
  return {
    id: row.id,
    name: row.nombre,
    dose: row.dosis ?? "",
    frequency: row.frecuencia ?? "",
    times: (row.horarios ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    start: row.fecha_inicio ?? "",
    end: row.fecha_fin ?? "",
    note: row.nota ?? "",
    color: row.color ?? "", // por si luego lo guardas en BD
  }
}

async function cargar() {
  loading.value = true
  error.value = ""
  try {
    // 1️⃣ datos offline
    const offline = getMeds()
    if (offline.length > 0) {
      meds.value = offline
    }

    // 2️⃣ refrescar desde API
    const data = await getMedicamentosFromAPI()
    meds.value = data.map(mapDbToUi)

    // 3️⃣ guardar offline
    saveMeds(meds.value)
  } catch (e) {
    if (!meds.value.length) {
      error.value = e?.message || "No se pudo cargar la lista"
    }
  } finally {
    loading.value = false
  }
}

onMounted(cargar)

/* ============ ACCIONES ============ */

function nuevo() {
  editingMed.value = null
  openAdd.value = true
}

function editar(m) {
  // copiamos para no mutar la fila mientras editas
  editingMed.value = { ...m }
  openAdd.value = true
}

function handleClose() {
  openAdd.value = false
  editingMed.value = null
}

/**
 * Recibe el medicamento que emitió el modal.
 * Sirve tanto para crear como para editar.
 */
async function onSaved(uiMed) {
  if (!uiMed) {
    handleClose()
    return
  }

  const idx = meds.value.findIndex((m) => m.id === uiMed.id)

  if (idx !== -1) {
    // 🔁 Edición
    meds.value[idx] = uiMed
  } else {
    // ➕ Nuevo
    meds.value.push(uiMed)
  }

  // Persistimos en storage local
  saveMeds(meds.value)

  handleClose()
}

async function eliminar(id) {
  if (!confirm("¿Eliminar medicamento?")) return
  try {
    await deleteMedicamentoFromAPI(id)
    removeMed(id)
    meds.value = meds.value.filter((m) => m.id !== id)
    saveMeds(meds.value)
  } catch (e) {
    alert(e?.message || "No se pudo eliminar")
  }
}
</script>

<style scoped>
.wrap {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1rem 1.1rem 1.4rem;
}

.row {
  display: flex;
  gap: 1rem;
}

.center {
  align-items: center;
}

.between {
  justify-content: space-between;
}

/* Botón "Agregar Medicamento" */
.btn {
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.25);
  transition: 0.2s ease;
}

.btn:hover {
  background: #020617;
  transform: translateY(-1px);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.35);
}

.btn-icon-left {
  width: 18px;
  height: 18px;
}

/* Tabla */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.table th,
.table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  vertical-align: top;
}

.table th {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
}

.name {
  font-weight: 600;
}

.sub {
  color: #64748b;
  font-size: 0.875rem;
}

.pill {
  display: inline-block;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  margin-right: 0.35rem;
  margin-top: 0.25rem;
  font-size: 0.85rem;
}

.chip {
  background: #eef2ff;
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  font-size: 0.85rem;
}

/* Acciones */
.acciones {
  white-space: nowrap;
  display: flex;
  gap: 0.4rem;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: 0.2s ease;
}

.icon-btn:hover {
  background: #ffffff;
  border-color: #111827;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.icon-btn .icon {
  width: 20px;
  height: 20px;
  color: #111827;
}

.icon-btn.danger .icon {
  color: #b91c1c;
}

.icon-btn.danger:hover {
  background: #fee2e2;
  border-color: #b91c1c;
}

/* Nombre + color */
.name-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  margin-top: 0.25rem;
  border: 1px solid #e5e7eb;
}

/* Badge "Vencido" */
.badge-exp {
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 0.75rem;
  font-weight: 600;
}

/* ========== RESPONSIVE ========== */

/* Tablet - ocultar columnas menos importantes */
@media (max-width: 880px) {
  .table th:nth-child(4),
  .table td:nth-child(4) {
    display: none; /* Ocultar horarios en tablet */
  }

  .btn span {
    display: none; /* Solo mostrar ícono en botón agregar */
  }

  .btn {
    padding: 0.55rem 0.9rem;
  }
}

/* Mobile - convertir tabla a cards */
@media (max-width: 640px) {
  .wrap {
    margin: 1rem auto;
    padding: 0 0.75rem;
  }

  .card {
    padding: 1rem;
  }

  .row.between {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .row.between h2 {
    font-size: 1.3rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  /* Ocultar tabla, mostrar cards */
  .table {
    display: none;
  }

  /* Cards personalizadas para mobile */
  .table tbody {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .table tbody tr {
    display: flex;
    flex-direction: column;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1rem;
    gap: 0.75rem;
  }

  .table tbody td {
    display: block;
    border: none;
    padding: 0;
  }

  /* Añadir labels antes de cada dato */
  .table tbody td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #6b7280;
    font-size: 0.8rem;
    display: block;
    margin-bottom: 0.25rem;
  }

  .table tbody td:first-child::before {
    content: '💊 Medicamento';
  }

  .table tbody td:nth-child(2)::before {
    content: '💉 Dosis';
  }

  .table tbody td:nth-child(3)::before {
    content: '🔁 Frecuencia';
  }

  .table tbody td:nth-child(4)::before {
    content: '⏰ Horarios';
  }

  .table tbody td:nth-child(5)::before {
    content: '📅 Período';
  }

  .table tbody td:nth-child(6)::before {
    content: '⚙️ Acciones';
  }

  .acciones {
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .icon-btn {
    width: 44px;
    height: 44px; /* Better touch target */
  }

  .icon-btn .icon {
    width: 22px;
    height: 22px;
  }
}
</style>
