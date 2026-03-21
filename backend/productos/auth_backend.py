# backend/productos/auth_backend.py
from django.contrib.auth.hashers import check_password
from productos.models import UsuarioRegistrado


class UsuarioRegistradoBackend:
    """
    Backend de autenticación para UsuarioRegistrado.
    Busca por correo_hash y verifica la contraseña.
    """

    def authenticate(self, request, correo=None, password=None):
        if not correo or not password:
            return None

        correo_hash = UsuarioRegistrado.hash_email(correo)

        try:
            usuario = UsuarioRegistrado.objects.get(
                correo_hash=correo_hash,
                activo=True
            )
        except UsuarioRegistrado.DoesNotExist:
            return None

        if check_password(password, usuario.password):
            return usuario

        return None

    def get_user(self, user_id):
        try:
            return UsuarioRegistrado.objects.get(pk=user_id)
        except UsuarioRegistrado.DoesNotExist:
            return None