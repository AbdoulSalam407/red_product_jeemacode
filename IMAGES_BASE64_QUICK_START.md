# ⚡ Quick Start - Images Base64

## 🚀 Installation en 5 minutes

### Étape 1: Créer l'app Django

```bash
cd backend
python manage.py startapp images
```

### Étape 2: Copier les fichiers

Copier les fichiers suivants dans `backend/images/`:
- `models.py` - Modèles
- `serializers.py` - Serializers
- `views.py` - ViewSets
- `urls.py` - URLs
- `admin.py` - Admin
- `apps.py` - Configuration
- `__init__.py` - Initialisation

### Étape 3: Ajouter aux INSTALLED_APPS

**Fichier:** `backend/config/settings.py`

```python
INSTALLED_APPS = [
    # ...
    'images',
]
```

### Étape 4: Inclure les URLs

**Fichier:** `backend/config/urls.py`

```python
from django.urls import path, include

urlpatterns = [
    # ...
    path('api/', include('images.urls')),
]
```

### Étape 5: Créer les migrations

```bash
python manage.py makemigrations images
python manage.py migrate images
```

### Étape 6: Démarrer le serveur

```bash
python manage.py runserver
```

---

## 🧪 Tests Rapides

### Test 1: Créer une image

```bash
# Créer une image simple
curl -X POST http://localhost:8000/api/images/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Image",
    "description": "Image de test",
    "image_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }'
```

**Résultat attendu:** HTTP 201 avec l'image créée

### Test 2: Lister les images

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/images/
```

**Résultat attendu:** HTTP 200 avec la liste des images

### Test 3: Récupérer une image

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/images/1/
```

**Résultat attendu:** HTTP 200 avec l'image complète

### Test 4: Mettre à jour une image

```bash
curl -X PATCH http://localhost:8000/api/images/1/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Image mise à jour"}'
```

**Résultat attendu:** HTTP 200 avec l'image mise à jour

### Test 5: Supprimer une image

```bash
curl -X DELETE http://localhost:8000/api/images/1/ \
  -H "Authorization: Bearer TOKEN"
```

**Résultat attendu:** HTTP 204 (pas de contenu)

---

## 📝 Exemple Complet (Python)

```python
import requests
import base64
import json

# Configuration
API_URL = 'http://localhost:8000/api'
TOKEN = 'votre_token_jwt'

headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json'
}

# 1. Lire une image depuis un fichier
with open('image.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode()
    image_base64 = f"data:image/jpeg;base64,{image_data}"

# 2. Créer une image
response = requests.post(
    f'{API_URL}/images/',
    headers=headers,
    json={
        'title': 'Ma Chambre',
        'description': 'Photo de la chambre deluxe',
        'image_base64': image_base64
    }
)

if response.status_code == 201:
    image = response.json()
    print(f"Image créée: {image['id']}")
    image_id = image['id']
else:
    print(f"Erreur: {response.status_code}")
    print(response.json())

# 3. Récupérer l'image
response = requests.get(
    f'{API_URL}/images/{image_id}/',
    headers=headers
)

if response.status_code == 200:
    image = response.json()
    print(f"Image: {image['title']}")
    print(f"Type: {image['image_type']}")
    print(f"Taille: {image['image_size_mb']} MB")
else:
    print(f"Erreur: {response.status_code}")

# 4. Mettre à jour l'image
response = requests.patch(
    f'{API_URL}/images/{image_id}/',
    headers=headers,
    json={
        'title': 'Ma Chambre - Mise à jour',
        'description': 'Photo mise à jour'
    }
)

if response.status_code == 200:
    print("Image mise à jour")
else:
    print(f"Erreur: {response.status_code}")

# 5. Supprimer l'image
response = requests.delete(
    f'{API_URL}/images/{image_id}/',
    headers=headers
)

if response.status_code == 204:
    print("Image supprimée")
else:
    print(f"Erreur: {response.status_code}")
```

---

## 🎨 Exemple Complet (JavaScript)

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

// 2. Créer une image
async function createImage(title, description, file) {
  const imageBase64 = await fileToBase64(file);
  
  const response = await fetch(`${API_URL}/images/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title,
      description,
      image_base64: imageBase64
    })
  });

  if (response.ok) {
    const image = await response.json();
    console.log('Image créée:', image.id);
    return image;
  } else {
    console.error('Erreur:', response.status);
  }
}

// 3. Récupérer une image
async function getImage(imageId) {
  const response = await fetch(`${API_URL}/images/${imageId}/`, { headers });
  
  if (response.ok) {
    const image = await response.json();
    console.log('Image:', image.title);
    return image;
  } else {
    console.error('Erreur:', response.status);
  }
}

// 4. Mettre à jour une image
async function updateImage(imageId, data) {
  const response = await fetch(`${API_URL}/images/${imageId}/`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data)
  });

  if (response.ok) {
    const image = await response.json();
    console.log('Image mise à jour');
    return image;
  } else {
    console.error('Erreur:', response.status);
  }
}

// 5. Supprimer une image
async function deleteImage(imageId) {
  const response = await fetch(`${API_URL}/images/${imageId}/`, {
    method: 'DELETE',
    headers
  });

  if (response.status === 204) {
    console.log('Image supprimée');
  } else {
    console.error('Erreur:', response.status);
  }
}

// Utilisation
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const image = await createImage('Ma Chambre', 'Photo', file);
  console.log(image);
});
```

---

## 📊 Résumé des Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/images/` | Créer une image |
| GET | `/api/images/` | Lister les images |
| GET | `/api/images/{id}/` | Récupérer une image |
| PATCH | `/api/images/{id}/` | Mettre à jour une image |
| DELETE | `/api/images/{id}/` | Supprimer une image |
| POST | `/api/images/bulk_delete/` | Supprimer plusieurs images |
| GET | `/api/images/{id}/download/` | Télécharger une image |
| POST | `/api/images/{id}/set_primary/` | Marquer comme principale |

---

## ✅ Checklist

- [ ] App créée
- [ ] Fichiers copiés
- [ ] INSTALLED_APPS mise à jour
- [ ] URLs incluses
- [ ] Migrations créées
- [ ] Migrations appliquées
- [ ] Serveur démarré
- [ ] Tests réussis
- [ ] Frontend intégré

---

## 🐛 Dépannage

### Erreur: "No module named 'images'"

**Solution:** Vérifier que l'app est dans INSTALLED_APPS

### Erreur: "Image not found"

**Solution:** Vérifier que le TOKEN est valide

### Erreur: "Invalid base64"

**Solution:** Vérifier que l'image est au format `data:image/...;base64,...`

---

## 📚 Documentation Complète

- **IMAGES_BASE64_CRUD.md** - Documentation complète
- **IMAGES_BASE64_FRONTEND.md** - Intégration frontend

---

**Date:** 8 Décembre 2024
**Durée:** ~5 minutes
**Status:** ✅ Prêt
