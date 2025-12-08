# Guide de Débogage Rapide - CRUD Hôtels

## 🚨 Problèmes Courants et Solutions

### 1. Images ne s'affichent pas

**Symptôme:** Images manquantes, affichage de la première lettre

**Diagnostic:**
```javascript
// Console du navigateur
console.log('Hotel image:', hotel.image);
console.log('API URL:', import.meta.env.VITE_API_URL);
```

**Solutions:**

#### A. Image serveur (chemin relatif)
```
❌ Mauvais: hotel.image = "hotels/image.jpg"
✅ Correct: http://localhost:8000/media/hotels/image.jpg
```

**Fix:**
```typescript
const imageUrl = hotel.image.startsWith('data:') 
  || hotel.image.startsWith('http')
  || hotel.image.startsWith('/')
  ? hotel.image 
  : `${import.meta.env.VITE_API_URL?.replace('/api', '')}/media/${hotel.image}`;
```

#### B. Dossier media non créé
```bash
# Créer le dossier
mkdir -p backend/media/hotels
chmod 755 backend/media
```

#### C. Image invalide
```bash
# Vérifier les permissions
ls -la backend/media/hotels/
chmod 644 backend/media/hotels/*
```

---

### 2. Erreur "CORS error"

**Symptôme:** `Access to XMLHttpRequest blocked by CORS policy`

**Diagnostic:**
```javascript
// Console du navigateur
// Vérifier l'URL de l'API
console.log('API URL:', import.meta.env.VITE_API_URL);
```

**Solution:**
```python
# backend/config/settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

---

### 3. Erreur "Connection refused"

**Symptôme:** `Error: connect ECONNREFUSED 127.0.0.1:8000`

**Diagnostic:**
```bash
# Vérifier si le serveur Django est en cours d'exécution
curl http://localhost:8000
```

**Solution:**
```bash
cd backend
python manage.py runserver
```

---

### 4. Cache pas à jour

**Symptôme:** Données obsolètes après modification

**Diagnostic:**
```javascript
// Console du navigateur
localStorage.getItem('hotels_cache_time');
Date.now() - parseInt(localStorage.getItem('hotels_cache_time'));
```

**Solution:**
```javascript
// Vider le cache
localStorage.removeItem('hotels_cache');
localStorage.removeItem('hotels_cache_time');

// Recharger la page
location.reload();
```

---

### 5. Erreur "Token invalid"

**Symptôme:** `401 Unauthorized` ou `Token is invalid or expired`

**Diagnostic:**
```javascript
// Console du navigateur
console.log('Access token:', localStorage.getItem('access_token'));
console.log('Refresh token:', localStorage.getItem('refresh_token'));
```

**Solution:**
```javascript
// Se reconnecter
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
window.location.href = '/login';
```

---

### 6. Erreur "Champs requis"

**Symptôme:** `400 Bad Request` avec erreurs de validation

**Diagnostic:**
```javascript
// Console du navigateur
console.log('Form data:', data);
```

**Champs requis:**
- `name` - Nom de l'hôtel
- `city` - Ville
- `address` - Adresse
- `phone` - Téléphone
- `email` - Email
- `price_per_night` - Prix par nuit

**Solution:**
```typescript
// Vérifier le formulaire
if (!data.name || !data.city || !data.address || !data.phone || !data.email || !data.price_per_night) {
  console.error('Champs requis manquants');
  return;
}
```

---

### 7. Image ne se sauvegarde pas

**Symptôme:** Image créée mais non persistée

**Diagnostic:**
```bash
# Vérifier les fichiers uploadés
ls -la backend/media/hotels/
```

**Solution:**

#### A. Dossier non accessible
```bash
chmod 755 backend/media
chmod 755 backend/media/hotels
```

#### B. Image non envoyée
```javascript
// Console du navigateur
console.log('Selected image:', selectedImage);
console.log('Is File?', selectedImage instanceof File);
```

#### C. FormData incorrect
```typescript
// Vérifier le FormData
const formData = new FormData();
formData.append('image', selectedImage);
console.log('FormData entries:', [...formData.entries()]);
```

---

### 8. Spinner ne disparaît pas

**Symptôme:** Spinner visible en permanence

**Diagnostic:**
```javascript
// Console du navigateur
console.log('Syncing IDs:', syncingHotelIds);
```

**Solution:**

#### A. Erreur non gérée
```typescript
// Vérifier les logs backend
python manage.py runserver --verbosity 2
```

#### B. Promise non résolue
```typescript
// Vérifier que la requête se termine
await api.patch(`/hotels/${id}/`, formData);
```

---

### 9. Modification non persistée

**Symptôme:** Modification visible mais disparaît après refresh

**Diagnostic:**
```javascript
// Console du navigateur
// Vérifier la réponse du serveur
console.log('Response data:', response.data);
```

**Solution:**

#### A. Erreur serveur silencieuse
```bash
# Vérifier les logs backend
python manage.py runserver --verbosity 2
```

#### B. Cache non invalidé
```typescript
// Vérifier l'invalidation du cache
invalidateCache();
```

---

### 10. Erreur "Image invalide"

**Symptôme:** `400 Bad Request` avec erreur image

**Diagnostic:**
```javascript
// Console du navigateur
console.log('Image size:', selectedImage.size);
console.log('Image type:', selectedImage.type);
```

**Vérifications:**
- Taille: < 5MB
- Type: image/jpeg, image/png, image/gif, image/webp
- Format: Non corrompu

**Solution:**
```typescript
// Valider avant envoi
if (selectedImage.size > 5 * 1024 * 1024) {
  console.error('Image trop grande');
  return;
}

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!allowedTypes.includes(selectedImage.type)) {
  console.error('Format non supporté');
  return;
}
```

---

## 🔧 Commandes Utiles

### Frontend

```bash
# Démarrer le serveur
npm run dev

