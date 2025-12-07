# Guide de Dépannage - CRUD Optimisé

## 🔴 Problème 1: Les mutations sont lentes (> 500ms)

### Symptômes
- Les opérations CRUD prennent plus de 500ms
- L'UI n'est pas instantanée
- Latence perceptible avant la mise à jour

### Diagnostic

```typescript
// Ajouter dans useHotels.ts
const measurePerformance = (label: string) => {
  const start = performance.now()
  return () => {
    const end = performance.now()
    console.log(`${label}: ${(end - start).toFixed(2)}ms`)
  }
}

// Utilisation
const stopTimer = measurePerformance('CREATE')
await createHotel(data)
stopTimer()
```

### Solutions

#### Solution 1: Vérifier CONN_MAX_AGE

```python
# ❌ MAUVAIS
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        # Pas de CONN_MAX_AGE = nouvelle connexion à chaque requête
    }
}

# ✅ BON
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'CONN_MAX_AGE': 600,  # Réutiliser les connexions 10 min
    }
}
```

**Impact:** -100ms par requête

#### Solution 2: Vérifier les Indexes PostgreSQL

```python
# ❌ MAUVAIS: Pas d'indexes
class Hotel(models.Model):
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)

# ✅ BON: Indexes sur les champs de recherche
class Hotel(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    city = models.CharField(max_length=100, db_index=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['city', 'is_active']),
        ]
```

**Impact:** -150ms sur les requêtes de recherche

#### Solution 3: Vérifier les N+1 Queries

```python
# ❌ MAUVAIS: N+1 queries
hotels = Hotel.objects.all()
for hotel in hotels:
    print(hotel.city)  # Requête pour chaque hôtel

# ✅ BON: Une seule requête
hotels = Hotel.objects.all().values('id', 'name', 'city')
```

**Impact:** -200ms+ sur les listes longues

#### Solution 4: Vérifier la Sérialisation

```python
# ❌ MAUVAIS: Tous les champs sérialisés
class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'  # Trop de champs

# ✅ BON: Seulement les champs nécessaires
class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = [
            'id', 'name', 'city', 'price_per_night',
            'rating', 'image', 'is_active'
        ]
```

**Impact:** -50ms sur la sérialisation

---

## 🔴 Problème 2: Le rollback ne fonctionne pas

### Symptômes
- Les données ne sont pas restaurées en cas d'erreur
- L'UI affiche des données incorrectes après une erreur
- Les mutations échouées ne reviennent pas à l'état précédent

### Diagnostic

```typescript
// Vérifier dans React Query DevTools
// 1. Ouvrir React Query DevTools
// 2. Vérifier l'état du cache après une erreur
// 3. Vérifier que previousData est restauré
```

### Solutions

#### Solution 1: Vérifier onMutate retourne le contexte

```typescript
// ❌ MAUVAIS: onMutate ne retourne rien
const createMutation = useMutation({
  mutationFn: async (data) => { /* ... */ },
  onMutate: async (data) => {
    // Pas de return!
    queryClient.setQueryData(QUERY_KEY, (old) => [...old, data])
  },
})

// ✅ BON: onMutate retourne le contexte
const createMutation = useMutation({
  mutationFn: async (data) => { /* ... */ },
  onMutate: async (data) => {
    const previousData = queryClient.getQueryData(QUERY_KEY)
    queryClient.setQueryData(QUERY_KEY, (old) => [...old, data])
    return { previousData }  // ← Important!
  },
  onError: (error, data, context) => {
    if (context?.previousData) {
      queryClient.setQueryData(QUERY_KEY, context.previousData)
    }
  },
})
```

#### Solution 2: Vérifier onError utilise le contexte

```typescript
// ❌ MAUVAIS: onError ne restaure pas
const updateMutation = useMutation({
  mutationFn: async (data) => { /* ... */ },
  onError: (error) => {
    console.error(error)
    // Pas de rollback!
  },
})

// ✅ BON: onError restaure les données
const updateMutation = useMutation({
  mutationFn: async (data) => { /* ... */ },
  onError: (error, data, context) => {
    if (context?.previousData) {
      queryClient.setQueryData(QUERY_KEY, context.previousData)
    }
    console.error(error)
  },
})
```

