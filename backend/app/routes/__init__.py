# Routes __init__
from app.routes.auth import auth_bp
from app.routes.users import users_bp
from app.routes.settings import settings_bp
from app.routes.operations import operations_bp
from app.routes.database import database_bp

__all__ = [
    'auth_bp',
    'users_bp',
    'settings_bp',
    'operations_bp',
    'database_bp'
]
