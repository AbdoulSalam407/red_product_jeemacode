# ⚡ Quick Start - Images Base64 pour Hôtels

## 🚀 Installation en 3 étapes

### Étape 1: Créer la migration

```bash
cd backend
python manage.py makemigrations hotels
```

### Étape 2: Appliquer la migration

```bash
python manage.py migrate hotels
```

### Étape 3: Redémarrer le serveur

```bash
python manage.py runserver
```

---

## 🧪 Test Rapide

### Créer un hôtel avec image

```bash
curl -X POST http://localhost:8000/api/hotels/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

**Résultat attendu:** HTTP 201 avec l'hôtel créé

---

## 📝 Changements Effectués

### 1. Modèle Hotel (`models.py`)

**Avant:**
```python
image = models.ImageField(upload_to='hotels/', blank=True, null=True)
```

**Après:**
```python
image_base64 = models.TextField(blank=True, null=True)
image_type = models.CharField(max_length=50, choices=[...], default='jpeg')
image_size = models.IntegerField(default=0)
```

### 2. Serializer (`serializers.py`)

**Ajouté:**
- Validation base64
- Extraction métadonnées (type, taille)
- Méthode `get_image_size_mb()`
- Méthodes `create()` et `update()`

### 3. API Response

**Avant:**
```json
{
  "id": 1,
  "name": "Hotel",
  "image": "/media/hotels/image.jpg"
}
```

**Après:**
```json
{
  "id": 1,
  "name": "Hotel",
  "image_base64": "data:image/jpeg;base64,...",
  "image_type": "jpeg",
  "image_size": 45678,
  "image_size_mb": 0.04
}
```

---

## 📊 Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/hotels/` | Créer avec image |
| GET | `/api/hotels/` | Lister |
| GET | `/api/hotels/{id}/` | Récupérer |
| PATCH | `/api/hotels/{id}/` | Mettre à jour |
| DELETE | `/api/hotels/{id}/` | Supprimer |

---

## 💡 Exemples

### JavaScript

```javascript
// Convertir fichier en base64
const file = document.querySelector('input[type="file"]').files[0];
const reader = new FileReader();
reader.onload = (e) => {
  const imageBase64 = e.target.result; // data:image/jpeg;base64,...
  
  // Créer l'hôtel
  fetch('/api/hotels/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Hotel Deluxe',
      city: 'Dakar',
      address: '123 Rue',
      phone: '+221 33 123 45 67',
      email: 'hotel@example.com',
      price_per_night: 150000,
      rating: 4.5,
      rooms_count: 50,
      available_rooms: 20,
      image_base64: imageBase64
    })
  })
  .then(r => r.json())
  .then(data => console.log(data));
};
reader.readAsDataURL(file);
```

### Python

```python
import requests
import base64

# Lire l'image
with open('hotel.jpg', 'rb') as f:
    image_base64 = f"data:image/jpeg;base64,{base64.b64encode(f.read()).decode()}"

# Créer l'hôtel
response = requests.post(
    'http://localhost:8000/api/hotels/',
    headers={'Authorization': f'Bearer {token}'},
    json={
        'name': 'Hotel Deluxe',
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
```

---

## ✅ Checklist

- [ ] Migration créée
- [ ] Migration appliquée
- [ ] Serveur redémarré
- [ ] Test de création réussi
- [ ] Image affichée correctement
- [ ] Frontend mis à jour

---

## 🎯 Résumé

| Avant | Après |
|-------|-------|
| Images sur disque | Images en base64 |
| Fichiers `/media/` | Base de données |
| Chemin relatif | Data URL |
| Problèmes CORS | Pas de problèmes |
| Déploiement complexe | Déploiement simple |

---

## 📚 Documentation Complète

Voir **HOTELS_IMAGES_BASE64.md** pour :
- Schéma BD complet
- Tous les endpoints
- Exemples détaillés
- Intégration frontend

---

**Durée:** ~5 minutes
**Status:** ✅ Prêt
