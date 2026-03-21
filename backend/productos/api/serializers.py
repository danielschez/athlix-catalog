# productos/api/serializers.py
from rest_framework import serializers
from productos.models import (
    UsuarioRegistrado, Categoria, Talla,
    Producto, Pedido, DetallePedido
)


class UsuarioRegistradoSerializer(serializers.ModelSerializer):
    nombre   = serializers.CharField()
    correo   = serializers.EmailField()
    telefono = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model  = UsuarioRegistrado
        fields = ("id", "nombre", "correo", "telefono", "password", "activo", "creado")
        read_only_fields = ("id", "creado")

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
        obj = UsuarioRegistrado()
        obj.nombre   = validated_data["nombre"]
        obj.correo   = validated_data["correo"]
        obj.telefono = validated_data.get("telefono", "")
        obj.password = validated_data["password"]
        obj.activo   = validated_data.get("activo", True)
        obj.save()
        return obj

    def update(self, instance, validated_data):
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