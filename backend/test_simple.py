#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Test CRUD simple pour les hôtels"""

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Ajouter testserver a ALLOWED_HOSTS avant django.setup()
from django.conf import settings
if 'testserver' not in settings.ALLOWED_HOSTS:
    settings.ALLOWED_HOSTS.append('testserver')

django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from hotels.models import Hotel

User = get_user_model()

# Image base64 simple
IMAGE_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

def get_token():
    """Obtenir un token JWT"""
    try:
        user = User.objects.get(email='admin@example.com')
    except User.DoesNotExist:
        user = User.objects.create_user(
            email='admin@example.com',
            password='admin123',
            username='admin'
        )
    
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)

def main():
    client = APIClient()
    token = get_token()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    print("=" * 60)
    print("TEST CRUD HOTELS - IMAGES BASE64")
    print("=" * 60)
    
    # TEST 1: CREATE
    print("\n[1/6] CREATE - Creer un hotel")
    print("-" * 60)
    
    hotel_data = {
        'name': 'Hotel Deluxe',
        'description': 'Un hotel de luxe',
        'city': 'Dakar',
        'address': '123 Rue',
        'phone': '+221 33 123 45 67',
        'email': 'hotel@example.com',
        'price_per_night': 150000,
        'rating': 4.5,
        'rooms_count': 50,
        'available_rooms': 20,
        'image_base64': IMAGE_BASE64
    }
    
    response = client.post('/api/hotels/', hotel_data, format='json')
    print(f"Status: {response.status_code}")
    
    if response.status_code != 201:
        try:
            print(f"ERREUR: {response.data}")
        except:
            print(f"ERREUR: {response.content}")
        return False
    
    hotel = response.json()
    hotel_id = hotel['id']
    
    print(f"[OK] Hotel cree avec ID: {hotel_id}")
    print(f"[OK] Nom: {hotel['name']}")
    print(f"[OK] Image type: {hotel['image_type']}")
    print(f"[OK] Image size: {hotel['image_size']} bytes")
    print("[OK] TEST 1 REUSSI")
    
    # TEST 2: READ
    print("\n[2/6] READ - Recuperer l'hotel")
    print("-" * 60)
    
    response = client.get(f'/api/hotels/{hotel_id}/', format='json')
    print(f"Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"ERREUR: {response.data}")
        return False
    
    hotel = response.json()
    print(f"[OK] Hotel recupere: {hotel['name']}")
    print(f"[OK] Ville: {hotel['city']}")
    print(f"[OK] Image type: {hotel['image_type']}")
    print("[OK] TEST 2 REUSSI")
    
    # TEST 3: UPDATE
    print("\n[3/6] UPDATE - Modifier l'hotel")
    print("-" * 60)
    
    update_data = {
        'name': 'Hotel Deluxe Premium',
        'rating': 5.0
    }
    
    response = client.patch(f'/api/hotels/{hotel_id}/', update_data, format='json')
    print(f"Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"ERREUR: {response.data}")
        return False
    
    hotel = response.json()
    print(f"[OK] Nom mis a jour: {hotel['name']}")
    print(f"[OK] Rating mis a jour: {hotel['rating']}")
    print("[OK] TEST 3 REUSSI")
    
    # TEST 4: UPDATE IMAGE
    print("\n[4/6] UPDATE IMAGE - Mettre a jour l'image")
    print("-" * 60)
    
    image_jpeg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
    
    response = client.patch(f'/api/hotels/{hotel_id}/', {'image_base64': image_jpeg}, format='json')
    print(f"Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"ERREUR: {response.data}")
        return False
    
    hotel = response.json()
    print(f"[OK] Image type: {hotel['image_type']}")
    print(f"[OK] Image size: {hotel['image_size']} bytes")
    print("[OK] TEST 4 REUSSI")
    
    # TEST 5: LIST
    print("\n[5/6] LIST - Lister les hotels")
    print("-" * 60)
    
    response = client.get('/api/hotels/', format='json')
    print(f"Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"ERREUR: {response.data}")
        return False
    
    data = response.json()
    # Vérifier si c'est une liste ou un dictionnaire avec 'results'
    if isinstance(data, list):
        hotels = data
    else:
        hotels = data.get('results', [])
    
    print(f"[OK] Nombre d'hotels: {len(hotels)}")
    if hotels:
        print(f"[OK] Premier hotel: {hotels[0]['name']}")
    print("[OK] TEST 5 REUSSI")
    
    # TEST 6: DELETE
    print("\n[6/6] DELETE - Supprimer l'hotel")
    print("-" * 60)
    
    response = client.delete(f'/api/hotels/{hotel_id}/', format='json')
    print(f"Status: {response.status_code}")
    
    if response.status_code != 204:
        print(f"ERREUR: {response.data}")
        return False
    
    print(f"[OK] Hotel supprime")
    
    # Verifier
    response = client.get(f'/api/hotels/{hotel_id}/', format='json')
    if response.status_code != 404:
        print(f"ERREUR: Hotel toujours present")
        return False
    
    print(f"[OK] Hotel introuvable apres suppression")
    print("[OK] TEST 6 REUSSI")
    
    # RESUME
    print("\n" + "=" * 60)
    print("RESUME DES TESTS")
    print("=" * 60)
    print("[OK] CREATE - Hotel cree avec image base64")
    print("[OK] READ - Hotel recupere avec image")
    print("[OK] UPDATE - Hotel modifie")
    print("[OK] UPDATE IMAGE - Image mise a jour")
    print("[OK] LIST - Hotels listes")
    print("[OK] DELETE - Hotel supprime")
    print("\n[OK][OK][OK] TOUS LES TESTS REUSSIS! [OK][OK][OK]")
    print("=" * 60)
    
    return True

if __name__ == '__main__':
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\nERREUR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
