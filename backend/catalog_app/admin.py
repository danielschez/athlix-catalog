from django.utils.html import format_html
from django.contrib import admin
from .models import Product, Category, Size

admin.site.register(Category)
admin.site.register(Size)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'size', 'brand', 'stock', 'price', 'status')
    list_filter = ('category', 'size', 'status')
    search_fields = ('name', 'brand')
    fieldsets = (
        ('Información básica', {
            'fields': ('name', 'description', 'category', 'size', 'brand', 'image')
        }),
        ('Inventario y precio', {
            'fields': ('stock', 'price', 'status')
        }),
    )

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />'.format(obj.image.url))
        return "-"
    image_tag.short_description = 'Imagen'
    image_tag.allow_tags = True
