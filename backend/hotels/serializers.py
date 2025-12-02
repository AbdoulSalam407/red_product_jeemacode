from rest_framework import serializers
from .models import Hotel

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = (
            'id', 'name', 'description', 'city', 'address', 'phone', 'email',
            'price_per_night', 'rating', 'image', 'rooms_count', 'available_rooms',
            'is_active', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
