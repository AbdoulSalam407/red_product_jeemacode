# 🖼️ CRUD Complet pour Images en Base64

## 📋 Vue d'ensemble

Système complet de gestion des images en base64 **sans stockage de fichiers**. Tout est stocké en base de données.

### Caractéristiques

- ✅ Stockage en base64 (TextField)
- ✅ Pas de fichiers sur le disque
- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ API REST avec endpoints clairs
- ✅ Gestion des métadonnées (type, taille, dimensions)
- ✅ Support multi-images par hôtel
- ✅ Authentification requise

---

## 🗄️ Schéma de Base de Données

### Table: `images_image`

```sql
CREATE TABLE images_image (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_base64 LONGTEXT NOT NULL,  -- Stockage base64
    image_type VARCHAR(50),           -- jpeg, png, gif, webp, svg
    image_size INT,                   -- Taille en bytes
    image_width INT,                  -- Largeur en pixels
    image_height INT,                 -- Hauteur en pixels
    user_id BIGINT NOT NULL,          -- Référence à l'utilisateur
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users_customuser(id),
    INDEX (user_id, is_active),
    INDEX (image_type),
    INDEX (created_at DESC)
);
```

### Table: `images_hotelimage`

```sql
CREATE TABLE images_hotelimage (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hotel_id BIGINT NOT NULL,
    image_id BIGINT NOT NULL,
    order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels_hotel(id),
    FOREIGN KEY (image_id) REFERENCES images_image(id),
    UNIQUE KEY (hotel_id, image_id),
    INDEX (is_primary)
);
```

---

## 🔌 Endpoints API

### 1. CREATE - Créer une image

**Endpoint:** `POST /api/images/`

**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Chambre Deluxe",
  "description": "Photo de la chambre deluxe",
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k"
}
```

**Réponse (201 Created):**
```json
{
  "id": 1,
  "title": "Chambre Deluxe",
  "description": "Photo de la chambre deluxe",
  "image_base64": "data:image/jpeg;base64,...",
  "image_type": "jpeg",
  "image_size": 45678,
  "image_size_mb": 0.04,
  "image_width": 1920,
  "image_height": 1080,
  "image_url": "data:image/jpeg;base64,...",
  "is_active": true,
  "created_at": "2024-12-08T22:00:00Z",
  "updated_at": "2024-12-08T22:00:00Z"
}
```

---

### 2. READ - Récupérer les images

#### Lister toutes les images

**Endpoint:** `GET /api/images/`

**Headers:**
```
Authorization: Bearer TOKEN
```

**Réponse (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Chambre Deluxe",
    "image_base64": "data:image/jpeg;base64,...",
    "image_type": "jpeg",
    "image_size_mb": 0.04,
    "is_active": true,
    "created_at": "2024-12-08T22:00:00Z"
  },
  {
    "id": 2,
    "title": "Piscine",
    "image_base64": "data:image/png;base64,...",
    "image_type": "png",
    "image_size_mb": 0.12,
    "is_active": true,
    "created_at": "2024-12-08T23:00:00Z"
  }
]
```

#### Récupérer une image spécifique

**Endpoint:** `GET /api/images/{id}/`

**Réponse (200 OK):**
```json
{
  "id": 1,
  "title": "Chambre Deluxe",
  "description": "Photo de la chambre deluxe",
  "image_base64": "data:image/jpeg;base64,...",
  "image_type": "jpeg",
  "image_size": 45678,
  "image_size_mb": 0.04,
  "image_width": 1920,
  "image_height": 1080,
  "image_url": "data:image/jpeg;base64,...",
  "is_active": true,
  "created_at": "2024-12-08T22:00:00Z",
  "updated_at": "2024-12-08T22:00:00Z"
}
```

#### Télécharger une image

**Endpoint:** `GET /api/images/{id}/download/`

**Réponse (200 OK):**
```json
{
  "title": "Chambre Deluxe",
  "image_base64": "data:image/jpeg;base64,...",
  "image_type": "jpeg",
  "image_size_mb": 0.04
}
```

---

### 3. UPDATE - Mettre à jour une image

**Endpoint:** `PATCH /api/images/{id}/`

