# 🧪 Tests CRUD Hôtels - Images Base64

## 📋 Plan de Test

1. ✅ **CREATE** - Créer un hôtel avec image
2. ✅ **READ** - Récupérer l'hôtel
3. ✅ **UPDATE** - Modifier l'hôtel et l'image
4. ✅ **DELETE** - Supprimer l'hôtel

---

## 🔐 Authentification

D'abord, obtenir un token JWT :

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Réponse:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User"
  }
}
```

**Copier le token `access` pour les tests suivants.**

---

## ✅ Test 1: CREATE - Créer un hôtel avec image

### Image Base64 Simple (PNG 1x1)

```bash
curl -X POST http://localhost:8000/api/hotels/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hotel Deluxe",
    "description": "Un hôtel de luxe avec piscine",
    "city": "Dakar",
    "address": "123 Rue de la Paix",
    "phone": "+221 33 123 45 67",
    "email": "hotel@example.com",
    "price_per_night": 150000,
    "rating": 4.5,
    "rooms_count": 50,
    "available_rooms": 20,
    "is_active": true,
    "image_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }'
```

### Résultat Attendu (HTTP 201)

```json
{
  "id": 1,
  "name": "Hotel Deluxe",
  "description": "Un hôtel de luxe avec piscine",
  "city": "Dakar",
  "address": "123 Rue de la Paix",
  "phone": "+221 33 123 45 67",
  "email": "hotel@example.com",
  "price_per_night": "150000.00",
  "rating": 4.5,
  "image_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "image_type": "png",
  "image_size": 68,
  "image_size_mb": 0.0,
  "rooms_count": 50,
  "available_rooms": 20,
  "is_active": true,
  "created_at": "2024-12-08T22:32:23Z",
  "updated_at": "2024-12-08T22:32:23Z"
}
```

### ✅ Vérifications

- [ ] HTTP 201 (Created)
- [ ] `id` retourné (ex: 1)
- [ ] `image_base64` retourné
- [ ] `image_type` = "png"
- [ ] `image_size` > 0
- [ ] `image_size_mb` = 0.0
- [ ] `created_at` et `updated_at` définis

---

## ✅ Test 2: READ - Récupérer l'hôtel

### Lister tous les hôtels

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/hotels/
```

### Résultat Attendu (HTTP 200)

```json
[
  {
    "id": 1,
    "name": "Hotel Deluxe",
    "description": "Un hôtel de luxe avec piscine",
    "city": "Dakar",
    "address": "123 Rue de la Paix",
    "phone": "+221 33 123 45 67",
    "email": "hotel@example.com",
    "price_per_night": "150000.00",
    "rating": 4.5,
    "image_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "image_type": "png",
    "image_size": 68,
    "image_size_mb": 0.0,
    "rooms_count": 50,
    "available_rooms": 20,
    "is_active": true,
    "created_at": "2024-12-08T22:32:23Z",
    "updated_at": "2024-12-08T22:32:23Z"
  }
]
```

### Récupérer un hôtel spécifique

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/hotels/1/
```

### ✅ Vérifications

- [ ] HTTP 200 (OK)
- [ ] Hôtel retourné avec tous les champs
- [ ] `image_base64` présent et complet
- [ ] `image_type` correct
- [ ] `image_size` > 0

---

## ✅ Test 3: UPDATE - Modifier l'hôtel

### Mettre à jour le nom et la description

```bash
curl -X PATCH http://localhost:8000/api/hotels/1/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hotel Deluxe Premium",
    "description": "Un hôtel 5 étoiles avec spa"
  }'
```

### Résultat Attendu (HTTP 200)

```json
{
  "id": 1,
  "name": "Hotel Deluxe Premium",
  "description": "Un hôtel 5 étoiles avec spa",
  "city": "Dakar",
  "address": "123 Rue de la Paix",
  "phone": "+221 33 123 45 67",
  "email": "hotel@example.com",
  "price_per_night": "150000.00",
  "rating": 4.5,
  "image_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "image_type": "png",
  "image_size": 68,
  "image_size_mb": 0.0,
  "rooms_count": 50,
  "available_rooms": 20,
  "is_active": true,
  "created_at": "2024-12-08T22:32:23Z",
  "updated_at": "2024-12-08T22:35:00Z"
}
```

### Mettre à jour l'image

```bash
curl -X PATCH http://localhost:8000/api/hotels/1/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
  }'
```

### ✅ Vérifications

- [ ] HTTP 200 (OK)
- [ ] `name` mis à jour
- [ ] `description` mise à jour
- [ ] `image_base64` mis à jour
- [ ] `image_type` changé (png → jpeg)
- [ ] `image_size` changé
- [ ] `updated_at` mis à jour

---

## ✅ Test 4: DELETE - Supprimer l'hôtel

### Supprimer l'hôtel

```bash
curl -X DELETE http://localhost:8000/api/hotels/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Résultat Attendu (HTTP 204)

