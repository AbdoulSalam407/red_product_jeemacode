from rest_framework import serializers
from .models import Image, HotelImage
import base64
import imghdr
from django.core.files.base import ContentFile

class ImageSerializer(serializers.ModelSerializer):
    """
    Serializer pour les images en base64
    - Accepte base64 en entrée
    - Retourne base64 en sortie
    """
    
    image_size_mb = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Image
        fields = (
            'id', 'title', 'description', 'image_base64', 'image_type',
            'image_size', 'image_size_mb', 'image_width', 'image_height',
            'image_url', 'is_active', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'image_size', 'image_type', 'image_width', 'image_height', 'created_at', 'updated_at')
    
    def get_image_size_mb(self, obj):
        """Retourner la taille en MB"""
        return obj.get_image_size_mb()
    
    def get_image_url(self, obj):
        """Retourner l'URL de l'image (data URL)"""
        if obj.image_base64:
            return obj.image_base64
        return None
    
    def validate_image_base64(self, value):
        """
        Valider et traiter l'image base64
        - Extraire le type d'image
        - Calculer la taille
        - Valider le format
        """
        if not value:
            raise serializers.ValidationError("L'image ne peut pas être vide")
        
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
            # Si ce n'est pas un data URL, le rejeter
            raise serializers.ValidationError("L'image doit être au format base64 (data:image/...;base64,...)")
    
    def create(self, validated_data):
        """Créer une image et extraire les métadonnées"""
        image_base64 = validated_data['image_base64']
        
        # Extraire les métadonnées
        header, data = image_base64.split(',', 1)
        mime_type = header.split(':')[1].split(';')[0]
        image_type = mime_type.split('/')[1]
        
        # Décoder pour obtenir la taille
        image_data = base64.b64decode(data)
        image_size = len(image_data)
        
        # Créer un fichier temporaire pour obtenir les dimensions
        temp_file = ContentFile(image_data)
        
        # Ajouter les métadonnées
        validated_data['image_type'] = image_type
        validated_data['image_size'] = image_size
        validated_data['user'] = self.context['request'].user
        
        # Créer l'image
        image = Image.objects.create(**validated_data)
        
        return image
    
    def update(self, instance, validated_data):
        """Mettre à jour une image"""
        if 'image_base64' in validated_data:
            image_base64 = validated_data['image_base64']
            
            # Extraire les métadonnées
            header, data = image_base64.split(',', 1)
            mime_type = header.split(':')[1].split(';')[0]
            image_type = mime_type.split('/')[1]
            
            # Décoder pour obtenir la taille
            image_data = base64.b64decode(data)
            image_size = len(image_data)
            
            # Mettre à jour les métadonnées
            instance.image_type = image_type
            instance.image_size = image_size
        
        # Mettre à jour les autres champs
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class HotelImageSerializer(serializers.ModelSerializer):
    """Serializer pour les images des hôtels"""
    
    image = ImageSerializer(read_only=True)
    
    class Meta:
        model = HotelImage
        fields = ('id', 'image', 'order', 'is_primary', 'created_at')
        read_only_fields = ('id', 'created_at')


class ImageListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des images"""
    
    image_size_mb = serializers.SerializerMethodField()
    
    class Meta:
        model = Image
        fields = (
            'id', 'title', 'image_base64', 'image_type',
            'image_size_mb', 'is_active', 'created_at'
        )
    
    def get_image_size_mb(self, obj):
        return obj.get_image_size_mb()
