from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioRegistradoViewSet,
    CategoriaViewSet,
    TallaViewSet,
    ProductoViewSet,
    PedidoViewSet,
    DetallePedidoViewSet,
)

router = DefaultRouter()

router.register(r"usuarios", UsuarioRegistradoViewSet)
router.register(r"categorias", CategoriaViewSet)
router.register(r"tallas", TallaViewSet)
router.register(r"productos", ProductoViewSet)
router.register(r"pedidos", PedidoViewSet)
router.register(r"detalles", DetallePedidoViewSet)

urlpatterns = router.urls