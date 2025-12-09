#!/usr/bin/env python
"""
Script de test CRUD pour les hôtels avec images base64
Exécuter: python manage.py shell < test_hotels_crud.py
"""

import os
import django
import json
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from hotels.models import Hotel

User = get_user_model()

# Image base64 simple (PNG 1x1)
IMAGE_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

def get_token():
    """Obtenir un token JWT"""
    try:
        user = User.objects.get(email='admin@example.com')
    except User.DoesNotExist:
        # Créer un utilisateur admin pour les tests
        user = User.objects.create_user(
            email='admin@example.com',
            password='admin123',
            username='admin'
        )
    
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)

def test_crud():
    """Tester le CRUD complet"""
    
    client = APIClient()
    token = get_token()
    
    # Authentifier le client
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    print("=" * 60)
    print("TEST CRUD HÔTELS - IMAGES BASE64")
    print("=" * 60)
    
    # ========== TEST 1: CREATE ==========
    print("\n✅ TEST 1: CREATE - Créer un hôtel")
    print("-" * 60)
    
    hotel_data = {
        'name': 'Hotel Deluxe',
        'description': 'Un hôtel de luxe avec piscine',
        'city': 'Dakar',
        'address': '123 Rue de la Paix',
        'phone': '+221 33 123 45 67',
        'email': 'hotel@example.com',
        'price_per_night': 150000,
        'rating': 4.5,
        'rooms_count': 50,
        'available_rooms': 20,
        'is_active': True,
        'image_base64': IMAGE_BASE64
    }
    
    response = client.post('/api/hotels/', hotel_data, format='json')
    
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    
    hotel = response.json()
    hotel_id = hotel['id']
    
    print(f"✓ Hôtel créé avec ID: {hotel_id}")
    print(f"✓ Nom: {hotel['name']}")
    print(f"✓ Image type: {hotel['image_type']}")
    print(f"✓ Image size: {hotel['image_size']} bytes ({hotel['image_size_mb']} MB)")
    print(f"✓ Image présente: {len(hotel['image_base64']) > 0}")
    
    assert hotel['name'] == 'Hotel Deluxe', "Nom incorrect"
    assert hotel['image_type'] == 'png', "Type d'image incorrect"
    assert hotel['image_size'] > 0, "Taille d'image non calculée"
    assert hotel['image_base64'] == IMAGE_BASE64, "Image non stockée"
    
    print("✅ TEST 1 RÉUSSI")
    
    # ========== TEST 2: READ ==========
    print("\n✅ TEST 2: READ - Récupérer l'hôtel")
    print("-" * 60)
    
    response = client.get(f'/api/hotels/{hotel_id}/', format='json')
    
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    
    hotel = response.json()
    
    print(f"✓ Hôtel récupéré: {hotel['name']}")
    print(f"✓ Ville: {hotel['city']}")
    print(f"✓ Prix: {hotel['price_per_night']}")
    print(f"✓ Image type: {hotel['image_type']}")
    print(f"✓ Image size: {hotel['image_size_mb']} MB")
    
    assert hotel['name'] == 'Hotel Deluxe', "Nom incorrect"
    assert hotel['city'] == 'Dakar', "Ville incorrecte"
    assert hotel['image_base64'] == IMAGE_BASE64, "Image non récupérée"
    
    print("✅ TEST 2 RÉUSSI")
    
    # ========== TEST 3: UPDATE ==========
    print("\n✅ TEST 3: UPDATE - Modifier l'hôtel")
    print("-" * 60)
    
    update_data = {
        'name': 'Hotel Deluxe Premium',
        'description': 'Un hôtel 5 étoiles avec spa',
        'rating': 5.0,
        'available_rooms': 15
    }
    
    response = client.patch(f'/api/hotels/{hotel_id}/', update_data, format='json')
    
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    
    hotel = response.json()
    
    print(f"✓ Nom mis à jour: {hotel['name']}")
    print(f"✓ Description mise à jour: {hotel['description']}")
    print(f"✓ Rating mis à jour: {hotel['rating']}")
    print(f"✓ Chambres disponibles: {hotel['available_rooms']}")
    
    assert hotel['name'] == 'Hotel Deluxe Premium', "Nom non mis à jour"
    assert hotel['rating'] == 5.0, "Rating non mis à jour"
    assert hotel['available_rooms'] == 15, "Chambres non mises à jour"
    
    print("✅ TEST 3 RÉUSSI")
    
    # ========== TEST 4: UPDATE IMAGE ==========
    print("\n✅ TEST 4: UPDATE IMAGE - Mettre à jour l'image")
    print("-" * 60)
    
    # Image JPEG base64 simple
    image_jpeg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
    
    update_data = {
        'image_base64': image_jpeg
    }
    
    response = client.patch(f'/api/hotels/{hotel_id}/', update_data, format='json')
    
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    
    hotel = response.json()
    
    print(f"✓ Image type changé: {hotel['image_type']}")
    print(f"✓ Image size changée: {hotel['image_size']} bytes")
    print(f"✓ Image mise à jour: {hotel['image_base64'][:50]}...")
    
    assert hotel['image_type'] == 'jpeg', "Type d'image non changé"
    assert hotel['image_base64'] == image_jpeg, "Image non mise à jour"
    
    print("✅ TEST 4 RÉUSSI")
    
    # ========== TEST 5: LIST ==========
    print("\n✅ TEST 5: LIST - Lister les hôtels")
    print("-" * 60)
    
    response = client.get('/api/hotels/', format='json')
    
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    
    hotels = response.json()
    
    print(f"✓ Nombre d'hôtels: {len(hotels)}")
    print(f"✓ Premier hôtel: {hotels[0]['name']}")
    print(f"✓ Image présente: {len(hotels[0]['image_base64']) > 0}")
    
    assert len(hotels) > 0, "Aucun hôtel trouvé"
    assert hotels[0]['id'] == hotel_id, "Hôtel incorrect"
    
    print("✅ TEST 5 RÉUSSI")
    
    # ========== TEST 6: DELETE ==========
    print("\n✅ TEST 6: DELETE - Supprimer l'hôtel")
    print("-" * 60)
    
    response = client.delete(f'/api/hotels/{hotel_id}/', format='json')
    
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 204, f"Expected 204, got {response.status_code}"
    
    print(f"✓ Hôtel supprimé avec succès")
    
    # Vérifier que l'hôtel est supprimé
    response = client.get(f'/api/hotels/{hotel_id}/', format='json')
    
    print(f"Status Code après suppression: {response.status_code}")
    assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    
    print(f"✓ Hôtel introuvable après suppression")
    
    print("✅ TEST 6 RÉUSSI")
    
    # ========== RÉSUMÉ ==========
    print("\n" + "=" * 60)
    print("RÉSUMÉ DES TESTS")
    print("=" * 60)
    print("✅ CREATE - Hôtel créé avec image base64")
    print("✅ READ - Hôtel récupéré avec image")
    print("✅ UPDATE - Hôtel modifié")
    print("✅ UPDATE IMAGE - Image mise à jour")
    print("✅ LIST - Hôtels listés")
    print("✅ DELETE - Hôtel supprimé")
    print("\n🎉 TOUS LES TESTS RÉUSSIS!")
    print("=" * 60)

if __name__ == '__main__':
    try:
        test_crud()
    except AssertionError as e:
        print(f"\n❌ ERREUR: {e}")
        exit(1)
    except Exception as e:
        print(f"\n❌ ERREUR INATTENDUE: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
