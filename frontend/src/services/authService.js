// frontend/src/services/authService.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export const authService = {
  // 🧾 REGISTRO DE USUARIO + PERFIL AUTOMÁTICO
  async register(email, password, nombre = '') {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    const user = data.user
    if (user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: user.id, nombre }
      ])
      if (profileError) console.error('Error creando perfil:', profileError)
    }
    return user
  },

  // 🔑 INICIO DE SESIÓN
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    const user = data.user
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }
    return user
  },

  // 🚪 CERRAR SESIÓN
  async logout() {
    await supabase.auth.signOut()
    localStorage.removeItem('user')
  },

  // 👤 OBTENER USUARIO ACTUAL (por si lo necesitas en algún sitio)
  async getUser() {
    const { data, error } = await supabase.auth.getSession()
    if (error) console.error(error)

    return data?.session?.user || JSON.parse(localStorage.getItem('user'))
  },

  // 🔄 ESCUCHAR CAMBIOS DE AUTENTICACIÓN
  onAuthChange(callback) {
    supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
      callback(user)
    })
  }
}

export { supabase }
