from rest_framework import serializers
from .models import Hotel

class HotelSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    price_per_night = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    name = serializers.CharField(required=False)
    city = serializers.CharField(required=False)
    address = serializers.CharField(required=False)
    phone = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    rating = serializers.FloatField(required=False)
    rooms_count = serializers.IntegerField(required=False)
    available_rooms = serializers.IntegerField(required=False)
    is_active = serializers.BooleanField(required=False)
    
    class Meta:
        model = Hotel
        fields = (
            'id', 'name', 'description', 'city', 'address', 'phone', 'email',
            'price_per_night', 'rating', 'image', 'rooms_count', 'available_rooms',
            'is_active', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # En mode PATCH (partial update), rendre tous les champs optionnels
        if self.partial:
            for field_name in self.fields:
                if field_name not in self.Meta.read_only_fields:
                    self.fields[field_name].required = False
    
    def validate_price_per_night(self, value):
        if value < 0:
            raise serializers.ValidationError("Le prix ne peut pas être négatif")
        return value
    
    def validate_rating(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError("La note doit être entre 0 et 5")
        return value
    
    def validate(self, data):
        """Validate required fields for create operations"""
        # For create operations, ensure required fields are provided
        if not self.instance:  # This is a create operation
            required_fields = ['name', 'city', 'address', 'phone', 'email', 'price_per_night']
            for field in required_fields:
                if field not in data or data[field] is None or data[field] == '':
                    raise serializers.ValidationError({field: f'{field} est requis'})
        
        # Remove base64 data URLs from image field (they shouldn't be stored)
        if 'image' in data and isinstance(data['image'], str) and data['image'].startswith('data:'):
            data['image'] = None
        
        return data