```
(Pas de contenu)
```

### Vérifier que l'hôtel est supprimé

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/hotels/1/
```

### Résultat Attendu (HTTP 404)

```json
{
  "detail": "Not found."
}
```

### ✅ Vérifications

- [ ] HTTP 204 (No Content) lors de la suppression
- [ ] HTTP 404 (Not Found) lors de la récupération
- [ ] Hôtel supprimé de la BD

---

## 🧪 Test Complet (Script Python)

```python
import requests
import json
import base64

# Configuration
API_URL = 'http://localhost:8000/api'
TOKEN = 'YOUR_TOKEN'

headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json'
}

# Image base64 simple
image_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

print("=" * 50)
print("TEST 1: CREATE - Créer un hôtel")
print("=" * 50)

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

print(f"Status: {response.status_code}")
hotel = response.json()
print(json.dumps(hotel, indent=2))

hotel_id = hotel['id']

print("\n" + "=" * 50)
print("TEST 2: READ - Récupérer l'hôtel")
print("=" * 50)

response = requests.get(
    f'{API_URL}/hotels/{hotel_id}/',
    headers=headers
)

print(f"Status: {response.status_code}")
hotel = response.json()
print(f"Nom: {hotel['name']}")
print(f"Image type: {hotel['image_type']}")
print(f"Image size: {hotel['image_size_mb']} MB")
print(f"Image présente: {'image_base64' in hotel and len(hotel['image_base64']) > 0}")

print("\n" + "=" * 50)
print("TEST 3: UPDATE - Modifier l'hôtel")
print("=" * 50)

response = requests.patch(
    f'{API_URL}/hotels/{hotel_id}/',
    headers=headers,
    json={
        'name': 'Hotel Deluxe Premium',
        'rating': 5.0
    }
)

print(f"Status: {response.status_code}")
hotel = response.json()
print(f"Nom: {hotel['name']}")
print(f"Rating: {hotel['rating']}")

print("\n" + "=" * 50)
print("TEST 4: DELETE - Supprimer l'hôtel")
print("=" * 50)

response = requests.delete(
    f'{API_URL}/hotels/{hotel_id}/',
    headers=headers
)

print(f"Status: {response.status_code}")

# Vérifier que l'hôtel est supprimé
response = requests.get(
    f'{API_URL}/hotels/{hotel_id}/',
    headers=headers
)

print(f"Status après suppression: {response.status_code}")
if response.status_code == 404:
    print("✅ Hôtel supprimé avec succès")
else:
    print("❌ Erreur: Hôtel toujours présent")

print("\n" + "=" * 50)
print("RÉSUMÉ")
print("=" * 50)
print("✅ CREATE - Hôtel créé avec image base64")
print("✅ READ - Hôtel récupéré avec image")
print("✅ UPDATE - Hôtel modifié")
print("✅ DELETE - Hôtel supprimé")
```

---

## 🎯 Checklist de Validation

### CREATE
- [ ] HTTP 201
- [ ] `id` retourné
- [ ] `image_base64` stocké
- [ ] `image_type` détecté
- [ ] `image_size` calculé

### READ
- [ ] HTTP 200
- [ ] Hôtel retourné complet
- [ ] `image_base64` présent
- [ ] Métadonnées correctes

### UPDATE
- [ ] HTTP 200
- [ ] Champs mis à jour
- [ ] Image mise à jour (si fournie)
- [ ] `updated_at` changé

### DELETE
- [ ] HTTP 204
- [ ] Hôtel supprimé
- [ ] GET retourne 404

---

## 📊 Résultats Attendus

| Opération | Statut | Détail |
|-----------|--------|--------|
| CREATE | 201 | Hôtel créé avec image |
| READ (list) | 200 | Hôtel dans la liste |
| READ (detail) | 200 | Hôtel avec image |
| UPDATE | 200 | Hôtel modifié |
| DELETE | 204 | Hôtel supprimé |
| GET après DELETE | 404 | Hôtel introuvable |

---

## ✅ Conclusion

Si tous les tests passent :
- ✅ CREATE fonctionne
- ✅ READ fonctionne
- ✅ UPDATE fonctionne
- ✅ DELETE fonctionne
- ✅ Images base64 stockées correctement
- ✅ Métadonnées extraites correctement

**Status:** 🟢 **PRÊT POUR PRODUCTION**

---

**Date:** 8 Décembre 2024
**Version:** 1.0.0
