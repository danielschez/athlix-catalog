# backend/productos/api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from productos.models import (
    ProductoTalla, UsuarioRegistrado, Categoria, Talla,
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


class CrearPedidoView(APIView):
    authentication_classes = []
    permission_classes     = []

    def post(self, request):
        usuario_id = request.data.get("usuario_id")
        items      = request.data.get("items", [])

        if not usuario_id or not items:
            return Response(
                {"detail": "usuario_id e items son requeridos."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            usuario = UsuarioRegistrado.objects.get(pk=usuario_id, activo=True)
        except UsuarioRegistrado.DoesNotExist:
            return Response(
                {"detail": "Usuario no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        pedido  = Pedido.objects.create(usuario=usuario, estado="pendiente")
        errores = []

        for item in items:
            try:
                producto = Producto.objects.get(pk=item["id"], activo=True)
                cantidad = int(item["quantity"])
                talla_id = item.get("talla_id")

                if producto.tiene_tallas:
                    if not talla_id:
                        errores.append(f"{producto.nombre}: debes seleccionar una talla.")
                        continue

                    try:
                        pt = ProductoTalla.objects.get(producto=producto, talla_id=talla_id)
                        if pt.stock < cantidad:
                            errores.append(f"{producto.nombre} talla {pt.talla.talla}: stock insuficiente.")
                            continue
                        pt.stock -= cantidad
                        pt.save()
                    except ProductoTalla.DoesNotExist:
                        errores.append(f"{producto.nombre}: talla no disponible.")
                        continue

                else:
                    if producto.stock < cantidad:
                        errores.append(f"{producto.nombre}: stock insuficiente.")
                        continue
                    producto.stock -= cantidad
                    producto.save()

                DetallePedido.objects.create(
                    pedido          = pedido,
                    producto        = producto,
                    cantidad        = cantidad,
                    precio_unitario = producto.precio,
                )

                producto.actualizar_activo()

            except Producto.DoesNotExist:
                errores.append(f"Producto ID {item['id']} no encontrado.")

        pedido.actualizar_total()

        return Response({
            "pedido_id": pedido.id,
            "total":     str(pedido.total),
            "estado":    pedido.estado,
            "errores":   errores,
        }, status=status.HTTP_201_CREATED)