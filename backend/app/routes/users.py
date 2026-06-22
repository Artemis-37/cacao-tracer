# Routes - Users
from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
import jsonify
from flask import jsonify

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Obtenir un utilisateur"""
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict()), 200
