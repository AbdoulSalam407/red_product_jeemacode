from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Image(models.Model):
    """
    Modèle pour stocker les images en base64
    - Pas de stockage de fichiers
    - Tout en base de données
    """
    
    # Champs de base
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)
    
    # Image en base64 (TextField pour stocker de grandes données)
    image_base64 = models.TextField(
        help_text="Image encodée en base64 (data:image/jpeg;base64,...)"
    )
    
    # Métadonnées
    image_type = models.CharField(
        max_length=50,
        choices=[
            ('jpeg', 'JPEG'),
            ('png', 'PNG'),
            ('gif', 'GIF'),
            ('webp', 'WebP'),
            ('svg', 'SVG'),
        ],
        default='jpeg',
        db_index=True
    )
    
    # Taille en bytes
    image_size = models.IntegerField(default=0)
    
    # Dimensions
    image_width = models.IntegerField(null=True, blank=True)
    image_height = models.IntegerField(null=True, blank=True)
    
    # Relation avec l'utilisateur
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='images'
    )
    
    # Métadonnées de suivi
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['image_type']),
            models.Index(fields=['-created_at']),
        ]
        verbose_name = 'Image'
        verbose_name_plural = 'Images'
    
    def __str__(self):
        return f"{self.title} ({self.image_type})"
    
    def get_image_size_mb(self):
        """Retourner la taille en MB"""
        return round(self.image_size / (1024 * 1024), 2)
    
    def is_large_image(self):
        """Vérifier si l'image est grande (> 5 MB)"""
        return self.image_size > 5 * 1024 * 1024


class HotelImage(models.Model):
    """
    Relation entre Hotel et Image
    Permet à un hôtel d'avoir plusieurs images
    """
    
    hotel = models.ForeignKey(
        'hotels.Hotel',
        on_delete=models.CASCADE,
        related_name='images'
    )
    
    image = models.ForeignKey(
        Image,
        on_delete=models.CASCADE
    )
    
    # Ordre d'affichage
    order = models.IntegerField(default=0)
    
    # Marquer comme image principale
    is_primary = models.BooleanField(default=False, db_index=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']
        unique_together = ('hotel', 'image')
        verbose_name = 'Image Hôtel'
        verbose_name_plural = 'Images Hôtels'
    
    def __str__(self):
        return f"{self.hotel.name} - {self.image.title}"
