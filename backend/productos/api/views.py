#backend/productos/api/views.py
from rest_framework import viewsets

from productos.models import (
    UsuarioRegistrado,
    Categoria,
    Talla,
    Producto,
    Pedido,
    DetallePedido,
)

from .serializers import (
    UsuarioRegistradoSerializer,
    CategoriaSerializer,
    TallaSerializer,
    ProductoSerializer,
    PedidoSerializer,
    DetallePedidoSerializer,
)


# Usuarios registrados
class UsuarioRegistradoViewSet(viewsets.ModelViewSet):
    queryset = UsuarioRegistrado.objects.all()
    serializer_class = UsuarioRegistradoSerializer


# Categorías
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


# Tallas
class TallaViewSet(viewsets.ModelViewSet):
    queryset = Talla.objects.all()
    serializer_class = TallaSerializer


# Productos
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


# Pedidos
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer


# Detalle de pedidos
class DetallePedidoViewSet(viewsets.ModelViewSet):
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer