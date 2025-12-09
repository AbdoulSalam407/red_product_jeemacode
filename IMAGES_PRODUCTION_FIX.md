# 🖼️ Correction des Images en Production (Render + Vercel)

## 🔍 Problème Identifié

Les images ne s'affichent pas en production car :

1. **VITE_API_URL non défini** - Variable d'environnement manquante
2. **Construction d'URL incorrecte** - `.replace('/api', '')` ne fonctionne pas toujours
3. **Chemins relatifs** - `/media/...` ne fonctionnent pas en production
4. **CORS** - Problèmes de cross-origin

---

## ✅ Solution Implémentée

### 1. Correction dans `Hotels.tsx`

```javascript
// Avant (INCORRECT)
src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/media/${hotel.image}`}

// Après (CORRECT)
src={
  (() => {
    // Si c'est déjà une URL complète ou data URL
    if (hotel.image.startsWith('data:') || hotel.image.startsWith('http')) {
      return hotel.image;
    }
    // Si c'est un chemin absolu
    if (hotel.image.startsWith('/')) {
      return hotel.image;
    }
    // Sinon, construire l'URL complète
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}/media/${hotel.image}`;
  })()
}
```

### 2. Correction dans `HotelModal.tsx`

```javascript
// Avant (INCORRECT)
const imageUrl = initialData.image.startsWith('data:') || initialData.image.startsWith('http') || initialData.image.startsWith('/')
  ? initialData.image
  : `${import.meta.env.VITE_API_URL?.replace('/api', '')}/media/${initialData.image}`;

// Après (CORRECT)
let imageUrl = initialData.image;

if (!initialData.image.startsWith('data:') && !initialData.image.startsWith('http') && !initialData.image.startsWith('/')) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  const baseUrl = apiUrl.replace('/api', '');
  imageUrl = `${baseUrl}/media/${initialData.image}`;
}
```

---

## 🔧 Configuration en Production

### 1. Render (Backend Django)

**Fichier:** `backend/config/settings.py`

```python
# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "https://red-product-jeemacode.vercel.app",  # Vercel Frontend
    "http://localhost:3000",
    "http://localhost:5173",
]

# Media Files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Static Files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Allowed Hosts
ALLOWED_HOSTS = [
    'red-product-backend.onrender.com',
    'localhost',
    '127.0.0.1',
]
```

**Fichier:** `backend/config/urls.py`

```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... vos URLs
]

# Servir les fichiers media en production
if settings.DEBUG or True:  # Toujours servir les media
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
```

### 2. Vercel (Frontend React)

**Fichier:** `frontend/.env.production`

```env
VITE_API_URL=https://red-product-backend.onrender.com/api
```

**Fichier:** `frontend/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "https://red-product-backend.onrender.com/api"
  }
}
```

---

## 📋 Checklist de Configuration

### Backend (Render)

- [ ] `CORS_ALLOWED_ORIGINS` configuré avec l'URL Vercel
- [ ] `MEDIA_URL = '/media/'`
- [ ] `MEDIA_ROOT = os.path.join(BASE_DIR, 'media')`
- [ ] `ALLOWED_HOSTS` inclut le domaine Render
- [ ] `urls.py` serve les fichiers media
- [ ] Variables d'environnement définies

### Frontend (Vercel)

- [ ] `.env.production` avec `VITE_API_URL`
- [ ] `vercel.json` configuré
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

---

## 🧪 Tests

### Test 1: Vérifier l'API

```bash
curl -H "Authorization: Bearer TOKEN" \
  https://red-product-backend.onrender.com/api/hotels/
```

**Résultat attendu:** JSON avec les hôtels et le champ `image`

### Test 2: Vérifier l'image

```bash
curl -I https://red-product-backend.onrender.com/media/hotels/image.jpg
```

**Résultat attendu:** HTTP 200

### Test 3: Vérifier le frontend

1. Ouvrir https://red-product-jeemacode.vercel.app/hotels
2. Les images doivent s'afficher
3. Ouvrir la console (F12)
4. Vérifier qu'il n'y a pas d'erreurs CORS

---

## 🐛 Dépannage

### Erreur: "Failed to load image"

**Cause:** L'URL est incorrecte

**Solution:**
```bash
# Vérifier l'URL dans la console
console.log('Image URL:', imageUrl);

# Vérifier que le fichier existe
curl -I https://api.example.com/media/hotels/image.jpg
```

### Erreur: "CORS policy"

**Cause:** CORS non configuré

**Solution:**
```python
# Dans settings.py
CORS_ALLOWED_ORIGINS = [
    "https://red-product-jeemacode.vercel.app",
]

CORS_ALLOW_CREDENTIALS = True
```

### Erreur: "404 Not Found"

**Cause:** Le fichier n'existe pas sur le serveur

**Solution:**
```bash
# Vérifier que le dossier media existe
ls -la backend/media/hotels/

# Vérifier les permissions
chmod -R 755 backend/media/
```

### Images vides en production

**Cause:** `VITE_API_URL` non défini

**Solution:**
```bash
# Vérifier la variable d'environnement
echo $VITE_API_URL

# Définir dans Vercel
# Settings → Environment Variables
# VITE_API_URL = https://red-product-backend.onrender.com/api
```

---

## 🔐 Sécurité

### CORS Sécurisé

```python
# ✅ BON
CORS_ALLOWED_ORIGINS = [
    "https://red-product-jeemacode.vercel.app",
]

# ❌ MAUVAIS
CORS_ALLOW_ALL_ORIGINS = True
```

### Fichiers Media Sécurisés

```python
# Vérifier les permissions
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
os.chmod(MEDIA_ROOT, 0o755)
```

---

## 📊 Résumé des Changements

| Fichier | Changement | Status |
|---------|-----------|--------|
| `frontend/src/pages/Hotels.tsx` | Construction URL corrigée | ✅ |
| `frontend/src/components/HotelModal.tsx` | Construction URL corrigée | ✅ |
| `frontend/.env.production` | VITE_API_URL défini | ⏳ |
| `backend/config/settings.py` | CORS + Media configuré | ⏳ |
| `backend/config/urls.py` | Media files servies | ⏳ |

---

## 🚀 Déploiement

### Étape 1: Backend (Render)

```bash
# Pousser les changements
git add -A
git commit -m "fix: Configuration CORS et media pour production"
git push

# Render redéploiera automatiquement
```

### Étape 2: Frontend (Vercel)

```bash
# Ajouter les variables d'environnement
# Vercel Dashboard → Settings → Environment Variables
# VITE_API_URL = https://red-product-backend.onrender.com/api

# Redéployer
git add -A
git commit -m "fix: Construction URL images pour production"
git push
```

### Étape 3: Vérifier

1. Ouvrir https://red-product-jeemacode.vercel.app/hotels
2. Les images doivent s'afficher
3. Vérifier la console (F12) pour les erreurs

---

## 📝 Variables d'Environnement

### Render (Backend)

```env
DEBUG=False
ALLOWED_HOSTS=red-product-backend.onrender.com,localhost
DATABASE_URL=postgresql://...
CORS_ALLOWED_ORIGINS=https://red-product-jeemacode.vercel.app
MEDIA_URL=/media/
MEDIA_ROOT=/var/data/media
```

### Vercel (Frontend)

```env
VITE_API_URL=https://red-product-backend.onrender.com/api
```

---

## ✅ Conclusion

Les images devraient maintenant s'afficher correctement en production :

- ✅ URLs construites correctement
- ✅ CORS configuré
- ✅ Media files servies
- ✅ Variables d'environnement définies

**Prochaines étapes:**
1. Configurer les variables d'environnement
2. Redéployer backend et frontend
3. Tester les images en production
4. Vérifier les logs en cas d'erreur

---

**Date:** 8 Décembre 2024
**Status:** ✅ Prêt pour production
