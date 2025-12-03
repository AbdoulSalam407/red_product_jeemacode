from rest_framework import serializers
from .models import Hotel

class HotelSerializer(serializers.ModelSerializer):
    image = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    price_per_night = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        model = Hotel
        fields = (
            'id', 'name', 'description', 'city', 'address', 'phone', 'email',
            'price_per_night', 'rating', 'image', 'rooms_count', 'available_rooms',
            'is_active', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def validate_price_per_night(self, value):
        if value < 0:
            raise serializers.ValidationError("Le prix ne peut pas être négatif")
        return value
    
    def validate_rating(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError("La note doit être entre 0 et 5")
        return value
