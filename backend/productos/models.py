#backend/productos/models.py
from django.db import models
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db import IntegrityError
import hashlib

from .encryption import encryptor


class UsuarioRegistrado(models.Model):

    # ============================
    # CAMPOS ENCRIPTADOS (DB)
    # ============================
    _nombre   = models.CharField(db_column='nombre',   null=True, blank=True)
    _correo   = models.CharField(db_column='correo',   null=True, blank=True)
    _telefono = models.CharField(db_column='telefono', null=True, blank=True)

    # ============================
    # HASHES PARA BÚSQUEDA
    # ============================
    correo_hash = models.CharField(
        max_length=64,
        db_index=True,
        editable=False,
        null=True,
        blank=True,
    )

    telefono_hash = models.CharField(
        max_length=64,
        db_index=True,
        editable=False,
        null=True,
        blank=True,
    )

    # ============================
    # OTROS CAMPOS
    # ============================
    password = models.CharField(max_length=255)
    creado   = models.DateTimeField(auto_now_add=True)
    activo   = models.BooleanField(default=True)

    # ============================
    # HASH HELPERS
    # ============================
    @staticmethod
    def hash_email(value):
        return hashlib.sha256(value.strip().lower().encode()).hexdigest()

    @staticmethod
    def hash_phone(value):
        return hashlib.sha256(value.strip().encode()).hexdigest()

    # ============================
    # PROPERTIES
    # ============================
    @property
    def nombre(self):
        return encryptor.decrypt(self._nombre) if self._nombre else ''

    @nombre.setter
    def nombre(self, value):
        self._nombre = encryptor.encrypt(value) if value else ''

    @property
    def correo(self):
        return encryptor.decrypt(self._correo) if self._correo else ''

    @correo.setter
    def correo(self, value):
        if value:
            value = value.strip().lower()
            self._correo     = encryptor.encrypt(value)
            self.correo_hash = self.hash_email(value)
        else:
            self._correo     = ''
            self.correo_hash = None

    @property
    def telefono(self):
        return encryptor.decrypt(self._telefono) if self._telefono else ''

    @telefono.setter
    def telefono(self, value):
        if value:
            value = value.strip()
            self._telefono     = encryptor.encrypt(value)
            self.telefono_hash = self.hash_phone(value)
        else:
            self._telefono     = ''
            self.telefono_hash = None

    # ============================
    # VALIDACIÓN
    # ============================
    def clean(self):
        errors = {}

        if self.correo_hash and UsuarioRegistrado.objects.filter(
            correo_hash=self.correo_hash
        ).exclude(pk=self.pk).exists():
            errors["correo"] = "Este correo electrónico ya está registrado."

        if self.telefono_hash and UsuarioRegistrado.objects.filter(
            telefono_hash=self.telefono_hash
        ).exclude(pk=self.pk).exists():
            errors["telefono"] = "Este número de teléfono ya está registrado."

        if errors:
            raise ValidationError(errors)

    # ============================
    # SAVE
    # ============================
    def save(self, *args, **kwargs):
        self.full_clean()

        if not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)

        try:
            super().save(*args, **kwargs)
        except IntegrityError:
            raise ValidationError({
                "general": "El correo o teléfono ya existe en la base de datos."
            })

    def __str__(self):
        return self.nombre or "Usuario"

    class Meta:
        verbose_name        = "Usuario Registrado"
        verbose_name_plural = "Usuarios Registrados"


# =========================================================
# CATEGORÍAS
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
        ("ropa",    "Ropa"),
    ]

    talla = models.CharField(max_length=10)
    tipo  = models.CharField(max_length=10, choices=TIPO_TALLA)

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
    nombre      = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)

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

    stock = models.PositiveIntegerField(default=0)

    activo = models.BooleanField(default=True)

    imagen1 = models.ImageField(upload_to="productos/", blank=True, null=True)
    imagen2 = models.ImageField(upload_to="productos/", blank=True, null=True)
    imagen3 = models.ImageField(upload_to="productos/", blank=True, null=True)

    creado      = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    @property
    def tiene_tallas(self):
        return self.producto_tallas.exists()

    @property
    def stock_total(self):
        if self.tiene_tallas:
            return sum(pt.stock for pt in self.producto_tallas.all())
        return self.stock

    def actualizar_activo(self):
        self.activo = self.stock_total > 0
        Producto.objects.filter(pk=self.pk).update(activo=self.activo)

    def __str__(self):
        return self.nombre


# =========================================================
# PRODUCTO - TALLA (stock por talla)
# =========================================================

class ProductoTalla(models.Model):
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name="producto_tallas"
    )

    talla = models.ForeignKey(
        Talla,
        on_delete=models.CASCADE,
        related_name="producto_tallas"
    )

    stock = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("producto", "talla")
        verbose_name        = "Talla del Producto"
        verbose_name_plural = "Tallas del Producto"

    def __str__(self):
        return f"{self.producto.nombre} — {self.talla.talla}: {self.stock} uds"

# =========================================================
# PEDIDOS
# =========================================================

class Pedido(models.Model):

    ESTADOS = [
        ("pendiente",  "Pendiente"),
        ("procesando", "Procesando"),
        ("enviado",    "Enviado"),
        ("entregado",  "Entregado"),
        ("cancelado",  "Cancelado"),
    ]

    usuario = models.ForeignKey(
        UsuarioRegistrado,
        on_delete=models.CASCADE,
        related_name="pedidos"
    )

    fecha  = models.DateTimeField(default=timezone.now)
    estado = models.CharField(max_length=20, choices=ESTADOS, default="pendiente")
    total  = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def actualizar_total(self):
        self.total = sum(det.subtotal for det in self.detalles.all())
        self.save()

    def __str__(self):
        return f"Pedido #{self.id} — {self.usuario.nombre}"


# =========================================================
# DETALLE PEDIDO
# =========================================================

class DetallePedido(models.Model):

    pedido   = models.ForeignKey(Pedido,   on_delete=models.CASCADE, related_name="detalles")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)

    cantidad        = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal        = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.subtotal = self.precio_unitario * self.cantidad
        super().save(*args, **kwargs)
        self.pedido.actualizar_total()

    def __str__(self):
        return f"{self.producto.nombre} x {self.cantidad}"