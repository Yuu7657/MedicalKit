from backend.app import app

# Vercel espera una aplicación WSGI
# La aplicación Flask se ejecutará como función serverless

# Exponer la aplicación Flask para Vercel
app = app
