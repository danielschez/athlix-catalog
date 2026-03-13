from rest_framework import serializers
from productos.models import *


class UsuarioRegistradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioRegistrado
        fields = "__all__"


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"


class TallaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Talla
        fields = "__all__"


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = "__all__"


class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = "__all__"


class DetallePedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallePedido
        fields = "__all__"