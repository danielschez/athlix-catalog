from django.db import models

class Category(models.Model):
    name = models.CharField("Nombre de categoría", max_length=50, unique=True)
    description = models.TextField("Descripción", blank=True, null=True)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    def __str__(self):
        return self.name


class Size(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='sizes', verbose_name="Categoría")
    size = models.CharField("Talla", max_length=10)

    class Meta:
        verbose_name = "Talla"
        verbose_name_plural = "Tallas"

    def __str__(self):
        return f"{self.category.name} - {self.size}"


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Categoría")
    size = models.ForeignKey(Size, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Talla")
    name = models.CharField("Nombre", max_length=100)
    description = models.TextField("Descripción", blank=True, null=True)
    brand = models.CharField("Marca", max_length=50)
    stock = models.PositiveIntegerField("Piezas disponibles", default=0)
    price = models.DecimalField("Precio", max_digits=10, decimal_places=2)
    status = models.BooleanField("Disponible", default=True)  # True = Disponible, False = Agotado
    created_at = models.DateTimeField("Fecha de creación", auto_now_add=True)
    updated_at = models.DateTimeField("Fecha de actualización", auto_now=True)
    image = models.ImageField("Imagen del producto", upload_to='products/', blank=True, null=True)


    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        return self.name
