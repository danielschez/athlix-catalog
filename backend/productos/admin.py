# backend/productos/admin.py
from django.contrib import admin
from django.contrib import messages
from django import forms
from django.utils.safestring import mark_safe
from django.utils.html import format_html
from django.db import models
from django.core.exceptions import ValidationError

from .models import (
    ProductoTalla,
    UsuarioRegistrado,
    Categoria,
    Talla,
    Producto,
    Pedido,
    DetallePedido
)

# =========================================================
# FORM PERSONALIZADO PARA USUARIO
# =========================================================

class UsuarioRegistradoForm(forms.ModelForm):
    nombre   = forms.CharField(label="Nombre")
    correo   = forms.EmailField(label="Correo")
    telefono = forms.CharField(label="Teléfono", required=False)
    password = forms.CharField(
        label="Contraseña",
        widget=forms.PasswordInput(render_value=True),
        required=False,
        help_text="Déjalo vacío para no cambiarla."
    )

    class Meta:
        model  = UsuarioRegistrado
        fields = ("activo",)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.fields["nombre"].initial   = self.instance.nombre
            self.fields["correo"].initial   = self.instance.correo
            self.fields["telefono"].initial = self.instance.telefono

    def save(self, commit=True):
        obj = super().save(commit=False)
        obj.nombre   = self.cleaned_data["nombre"]
        obj.correo   = self.cleaned_data["correo"]
        obj.telefono = self.cleaned_data.get("telefono", "")
        pwd = self.cleaned_data.get("password")
        if pwd:
            obj.password = pwd
        if commit:
            obj.save()
        return obj


# =========================================================
# ADMIN USUARIO
# =========================================================

@admin.register(UsuarioRegistrado)
class UsuarioRegistradoAdmin(admin.ModelAdmin):
    form            = UsuarioRegistradoForm
    list_display    = ("nombre", "correo", "telefono", "activo", "creado")
    readonly_fields = ("creado",)
    search_fields   = ("correo_hash", "telefono_hash")
    fields          = ("nombre", "correo", "telefono", "password", "activo", "creado")

    def save_model(self, request, obj, form, change):
        try:
            obj.full_clean()
            obj.save()
        except ValidationError as e:
            for field, errors in e.message_dict.items():
                for error in errors:
                    self.message_user(request, error, level=messages.ERROR)
            return


# =========================================================
# REGISTROS SIMPLES
# =========================================================

admin.site.register(Categoria)
admin.site.register(Talla)


# =========================================================
# WIDGET CON VISTA PREVIA
# =========================================================

class ImagenPreviewWidget(forms.ClearableFileInput):
    template_name = None

    def render(self, name, value, attrs=None, renderer=None):
        html = ""
        if value and hasattr(value, "url"):
            html += f'<img src="{value.url}" width="150" style="border-radius:8px; display:block; margin-bottom:10px;">'
            html += f'<label style="display:inline-flex; align-items:center; gap:6px; margin-bottom:10px;"><input type="checkbox" name="{name}-clear"> Eliminar imagen</label><br>'
        html += f'<input type="file" name="{name}" accept="image/*">'
        return mark_safe(html)


# =========================================================
# INLINE TALLAS DEL PRODUCTO
# =========================================================

class ProductoTallaInline(admin.TabularInline):
    model  = ProductoTalla
    extra  = 1
    fields = ("talla", "stock")


# =========================================================
# ADMIN PRODUCTO 
# =========================================================

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):

    formfield_overrides = {
        models.ImageField: {"widget": ImagenPreviewWidget},
    }

    list_display = (
        "nombre", "categoria", "stock_total",
        "preview_imagen1", "preview_imagen2", "preview_imagen3",
    )

    readonly_fields = (
        "preview_imagen1", "preview_imagen2", "preview_imagen3",
        "stock_total",
    )

    fieldsets = (
        ("Información", {
            "fields": (
                "nombre", "descripcion", "precio", "categoria",
                "stock",
                "stock_total",
                "activo",
            )
        }),
        ("Imágenes", {
            "fields": (
                "imagen1", "preview_imagen1",
                "imagen2", "preview_imagen2",
                "imagen3", "preview_imagen3",
            )
        }),
    )

    inlines = [ProductoTallaInline]

    def preview_imagen1(self, obj):
        if obj.imagen1:
            return format_html('<img src="{}" width="120" style="border-radius:8px;" />', obj.imagen1.url)
        return "Sin imagen"

    def preview_imagen2(self, obj):
        if obj.imagen2:
            return format_html('<img src="{}" width="120" style="border-radius:8px;" />', obj.imagen2.url)
        return "Sin imagen"

    def preview_imagen3(self, obj):
        if obj.imagen3:
            return format_html('<img src="{}" width="120" style="border-radius:8px;" />', obj.imagen3.url)
        return "Sin imagen"

    def stock_total(self, obj):
        return obj.stock_total
    stock_total.short_description = "Stock total"


# =========================================================
# PEDIDOS
# =========================================================

class DetallePedidoInline(admin.TabularInline):
    model           = DetallePedido
    extra           = 1
    fields          = ("producto", "cantidad", "precio_unitario", "subtotal")
    readonly_fields = ("subtotal",)


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display   = ("id", "usuario", "estado", "fecha", "total")
    list_filter    = ("estado", "fecha")
    search_fields  = ("usuario__nombre", "usuario__correo")
    date_hierarchy = "fecha"
    inlines        = [DetallePedidoInline]


@admin.register(DetallePedido)
class DetallePedidoAdmin(admin.ModelAdmin):
    list_display = ("pedido", "producto", "cantidad", "precio_unitario", "subtotal")
    list_filter  = ("pedido",)