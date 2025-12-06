from supabase import create_client, Client
from dotenv import load_dotenv
import os

def init_supabase() -> Client:
    """Inicializa el cliente de Supabase leyendo las variables del .env."""
    load_dotenv()

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise ValueError("⚠️ Variables de entorno no encontradas. Verifica tu archivo .env")

    print("✅ Supabase configurado correctamente.")
    return create_client(url, key)

# 👇 Cliente global, único para todo el backend
supabase: Client = init_supabase()


# --- Funciones helper opcionales (por si las quieres usar en otros lugares) ---

def get_medicamentos():
    response = supabase.table('medicamentos').select('*').execute()
    return response.data

def get_medicamento_by_id(medicamento_id):
    response = supabase.table('medicamentos').select('*').eq('id', medicamento_id).execute()
    return response.data

def add_medicamento(nombre, dosis, frecuencia, horarios, fecha_inicio, fecha_fin, nota, user_id, nombre_id):
    response = supabase.table('medicamentos').insert({
        'nombre': nombre,
        'dosis': dosis,
        'frecuencia': frecuencia,
        'horarios': horarios,
        'fecha_inicio': fecha_inicio,
        'fecha_fin': fecha_fin,
        'nota': nota,
        'user_id': user_id,
        'nombre_id': nombre_id
    }).execute()
    return response.data

def add_notificacion(user_id, medicamento_id):
    response = supabase.table('notificaciones').insert({
        'user_id': user_id,
        'medicamento_id': medicamento_id,
        'enabled': True,
        'created_at': "now()"
    }).execute()
    return response.data

def get_notificaciones_by_user_id(user_id):
    response = supabase.table('notificaciones').select('*').eq('user_id', user_id).execute()
    return response.data

def add_profile(user_id, nombre, edad, rol="usuario"):
    response = supabase.table('profiles').insert({
        'id': user_id,
        'nombre': nombre,
        'edad': edad,
        'rol': rol,
        'created_at': "now()"
    }).execute()
    return response.data
