# backend/routes/medicamentos.py

from flask import Blueprint, jsonify, request
from supabase_client import supabase  # Cliente global de Supabase

medicamentos_bp = Blueprint('medicamentos', __name__)


# GET: Obtener todos los medicamentos (opcionalmente por user_id)
@medicamentos_bp.route('/', methods=['GET'])
def obtener_medicamentos():
    try:
        user_id = request.args.get('user_id')  # opcional

        query = supabase.table('medicamentos').select('*')
        if user_id:
            query = query.eq('user_id', user_id)

        response = query.execute()
        data = response.data or []

        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# POST: Agregar un nuevo medicamento
@medicamentos_bp.route('/', methods=['POST'])
def agregar_medicamento():
    try:
        nuevo = request.get_json() or {}

        if not nuevo.get('nombre'):
            return jsonify({"error": "El nombre del medicamento es obligatorio"}), 400

        response = supabase.table('medicamentos').insert(nuevo).execute()
        data = response.data

        if data:
            # Supabase devuelve una lista con el registro creado
            return jsonify(data), 201
        else:
            return jsonify({"error": "No se pudo agregar el medicamento"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# PUT: Editar un medicamento existente
@medicamentos_bp.route('/<int:id>', methods=['PUT'])
def editar_medicamento(id: int):
    try:
        datos = request.get_json() or {}

        response = (
            supabase
            .table('medicamentos')
            .update(datos)
            .eq('id', id)
            .execute()
        )
        data = response.data

        if data:
            return jsonify(data), 200
        else:
            return jsonify({"error": "Medicamento no encontrado o no se pudo actualizar"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# DELETE: Eliminar un medicamento
@medicamentos_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_medicamento(id: int):
    try:
        response = (
            supabase
            .table('medicamentos')
            .delete()
            .eq('id', id)
            .execute()
        )
        data = response.data

        if data:
            return jsonify({"mensaje": "Medicamento eliminado"}), 200
        else:
            return jsonify({"error": "Medicamento no encontrado o no se pudo eliminar"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
