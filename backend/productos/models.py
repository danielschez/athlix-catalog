#backend/productos/models.py
from django.db import models
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.utils import timezone


# =========================================================
# USUARIOS REGISTRADOS (CLIENTES DE LA TIENDA)
# =========================================================

class UsuarioRegistrado(models.Model):
    nombre = models.CharField(max_length=255)

    correo = models.EmailField(
        unique=True
    )

    password = models.CharField(
        max_length=255
    )

    telefono = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    creado = models.DateTimeField(
        auto_now_add=True
    )

    activo = models.BooleanField(
        default=True
    )

    def save(self, *args, **kwargs):
        # Encriptar contraseña automáticamente
        if not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre


# =========================================================
# CATEGORÍAS (JERÁRQUICAS)
# =========================================================

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)

    padre = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="subcategorias"
    )

    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre


# =========================================================
# TALLAS
# =========================================================

class Talla(models.Model):
    TIPO_TALLA = [
        ("calzado", "Calzado"),
        ("ropa", "Ropa"),
    ]

    talla = models.CharField(
        max_length=10
    )  # XS, S, M, 26.5, etc.

    tipo = models.CharField(
        max_length=10,
        choices=TIPO_TALLA
    )

    categorias = models.ManyToManyField(
        Categoria,
        related_name="tallas",
        blank=True
    )

    def __str__(self):
        return f"{self.talla} ({self.tipo})"


# =========================================================
# PRODUCTOS
# =========================================================

class Producto(models.Model):
    nombre = models.CharField(max_length=255)

    descripcion = models.TextField(
        blank=True
    )

    # Precio opcional
    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    categoria = models.ForeignKey(
        "Categoria",
        on_delete=models.CASCADE,
        related_name="productos"
    )

    tallas = models.ManyToManyField(
        "Talla",
        blank=True
    )

    # Stock
    stock = models.PositiveIntegerField(
        default=0
    )

    # Activo (se desactiva cuando stock = 0)
    activo = models.BooleanField(
        default=True
    )

    # Máximo 3 imágenes
    imagen1 = models.ImageField(
        upload_to="productos/",
        blank=True,
        null=True
    )

    imagen2 = models.ImageField(
        upload_to="productos/",
        blank=True,
        null=True
    )

    imagen3 = models.ImageField(
        upload_to="productos/",
        blank=True,
        null=True
    )

    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Auto-desactivar si no hay stock
        if self.stock <= 0:
            self.activo = False
        else:
            self.activo = True

        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre
    
class Pedido(models.Model):

    ESTADOS = [
        ("pendiente", "Pendiente"),
        ("procesando", "Procesando"),
        ("enviado", "Enviado"),
        ("entregado", "Entregado"),
        ("cancelado", "Cancelado"),
    ]

    usuario = models.ForeignKey(
        UsuarioRegistrado,
        on_delete=models.CASCADE,
        related_name="pedidos"
    )

    fecha = models.DateTimeField(default=timezone.now)

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default="pendiente"
    )

    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    def actualizar_total(self):
        total = sum(det.subtotal for det in self.detalles.all())
        self.total = total
        self.save()

    def __str__(self):
        return f"Pedido #{self.id} — {self.usuario.nombre}"
    
class DetallePedido(models.Model):

    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name="detalles"
    )

    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE
    )

    cantidad = models.PositiveIntegerField(default=1)

    precio_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def save(self, *args, **kwargs):
        self.subtotal = self.precio_unitario * self.cantidad
        super().save(*args, **kwargs)

        self.pedido.actualizar_total()

    def __str__(self):
        return f"{self.producto.nombre} x {self.cantidad}"
    