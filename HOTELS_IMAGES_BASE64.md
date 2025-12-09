# 🏨 Images Base64 pour les Hôtels

## 📋 Vue d'ensemble

Intégration complète du stockage d'images en base64 **directement dans le modèle Hotel**.

### Caractéristiques

- ✅ Image stockée en base64 dans le champ `image_base64`
- ✅ Métadonnées automatiques (type, taille)
- ✅ Pas de fichiers sur disque
- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ Validation base64
- ✅ Limite de taille (10 MB)

---

## 🗄️ Schéma de Base de Données

### Champs ajoutés au modèle Hotel

```python
# Image stockée en base64 (pas de fichier sur disque)
image_base64 = models.TextField(
    blank=True,
    null=True,
    help_text="Image encodée en base64 (data:image/jpeg;base64,...)"
)

image_type = models.CharField(
    max_length=50,
    choices=[
        ('jpeg', 'JPEG'),
        ('png', 'PNG'),
        ('gif', 'GIF'),
        ('webp', 'WebP'),
        ('svg', 'SVG'),
    ],
    blank=True,
    null=True,
    default='jpeg'
)

image_size = models.IntegerField(
    default=0,
    help_text="Taille en bytes"
)
```

### Migration SQL

```sql
ALTER TABLE hotels_hotel ADD COLUMN image_base64 LONGTEXT;
ALTER TABLE hotels_hotel ADD COLUMN image_type VARCHAR(50) DEFAULT 'jpeg';
ALTER TABLE hotels_hotel ADD COLUMN image_size INT DEFAULT 0;
```

---

## 🔌 Endpoints API

### 1. CREATE - Créer un hôtel avec image

**Endpoint:** `POST /api/hotels/`

**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Hotel Deluxe",
  "description": "Un hôtel de luxe",
  "city": "Dakar",
  "address": "123 Rue Principale",
  "phone": "+221 33 123 45 67",
  "email": "hotel@example.com",
  "price_per_night": 150000,
  "rating": 4.5,
  "rooms_count": 50,
  "available_rooms": 20,
  "is_active": true,
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
}
```

**Réponse (201 Created):**
```json
{
  "id": 1,
  "name": "Hotel Deluxe",
  "description": "Un hôtel de luxe",
  "city": "Dakar",
  "address": "123 Rue Principale",
  "phone": "+221 33 123 45 67",
  "email": "hotel@example.com",
  "price_per_night": "150000.00",
  "rating": 4.5,
  "image_base64": "data:image/jpeg;base64,...",
  "image_type": "jpeg",
  "image_size": 45678,
  "image_size_mb": 0.04,
  "rooms_count": 50,
  "available_rooms": 20,
  "is_active": true,
  "created_at": "2024-12-08T22:00:00Z",
  "updated_at": "2024-12-08T22:00:00Z"
}
```

---

### 2. READ - Récupérer les hôtels

#### Lister tous les hôtels

**Endpoint:** `GET /api/hotels/`

**Headers:**
```
Authorization: Bearer TOKEN
```

**Réponse (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Hotel Deluxe",
    "description": "Un hôtel de luxe",
    "city": "Dakar",
    "address": "123 Rue Principale",
    "phone": "+221 33 123 45 67",
    "email": "hotel@example.com",
    "price_per_night": "150000.00",
    "rating": 4.5,
    "image_base64": "data:image/jpeg;base64,...",
    "image_type": "jpeg",
    "image_size": 45678,
    "image_size_mb": 0.04,
    "rooms_count": 50,
    "available_rooms": 20,
    "is_active": true,
    "created_at": "2024-12-08T22:00:00Z",
    "updated_at": "2024-12-08T22:00:00Z"
  }
]
```

#### Récupérer un hôtel spécifique

**Endpoint:** `GET /api/hotels/{id}/`

**Réponse (200 OK):**
```json
{
  "id": 1,
  "name": "Hotel Deluxe",
  "description": "Un hôtel de luxe",
  "city": "Dakar",
  "address": "123 Rue Principale",
  "phone": "+221 33 123 45 67",
  "email": "hotel@example.com",
  "price_per_night": "150000.00",
  "rating": 4.5,
  "image_base64": "data:image/jpeg;base64,...",
  "image_type": "jpeg",
  "image_size": 45678,
  "image_size_mb": 0.04,
  "rooms_count": 50,
  "available_rooms": 20,
  "is_active": true,
  "created_at": "2024-12-08T22:00:00Z",
  "updated_at": "2024-12-08T22:00:00Z"
}
```

---

### 3. UPDATE - Mettre à jour un hôtel

**Endpoint:** `PATCH /api/hotels/{id}/`

