# MedicalKit 🏥

Aplicación de gestión de medicamentos con Vue.js y Flask.

## 📁 Estructura del Proyecto

```
MedicalKit/
├── frontend/          # Aplicación Vue.js 3 + Vite
├── backend/           # API Flask + Supabase
├── vercel.json        # Configuración de deploy
└── README.md          # Este archivo
```

## 🚀 Instalación y Configuración

### Backend

1. Navega al directorio backend:
```bash
cd backend
```

2. Crea un entorno virtual:
```bash
python -m venv venv
source venv/Scripts/activate  # En Windows
source venv/bin/activate      # En Linux/Mac
```

3. Instala las dependencias:
```bash
pip install -r requirements.txt
```

4. Configura las variables de entorno:
Crea un archivo `.env` en la carpeta `backend/` con:
```
SUPABASE_URL=tu_url_supabase
SUPABASE_KEY=tu_clave_supabase
```

5. Ejecuta el servidor:
```bash
python app.py
```

### Frontend

1. Navega al directorio frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la carpeta `frontend/` con:
```
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_publica_supabase
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

## 🗄️ Base de Datos (Supabase)

Este proyecto utiliza **Supabase** como base de datos y backend. 

### Tablas Necesarias

Crea la siguiente tabla en Supabase:

```sql
CREATE TABLE medicamentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  dosis VARCHAR(100),
  frecuencia VARCHAR(100),
  fecha_inicio DATE,
  fecha_fin DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Credenciales

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Obtén tu `SUPABASE_URL` y `SUPABASE_KEY` (anon key)
4. Configura estos valores en los archivos `.env` tanto del frontend como del backend

## 🛠️ Scripts Disponibles

### Frontend
- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Vista previa del build

### Backend
- `python app.py` - Inicia el servidor Flask

## 📦 Dependencias Principales

### Frontend
- Vue.js 3
- Vue Router 4
- Vite
- Supabase JS
- Tailwind CSS

### Backend
- Flask
- Supabase Python
- python-dotenv

## 🚢 Deploy

### Frontend (Vercel)
El frontend está configurado para deployarse en Vercel automáticamente al hacer push a la rama `main`.

### Backend
Puedes deployar el backend en plataformas como:
- Render
- Railway
- Heroku
- Google Cloud Run

## 📝 Notas Importantes

- **No subas archivos `.env` a GitHub** - Estos contienen credenciales sensibles
- Las variables de entorno deben configurarse en los servicios de deploy (Vercel, Render, etc.)
- Asegúrate de que tu base de datos Supabase esté configurada con las políticas de seguridad adecuadas

## 📄 Licencia

Este proyecto es privado.
