import sys
import os

# Obtener rutas correctas para Vercel
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, 'backend')

# Agregar directorios a la ruta de Python
sys.path.insert(0, root_dir)
sys.path.insert(0, backend_dir)

# Importar la aplicación Flask
from backend.app import app

# Vercel ejecutará esto como función serverless WSGI