**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Chambre Deluxe - Mise à jour",
  "description": "Photo mise à jour",
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/..."
}
```

**Réponse (200 OK):**
```json
{
  "id": 1,
  "title": "Chambre Deluxe - Mise à jour",
  "description": "Photo mise à jour",
  "image_base64": "data:image/jpeg;base64,...",
  "image_type": "jpeg",
  "image_size": 56789,
  "image_size_mb": 0.05,
  "image_width": 2048,
  "image_height": 1536,
  "image_url": "data:image/jpeg;base64,...",
  "is_active": true,
  "created_at": "2024-12-08T22:00:00Z",
  "updated_at": "2024-12-08T23:30:00Z"
}
```

---

### 4. DELETE - Supprimer une image

**Endpoint:** `DELETE /api/images/{id}/`

**Headers:**
```
Authorization: Bearer TOKEN
```

**Réponse (204 No Content):**
```
(Pas de contenu)
```

#### Supprimer plusieurs images

**Endpoint:** `POST /api/images/bulk_delete/`

**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "ids": [1, 2, 3]
}
```

**Réponse (200 OK):**
```json
{
  "message": "3 image(s) supprimée(s)",
  "deleted_count": 3
}
```

---

## 🏨 Endpoints pour les Images des Hôtels

### Ajouter une image à un hôtel

**Endpoint:** `POST /api/hotel-images/`

**Body:**
```json
{
  "hotel": 1,
  "image": 1,
  "order": 0,
  "is_primary": true
}
```

**Réponse (201 Created):**
```json
{
  "id": 1,
  "image": {
    "id": 1,
    "title": "Chambre Deluxe",
    "image_base64": "data:image/jpeg;base64,...",
    "image_type": "jpeg",
    "image_size_mb": 0.04,
    "image_url": "data:image/jpeg;base64,...",
    "is_active": true,
    "created_at": "2024-12-08T22:00:00Z",
    "updated_at": "2024-12-08T22:00:00Z"
  },
  "order": 0,
  "is_primary": true,
  "created_at": "2024-12-08T22:00:00Z"
}
```

### Récupérer les images d'un hôtel

**Endpoint:** `GET /api/hotel-images/by_hotel/?hotel_id=1`

**Réponse (200 OK):**
```json
[
  {
    "id": 1,
    "image": {
      "id": 1,
      "title": "Chambre Deluxe",
      "image_base64": "data:image/jpeg;base64,...",
      "image_type": "jpeg",
      "image_size_mb": 0.04,
      "image_url": "data:image/jpeg;base64,...",
      "is_active": true,
      "created_at": "2024-12-08T22:00:00Z",
      "updated_at": "2024-12-08T22:00:00Z"
    },
    "order": 0,
    "is_primary": true,
    "created_at": "2024-12-08T22:00:00Z"
  }
]
```

### Récupérer l'image principale d'un hôtel

**Endpoint:** `GET /api/hotel-images/primary_by_hotel/?hotel_id=1`

**Réponse (200 OK):**
```json
{
  "id": 1,
  "image": {
    "id": 1,
    "title": "Chambre Deluxe",
    "image_base64": "data:image/jpeg;base64,...",
    "image_type": "jpeg",
    "image_size_mb": 0.04,
    "image_url": "data:image/jpeg;base64,...",
    "is_active": true,
    "created_at": "2024-12-08T22:00:00Z",
    "updated_at": "2024-12-08T22:00:00Z"
  },
  "order": 0,
  "is_primary": true,
  "created_at": "2024-12-08T22:00:00Z"
}
```

### Marquer une image comme principale

**Endpoint:** `POST /api/images/{id}/set_primary/?hotel_id=1`

**Réponse (200 OK):**
```json
{
  "message": "Image marquée comme principale"
}
```

---

## 🔧 Installation

### 1. Ajouter l'app aux INSTALLED_APPS

**Fichier:** `backend/config/settings.py`

```python
INSTALLED_APPS = [
    # ...
    'images',
]
```

### 2. Inclure les URLs

**Fichier:** `backend/config/urls.py`

```python
urlpatterns = [
    # ...
    path('api/', include('images.urls')),
]
```

