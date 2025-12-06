# Guía de Deploy a Vercel + Render

## Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com) - para el Frontend
2. Cuenta en [Render](https://render.com) - para el Backend Python
3. Cuenta en [Supabase](https://supabase.com) - para la Base de Datos
4. Vercel CLI instalado (`npm install -g vercel`)

## PARTE 1: Deploy del Frontend en Vercel

### 1. Conectar tu proyecto a Vercel

```bash
cd /ruta/a/MedicalKit
vercel login
vercel link
```

Vercel automáticamente detectará que es un monorepo con frontend en `frontend/` y lo deployará.

### 2. El Frontend estará en:
```
https://tu-proyecto.vercel.app
```

---

## PARTE 2: Deploy del Backend en Render

### 1. Crear un nuevo servicio en Render

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Dashboard > New + > Web Service
3. Conecta tu repositorio GitHub (https://github.com/Yuu7657/MedicalKit)
4. Configura:
   - **Name**: `medicalkit-api` (o el que prefieras)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn backend.app:app`
   - **Plan**: Free (o Starter si necesitas mejor rendimiento)

### 2. Configurar Variables de Entorno en Render

En el dashboard del servicio > Environment:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=tu_service_role_key
```

### 3. El Backend estará en:
```
https://medicalkit-api.onrender.com
```

---

## PARTE 3: Configurar Variables de Entorno

### En Frontend (archivo `.env` local):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_API_URL=https://medicalkit-api.onrender.com
```

### En Backend (Render Dashboard):
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=tu_service_role_key
```

### 3. Configurar tu Base de Datos en Supabase

#### Crear tabla medicamentos:

En tu proyecto Supabase, ejecuta este SQL en el SQL editor:

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

-- Habilitar RLS (Row Level Security)
ALTER TABLE medicamentos ENABLE ROW LEVEL SECURITY;

-- Política para que cada usuario vea solo sus medicamentos
CREATE POLICY "Users can view their own medicamentos"
  ON medicamentos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medicamentos"
  ON medicamentos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medicamentos"
  ON medicamentos
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medicamentos"
  ON medicamentos
  FOR DELETE
  USING (auth.uid() = user_id);
```

### 4. Obtener tus credenciales de Supabase

1. Ve a tu proyecto en Supabase
2. Settings > API
3. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **Service Role Secret** → `SUPABASE_KEY` (para el backend)
   - **Anon Public Key** → para el frontend (ya está en `.env`)

### 5. Hacer Deploy

```bash
git push origin main
```

Ambos servicios (Vercel y Render) harán deploy automáticamente.

### 6. Verificar el Deploy

- Frontend: `https://tu-proyecto.vercel.app`
- Backend API: `https://medicalkit-api.onrender.com`

## Solución de Problemas

### Error: "Cannot find module 'supabase_client'"
- Asegúrate que `supabase_client.py` está en la carpeta `backend/`
- Verifica que el archivo tiene las importaciones correctas

### Error: "SUPABASE_URL not found"
- Verifica que las variables de entorno están configuradas en Vercel
- Usa `vercel env ls` para listar las variables

### Error en la BD: "Table does not exist"
- Crea la tabla `medicamentos` siguiendo el SQL arriba
- Verifica que tu `SUPABASE_KEY` es una service role key, no la anon key

## Estructura de Archivos para Deploy

```
MedicalKit/
├── api/
│   └── index.py          # Punto de entrada de Vercel para Python
├── backend/
│   ├── app.py            # Aplicación Flask
│   ├── supabase_client.py
│   ├── models/
│   ├── routes/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── dist/             # Se genera durante el build
├── vercel.json           # Configuración de Vercel
├── requirements.txt      # Dependencias Python (raíz)
└── .vercelignore
```

## Monitoreo

En el dashboard de Vercel puedes:
- Ver logs en tiempo real: `vercel logs`
- Desplegar cambios: `git push origin main`
- Rollback: click en "Rollback" en el dashboard

¡Listo! Tu proyecto MedicalKit estará disponible en línea con base de datos funcional.
