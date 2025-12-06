// src/services/medicamentosService.js

export async function obtenerMedicamentos() {
  const res = await fetch('http://localhost:5000/medicamentos');
  if (!res.ok) {
    throw new Error('Error al obtener los medicamentos');
  }
  return await res.json();
}

export async function agregarMedicamento(medicamento) {
  const res = await fetch('http://localhost:5000/medicamentos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(medicamento),
  });

  if (!res.ok) {
    throw new Error('Error al agregar medicamento');
  }

  return await res.json();
}

export async function editarMedicamento(id, medicamento) {
  const res = await fetch(`http://localhost:5000/medicamentos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(medicamento),
  });

  if (!res.ok) {
    throw new Error('Error al editar medicamento');
  }

  return await res.json();
}

export async function eliminarMedicamento(id) {
  const res = await fetch(`http://localhost:5000/medicamentos/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Error al eliminar medicamento');
  }

  return await res.json();
}
