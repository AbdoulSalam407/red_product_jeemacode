# Checklist d'Implémentation - CRUD Optimisé

## ✅ Phase 1: Installation des Dépendances

### Frontend
```bash
npm install @tanstack/react-query axios
```

### Backend
```bash
pip install psycopg2-binary django-filter
```

**Vérifier:**
- [ ] `@tanstack/react-query` installé
- [ ] `axios` installé
- [ ] `psycopg2-binary` installé

---

## ✅ Phase 2: Configuration React Query

### Fichier: `frontend/src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      gcTime: 10 * 60 * 1000,          // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
```

**Vérifier:**
- [ ] `QueryClient` créé avec options
- [ ] `QueryClientProvider` enveloppe l'app
- [ ] `staleTime` et `gcTime` configurés

---

## ✅ Phase 3: Client API Axios

### Fichier: `frontend/src/lib/api.ts`

```typescript
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// Intercepteur requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Intercepteur réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

**Vérifier:**
- [ ] `axios` créé avec `baseURL`
- [ ] Intercepteur d'authentification
- [ ] Gestion des erreurs 401

---

## ✅ Phase 4: Hook useHotels avec Optimistic Updates

### Fichier: `frontend/src/hooks/useHotels.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export interface Hotel {
  id: number
  name: string
  city: string
  description: string
  price_per_night: number
  rating: number
  rooms_count: number
  available_rooms: number
  image?: string | File
  is_active: boolean
  created_at: string
  updated_at: string
}

const QUERY_KEY = ['hotels']

export const useHotels = () => {
  const queryClient = useQueryClient()

  // ============================================
  // FETCH HOTELS
  // ============================================
  const { data: hotels = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await api.get('/hotels/')
      return Array.isArray(response.data) ? response.data : response.data.results || []
    },
  })

  // ============================================
  // CREATE HOTEL (OPTIMISTIC UPDATE)
  // ============================================
  const createMutation = useMutation({
    mutationFn: async (newHotel: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>) => {
      const formData = new FormData()

      Object.entries(newHotel).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value)
          } else {
            formData.append(key, String(value))
          }
        }
      })

      const response = await api.post('/hotels/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onMutate: async (newHotel) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })

      // Sauvegarder les données précédentes
      const previousHotels = queryClient.getQueryData<Hotel[]>(QUERY_KEY)

      // Optimistic update: ajouter l'hôtel immédiatement
      const optimisticHotel: Hotel = {
        id: -Math.random(),
        ...newHotel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Hotel

      queryClient.setQueryData(QUERY_KEY, (old: Hotel[] = []) => [
        ...old,
        optimisticHotel,
      ])

      return { previousHotels }
    },
    onError: (error, newHotel, context) => {
      // Rollback en cas d'erreur
      if (context?.previousHotels) {
        queryClient.setQueryData(QUERY_KEY, context.previousHotels)
      }
      console.error('Erreur création:', error)
    },
    onSuccess: (data) => {
      // Remplacer l'hôtel optimiste par la vraie réponse
      queryClient.setQueryData(QUERY_KEY, (old: Hotel[] = []) =>
        old.map((h) => (h.id < 0 ? data : h))
      )
    },
  })

  // ============================================
  // UPDATE HOTEL (OPTIMISTIC UPDATE)
  // ============================================
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Hotel> }) => {
      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value)
          } else {
            formData.append(key, String(value))
          }
        }
      })

      const response = await api.patch(`/hotels/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previousHotels = queryClient.getQueryData<Hotel[]>(QUERY_KEY)

      // Optimistic update: mettre à jour immédiatement
      queryClient.setQueryData(QUERY_KEY, (old: Hotel[] = []) =>
        old.map((h) => (h.id === id ? { ...h, ...data } : h))
      )

      return { previousHotels }
    },
    onError: (error, variables, context) => {
      if (context?.previousHotels) {
        queryClient.setQueryData(QUERY_KEY, context.previousHotels)
      }
      console.error('Erreur mise à jour:', error)
    },
  })

  // ============================================
  // DELETE HOTEL (OPTIMISTIC UPDATE)
  // ============================================
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/hotels/${id}/`)
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previousHotels = queryClient.getQueryData<Hotel[]>(QUERY_KEY)

      // Optimistic update: supprimer immédiatement
      queryClient.setQueryData(QUERY_KEY, (old: Hotel[] = []) =>
        old.filter((h) => h.id !== id)
      )

      return { previousHotels }
    },
    onError: (error, id, context) => {
      if (context?.previousHotels) {
        queryClient.setQueryData(QUERY_KEY, context.previousHotels)
      }
      console.error('Erreur suppression:', error)
    },
  })

  return {
    hotels,
    isLoading,
    error,
    createHotel: createMutation.mutate,
    updateHotel: updateMutation.mutate,
    deleteHotel: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
```

**Vérifier:**
- [ ] `useQuery` pour fetch
- [ ] `useMutation` pour CREATE
- [ ] `useMutation` pour UPDATE
- [ ] `useMutation` pour DELETE
- [ ] `onMutate` pour optimistic update
- [ ] `onError` pour rollback
- [ ] `onSuccess` pour validation

---

## ✅ Phase 5: Configuration Django

### Fichier: `backend/config/settings.py`

```python
import os
from pathlib import Path
from decouple import config

# ============================================
# DATABASE OPTIMIZATION
# ============================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
        
        # ⭐ CONNECTION POOLING
        'CONN_MAX_AGE': 600,  # Réutiliser les connexions 10 min
        'ATOMIC_REQUESTS': False,
        'AUTOCOMMIT': True,
        
        # ⭐ POSTGRESQL OPTIONS
        'OPTIONS': {
            'connect_timeout': 10,
            'options': '-c statement_timeout=30000',  # 30s timeout
            'sslmode': 'require',  # Pour AlwaysData
        }
    }
}

