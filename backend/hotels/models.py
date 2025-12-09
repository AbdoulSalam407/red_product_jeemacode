from django.db import models

class Hotel(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, db_index=True)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    rating = models.FloatField(default=0)
    # Image stockée en base64 (pas de fichier sur disque)
    image_base64 = models.TextField(
        blank=True,
        null=True,
        help_text="Image encodée en base64 (data:image/jpeg;base64,...)"
    )
    image_type = models.CharField(
        max_length=50,
        choices=[
            ('jpeg', 'JPEG'),
            ('png', 'PNG'),
            ('gif', 'GIF'),
            ('webp', 'WebP'),
            ('svg', 'SVG'),
        ],
        blank=True,
        null=True,
        default='jpeg'
    )
    image_size = models.IntegerField(default=0, help_text="Taille en bytes")
    rooms_count = models.IntegerField(default=0)
    available_rooms = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['city', 'is_active']),
            models.Index(fields=['price_per_night']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return self.name
