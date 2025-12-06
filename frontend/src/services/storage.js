// src/services/storage.js

const K_MEDS = 'meds'
const K_NOTI = 'notifications_enabled'
const K_SYNC = 'last_sync'

// Obtener medicamentos desde IndexedDB
export function getMeds() {
  try { return JSON.parse(localStorage.getItem(K_MEDS) ?? '[]') } catch { return [] }
}

// Guardar medicamentos en IndexedDB
export function saveMeds(meds) { 
  localStorage.setItem(K_MEDS, JSON.stringify(meds)) 
}

// Agregar un medicamento
export function addMed(m) { 
  const arr = getMeds(); 
  arr.push(m); 
  saveMeds(arr) 
}

// Actualizar medicamento
export function updateMed(id, patch) {
  saveMeds(getMeds().map(m => m.id === id ? { ...m, ...patch } : m))
}

// Eliminar un medicamento
export function removeMed(id) { 
  saveMeds(getMeds().filter(m => m.id !== id)) 
}

// Configuración de notificaciones
export function setNotificationsEnabled(v) { 
  localStorage.setItem(K_NOTI, JSON.stringify(!!v)) 
}
export function getNotificationsEnabled() { 
  return JSON.parse(localStorage.getItem(K_NOTI) ?? 'false') 
}

// Última sincronización
export function setLastSync(ts = Date.now()) { 
  localStorage.setItem(K_SYNC, String(ts)) 
}
export function getLastSync() { 
  return Number(localStorage.getItem(K_SYNC) ?? 0) 
}

// Sincronización con el backend
export async function syncWithBackend() {
  try {
    const res = await fetch('/api/meds')
    if (!res.ok) throw new Error('Network error')
    const meds = await res.json()
    saveMeds(meds)
    setLastSync()
    return { ok: true }
  } catch (e) {
    return { ok: false, reason: String(e) }
  }
}
