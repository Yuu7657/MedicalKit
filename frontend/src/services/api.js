// frontend/src/services/api.js

// URL base de tu backend Flask
const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

// OJO: la ruta real en Flask es /medicamentos/  → con slash final
const BASE = `${API}/medicamentos/`

// READ – listar medicamentos
export async function getMedicamentos() {
  const r = await fetch(BASE)
  if (!r.ok) throw new Error('No se pudo listar medicamentos')
  return r.json()
}

// CREATE – agregar medicamento
export async function addMedicamento(body) {
  const r = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error('No se pudo crear el medicamento')
  return r.json()
}

// UPDATE – editar medicamento
export async function updateMedicamento(id, body) {
  const r = await fetch(`${BASE}${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error('No se pudo actualizar el medicamento')
  return r.json()
}

// DELETE – eliminar medicamento
export async function deleteMedicamento(id) {
  const r = await fetch(`${BASE}${id}`, { method: 'DELETE' })
  if (!r.ok) throw new Error('No se pudo eliminar el medicamento')
  return r.json()
}
