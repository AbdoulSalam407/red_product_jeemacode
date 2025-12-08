# Guide de Suppression des Images - Base de Données

## 📋 Résumé

Suppression complète du champ `image` de la base de données et du code.

---

## ✅ Changements Effectués

### 1. Backend

#### Fichier: `backend/hotels/models.py`
- ✅ Suppression du champ `image = models.ImageField(...)`

#### Fichier: `backend/hotels/serializers.py`
- ✅ Suppression de `image = serializers.ImageField(...)`
- ✅ Suppression de `'image'` des champs du serializer
- ✅ Suppression de la validation des images

### 2. Frontend

#### Fichier: `frontend/src/hooks/useHotels.ts`
- ✅ Suppression de `image?: string | File` de l'interface Hotel
- ✅ Suppression du traitement des images dans CREATE
- ✅ Suppression du traitement des images dans UPDATE

---

## 🔧 Étapes d'Application

### Étape 1: Créer une Migration Django

```bash
cd backend
python manage.py makemigrations hotels
```

**Résultat attendu:**
```
Migrations for 'hotels':
  hotels/migrations/XXXX_remove_hotel_image.py
    - Remove field image from hotel
```

### Étape 2: Appliquer la Migration

```bash
python manage.py migrate hotels
```

**Résultat attendu:**
```
Running migrations:
  Applying hotels.XXXX_remove_hotel_image... OK
```

### Étape 3: Vérifier la Migration

```bash
python manage.py showmigrations hotels
```

**Résultat attendu:**
```
hotels
 [X] 0001_initial
 [X] 0002_remove_hotel_image
```

### Étape 4: Supprimer les Fichiers Images (Optionnel)

```bash
# Supprimer le dossier media/hotels
rm -rf backend/media/hotels/

# Ou sur Windows
rmdir /s /q backend\media\hotels\
```

### Étape 5: Redémarrer les Serveurs

```bash
# Terminal 1: Backend
cd backend
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 🧪 Tests

### Test 1: Vérifier que l'API fonctionne

```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/hotels/
```

**Résultat attendu:** Liste des hôtels sans le champ `image`

### Test 2: Créer un hôtel

```bash
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hotel Test",
    "city": "Dakar",
    "address": "123 Rue",
    "phone": "+221 33 123 45 67",
    "email": "test@hotel.com",
    "price_per_night": 50000,
    "rating": 4.5,
    "rooms_count": 50,
    "available_rooms": 20,
    "is_active": true
  }' \
  http://localhost:8000/api/hotels/
```

**Résultat attendu:** Hôtel créé sans erreur

### Test 3: Modifier un hôtel

```bash
curl -X PATCH -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Hotel Test Updated"}' \
  http://localhost:8000/api/hotels/1/
```

**Résultat attendu:** Hôtel modifié sans erreur

### Test 4: Frontend

1. Ouvrir http://localhost:5173
2. Créer un hôtel (sans image)
3. Modifier un hôtel
4. Supprimer un hôtel

**Résultat attendu:** Tout fonctionne sans erreur

---

## 📊 Fichiers Modifiés

| Fichier | Changement | Status |
|---------|-----------|--------|
| `backend/hotels/models.py` | Suppression du champ image | ✅ |
| `backend/hotels/serializers.py` | Suppression du champ image | ✅ |
| `frontend/src/hooks/useHotels.ts` | Suppression du champ image | ✅ |
| `frontend/src/components/HotelModal.tsx` | À mettre à jour | ⏳ |
| `frontend/src/pages/Hotels.tsx` | À mettre à jour | ⏳ |

---

## 🔄 Mise à Jour du Frontend (Optionnel)

Si vous voulez nettoyer complètement le frontend, vous pouvez aussi supprimer:

### HotelModal.tsx
- Supprimer la section "Image" du formulaire
- Supprimer `selectedImage` et `imagePreview`
- Supprimer `handleImageChange`

### Hotels.tsx
- Supprimer l'affichage de l'image
- Utiliser un avatar ou une icône à la place

---

## ⚠️ Attention

### Avant de Supprimer les Images

1. **Sauvegarder les images** si vous en avez besoin
   ```bash
   cp -r backend/media/hotels/ backup/
   ```

2. **Vérifier qu'aucun code** ne dépend du champ image
   ```bash
   grep -r "image" frontend/src/
   grep -r "image" backend/
   ```

3. **Tester en développement** avant de déployer en production

---

## 🚀 Déploiement Production

### Étape 1: Créer une Sauvegarde

```bash
# Sauvegarder la base de données
pg_dump DATABASE_NAME > backup.sql

# Sauvegarder les images
cp -r media/ backup/media/
```

### Étape 2: Appliquer la Migration

```bash
python manage.py migrate hotels
```

### Étape 3: Vérifier

```bash
# Vérifier que l'API fonctionne
curl https://api.example.com/api/hotels/

# Vérifier que le frontend fonctionne
# Ouvrir https://example.com
```

### Étape 4: Nettoyer (Optionnel)

```bash
# Supprimer les images
rm -rf media/hotels/

# Vider le cache
python manage.py clear_cache
```

---

## 🔙 Rollback (Si Nécessaire)

### Annuler la Migration

```bash
python manage.py migrate hotels 0001
```

### Restaurer la Sauvegarde

```bash
# Restaurer la base de données
psql DATABASE_NAME < backup.sql

# Restaurer les images
cp -r backup/media/ media/
```

---

## 📝 Checklist

- [ ] Créer une migration Django
- [ ] Appliquer la migration
- [ ] Vérifier que l'API fonctionne
- [ ] Tester la création d'hôtel
- [ ] Tester la modification d'hôtel
- [ ] Tester la suppression d'hôtel
- [ ] Tester le frontend
- [ ] Supprimer les fichiers images (optionnel)
- [ ] Nettoyer le code frontend (optionnel)
- [ ] Déployer en production

---

## 📞 Problèmes Courants

### Erreur: "No changes detected in app 'hotels'"

**Cause:** Le modèle n'a pas changé

**Solution:** Vérifier que le fichier models.py a été modifié

### Erreur: "Column 'image' does not exist"

**Cause:** La migration n'a pas été appliquée

**Solution:** 
```bash
python manage.py migrate hotels
```

### Erreur: "image field is required"

**Cause:** Le serializer attend toujours le champ image

**Solution:** Vérifier que le serializer a été modifié

---

## ✅ Conclusion

Le champ `image` a été supprimé de:
- ✅ Modèle Django
- ✅ Serializer Django
- ✅ Interface TypeScript
- ✅ Hook useHotels

**Prochaines étapes:**
1. Créer et appliquer la migration
2. Tester le système
3. Nettoyer le frontend (optionnel)
4. Déployer en production

---

**Date:** 8 Décembre 2024
**Status:** ✅ Prêt pour migration
