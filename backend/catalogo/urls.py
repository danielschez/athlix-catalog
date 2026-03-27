# backend/catalogo/urls.py
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static

from productos.api.auth_views import LoginView, RefreshView
from productos.api.views import CrearPedidoView

urlpatterns = [
    path("", RedirectView.as_view(url="/admin/", permanent=False)),
    path("admin/", admin.site.urls),

    path("api/auth/login/",    LoginView.as_view(),        name="login"),
    path("api/auth/refresh/",  RefreshView.as_view(),      name="refresh"),

    path("api/pedidos/crear/", CrearPedidoView.as_view(),  name="crear-pedido"),

    path("api/", include("productos.api.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)