#### Solution 3: Vérifier cancelQueries

```typescript
// ❌ MAUVAIS: Pas d'annulation
const createMutation = useMutation({
  onMutate: async (data) => {
    // Les requêtes en cours peuvent écraser les données optimistes
    queryClient.setQueryData(QUERY_KEY, (old) => [...old, data])
  },
})

// ✅ BON: Annuler les requêtes en cours
const createMutation = useMutation({
  onMutate: async (data) => {
    await queryClient.cancelQueries({ queryKey: QUERY_KEY })
    const previousData = queryClient.getQueryData(QUERY_KEY)
    queryClient.setQueryData(QUERY_KEY, (old) => [...old, data])
    return { previousData }
  },
})
```

---

## 🔴 Problème 3: Le cache n'est pas invalidé

### Symptômes
- Les données anciennes s'affichent après une mutation
- Les changements ne sont pas visibles
- Le cache n'est jamais mis à jour

### Diagnostic

```typescript
// Vérifier dans React Query DevTools
// 1. Vérifier que le cache est marqué comme "stale"
// 2. Vérifier que les données sont mises à jour
// 3. Vérifier que les requêtes sont refetch
```

### Solutions

#### Solution 1: Vérifier staleTime et gcTime

```typescript
// ❌ MAUVAIS: Cache trop long
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000,  // 1 heure = données jamais mises à jour
    },
  },
})

// ✅ BON: Cache raisonnable
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      gcTime: 10 * 60 * 1000,      // 10 minutes
    },
  },
})
```

#### Solution 2: Vérifier onSuccess invalide le cache

```typescript
// ❌ MAUVAIS: Pas d'invalidation
const createMutation = useMutation({
  mutationFn: async (data) => { /* ... */ },
  onSuccess: (data) => {
    // Pas d'invalidation!
  },
})

// ✅ BON: Invalider le cache
const createMutation = useMutation({
  mutationFn: async (data) => { /* ... */ },
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY })
  },
})
```

#### Solution 3: Vérifier les query keys

```typescript
// ❌ MAUVAIS: Query keys différentes
const { data: hotels } = useQuery({
  queryKey: ['hotels'],  // Key 1
  queryFn: fetchHotels,
})

const createMutation = useMutation({
  mutationFn: createHotel,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['hotel'] })  // Key 2 ≠ Key 1
  },
})

// ✅ BON: Query keys identiques
const QUERY_KEY = ['hotels']

const { data: hotels } = useQuery({
  queryKey: QUERY_KEY,
  queryFn: fetchHotels,
})

const createMutation = useMutation({
  mutationFn: createHotel,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY })
  },
})
```

---

## 🔴 Problème 4: Les images ne sont pas uploadées

### Symptômes
- Les images ne sont pas envoyées au serveur
- Erreur 400 Bad Request
- Le champ image est vide

### Diagnostic

```typescript
// Vérifier dans Network tab
// 1. Vérifier que Content-Type = multipart/form-data
// 2. Vérifier que le fichier est dans FormData
// 3. Vérifier que le serveur reçoit le fichier
```

### Solutions

#### Solution 1: Vérifier FormData

```typescript
// ❌ MAUVAIS: Envoyer l'objet directement
const createHotel = async (data) => {
  const response = await api.post('/hotels/', data)  // ← Pas de FormData
  return response.data
}

// ✅ BON: Utiliser FormData
const createHotel = async (data) => {
  const formData = new FormData()
  
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value)
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })
  
  const response = await api.post('/hotels/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}
```

#### Solution 2: Vérifier le Content-Type

```typescript
// ❌ MAUVAIS: Content-Type incorrect
const response = await api.post('/hotels/', formData, {
  headers: { 'Content-Type': 'application/json' },  // ← Mauvais!
})

// ✅ BON: Laisser axios gérer
const response = await api.post('/hotels/', formData)
// Axios détecte FormData et définit automatiquement Content-Type

// Ou explicitement
const response = await api.post('/hotels/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
```

