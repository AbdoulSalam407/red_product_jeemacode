# Configuration CRUD Hôtels - Local & Ligne

## 🚀 Démarrage Rapide

### 1. Backend Django

```bash
cd backend

# Activer l'environnement virtuel
source venv/Scripts/activate  # Windows Git Bash
# ou
venv\Scripts\activate  # Windows CMD

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur (optionnel)
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver
```

**Vérification:**
- Backend accessible: http://localhost:8000
- API accessible: http://localhost:8000/api
- Admin accessible: http://localhost:8000/admin

---

### 2. Frontend React/Vite

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

**Vérification:**
- Frontend accessible: http://localhost:5173
- Logs: Vérifier la console du navigateur

---

## 🔧 Configuration Environnement

### Frontend (.env)

```env
# Mode développement (local)
VITE_API_URL=http://localhost:8000/api

# Mode production (ligne)
# VITE_API_URL=https://api.example.com/api
```

### Backend (.env)

```env
# Mode développement
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Mode production
# DEBUG=False
# ALLOWED_HOSTS=api.example.com
# SECRET_KEY=your-secret-key
# DATABASE_URL=postgresql://user:pass@host/db
```

---

## 📁 Structure des Fichiers

### Backend

```
backend/
├── config/              # Configuration Django
│   ├── settings.py      # Paramètres principaux
│   ├── urls.py          # Routes principales
│   └── wsgi.py          # WSGI pour production
├── hotels/              # App Hôtels
│   ├── models.py        # Modèle Hotel
│   ├── serializers.py   # Sérialisation
│   ├── views.py         # ViewSet CRUD
│   ├── urls.py          # Routes /hotels
│   └── migrations/      # Migrations BD
├── media/               # Dossier images
│   └── hotels/          # Images des hôtels
├── manage.py            # Commandes Django
└── requirements.txt     # Dépendances Python
```

### Frontend

```
frontend/
├── src/
│   ├── components/      # Composants React
│   │   ├── HotelModal.tsx    # Formulaire
│   │   └── ...
│   ├── hooks/           # Hooks personnalisés
│   │   └── useHotels.ts      # Logique CRUD
│   ├── pages/           # Pages
│   │   └── Hotels.tsx        # Page hôtels
│   ├── lib/             # Utilitaires
│   │   └── api.ts            # Client Axios
│   └── App.tsx          # App principal
├── public/              # Fichiers statiques
├── package.json         # Dépendances Node
└── vite.config.ts       # Configuration Vite
```

---

## 🗄️ Base de Données

### Modèle Hotel