**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Body (mettre à jour l'image):**
```json
{
  "name": "Hotel Deluxe - Mise à jour",
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/..."
}
```

**Réponse (200 OK):**
```json
{
  "id": 1,
  "name": "Hotel Deluxe - Mise à jour",
  "description": "Un hôtel de luxe",
  "city": "Dakar",
  "address": "123 Rue Principale",
  "phone": "+221 33 123 45 67",
  "email": "hotel@example.com",
  "price_per_night": "150000.00",
  "rating": 4.5,
  "image_base64": "data:image/jpeg;base64,...",
  "image_type": "jpeg",
  "image_size": 56789,
  "image_size_mb": 0.05,
  "rooms_count": 50,
  "available_rooms": 20,
  "is_active": true,
  "created_at": "2024-12-08T22:00:00Z",
  "updated_at": "2024-12-08T23:30:00Z"
}
```

---

### 4. DELETE - Supprimer un hôtel

**Endpoint:** `DELETE /api/hotels/{id}/`

**Headers:**
```
Authorization: Bearer TOKEN
```

**Réponse (204 No Content):**
```
(Pas de contenu)
```

---

## 🔧 Installation

### Étape 1: Créer une migration

```bash
cd backend
python manage.py makemigrations hotels
```

**Résultat attendu:**
```
Migrations for 'hotels':
  hotels/migrations/XXXX_alter_hotel_image.py
    - Remove field image from hotel
    - Add field image_base64 to hotel
    - Add field image_type to hotel
    - Add field image_size to hotel
```

### Étape 2: Appliquer la migration

```bash
python manage.py migrate hotels
```

**Résultat attendu:**
```
Running migrations:
  Applying hotels.XXXX_alter_hotel_image... OK
```

### Étape 3: Redémarrer le serveur

```bash
python manage.py runserver
```

---

## 📝 Exemples d'Utilisation

### Python (requests)

```python
import requests
import base64

# Configuration
API_URL = 'http://localhost:8000/api'
TOKEN = 'votre_token_jwt'

headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json'
}

# 1. Lire une image depuis un fichier
with open('hotel.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode()
    image_base64 = f"data:image/jpeg;base64,{image_data}"

# 2. Créer un hôtel avec image
response = requests.post(
    f'{API_URL}/hotels/',
    headers=headers,
    json={
        'name': 'Hotel Deluxe',
        'description': 'Un hôtel de luxe',
        'city': 'Dakar',
        'address': '123 Rue',
        'phone': '+221 33 123 45 67',
        'email': 'hotel@example.com',
        'price_per_night': 150000,
        'rating': 4.5,
        'rooms_count': 50,
        'available_rooms': 20,
        'image_base64': image_base64
    }
)

print(response.json())

# 3. Récupérer l'hôtel
response = requests.get(
    f'{API_URL}/hotels/1/',
    headers=headers
)

hotel = response.json()
print(f"Image type: {hotel['image_type']}")
print(f"Image size: {hotel['image_size_mb']} MB")

# 4. Mettre à jour l'image
response = requests.patch(
    f'{API_URL}/hotels/1/',
    headers=headers,
    json={
        'image_base64': image_base64
    }
)

print("Image mise à jour")

# 5. Supprimer l'hôtel
response = requests.delete(
    f'{API_URL}/hotels/1/',
    headers=headers
)

print("Hôtel supprimé")
```

### JavaScript (fetch)

```javascript
// Configuration
const API_URL = 'http://localhost:8000/api';
const TOKEN = 'votre_token_jwt';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

// 1. Convertir un fichier en base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 2. Créer un hôtel avec image
async function createHotel(hotelData, imageFile) {
  const imageBase64 = await fileToBase64(imageFile);
  
  const response = await fetch(`${API_URL}/hotels/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ...hotelData,
      image_base64: imageBase64
    })
  });

  if (response.ok) {
    const hotel = await response.json();
    console.log('Hôtel créé:', hotel.id);
    return hotel;
  } else {
    console.error('Erreur:', response.status);
  }
}

// 3. Récupérer un hôtel
async function getHotel(hotelId) {
  const response = await fetch(`${API_URL}/hotels/${hotelId}/`, { headers });
  
  if (response.ok) {
    const hotel = await response.json();
    console.log('Hôtel:', hotel.name);
    console.log('Image type:', hotel.image_type);
    console.log('Image size:', hotel.image_size_mb, 'MB');
    return hotel;
  } else {
    console.error('Erreur:', response.status);
  }
}

// 4. Mettre à jour un hôtel
async function updateHotel(hotelId, data) {
  const response = await fetch(`${API_URL}/hotels/${hotelId}/`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data)
  });

  if (response.ok) {
    const hotel = await response.json();
    console.log('Hôtel mis à jour');
    return hotel;
  } else {
    console.error('Erreur:', response.status);
  }
}