# ============================================
# CACHING
# ============================================

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'TIMEOUT': 300,  # 5 minutes
        'OPTIONS': {
            'MAX_ENTRIES': 1000,
        }
    }
}

# ============================================
# REST FRAMEWORK
# ============================================

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

# ============================================
# MIDDLEWARE
# ============================================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

**Vérifier:**
- [ ] `CONN_MAX_AGE` = 600
- [ ] `ATOMIC_REQUESTS` = False
- [ ] `AUTOCOMMIT` = True
- [ ] PostgreSQL OPTIONS configurées
- [ ] CACHES configuré
- [ ] REST_FRAMEWORK configuré

---

## ✅ Phase 6: Models Optimisés

### Fichier: `backend/hotels/models.py`

```python
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Hotel(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    city = models.CharField(max_length=100, db_index=True)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    price_per_night = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    rating = models.FloatField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    image = models.ImageField(upload_to='hotels/', null=True, blank=True)
    rooms_count = models.IntegerField(validators=[MinValueValidator(1)])
    available_rooms = models.IntegerField(validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['city', 'is_active']),
            models.Index(fields=['price_per_night']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return self.name
```

**Vérifier:**
- [ ] `db_index=True` sur les champs de recherche
- [ ] `Meta.indexes` définis
- [ ] Validators ajoutés

---

## ✅ Phase 7: Serializers Optimisés

### Fichier: `backend/hotels/serializers.py`

```python
from rest_framework import serializers
from .models import Hotel

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = [
            'id', 'name', 'description', 'city', 'address',
            'phone', 'email', 'price_per_night', 'rating',
            'image', 'rooms_count', 'available_rooms',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_price_per_night(self, value):
        if value < 0:
            raise serializers.ValidationError("Le prix ne peut pas être négatif")
        return value

    def validate_rating(self, value):
        if not (0 <= value <= 5):
            raise serializers.ValidationError("La note doit être entre 0 et 5")
        return value
```

**Vérifier:**
- [ ] Validators implémentés
- [ ] `read_only_fields` définis
- [ ] Tous les champs listés

---

## ✅ Phase 8: Views Optimisées

### Fichier: `backend/hotels/views.py`

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Hotel
from .serializers import HotelSerializer

class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Optimiser les requêtes"""
        queryset = Hotel.objects.all()
        
        # Filtrer par ville
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__icontains=city)
        
        # Filtrer par prix
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price_per_night__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_night__lte=max_price)
        
        # Ordonner
        ordering = self.request.query_params.get('ordering', '-created_at')
        queryset = queryset.order_by(ordering)
        
        return queryset

    def create(self, request, *args, **kwargs):
        """Créer un hôtel"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """Mettre à jour un hôtel"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Supprimer un hôtel"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des hôtels"""
        from django.db.models import Avg
        
        total = self.get_queryset().count()
        avg_price = self.get_queryset().aggregate(
            avg=Avg('price_per_night')
        )['avg'] or 0
        
        return Response({
            'total': total,
            'average_price': round(float(avg_price), 2),
        })
```

**Vérifier:**
- [ ] `get_queryset()` optimisé
- [ ] Filtres implémentés
- [ ] Endpoints CRUD complets

---

## ✅ Phase 9: Tests de Performance

### Test 1: Mesurer la latence UI

```typescript
// Dans le composant Hotels.tsx
const handleCreate = async (data: any) => {
  const start = performance.now()
  
  await createHotel(data)
  
  const end = performance.now()
  console.log(`CREATE latency: ${(end - start).toFixed(2)}ms`)
}
```

**Résultat attendu:** < 100ms

### Test 2: Vérifier les requêtes

```bash
# Terminal Django
python manage.py runserver --verbosity 2
```

**Chercher:**
- [ ] Pas de N+1 queries
- [ ] Requêtes < 200ms
- [ ] Indexes utilisés

### Test 3: Vérifier le cache

```typescript
// Dans React DevTools
// Vérifier que les requêtes suivantes sont en cache
```

---

## ✅ Checklist Finale

### Frontend
- [ ] React Query installé et configuré
- [ ] Client Axios créé avec intercepteurs
- [ ] Hook useHotels avec optimistic updates
- [ ] Composant Hotels utilise le hook
- [ ] Latence UI < 100ms

### Backend
- [ ] Django configuré avec CONN_MAX_AGE
- [ ] Models avec indexes
- [ ] Serializers avec validators
- [ ] Views optimisées
- [ ] Latence serveur < 200ms

### Base de Données
- [ ] Indexes PostgreSQL créés
- [ ] Connection pooling activé
- [ ] Requêtes optimisées
- [ ] Pas de N+1 queries

### Tests
- [ ] CREATE fonctionne instantanément
- [ ] UPDATE fonctionne instantanément
- [ ] DELETE fonctionne instantanément
- [ ] Rollback automatique en cas d'erreur
- [ ] Cache fonctionne correctement

---

## 🚀 Résultat Final

Après implémentation complète:
- ✅ CRUD instantané (< 100ms UI)
- ✅ Synchronisation en arrière-plan
- ✅ Rollback automatique
- ✅ Cache intelligent
- ✅ Latence serveur réduite

**Temps total d'implémentation:** ~4-5 heures