# Build pour production
npm run build

# Vérifier les erreurs TypeScript
npm run type-check

# Linter
npm run lint
```

### Backend

```bash
# Démarrer le serveur
python manage.py runserver

# Démarrer avec verbosité
python manage.py runserver --verbosity 2

# Migrations
python manage.py makemigrations
python manage.py migrate

# Shell Django
python manage.py shell

# Admin
python manage.py createsuperuser
```

### Base de Données

```bash
# Accéder à la BD
python manage.py dbshell

# Vérifier les hôtels
SELECT * FROM hotels_hotel;

# Vérifier les images
SELECT id, name, image FROM hotels_hotel;
```

---

## 📊 Vérifications Rapides

### Frontend

```javascript
// Vérifier l'API URL
console.log('API URL:', import.meta.env.VITE_API_URL);

// Vérifier les tokens
console.log('Access token:', localStorage.getItem('access_token'));
console.log('Refresh token:', localStorage.getItem('refresh_token'));

// Vérifier le cache
console.log('Cache:', localStorage.getItem('hotels_cache'));
console.log('Cache time:', localStorage.getItem('hotels_cache_time'));

// Vérifier les hôtels
console.log('Hotels:', hotels);

// Vérifier les erreurs
console.log('Error:', error);
```

### Backend

```python
# Shell Django
python manage.py shell

# Vérifier les hôtels
from hotels.models import Hotel
Hotel.objects.all()

# Vérifier les images
Hotel.objects.values('id', 'name', 'image')

# Vérifier les permissions
import os
os.stat('media/hotels')
```

---

## 🌐 Vérifications Réseau

### DevTools Network

```
1. Ouvrir F12 → Network
2. Recharger la page
3. Vérifier les requêtes:
   - GET /api/hotels/ → 200 OK
   - POST /api/hotels/ → 201 Created
   - PATCH /api/hotels/{id}/ → 200 OK
   - DELETE /api/hotels/{id}/ → 204 No Content
```

### Curl

```bash
# Lister les hôtels
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/hotels/

# Créer un hôtel
curl -X POST -H "Authorization: Bearer TOKEN" \
  -F "name=Test" \
  -F "city=Dakar" \
  http://localhost:8000/api/hotels/

# Mettre à jour un hôtel
curl -X PATCH -H "Authorization: Bearer TOKEN" \
  -F "name=Test Updated" \
  http://localhost:8000/api/hotels/1/

# Supprimer un hôtel
curl -X DELETE -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/hotels/1/
```

---

## 📝 Logs Importants

### Frontend

```
[Frontend] Form data before submit: {...}
[Frontend] Create data: {...}
[Frontend] Modified data: {...}
[Frontend] Deleting hotel: {...}
[Frontend] Error: {...}
```

### Backend

```
[Backend] Create hotel request data: <QueryDict: {...}>
[Backend] Hotel creation validation errors: {...}
[Backend] Update hotel request data: <QueryDict: {...}>
[Backend] Delete hotel request: DELETE /hotels/1/
```

---

## 🆘 Escalade

Si le problème persiste:

1. **Vérifier les logs** (Frontend + Backend)
2. **Vérifier la configuration** (.env)
3. **Vérifier la base de données** (Django admin)
4. **Redémarrer les serveurs**
5. **Vider le cache** (localStorage)
6. **Consulter la documentation**

---

## 📞 Contacts

- **Frontend:** Vérifier `frontend/src/`
- **Backend:** Vérifier `backend/hotels/`
- **Base de données:** Vérifier `backend/media/`
- **Logs:** Vérifier la console du navigateur et le terminal

---

## ✅ Checklist de Débogage

- [ ] Vérifier les logs (Frontend + Backend)
- [ ] Vérifier la configuration (.env)
- [ ] Vérifier la connexion réseau (DevTools)
- [ ] Vérifier le cache (localStorage)
- [ ] Vérifier la base de données
- [ ] Vérifier les permissions (dossier media)
- [ ] Redémarrer les serveurs
- [ ] Vider le cache du navigateur
- [ ] Consulter la documentation
- [ ] Escalader si nécessaire

---

**Dernière mise à jour:** 8 Décembre 2024
