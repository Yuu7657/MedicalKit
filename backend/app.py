# backend/app.py

from flask import Flask, jsonify
from flask_cors import CORS

# Cliente global de Supabase (ya inicializado en supabase_client.py)
from supabase_client import supabase
from routes.medicamentos import medicamentos_bp  # Blueprint de medicamentos

app = Flask(__name__)

# Permitir peticiones desde tu PWA (Vite en localhost:5174)
CORS(app)

# Registra el Blueprint de medicamentos en /medicamentos
app.register_blueprint(medicamentos_bp, url_prefix='/medicamentos')


@app.route('/')
def home():
    return jsonify({
        "status": "OK",
        "message": "API Flask + Supabase lista ✅"
    })


@app.route('/api/test', methods=['GET'])
def test_conexion():
    """
    Endpoint sencillo para probar la conexión a Supabase.
    """
    try:
        response = supabase.table('medicamentos').select('*').limit(1).execute()
        return jsonify({
            "conexion": "exitosa",
            "data": response.data
        }), 200
    except Exception as e:
        return jsonify({
            "conexion": "fallida",
            "error": str(e)
        }), 500


if __name__ == '__main__':
    print("🚀 Iniciando servidor en http://127.0.0.1:5000 ...")
    app.run(debug=True, port=5000)
