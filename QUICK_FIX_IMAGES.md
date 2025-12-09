# ⚡ Quick Fix - Images en Production

## 🎯 Problème
Les images ne s'affichent pas sur Render + Vercel

## ✅ Solution Rapide (5 minutes)

### Étape 1: Vérifier les fichiers modifiés

```bash
# Frontend
✅ frontend/src/pages/Hotels.tsx - MODIFIÉ
✅ frontend/src/components/HotelModal.tsx - MODIFIÉ
```

### Étape 2: Configurer les variables d'environnement

#### Vercel (Frontend)

1. Aller sur https://vercel.com/dashboard
2. Sélectionner le projet `red-product-frontend`
3. Settings → Environment Variables
4. Ajouter:
   ```
   VITE_API_URL = https://red-product-backend.onrender.com/api
   ```
5. Redéployer

#### Render (Backend)

1. Aller sur https://dashboard.render.com
2. Sélectionner le service `red-product-backend`
3. Environment → Add Environment Variable
4. Ajouter:
   ```
   CORS_ALLOWED_ORIGINS = https://red-product-jeemacode.vercel.app
   ```

### Étape 3: Vérifier la configuration backend

**Fichier:** `backend/config/settings.py`

```python
# ✅ CORS
CORS_ALLOWED_ORIGINS = [
    "https://red-product-jeemacode.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
]

# ✅ Media Files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

**Fichier:** `backend/config/urls.py`

```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ...
]

# ✅ Servir les media
if settings.DEBUG or True:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Étape 4: Commit et Push

```bash
cd d:\RED PRODUCT

# Commit les changements
git add -A
git commit -m "fix: Configuration images pour production (Render + Vercel)

- Construction URL images corrigée dans Hotels.tsx
- Construction URL images corrigée dans HotelModal.tsx
- Fallback sur VITE_API_URL par défaut
- Support des chemins relatifs et absolus
- Gestion des data URLs et URLs complètes

Production: Images doivent maintenant s'afficher correctement"

# Push
git push
```

### Étape 5: Redéployer

#### Render (Backend)
- Automatique après git push
- Vérifier: https://red-product-backend.onrender.com/api/hotels/

#### Vercel (Frontend)
- Automatique après git push
- Vérifier: https://red-product-jeemacode.vercel.app/hotels

### Étape 6: Tester

1. Ouvrir https://red-product-jeemacode.vercel.app/hotels
2. Les images doivent s'afficher
3. Ouvrir F12 (Console)
4. Vérifier qu'il n'y a pas d'erreurs

---

## 🔍 Dépannage Rapide

### Images ne s'affichent pas

**Vérifier:**
```javascript
// Console (F12)
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

// Devrait afficher:
// VITE_API_URL: https://red-product-backend.onrender.com/api
```

### Erreur CORS

**Vérifier:**
```bash
# Tester l'API
curl -H "Authorization: Bearer TOKEN" \
  https://red-product-backend.onrender.com/api/hotels/

# Vérifier les headers CORS
curl -I https://red-product-backend.onrender.com/api/hotels/
```

### Erreur 404 sur les images

**Vérifier:**
```bash
# Tester l'URL de l'image
curl -I https://red-product-backend.onrender.com/media/hotels/image.jpg

# Devrait retourner 200, pas 404
```

---

## 📋 Checklist

- [ ] Variables d'environnement configurées (Vercel)
- [ ] CORS configuré (Render)
- [ ] Media files configurés (Render)
- [ ] Changements pushés (git push)
- [ ] Backend redéployé (Render)
- [ ] Frontend redéployé (Vercel)
- [ ] Images affichées en production
- [ ] Pas d'erreurs en console (F12)

---

## 🚀 Résultat

✅ Images affichées correctement en production
✅ Pas d'erreurs CORS
✅ Pas d'erreurs 404
✅ Performance optimale

---

**Durée:** ~5 minutes
**Difficulté:** Facile
**Status:** ✅ Prêt
