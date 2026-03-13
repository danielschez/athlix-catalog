from django.contrib import admin
from django import forms
from django.utils.safestring import mark_safe
from django.utils.html import format_html
from django.db import models

from .models import (
    UsuarioRegistrado,
    Categoria,
    Talla,
    Producto,
    Pedido, 
    DetallePedido
)

# =========================================================
# REGISTROS SIMPLES
# =========================================================

admin.site.register(UsuarioRegistrado)
admin.site.register(Categoria)
admin.site.register(Talla)


# =========================================================
# WIDGET CON VISTA PREVIA (SIN URL)
# =========================================================

class ImagenPreviewWidget(forms.ClearableFileInput):

    template_name = None  # evita template por defecto

    def render(self, name, value, attrs=None, renderer=None):
        html = ""

        # Vista previa si hay imagen
        if value and hasattr(value, "url"):
            html += f"""
                <img src="{value.url}" width="150"
                     style="border-radius:8px; display:block; margin-bottom:10px;">
            """

            # Checkbox eliminar
            html += f"""
                <label style="display:inline-flex; align-items:center; gap:6px; margin-bottom:10px;">
                    <input type="checkbox" name="{name}-clear">
                    Eliminar imagen
                </label><br>
            """

        # Input archivo
        html += f'<input type="file" name="{name}" accept="image/*">'

        return mark_safe(html)


# =========================================================
# ADMIN DEL PRODUCTO
# =========================================================

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):

    # Aplicar widget a todas las imágenes
    formfield_overrides = {
        models.ImageField: {"widget": ImagenPreviewWidget},
    }

    # Columnas en lista
    list_display = (
        "nombre",
        "categoria",
        "mostrar_tallas",
        "preview_imagen1",
        "preview_imagen2",
        "preview_imagen3",
    )

    # Campos solo lectura
    readonly_fields = (
        "preview_imagen1",
        "preview_imagen2",
        "preview_imagen3",
    )

    # Organización del formulario
    fieldsets = (
        ("Información", {
            "fields": (
                "nombre",
                "descripcion",
                "precio",
                "categoria",
                "tallas",
                "stock",
                "activo",
            )
        }),
        ("Imágenes", {
            "fields": (
                "imagen1",
                "preview_imagen1",
                "imagen2",
                "preview_imagen2",
                "imagen3",
                "preview_imagen3",
            )
        }),
    )

    # ======================================================
    # PREVIEWS EN FORMULARIO Y LISTA
    # ======================================================

    def preview_imagen1(self, obj):
        if obj.imagen1:
            return format_html(
                '<img src="{}" width="120" style="border-radius:8px;" />',
                obj.imagen1.url
            )
        return "Sin imagen"

    def preview_imagen2(self, obj):
        if obj.imagen2:
            return format_html(
                '<img src="{}" width="120" style="border-radius:8px;" />',
                obj.imagen2.url
            )
        return "Sin imagen"

    def preview_imagen3(self, obj):
        if obj.imagen3:
            return format_html(
                '<img src="{}" width="120" style="border-radius:8px;" />',
                obj.imagen3.url
            )
        return "Sin imagen"

    # ======================================================
    # TALLAS BONITAS
    # ======================================================

    def mostrar_tallas(self, obj):
        return ", ".join([t.talla for t in obj.tallas.all()]) or "Sin tallas"

    mostrar_tallas.short_description = "Tallas"

class DetallePedidoInline(admin.TabularInline):
    model = DetallePedido
    extra = 1

    fields = (
        "producto",
        "cantidad",
        "precio_unitario",
        "subtotal",
    )

    readonly_fields = ("subtotal",)

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "usuario",
        "estado",
        "fecha",
        "total",
    )

    list_filter = (
        "estado",
        "fecha",
    )

    search_fields = (
        "usuario__nombre",
        "usuario__correo",
    )

    date_hierarchy = "fecha"

    inlines = [DetallePedidoInline]

@admin.register(DetallePedido)
class DetallePedidoAdmin(admin.ModelAdmin):

    list_display = (
        "pedido",
        "producto",
        "cantidad",
        "precio_unitario",
        "subtotal",
    )

    list_filter = ("pedido",)