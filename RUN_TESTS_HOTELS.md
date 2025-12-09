# 🧪 Exécuter les Tests CRUD Hôtels

## 📋 Méthode 1: Script Python (Recommandé)

### Exécuter le script de test

```bash
cd backend
python manage.py shell < test_hotels_crud.py
```

### Résultat Attendu

```
============================================================
TEST CRUD HÔTELS - IMAGES BASE64
============================================================

✅ TEST 1: CREATE - Créer un hôtel
------------------------------------------------------------
Status Code: 201
✓ Hôtel créé avec ID: 1
✓ Nom: Hotel Deluxe
✓ Image type: png
✓ Image size: 68 bytes (0.0 MB)
✓ Image présente: True
✅ TEST 1 RÉUSSI

✅ TEST 2: READ - Récupérer l'hôtel
------------------------------------------------------------
Status Code: 200
✓ Hôtel récupéré: Hotel Deluxe
✓ Ville: Dakar
✓ Prix: 150000
✓ Image type: png
✓ Image size: 0.0 MB
✅ TEST 2 RÉUSSI

✅ TEST 3: UPDATE - Modifier l'hôtel
------------------------------------------------------------
Status Code: 200
✓ Nom mis à jour: Hotel Deluxe Premium
✓ Description mise à jour: Un hôtel 5 étoiles avec spa
✓ Rating mis à jour: 5.0
✓ Chambres disponibles: 15
✅ TEST 3 RÉUSSI

✅ TEST 4: UPDATE IMAGE - Mettre à jour l'image
------------------------------------------------------------
Status Code: 200
✓ Image type changé: jpeg
✓ Image size changée: 159 bytes
✓ Image mise à jour: /9j/4AAQSkZJRgABAQEAYABgAAD/...
✅ TEST 4 RÉUSSI

✅ TEST 5: LIST - Lister les hôtels
------------------------------------------------------------
Status Code: 200
✓ Nombre d'hôtels: 1
✓ Premier hôtel: Hotel Deluxe Premium
✓ Image présente: True
✅ TEST 5 RÉUSSI

✅ TEST 6: DELETE - Supprimer l'hôtel
------------------------------------------------------------
Status Code: 204
✓ Hôtel supprimé avec succès
Status Code après suppression: 404
✓ Hôtel introuvable après suppression
✅ TEST 6 RÉUSSI

============================================================
RÉSUMÉ DES TESTS
============================================================
✅ CREATE - Hôtel créé avec image base64
✅ READ - Hôtel récupéré avec image
✅ UPDATE - Hôtel modifié
✅ UPDATE IMAGE - Image mise à jour
✅ LIST - Hôtels listés
✅ DELETE - Hôtel supprimé

🎉 TOUS LES TESTS RÉUSSIS!
============================================================
```

---

## 📋 Méthode 2: Tests Manuels avec cURL

### 1️⃣ Obtenir un Token

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Copier le token `access` retourné.**

### 2️⃣ CREATE - Créer un hôtel

```bash
TOKEN="votre_token_ici"

curl -X POST http://localhost:8000/api/hotels/ \
  -H "Authorization: Bearer $TOKEN" \
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

**Résultat:** HTTP 201 avec l'hôtel créé (copier l'`id`)

### 3️⃣ READ - Récupérer l'hôtel

```bash
HOTEL_ID=1

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/hotels/$HOTEL_ID/
```

**Résultat:** HTTP 200 avec l'hôtel complet

### 4️⃣ UPDATE - Modifier l'hôtel

```bash
curl -X PATCH http://localhost:8000/api/hotels/$HOTEL_ID/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hotel Deluxe Premium",
    "rating": 5.0
  }'
```

**Résultat:** HTTP 200 avec l'hôtel modifié

### 5️⃣ UPDATE IMAGE - Mettre à jour l'image

```bash
curl -X PATCH http://localhost:8000/api/hotels/$HOTEL_ID/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
  }'
