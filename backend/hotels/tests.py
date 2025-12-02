from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Hotel

User = get_user_model()

class HotelListTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        # Créer des hôtels de test
        Hotel.objects.create(
            name='Hôtel Dakar Palace',
            city='Dakar',
            address='Avenue Cheikh Anta Diop',
            phone='+221 33 869 00 00',
            email='info@dakarpalace.sn',
            price_per_night=150.00,
            rating=4.8
        )
        Hotel.objects.create(
            name='Saly Beach Resort',
            city='Saly',
            address='Plage de Saly',
            phone='+221 33 957 00 00',
            email='contact@salybeach.sn',
            price_per_night=120.00,
            rating=4.6
        )

    def test_hotel_list(self):
        response = self.client.get('/api/hotels/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_hotel_filter_by_city(self):
        response = self.client.get('/api/hotels/?city=Dakar')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Hôtel Dakar Palace')

    def test_hotel_search(self):
        response = self.client.get('/api/hotels/?search=Palace')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_hotel_ordering(self):
        response = self.client.get('/api/hotels/?ordering=-price_per_night')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['price_per_night'], 150.0)

class HotelDetailTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.hotel = Hotel.objects.create(
            name='Test Hotel',
            city='Dakar',
            address='Test Address',
            phone='+221 33 869 00 00',
            email='test@hotel.sn',
            price_per_night=100.00,
            rating=4.5
        )

    def test_hotel_detail(self):
        response = self.client.get(f'/api/hotels/{self.hotel.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Hotel')

    def test_hotel_update(self):
        data = {
            'name': 'Updated Hotel',
            'city': 'Dakar',
            'address': 'Test Address',
            'phone': '+221 33 869 00 00',
            'email': 'test@hotel.sn',
            'price_per_night': 150.00,
            'rating': 4.8
        }
        response = self.client.put(f'/api/hotels/{self.hotel.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Hotel')

    def test_hotel_delete(self):
        response = self.client.delete(f'/api/hotels/{self.hotel.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Hotel.objects.filter(id=self.hotel.id).exists())

class HotelCreateTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_hotel_create(self):
        data = {
            'name': 'New Hotel',
            'city': 'Dakar',
            'address': 'New Address',
            'phone': '+221 33 869 00 00',
            'email': 'new@hotel.sn',
            'price_per_night': 100.00,
            'rating': 4.5
        }
        response = self.client.post('/api/hotels/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Hotel.objects.count(), 1)

    def test_hotel_create_unauthenticated(self):
        self.client.force_authenticate(user=None)
        data = {
            'name': 'New Hotel',
            'city': 'Dakar',
            'address': 'New Address',
            'phone': '+221 33 869 00 00',
            'email': 'new@hotel.sn',
            'price_per_night': 100.00,
            'rating': 4.5
        }
        response = self.client.post('/api/hotels/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
