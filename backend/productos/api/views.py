# backend/productos/api/views.py
from rest_framework import viewsets
from productos.models import (
    UsuarioRegistrado, Categoria, Talla,
    Producto, Pedido, DetallePedido,
)
from .serializers import (
    UsuarioRegistradoSerializer, CategoriaSerializer, TallaSerializer,
    ProductoSerializer, PedidoSerializer, DetallePedidoSerializer,
)


class UsuarioRegistradoViewSet(viewsets.ModelViewSet):
    queryset         = UsuarioRegistrado.objects.all()
    serializer_class = UsuarioRegistradoSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset         = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class TallaViewSet(viewsets.ModelViewSet):
    queryset         = Talla.objects.all()
    serializer_class = TallaSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset         = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer

    def get_queryset(self):
        queryset     = Producto.objects.filter(activo=True)
        categoria_id = self.request.query_params.get("categoria")

        if categoria_id:
            ids      = self._get_categoria_ids(int(categoria_id))
            queryset = queryset.filter(categoria__in=ids)

        return queryset

    def _get_categoria_ids(self, categoria_id, visitados=None):
        if visitados is None:
            visitados = set()

        if categoria_id in visitados:
            return []

        visitados.add(categoria_id)
        ids = [categoria_id]

        hijos = Categoria.objects.filter(
            padre_id=categoria_id
        ).exclude(
            id=categoria_id
        ).values_list("id", flat=True)

        for hijo_id in hijos:
            ids.extend(self._get_categoria_ids(hijo_id, visitados))

        return ids


class PedidoViewSet(viewsets.ModelViewSet):
    queryset         = Pedido.objects.all()
    serializer_class = PedidoSerializer


class DetallePedidoViewSet(viewsets.ModelViewSet):
    queryset         = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer