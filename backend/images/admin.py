from django.contrib import admin
from .models import Image, HotelImage


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    """Admin pour les images"""
    
    list_display = ('title', 'image_type', 'get_size_mb', 'user', 'is_active', 'created_at')
    list_filter = ('image_type', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'user__email')
    readonly_fields = ('image_size', 'image_type', 'image_width', 'image_height', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Informations', {
            'fields': ('title', 'description', 'user')
        }),
        ('Image', {
            'fields': ('image_base64', 'image_type', 'image_size', 'image_width', 'image_height')
        }),
        ('Statut', {
            'fields': ('is_active',)
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_size_mb(self, obj):
        return f"{obj.get_image_size_mb()} MB"
    get_size_mb.short_description = 'Taille'


@admin.register(HotelImage)
class HotelImageAdmin(admin.ModelAdmin):
    """Admin pour les images des hôtels"""
    
    list_display = ('hotel', 'image', 'order', 'is_primary', 'created_at')
    list_filter = ('is_primary', 'created_at')
    search_fields = ('hotel__name', 'image__title')
    ordering = ('hotel', 'order')
    
    fieldsets = (
        ('Relation', {
            'fields': ('hotel', 'image')
        }),
        ('Affichage', {
            'fields': ('order', 'is_primary')
        }),
        ('Métadonnées', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
