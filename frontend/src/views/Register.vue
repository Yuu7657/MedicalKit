<template>
  <div class="register-container">
    <h2>Crear Cuenta</h2>

    <form @submit.prevent="registerUser">
      <input v-model="email" type="email" placeholder="Correo electrónico" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirmar contraseña" required />

      <button type="submit" :disabled="loading">
        {{ loading ? 'Creando cuenta...' : 'Registrarse' }}
      </button>

      <p class="small">
        ¿Ya tienes una cuenta?
        <RouterLink to="/login">Inicia sesión aquí</RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden.')
    return
  }

  try {
    loading.value = true
    await authService.register(email.value, password.value)
    alert('Cuenta creada con éxito. Revisa tu correo para verificarla.')
    router.push('/login')
  } catch (error) {
    alert('Error al registrarse: ' + error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
}

h2 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
}

button:hover {
  background: #059669;
}

button:disabled {
  background: #a7f3d0;
  cursor: not-allowed;
}

.small {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #64748b;
}
</style>
