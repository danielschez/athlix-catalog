# productos/api/serializers.py
import requests as http_requests
from rest_framework import serializers
from productos.models import (
    UsuarioRegistrado, Categoria, Talla,
    Producto, Pedido, DetallePedido
)
from django.conf import settings


class UsuarioRegistradoSerializer(serializers.ModelSerializer):
    nombre   = serializers.CharField()
    correo   = serializers.EmailField()
    telefono = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)
    captcha  = serializers.CharField(write_only=True, required=False)  # ← opcional para no romper el admin

    class Meta:
        model  = UsuarioRegistrado
        fields = (
            "id", "nombre", "correo", "telefono",
            "password", "captcha",               # ← captcha incluido en fields
            "activo", "creado"
        )
        read_only_fields = ("id", "creado")

    def validate_captcha(self, token):
        """Verifica el token con Google solo si viene en la request."""
        if not token:
            return token

        secret = getattr(settings, "RECAPTCHA_SECRET_KEY", None)
        if not secret:
            return token  # si no hay clave configurada no bloquea

        res    = http_requests.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={"secret": secret, "response": token},
            timeout=5,
        )
        result = res.json()

        if not result.get("success"):
            raise serializers.ValidationError("Captcha inválido. Intenta de nuevo.")

        return token

    def validate(self, data):
        # Validar correo único
        correo_hash = UsuarioRegistrado.hash_email(data.get("correo", ""))
        qs = UsuarioRegistrado.objects.filter(correo_hash=correo_hash)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError({"correo": "Este correo ya está registrado."})

        # Validar teléfono único
        telefono = data.get("telefono", "")
        if telefono:
            telefono_hash = UsuarioRegistrado.hash_phone(telefono)
            qs2 = UsuarioRegistrado.objects.filter(telefono_hash=telefono_hash)
            if self.instance:
                qs2 = qs2.exclude(pk=self.instance.pk)
            if qs2.exists():
                raise serializers.ValidationError({"telefono": "Este teléfono ya está registrado."})

        return data

    def create(self, validated_data):
        validated_data.pop("captcha", None)  # ← no se guarda en la DB
        obj          = UsuarioRegistrado()
        obj.nombre   = validated_data["nombre"]
        obj.correo   = validated_data["correo"]
        obj.telefono = validated_data.get("telefono", "")
        obj.password = validated_data["password"]
        obj.activo   = validated_data.get("activo", True)
        obj.save()
        return obj

    def update(self, instance, validated_data):
        validated_data.pop("captcha", None)  # ← no se guarda en la DB
        instance.nombre   = validated_data.get("nombre",   instance.nombre)
        instance.correo   = validated_data.get("correo",   instance.correo)
        instance.telefono = validated_data.get("telefono", instance.telefono)
        instance.activo   = validated_data.get("activo",   instance.activo)

        pwd = validated_data.get("password")
        if pwd:
            instance.password = pwd

        instance.save()
        return instance


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Categoria
        fields = "__all__"


class TallaSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Talla
        fields = "__all__"


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Producto
        fields = "__all__"


class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Pedido
        fields = "__all__"


class DetallePedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DetallePedido
        fields = "__all__"