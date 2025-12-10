<template>
  <main class="auth-page">
    <section class="auth-card">
      <div class="auth-header">
        <div class="badge">
          <KeyIcon class="badge-icon" />
        </div>
        <h1>Iniciar sesión</h1>
        <p class="subtitle">
          Accede a tu botiquín y gestiona tus medicamentos en cualquier momento.
        </p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="field">
          <label for="email">Correo electrónico</label>
          <div class="field-input">
            <EnvelopeIcon class="field-icon" />
            <input
              id="email"
              v-model.trim="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>
        </div>

        <div class="field">
          <label for="password">Contraseña</label>
          <div class="field-input">
            <LockClosedIcon class="field-icon" />
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              class="field-toggle"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Ocultar' : 'Ver' }}
            </button>
          </div>
        </div>

        <p v-if="error" class="error-msg">
          {{ error }}
        </p>

        <button
          class="btn btn-primary"
          type="submit"
          :disabled="loading"
        >
          <span v-if="!loading">Entrar</span>
          <span v-else>Entrando...</span>
        </button>

        <p class="helper">
          ¿No tienes cuenta?
          <RouterLink to="/registro">Regístrate aquí</RouterLink>
        </p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { userStore } from '../store/userStore'
import {
  KeyIcon,
  EnvelopeIcon,
  LockClosedIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    const user = await authService.login(email.value, password.value)

    // 🔹 sincroniza el store al instante (sin recargar)
    if (user) {
      userStore.login(user)
    }

    // 🔹 redirige al inicio
    router.push({ name: 'inicio' })
  } catch (e) {
    console.error(e)
    error.value =
      e?.message ||
      'No se pudo iniciar sesión. Verifica tus datos e inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem 3rem;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 24px;
  padding: 2.1rem 2rem 2rem;
  box-shadow: 0 26px 60px rgba(15, 23, 42, 0.18);
  border: 1px solid #e5e7eb;
}

.auth-header {
  text-align: center;
  margin-bottom: 1.7rem;
}

.badge {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.9rem;
}

.badge-icon {
  width: 26px;
  height: 26px;
  color: #111827;
}

h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #111827;
}

.subtitle {
  font-size: 0.95rem;
  color: #6b7280;
}

/* Formulario */
.auth-form {
  display: grid;
  gap: 1.1rem;
}

.field {
  display: grid;
  gap: 0.35rem;
}

.field label {
  font-size: 0.88rem;
  font-weight: 500;
  color: #374151;
}

.field-input {
  position: relative;
  display: flex;
  align-items: center;
}

.field-input input {
  width: 100%;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  padding: 0.65rem 0.9rem;
  padding-left: 2.3rem;
  padding-right: 4rem;
  font-size: 0.95rem;
  outline: none;
  background: #f9fafb;
  transition: border-color 0.15s ease, box-shadow 0.15s ease,
    background 0.15s ease;
}

.field-input input:focus {
  border-color: #111827;
  background: #ffffff;
  box-shadow: 0 0 0 1px #11182726;
}

.field-icon {
  position: absolute;
  left: 0.75rem;
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.field-toggle {
  position: absolute;
  right: 0.9rem;
  border: none;
  background: transparent;
  font-size: 0.78rem;
  color: #4b5563;
  cursor: pointer;
}

/* Botón */
.btn {
  border-radius: 999px;
  padding: 0.7rem 1.4rem;
  font-size: 0.96rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-primary {
  margin-top: 0.4rem;
  width: 100%;
  background: #111827;
  color: #f9fafb;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.4);
}

.btn-primary:hover:not(:disabled) {
  background: #020617;
  transform: translateY(-1px);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.5);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: default;
  box-shadow: none;
}

/* Errores y helper */
.error-msg {
  font-size: 0.86rem;
  color: #b91c1c;
}

.helper {
  margin-top: 0.4rem;
  font-size: 0.88rem;
  color: #6b7280;
  text-align: center;
}

.helper a {
  color: #111827;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Responsive */
@media (max-width: 640px) {
  .auth-page {
    padding: 1.5rem 0.75rem 2rem;
  }

  .auth-card {
    padding: 1.75rem 1.25rem;
    border-radius: 20px;
  }

  h1 {
    font-size: 1.4rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  /* Prevenir zoom en iOS */
  .field-input input {
    font-size: 16px !important;
  }

  .badge {
    width: 48px;
    height: 48px;
  }

  .badge-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
