<template>
  <div class="notfound">
    <h1>😕 Página no encontrada</h1>
    <p>La ruta que intentas visitar no existe o fue movida.</p>

    <router-link to="/" class="btn">Volver al inicio</router-link>
  </div>
</template>

<script setup>
// No necesita lógica especial, solo navegación
</script>

<style scoped>
.notfound {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  color: #f1f5f9;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  font-family: 'Inter', sans-serif;
}

h1 {
  font-size: 2.5rem;
  color: #38bdf8;
  margin-bottom: 0.5rem;
}

p {
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.btn {
  background: #38bdf8;
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.4rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
}

.btn:hover {
  background: #0ea5e9;
}
</style>
