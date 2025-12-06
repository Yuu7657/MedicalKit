# ✅ Frontend Deployed - Próximos Pasos

## Estado Actual
- ✅ **Frontend**: Deployado en Vercel
  - URL: https://medical-dseqrl26r-ricardos-projects-9cae99c0.vercel.app
  - Rama: main (auto-sincronización con GitHub)

## 🔧 Próximos Pasos (Manual)

### 1. Crear y configurar Base de Datos en Supabase

**Crear tabla medicamentos:**

Ve a tu proyecto Supabase > SQL Editor y ejecuta:

```sql
CREATE TABLE medicamentos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  dosis VARCHAR(100),
  frecuencia VARCHAR(100),
  fecha_inicio DATE,
  fecha_fin DATE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS
ALTER TABLE medicamentos ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Users can view their own medicamentos"
  ON medicamentos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medicamentos"
  ON medicamentos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medicamentos"
  ON medicamentos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medicamentos"
  ON medicamentos FOR DELETE
  USING (auth.uid() = user_id);
```

### 2. Obtener Credenciales de Supabase

En tu proyecto Supabase > Settings > API:
- Copia **Project URL** → será tu `SUPABASE_URL`
- Copia **Service Role Secret** → será tu `SUPABASE_KEY` (para backend)
- Copia **Anon Public Key** → ya está en el frontend

### 3. Deployar Backend en Render

1. Ve a https://render.com y crea cuenta
2. Click en "New +" > "Web Service"
3. Conecta tu repositorio: https://github.com/Yuu7657/MedicalKit
4. Configura:
   - **Name**: `medicalkit-api`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn backend.app:app`
   - **Region**: Elige la más cercana
5. Click en "Create Web Service"

### 4. Configurar Variables de Entorno en Render

En tu servicio de Render:
1. Settings > Environment
2. Agrega estas variables:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=tu_service_role_key
   ```
3. Click en "Deploy"

### 5. Actualizar Frontend para conectar con Backend

Tu frontend en Vercel necesita conocer la URL del backend de Render.

**En Vercel Dashboard:**
1. Ve a tu proyecto > Settings > Environment Variables
2. Agrega:
   ```
   VITE_API_URL=https://medicalkit-api.onrender.com
   ```
3. Redeploy automáticamente

### 6. Verificar que Todo Funciona

- **Frontend**: https://medical-dseqrl26r-ricardos-projects-9cae99c0.vercel.app
- **Backend**: https://medicalkit-api.onrender.com
- **Base de Datos**: Supabase

**Prueba:**
1. Abre el frontend
2. Intenta agregar un medicamento
3. Verifica que se guarda en la BD

## 📋 Checklist

- [ ] Tabla `medicamentos` creada en Supabase
- [ ] Credenciales de Supabase obtenidas
- [ ] Proyecto creado en Render
- [ ] Variables de entorno configuradas en Render
- [ ] Backend deployado sin errores
- [ ] `VITE_API_URL` configurada en Vercel
- [ ] Frontend rediployado
- [ ] Todo funciona correctamente

## 🆘 Solución de Problemas

**Error: "Cannot connect to API"**
- Verifica que `VITE_API_URL` esté configurada en Vercel
- Espera a que Render termine el deploy inicial (puede tomar 1-2 min)

**Error: "Table medicamentos not found"**
- Verifica que creaste la tabla con el SQL anterior
- Revisa que el nombre de la tabla es exactamente `medicamentos`

**Error: "SUPABASE_KEY not found"**
- Verifica que agregaste las variables en Render Environment
- Usa la **Service Role Secret**, no la Anon Key

---

¡Una vez completes estos pasos, tu aplicación estará completamente funcional en línea! 🚀
