from rest_framework import serializers
from .models import Hotel
import base64

class HotelSerializer(serializers.ModelSerializer):
    price_per_night = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    image_base64 = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    image_size_mb = serializers.SerializerMethodField()
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
            'price_per_night', 'rating', 'image_base64', 'image_type', 'image_size', 'image_size_mb',
            'rooms_count', 'available_rooms', 'is_active', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'image_size', 'image_size_mb', 'created_at', 'updated_at')
    
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
    
    def get_image_size_mb(self, obj):
        """Retourner la taille de l'image en MB"""
        if obj.image_size:
            return round(obj.image_size / (1024 * 1024), 2)
        return 0
    
    def validate_image_base64(self, value):
        """Valider et traiter l'image base64"""
        if not value:
            return value
        
        # Vérifier si c'est un data URL
        if value.startswith('data:'):
            try:
                # Extraire le type et les données
                header, data = value.split(',', 1)
                # Extraire le type MIME (ex: data:image/jpeg;base64)
                mime_type = header.split(':')[1].split(';')[0]
                
                # Valider le type MIME
                if not mime_type.startswith('image/'):
                    raise serializers.ValidationError("Le fichier doit être une image")
                
                # Décoder et valider
                try:
                    image_data = base64.b64decode(data)
                except Exception:
                    raise serializers.ValidationError("Le base64 est invalide")
                
                # Vérifier la taille (max 10 MB)
                if len(image_data) > 10 * 1024 * 1024:
                    raise serializers.ValidationError("L'image ne doit pas dépasser 10 MB")
                
                return value
            except ValueError:
                raise serializers.ValidationError("Format base64 invalide")
        else:
            raise serializers.ValidationError("L'image doit être au format base64 (data:image/...;base64,...)")
    
    def validate(self, data):
        """Validate required fields for create operations"""
        # For create operations, ensure required fields are provided
        if not self.instance:  # This is a create operation
            required_fields = ['name', 'city', 'address', 'phone', 'email', 'price_per_night']
            for field in required_fields:
                if field not in data or data[field] is None or data[field] == '':
                    raise serializers.ValidationError({field: f'{field} est requis'})
        
        return data
    
    def create(self, validated_data):
        """Créer un hôtel et extraire les métadonnées de l'image"""
        if 'image_base64' in validated_data and validated_data['image_base64']:
            image_base64 = validated_data['image_base64']
            
            # Extraire les métadonnées
            header, image_data_str = image_base64.split(',', 1)
            mime_type = header.split(':')[1].split(';')[0]
            image_type = mime_type.split('/')[1]
            
            # Décoder pour obtenir la taille
            image_data = base64.b64decode(image_data_str)
            image_size = len(image_data)
            
            # Mettre à jour les métadonnées
            validated_data['image_type'] = image_type
            validated_data['image_size'] = image_size
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Mettre à jour un hôtel et extraire les métadonnées de l'image"""
        if 'image_base64' in validated_data and validated_data['image_base64']:
            image_base64 = validated_data['image_base64']
            
            # Extraire les métadonnées
            header, image_data_str = image_base64.split(',', 1)
            mime_type = header.split(':')[1].split(';')[0]
            image_type = mime_type.split('/')[1]
            
            # Décoder pour obtenir la taille
            image_data = base64.b64decode(image_data_str)
            image_size = len(image_data)
            
            # Mettre à jour les métadonnées
            validated_data['image_type'] = image_type
            validated_data['image_size'] = image_size
        
        return super().update(instance, validated_data)