### 3. Créer les migrations

```bash
python manage.py makemigrations images
python manage.py migrate images
```

### 4. Tester

```bash
python manage.py runserver
```

---

## 📝 Exemples d'Utilisation

### Python (requests)

```python
import requests
import base64

# Lire une image
with open('image.jpg', 'rb') as f:
    image_data = f.read()
    image_base64 = base64.b64encode(image_data).decode()
    image_base64_url = f"data:image/jpeg;base64,{image_base64}"

# Créer une image
response = requests.post(
    'http://localhost:8000/api/images/',
    headers={'Authorization': f'Bearer {token}'},
    json={
        'title': 'Chambre Deluxe',
        'description': 'Photo de la chambre',
        'image_base64': image_base64_url
    }
)

print(response.json())
```

### JavaScript (fetch)

```javascript
// Lire une image
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const reader = new FileReader();
reader.onload = (e) => {
  const imageBase64 = e.target.result; // data:image/jpeg;base64,...
  
  // Créer une image
  fetch('/api/images/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Chambre Deluxe',
      description: 'Photo de la chambre',
      image_base64: imageBase64
    })
  })
  .then(r => r.json())
  .then(data => console.log(data));
};

reader.readAsDataURL(file);
```

### cURL

```bash
# Créer une image
curl -X POST http://localhost:8000/api/images/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chambre Deluxe",
    "description": "Photo de la chambre",
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/..."
  }'

# Récupérer les images
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/images/

# Mettre à jour une image
curl -X PATCH http://localhost:8000/api/images/1/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chambre Deluxe - Mise à jour"
  }'

# Supprimer une image
curl -X DELETE http://localhost:8000/api/images/1/ \
  -H "Authorization: Bearer TOKEN"
```

---

## ⚙️ Configuration

### Limite de taille

**Fichier:** `backend/images/serializers.py` (ligne 80)

```python
# Vérifier la taille (max 10 MB)
if len(image_data) > 10 * 1024 * 1024:
    raise serializers.ValidationError("L'image ne doit pas dépasser 10 MB")
```

Modifier `10 * 1024 * 1024` pour changer la limite.

### Types d'images supportés

**Fichier:** `backend/images/models.py` (ligne 28-35)

```python
image_type = models.CharField(
    max_length=50,
    choices=[
        ('jpeg', 'JPEG'),
        ('png', 'PNG'),
        ('gif', 'GIF'),
        ('webp', 'WebP'),
        ('svg', 'SVG'),
    ],
    default='jpeg',
)
```

---

## 🧪 Tests

### Test de création

```bash
curl -X POST http://localhost:8000/api/images/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Image",
    "image_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }'
```

### Test de lecture

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/images/1/
```

### Test de mise à jour

```bash
curl -X PATCH http://localhost:8000/api/images/1/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Image mise à jour"}'
```

### Test de suppression

```bash
curl -X DELETE http://localhost:8000/api/images/1/ \
  -H "Authorization: Bearer TOKEN"
```

---

## ✅ Avantages

- ✅ **Pas de fichiers** - Tout en base de données
- ✅ **Sécurisé** - Pas d'accès direct aux fichiers
- ✅ **Portable** - Facile à sauvegarder et restaurer
- ✅ **Scalable** - Fonctionne avec n'importe quel nombre d'images
- ✅ **Performant** - Métadonnées indexées
- ✅ **Flexible** - Support de plusieurs formats

---

## ⚠️ Limitations

- ⚠️ **Taille BD** - Les images augmentent la taille de la base de données
- ⚠️ **Performance** - Les très grandes images peuvent ralentir les requêtes
- ⚠️ **Bande passante** - Le base64 augmente la taille de 33%

---

## 📊 Résumé

| Aspect | Détail |
|--------|--------|
| **Stockage** | Base de données (TextField) |
| **Format** | Base64 (data:image/...;base64,...) |
| **Limite** | 10 MB par image |
| **Authentification** | JWT requise |
| **Endpoints** | 8+ endpoints |
| **Métadonnées** | Type, taille, dimensions |

---

**Date:** 8 Décembre 2024
**Version:** 1.0.0
**Status:** ✅ Production Ready
