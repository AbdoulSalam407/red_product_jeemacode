from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Image, HotelImage
from .serializers import ImageSerializer, HotelImageSerializer, ImageListSerializer


class ImageViewSet(viewsets.ModelViewSet):
    """
    CRUD complet pour les images en base64
    
    Endpoints:
    - GET /api/images/ - Lister les images
    - POST /api/images/ - Créer une image
    - GET /api/images/{id}/ - Récupérer une image
    - PATCH /api/images/{id}/ - Mettre à jour une image
    - DELETE /api/images/{id}/ - Supprimer une image
    """
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Retourner les images de l'utilisateur connecté"""
        return Image.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Utiliser un serializer différent pour la liste"""
        if self.action == 'list':
            return ImageListSerializer
        return ImageSerializer
    
    def perform_create(self, serializer):
        """Créer une image avec l'utilisateur connecté"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_images(self, request):
        """
        Récupérer toutes les images de l'utilisateur
        GET /api/images/my_images/
        """
        images = self.get_queryset()
        serializer = self.get_serializer(images, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def set_primary(self, request, pk=None):
        """
        Marquer une image comme principale pour un hôtel
        POST /api/images/{id}/set_primary/?hotel_id=1
        """
        image = self.get_object()
        hotel_id = request.query_params.get('hotel_id')
        
        if not hotel_id:
            return Response(
                {'error': 'hotel_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            hotel_image = HotelImage.objects.get(
                image=image,
                hotel_id=hotel_id
            )
            # Désactiver les autres images principales
            HotelImage.objects.filter(
                hotel_id=hotel_id,
                is_primary=True
            ).update(is_primary=False)
            
            # Marquer comme principale
            hotel_image.is_primary = True
            hotel_image.save()
            
            return Response(
                {'message': 'Image marquée comme principale'},
                status=status.HTTP_200_OK
            )
        except HotelImage.DoesNotExist:
            return Response(
                {'error': 'Image non trouvée pour cet hôtel'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Télécharger l'image en base64
        GET /api/images/{id}/download/
        """
        image = self.get_object()
        return Response({
            'title': image.title,
            'image_base64': image.image_base64,
            'image_type': image.image_type,
            'image_size_mb': image.get_image_size_mb()
        })
    
    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        """
        Supprimer plusieurs images
        POST /api/images/bulk_delete/
        Body: {"ids": [1, 2, 3]}
        """
        ids = request.data.get('ids', [])
        
        if not ids:
            return Response(
                {'error': 'ids est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        deleted_count, _ = Image.objects.filter(
            id__in=ids,
            user=request.user
        ).delete()
        
        return Response({
            'message': f'{deleted_count} image(s) supprimée(s)',
            'deleted_count': deleted_count
        })


class HotelImageViewSet(viewsets.ModelViewSet):
    """
    Gestion des images des hôtels
    
    Endpoints:
    - GET /api/hotel-images/ - Lister les images des hôtels
    - POST /api/hotel-images/ - Ajouter une image à un hôtel
    - DELETE /api/hotel-images/{id}/ - Supprimer une image d'un hôtel
    """
    
    permission_classes = [IsAuthenticated]
    serializer_class = HotelImageSerializer
    queryset = HotelImage.objects.all()
    
    def perform_create(self, serializer):
        """Créer une relation image-hôtel"""
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def by_hotel(self, request):
        """
        Récupérer les images d'un hôtel
        GET /api/hotel-images/by_hotel/?hotel_id=1
        """
        hotel_id = request.query_params.get('hotel_id')
        
        if not hotel_id:
            return Response(
                {'error': 'hotel_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        images = HotelImage.objects.filter(hotel_id=hotel_id)
        serializer = self.get_serializer(images, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def primary_by_hotel(self, request):
        """
        Récupérer l'image principale d'un hôtel
        GET /api/hotel-images/primary_by_hotel/?hotel_id=1
        """
        hotel_id = request.query_params.get('hotel_id')
        
        if not hotel_id:
            return Response(
                {'error': 'hotel_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            hotel_image = HotelImage.objects.get(
                hotel_id=hotel_id,
                is_primary=True
            )
            serializer = self.get_serializer(hotel_image)
            return Response(serializer.data)
        except HotelImage.DoesNotExist:
            return Response(
                {'error': 'Aucune image principale trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )
