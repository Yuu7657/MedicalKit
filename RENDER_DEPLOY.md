# 🚀 Deployar Backend en Render

## Paso 1: Crear Cuenta en Render

1. Ve a https://render.com
2. Haz clic en "Sign up"
3. Usa GitHub para registrarte (más fácil)

## Paso 2: Conectar el Repositorio

1. Dashboard de Render
2. Click en "New +" (arriba a la derecha)
3. Selecciona "Web Service"
4. Selecciona "MedicalKit" en la lista de repositorios
5. Si no aparece, autoriza a Render acceder a tu GitHub

## Paso 3: Configurar el Servicio

**Rellena los siguientes campos:**

- **Name**: `medicalkit-api` (o como prefieras)
- **Environment**: `Python 3`
- **Region**: Elige la más cercana a ti (ej: Frankfurt, Ohio, etc.)
- **Branch**: `main`

**Build Command:**
```
pip install -r requirements.txt
```

**Start Command:**
```
gunicorn backend.app:app
```

## Paso 4: Agregar Variables de Entorno

Antes de hacer clic en "Create Web Service", desplaza hacia abajo y busca "Environment":

Agrega dos variables:

```
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_KEY = tu_service_role_key
```

(Reemplaza con tus valores reales de Supabase)

## Paso 5: Crear el Servicio

Haz clic en "Create Web Service"

**Espera 2-5 minutos** mientras Render:
- Clona tu repositorio
- Instala dependencias
- Inicia la aplicación

## Paso 6: Verificar que Funciona

Una vez que aparezca "Live", ve a la URL que Render te proporciona (algo como `https://medicalkit-api.onrender.com`).

Deberías ver algo como:
```
{"status": "ok"}
```

O puedes probar el endpoint de medicamentos:
```
https://medicalkit-api.onrender.com/medicamentos
```

## Paso 7: Conectar el Frontend

Ahora necesitas actualizar tu Frontend en Vercel para que conozca la URL del backend.

**En Vercel Dashboard:**

1. Ve a tu proyecto `medical-kit`
2. Settings > Environment Variables
3. Agrega:
   ```
   VITE_API_URL = https://medicalkit-api.onrender.com
   ```
4. Haz clic en "Save"
5. Click en "Redeploy" o espera a que redeploy automáticamente

## ✅ Verificación Final

Abre tu frontend:
```
https://medical-qfka0s120-ricardos-projects-9cae99c0.vercel.app
```

Intenta:
1. Registrarte
2. Agregar un medicamento
3. Verificar que aparece en la lista

Si funciona, ¡todo está listo! 🎉

## 🆘 Troubleshooting

### "Build failed"
- Verifica que `requirements.txt` tiene todas las dependencias
- Revisa los logs en Render Dashboard

### "Cannot connect to Supabase"
- Verifica que copiaste la `SUPABASE_KEY` correctamente (debe ser Service Role Key)
- Verifica que las variables están en Render Environment

### "API returns 500"
- Abre los logs en Render: Dashboard > Logs
- Busca el error específico

### "Frontend cannot reach API"
- Verifica que `VITE_API_URL` está correcto en Vercel
- Abre la consola del navegador (F12) y busca errores CORS

## 📝 Notas Importantes

- Render puede "hibernar" si no recibe tráfico por 15 minutos (en plan gratuito)
- Primera petición después de hibernar puede tardar 30 segundos
- Para evitar esto, actualiza a plan de pago (desde $7/mes)
- Los logs se guardan por 7 días en plan gratuito

¡Una vez completes esto, tu aplicación estará completamente funcional en línea! 🚀
