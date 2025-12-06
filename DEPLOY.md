# Guía de Deploy a Vercel

## Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Cuenta en [Supabase](https://supabase.com)
3. Vercel CLI instalado (`npm install -g vercel`)

## Pasos para Deploy

### 1. Conectar tu proyecto a Vercel

```bash
cd /ruta/a/MedicalKit
vercel login
vercel link
```

### 2. Configurar Variables de Entorno

Necesitas agregar las siguientes variables de entorno en el dashboard de Vercel o por CLI:

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
```

**O directamente en Vercel Dashboard:**
- Ve a tu proyecto en Vercel
- Settings > Environment Variables
- Agrega:
  - `SUPABASE_URL`: Tu URL de Supabase (ej: `https://xxxxx.supabase.co`)
  - `SUPABASE_KEY`: Tu service role key de Supabase (la clave privada, NO la anon key)

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
# Opción 1: Deploy automático con Git
git push origin main
# (Vercel hará deploy automáticamente)

# Opción 2: Deploy manual con CLI
vercel deploy --prod
```

### 6. Verificar el Deploy

- Frontend: `https://tu-proyecto.vercel.app`
- API Backend: `https://tu-proyecto.vercel.app/api`

## Variables de Entorno Requeridas

### En Vercel (Backend):
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=tu_service_role_key
NODE_ENV=production
```

### En Frontend (.env local):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

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