#### Solution 3: Vérifier le backend accepte les fichiers

```python
# ❌ MAUVAIS: Pas de gestion des fichiers
class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = ['name', 'city']  # Pas d'image!

# ✅ BON: Inclure le champ image
class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = ['id', 'name', 'city', 'image']  # ← Image incluse
```

---

## 🔴 Problème 5: Erreur 401 Unauthorized

### Symptômes
- Les requêtes retournent 401
- L'utilisateur est redirigé vers /login
- Le token n'est pas envoyé

### Diagnostic

```typescript
// Vérifier dans Network tab
// 1. Vérifier que Authorization header est présent
// 2. Vérifier que le token est valide
// 3. Vérifier que le token n'a pas expiré
```

### Solutions

#### Solution 1: Vérifier le token dans localStorage

```typescript
// ❌ MAUVAIS: Token pas stocké
const api = axios.create({
  baseURL: API_URL,
})

// ✅ BON: Récupérer le token
const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

#### Solution 2: Vérifier le format du token

```typescript
// ❌ MAUVAIS: Format incorrect
config.headers.Authorization = localStorage.getItem('access_token')
// Résultat: Authorization: "abc123..." (pas de "Bearer")

// ✅ BON: Format correct
config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
// Résultat: Authorization: "Bearer abc123..."
```

#### Solution 3: Vérifier l'expiration du token

```python
# Dans Django settings.py
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
}
```

---

## 🔴 Problème 6: Erreur CORS

### Symptômes
- Erreur "Access to XMLHttpRequest blocked by CORS policy"
- Les requêtes cross-origin échouent
- Le navigateur bloque les requêtes

### Diagnostic

```
Erreur dans la console:
Access to XMLHttpRequest at 'http://api.example.com/hotels/'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

### Solutions

#### Solution 1: Installer django-cors-headers

```bash
pip install django-cors-headers
```

#### Solution 2: Configurer CORS dans Django

```python
# settings.py
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ← Avant CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    # ...
]

# ✅ Développement
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
]

# ✅ Production
CORS_ALLOWED_ORIGINS = [
    'https://example.com',
]

# Ou permettre tous les origins (⚠️ Seulement en développement)
CORS_ALLOW_ALL_ORIGINS = True
```

---

## 🔴 Problème 7: Erreur "Network Error"

### Symptômes
- Erreur "Network Error" dans les requêtes
- Les requêtes timeout
- Impossible de se connecter au serveur

### Diagnostic

```typescript
// Vérifier dans Network tab
// 1. Vérifier que le serveur est en ligne
// 2. Vérifier que l'URL est correcte
// 3. Vérifier que le timeout n'est pas trop court
```

### Solutions

#### Solution 1: Vérifier l'URL API

```typescript
// ❌ MAUVAIS: URL incorrecte
const API_URL = 'http://localhost:8000/api'  // Serveur pas en ligne

// ✅ BON: URL correcte
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// .env.local
VITE_API_URL=http://localhost:8000/api
```

#### Solution 2: Augmenter le timeout

```typescript
// ❌ MAUVAIS: Timeout trop court
const api = axios.create({
  baseURL: API_URL,
  timeout: 1000,  // 1 seconde = trop court
})

// ✅ BON: Timeout raisonnable
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,  // 10 secondes
})
```

#### Solution 3: Vérifier le serveur Django

```bash
# Vérifier que le serveur est en ligne
python manage.py runserver

# Vérifier que le port est correct
# Par défaut: http://localhost:8000
```

---

## 📊 Checklist de Dépannage

Avant de déclarer un problème "résolu":

- [ ] Mesurer la latence avec `performance.now()`
- [ ] Vérifier les requêtes dans Network tab
- [ ] Vérifier le cache dans React Query DevTools
- [ ] Vérifier les logs Django
- [ ] Vérifier les erreurs dans la console
- [ ] Tester avec des données simples
- [ ] Tester en incognito (pas de cache)
- [ ] Redémarrer le serveur
- [ ] Vider le cache du navigateur

---

## 🆘 Ressources d'Aide

- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance.html)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Dernière mise à jour:** 7 décembre 2025