// 5. Supprimer un hôtel
async function deleteHotel(hotelId) {
  const response = await fetch(`${API_URL}/hotels/${hotelId}/`, {
    method: 'DELETE',
    headers
  });

  if (response.status === 204) {
    console.log('Hôtel supprimé');
  } else {
    console.error('Erreur:', response.status);
  }
}

// Utilisation
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const hotel = await createHotel({
    name: 'Hotel Deluxe',
    description: 'Un hôtel de luxe',
    city: 'Dakar',
    address: '123 Rue',
    phone: '+221 33 123 45 67',
    email: 'hotel@example.com',
    price_per_night: 150000,
    rating: 4.5,
    rooms_count: 50,
    available_rooms: 20
  }, file);
  
  console.log(hotel);
});
```

### cURL

```bash
# Créer un hôtel avec image
curl -X POST http://localhost:8000/api/hotels/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hotel Deluxe",
    "description": "Un hôtel de luxe",
    "city": "Dakar",
    "address": "123 Rue",
    "phone": "+221 33 123 45 67",
    "email": "hotel@example.com",
    "price_per_night": 150000,
    "rating": 4.5,
    "rooms_count": 50,
    "available_rooms": 20,
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/..."
  }'

# Récupérer les hôtels
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/hotels/

# Mettre à jour un hôtel
curl -X PATCH http://localhost:8000/api/hotels/1/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hotel Deluxe - Mise à jour",
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/..."
  }'

# Supprimer un hôtel
curl -X DELETE http://localhost:8000/api/hotels/1/ \
  -H "Authorization: Bearer TOKEN"
```

---

## 🎨 Intégration Frontend

### Hook React

```typescript
import { useState, useCallback } from 'react';
import api from '../lib/api';

export const useHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const createHotel = useCallback(async (hotelData, imageFile) => {
    setLoading(true);
    try {
      // Convertir l'image en base64
      const reader = new FileReader();
      const imageBase64 = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(imageFile);
      });

      // Créer l'hôtel
      const response = await api.post('/hotels/', {
        ...hotelData,
        image_base64: imageBase64
      });

      setHotels(prev => [response.data, ...prev]);
      return response.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { hotels, loading, createHotel };
};
```

### Composant Upload

```typescript
import React, { useRef, useState } from 'react';
import { useHotels } from '../hooks/useHotels';

export const HotelUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { createHotel } = useHotels();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Créer un preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    await createHotel({
      name: 'Hotel Deluxe',
      description: 'Un hôtel de luxe',
      city: 'Dakar',
      address: '123 Rue',
      phone: '+221 33 123 45 67',
      email: 'hotel@example.com',
      price_per_night: 150000,
      rating: 4.5,
      rooms_count: 50,
      available_rooms: 20
    }, file);
  };

  return (
    <div>
      {preview && <img src={preview} alt="Preview" className="w-48 h-48 object-cover" />}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
      <button onClick={handleUpload}>Créer l'hôtel</button>
    </div>
  );
};
```

---

## ✅ Avantages

- ✅ **Pas de fichiers** - Tout en base de données
- ✅ **Sécurisé** - Pas d'accès direct aux fichiers
- ✅ **Portable** - Facile à sauvegarder et restaurer
- ✅ **Intégré** - Image directement dans l'hôtel
- ✅ **Performant** - Métadonnées indexées
- ✅ **Simple** - Un seul modèle

---

## ⚠️ Limitations

- ⚠️ **Taille BD** - Les images augmentent la taille de la BD
- ⚠️ **Performance** - Les très grandes images peuvent ralentir
- ⚠️ **Bande passante** - Le base64 augmente la taille de 33%

---

## 📊 Résumé

| Aspect | Détail |
|--------|--------|
| **Stockage** | Base de données (TextField) |
| **Format** | Base64 (data:image/...;base64,...) |
| **Limite** | 10 MB par image |
| **Métadonnées** | Type, taille |
| **Authentification** | JWT requise |
| **Intégration** | Directement dans Hotel |

---

## 🧪 Tests

```bash
# Test de création
curl -X POST http://localhost:8000/api/hotels/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hotel",
    "city": "Dakar",
    "address": "123 Rue",
    "phone": "+221 33 123 45 67",
    "email": "test@hotel.com",
    "price_per_night": 100000,
    "image_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }'

# Test de lecture
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/hotels/1/

# Test de mise à jour
curl -X PATCH http://localhost:8000/api/hotels/1/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Hotel Updated"}'

# Test de suppression
curl -X DELETE http://localhost:8000/api/hotels/1/ \
  -H "Authorization: Bearer TOKEN"
```

---

**Date:** 8 Décembre 2024
**Version:** 1.0.0
**Status:** ✅ Production Ready
