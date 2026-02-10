from django.contrib import admin
from django import forms
from django.utils.html import format_html
from .models import Product, Category, Size

admin.site.register(Category)
admin.site.register(Size)

class NoCurrentImageClearableFileInput(forms.ClearableFileInput):
    """Quita el 'Currently: ...' del ImageField en el admin"""
    template_name = 'django/forms/widgets/clearable_file_input.html'

    def format_value(self, value):
        """No mostrar la URL de la imagen actual"""
        return None

class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'
        widgets = {
            'image': NoCurrentImageClearableFileInput,
        }

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm

    list_display = (
        'image_tag',
        'name',
        'category',
        'size',
        'brand',
        'stock',
        'price',
        'status'
    )
    list_filter = ('category', 'size', 'status')
    search_fields = ('name', 'brand')

    readonly_fields = ('image_preview',)

    fieldsets = (
        ('Información básica', {
            'fields': ('name', 'description', 'category', 'size', 'brand', 'image', 'image_preview')
        }),
        ('Inventario y precio', {
            'fields': ('stock', 'price', 'status')
        }),
    )

    def image_tag(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width:50px; height:auto; border-radius:4px;" />',
                obj.image.url
            )
        return "-"
    image_tag.short_description = 'Imagen'

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<a href="{}" target="_blank">'
                '<img src="{}" style="max-height:100px; border-radius:4px;" />'
                '</a>',
                obj.image.url,
                obj.image.url
            )
        return "No hay imagen"
    image_preview.short_description = 'Imagen actual'
