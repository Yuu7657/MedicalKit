// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '../store/userStore'

// Vistas principales
import Inicio from '../views/Inicio.vue'
import Calendario from '../views/Calendario.vue'
import Medicamentos from '../views/Medicamentos.vue'
import Configuracion from '../views/Configuracion.vue'

// Lazy load de vistas secundarias
const Login = () => import('../views/Login.vue')
const Registro = () => import('../views/Register.vue')
const NotFound = () => import('../views/NotFound.vue')

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: Inicio,
    meta: {
      title: 'Inicio | MedicalKit',
      requiresAuth: true
    }
  },
  { path: '/login', name: 'login', component: Login, meta: { title: 'Iniciar Sesión | MedicalKit' } },
  { path: '/registro', name: 'registro', component: Registro, meta: { title: 'Crear Cuenta | MedicalKit' } },

  {
    path: '/calendario',
    name: 'calendario',
    component: Calendario,
    meta: { title: 'Calendario | MedicalKit', requiresAuth: true }
  },
  {
    path: '/medicamentos',
    name: 'medicamentos',
    component: Medicamentos,
    meta: { title: 'Medicamentos | MedicalKit', requiresAuth: true }
  },
  {
    path: '/notificaciones',
    name: 'notificaciones',
    component: Configuracion,
    meta: { title: 'Notificaciones | MedicalKit', requiresAuth: true }
  },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: 'Página no encontrada | MedicalKit' } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

// 🔐 Middleware global: protege rutas y evita bucles
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'MedicalKit'

  const logged = userStore.isLogged()

  // Rutas privadas
  if (to.meta.requiresAuth && !logged) {
    return next({ name: 'login' })
  }

  // Evitar que usuarios autenticados vayan a login/registro
  if ((to.name === 'login' || to.name === 'registro') && logged) {
    return next({ name: 'inicio' })
  }

  next()
})

export default router
