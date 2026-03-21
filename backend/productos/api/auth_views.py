# backend/productos/api/auth_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password

from productos.models import UsuarioRegistrado


def get_tokens_for_user(usuario):
    """Genera access y refresh token para un UsuarioRegistrado."""
    refresh = RefreshToken()
    refresh['user_id']  = usuario.id
    refresh['nombre']   = usuario.nombre
    refresh['correo']   = usuario.correo

    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }


class LoginView(APIView):
    authentication_classes = []  # sin auth requerida para hacer login
    permission_classes     = []

    def post(self, request):
        correo   = request.data.get("correo", "").strip().lower()
        password = request.data.get("password", "")

        if not correo or not password:
            return Response(
                {"detail": "Correo y contraseña son requeridos."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Buscar por hash
        correo_hash = UsuarioRegistrado.hash_email(correo)

        try:
            usuario = UsuarioRegistrado.objects.get(
                correo_hash=correo_hash,
                activo=True
            )
        except UsuarioRegistrado.DoesNotExist:
            return Response(
                {"detail": "Correo o contraseña incorrectos."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not check_password(password, usuario.password):
            return Response(
                {"detail": "Correo o contraseña incorrectos."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        tokens = get_tokens_for_user(usuario)

        return Response({
            "access":  tokens["access"],
            "refresh": tokens["refresh"],
            "usuario": {
                "id":     usuario.id,
                "nombre": usuario.nombre,
                "correo": usuario.correo,
            }
        }, status=status.HTTP_200_OK)


class RefreshView(APIView):
    authentication_classes = []
    permission_classes     = []

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token requerido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            refresh = RefreshToken(refresh_token)
            return Response({
                "access": str(refresh.access_token)
            })
        except Exception:
            return Response(
                {"detail": "Token inválido o expirado."},
                status=status.HTTP_401_UNAUTHORIZED
            )