from django.contrib import admin
from .models import Hotel

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'price_per_night', 'rating', 'is_active', 'created_at')
    list_filter = ('city', 'is_active', 'created_at')
    search_fields = ('name', 'city', 'address')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Informations générales', {
            'fields': ('name', 'description', 'city', 'address')
        }),
        ('Contact', {
            'fields': ('phone', 'email')
        }),
        ('Tarification et disponibilité', {
            'fields': ('price_per_night', 'rooms_count', 'available_rooms')
        }),
        ('Évaluation', {
            'fields': ('rating', 'image')
        }),
        ('Statut', {
            'fields': ('is_active',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