```

**Résultat:** HTTP 200 avec l'image mise à jour

### 6️⃣ LIST - Lister les hôtels

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/hotels/
```

**Résultat:** HTTP 200 avec la liste des hôtels

### 7️⃣ DELETE - Supprimer l'hôtel

```bash
curl -X DELETE http://localhost:8000/api/hotels/$HOTEL_ID/ \
  -H "Authorization: Bearer $TOKEN"
```

**Résultat:** HTTP 204 (pas de contenu)

### 8️⃣ Vérifier la suppression

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/hotels/$HOTEL_ID/
```

**Résultat:** HTTP 404 (hôtel introuvable)

---

## 📋 Méthode 3: Tests avec Postman

### 1. Importer la collection

Créer une nouvelle collection "Hotels CRUD"

### 2. Configurer l'authentification

- Type: Bearer Token
- Token: `{{token}}`

### 3. Créer les requêtes

#### POST - Create Hotel
```
POST http://localhost:8000/api/hotels/
Body (JSON):
{
  "name": "Hotel Deluxe",
  "city": "Dakar",
  "address": "123 Rue",
  "phone": "+221 33 123 45 67",
  "email": "hotel@example.com",
  "price_per_night": 150000,
  "rating": 4.5,
  "rooms_count": 50,
  "available_rooms": 20,
  "image_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}
```

#### GET - Read Hotel
```
GET http://localhost:8000/api/hotels/{{hotel_id}}/
```

#### PATCH - Update Hotel
```
PATCH http://localhost:8000/api/hotels/{{hotel_id}}/
Body (JSON):
{
  "name": "Hotel Deluxe Premium",
  "rating": 5.0
}
```

#### DELETE - Delete Hotel
```
DELETE http://localhost:8000/api/hotels/{{hotel_id}}/
```

---

## ✅ Checklist de Validation

### CREATE (HTTP 201)
- [ ] Hôtel créé
- [ ] `id` retourné
- [ ] `image_base64` stocké
- [ ] `image_type` = "png"
- [ ] `image_size` > 0

### READ (HTTP 200)
- [ ] Hôtel récupéré
- [ ] Tous les champs présents
- [ ] `image_base64` complet
- [ ] Métadonnées correctes

### UPDATE (HTTP 200)
- [ ] Champs modifiés
- [ ] Image mise à jour (si fournie)
- [ ] `updated_at` changé

### DELETE (HTTP 204)
- [ ] Hôtel supprimé
- [ ] GET retourne 404

---

## 🐛 Dépannage

### Erreur 401 Unauthorized
```
Solution: Vérifier le token JWT
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'
```

### Erreur 400 Bad Request
```
Solution: Vérifier le format JSON et les champs requis
- name (requis)
- city (requis)
- address (requis)
- phone (requis)
- email (requis)
- price_per_night (requis)
```

### Erreur 404 Not Found
```
Solution: Vérifier que l'hôtel existe
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/hotels/
```

### Image base64 invalide
```
Solution: Vérifier le format
data:image/[type];base64,[données]

Types supportés: jpeg, png, gif, webp, svg
```

---

## 📊 Résumé des Tests

| Test | Méthode | Status | Détail |
|------|---------|--------|--------|
| CREATE | POST | 201 | Hôtel créé |
| READ | GET | 200 | Hôtel récupéré |
| UPDATE | PATCH | 200 | Hôtel modifié |
| UPDATE IMAGE | PATCH | 200 | Image mise à jour |
| LIST | GET | 200 | Hôtels listés |
| DELETE | DELETE | 204 | Hôtel supprimé |
| Verify Delete | GET | 404 | Hôtel introuvable |

---

## 🎯 Résultat Final

Si tous les tests passent :
- ✅ CRUD complet fonctionne
- ✅ Images base64 stockées
- ✅ Métadonnées extraites
- ✅ Prêt pour production

**Status:** 🟢 **TOUS LES TESTS RÉUSSIS**

---

**Date:** 8 Décembre 2024
**Version:** 1.0.0