```python
class Hotel(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.FloatField(default=0)
    image = models.ImageField(upload_to='hotels/', blank=True, null=True)
    rooms_count = models.IntegerField(default=0)
    available_rooms = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Migrations

```bash
# Créer une migration
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Voir l'état des migrations
python manage.py showmigrations
```

---

## 🔐 Authentification

### Configuration JWT (Django REST Framework)

```python
# settings.py
INSTALLED_APPS = [
    ...
    'rest_framework',
    'rest_framework_simplejwt',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

### Endpoints d'Authentification

```
POST   /api/auth/token/           → Obtenir access + refresh tokens
POST   /api/auth/token/refresh/   → Rafraîchir le token
POST   /api/auth/logout/          → Se déconnecter
```

### Utilisation Frontend

```typescript
// Stocker les tokens
localStorage.setItem('access_token', response.data.access);
localStorage.setItem('refresh_token', response.data.refresh);

// Envoyer le token dans les requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🖼️ Gestion des Images

### Configuration Django

```python
# settings.py
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# urls.py
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    ...
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Permissions Dossier

```bash
# Créer le dossier media
mkdir -p media/hotels

# Définir les permissions (Linux/Mac)
chmod 755 media
chmod 755 media/hotels
```

### Validation Images

```python
# serializers.py
def validate_image(self, value):
    if value:
        # Vérifier la taille (max 5MB)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("L'image ne doit pas dépasser 5MB")
        
        # Vérifier le type MIME
        allowed_types = ['image/jpeg', 'image/png', 'image/gif']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError("Format d'image non supporté")
    
    return value
```

---

## 🔄 API Endpoints

### Hôtels

```
GET    /api/hotels/              → Lister tous les hôtels
POST   /api/hotels/              → Créer un hôtel
GET    /api/hotels/{id}/         → Récupérer un hôtel
PATCH  /api/hotels/{id}/         → Mettre à jour un hôtel
DELETE /api/hotels/{id}/         → Supprimer un hôtel
```

### Paramètres de Requête

```
GET /api/hotels/?search=dakar&city=Dakar&price_per_night__gte=50000&page=1
```

### Réponses

**Succès (200/201):**
```json
{
  "id": 1,
  "name": "Hotel Dakar",
  "city": "Dakar",
  "price_per_night": "50000.00",
  "image": "hotels/image.jpg",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

**Erreur (400/401/404):**
```json
{
  "detail": "Message d'erreur",
  "name": ["Le nom est requis"],
  "city": ["La ville est requise"]
}
```

---

## 💾 Cache

### Configuration Frontend

```typescript
// hooks/useHotels.ts
const CACHE_KEY = 'hotels_cache';
const CACHE_TIME_KEY = 'hotels_cache_time';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
```

### Configuration Backend

```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# views.py
@method_decorator(cache_page(60 * 5))  # Cache 5 minutes
def list(self, request, *args, **kwargs):
    return super().list(request, *args, **kwargs)
```

---

## 🚀 Déploiement Production

### Frontend (Netlify)

```bash
# Build
npm run build

# Fichier netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Backend (Heroku/Railway)

```bash
# Procfile
web: gunicorn config.wsgi

# requirements.txt
Django==4.2.0
djangorestframework==3.14.0
django-cors-headers==4.0.0
gunicorn==20.1.0
```

### Variables d'Environnement Production

```
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=api.example.com
DATABASE_URL=postgresql://user:pass@host/db
CORS_ALLOWED_ORIGINS=https://example.com
```

---

## 🔍 Débogage

### Logs Frontend

```bash
# Vérifier la console du navigateur
F12 → Console

# Vérifier les logs de Vite
npm run dev  # Voir les logs dans le terminal
```

### Logs Backend

```bash
# Logs Django
python manage.py runserver --verbosity 2

# Logs de la base de données
python manage.py dbshell

# Logs des migrations
python manage.py migrate --verbosity 2
```

### DevTools

```
F12 → Network → Vérifier les requêtes
F12 → Application → localStorage → Vérifier le cache
F12 → Console → Vérifier les erreurs
```

---

## ✅ Checklist de Configuration

### Backend
- [ ] Environnement virtuel activé
- [ ] Dépendances installées
- [ ] Migrations appliquées
- [ ] Dossier `media/hotels/` créé
- [ ] Permissions correctes (755)
- [ ] Serveur démarre sans erreur
- [ ] API accessible sur http://localhost:8000/api

### Frontend
- [ ] Dépendances installées
- [ ] `.env` configuré avec `VITE_API_URL`
- [ ] Serveur démarre sans erreur
- [ ] Frontend accessible sur http://localhost:5173
- [ ] Pas d'erreurs console

### Intégration
- [ ] Backend et Frontend communiquent
- [ ] Authentification fonctionne
- [ ] CRUD complet fonctionne
- [ ] Images s'affichent correctement
- [ ] Cache fonctionne

---

## 🆘 Troubleshooting

### Erreur: "Connection refused"

**Cause:** Backend non démarré

**Solution:**
```bash
cd backend
python manage.py runserver
```

---

### Erreur: "CORS error"

**Cause:** CORS non configuré

**Solution:**
```python
# settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

---

### Erreur: "Image not found"

**Cause:** Dossier `media/` non créé

**Solution:**
```bash
mkdir -p media/hotels
chmod 755 media media/hotels
```

---

### Erreur: "Token invalid"

**Cause:** Token expiré ou invalide

**Solution:**
```typescript
// Rafraîchir le token
const response = await api.post('/auth/token/refresh/', {
  refresh: localStorage.getItem('refresh_token')
});
localStorage.setItem('access_token', response.data.access);
```

---

## 📚 Ressources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Axios Documentation](https://axios-http.com/)

---

## 📞 Support

Pour toute question:
1. Vérifier les logs (Frontend + Backend)
2. Vérifier la configuration (.env)
3. Vérifier la base de données
4. Redémarrer les serveurs
5. Consulter la documentation officielle
