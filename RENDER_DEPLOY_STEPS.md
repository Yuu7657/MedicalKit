# Desplegar Backend en Render

## Pasos:

### 1. Crea cuenta en Render
- Ve a https://render.com
- Haz login con GitHub

### 2. Crea nuevo Web Service
- Click en "New +" → "Web Service"
- Conecta repositorio `Yuu7657/MedicalKit`

### 3. Configura el servicio

**Nombre**: `medicalkit-api`

**Root Directory**: (dejar vacío - detecta automáticamente)

**Environment**: `Python 3`

**Build Command**:
```
pip install -r requirements.txt
```

**Start Command**:
```
gunicorn backend.app:app
```

### 4. Agrega variables de entorno

En "Environment Variables", agrega:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `https://znplepwwgpfyvhjshwff.supabase.co` |
| `SUPABASE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucGxlcHd3Z3BmeXZoanNod2ZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY5MzQ3OSwiZXhwIjoyMDc3MjY5NDc5fQ.ZQzWp8hNc-5Nli9E3s8r-Gsv4SXhH8C8sKqB9OTtTaE` |

### 5. Deploy

- Click en "Create Web Service"
- Espera 5-10 minutos por el deploy inicial
- Tu URL será: `https://medicalkit-api.onrender.com`

### 6. Verifica que funciona

Haz una request GET a: `https://medicalkit-api.onrender.com/medicamentos/`

Deberías recibir:
```json
[]
```
(vacío porque aún no hay medicamentos en la tabla)

## Próximos pasos:

1. Crear tabla `medicamentos` en Supabase (ver SETUP_FINAL.md)
2. Redeploy del frontend en Vercel con la URL del backend
3. Probar conexión completa

