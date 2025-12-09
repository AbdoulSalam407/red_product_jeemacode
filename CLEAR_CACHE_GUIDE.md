# 🗑️ Guide - Vider le Cache

## 📋 Méthode 1: Console du Navigateur (Rapide)

### Étapes

1. **Ouvrir la console du navigateur**
   - Appuyer sur `F12` ou `Ctrl+Shift+I`
   - Aller à l'onglet "Console"

2. **Exécuter la commande**
   ```javascript
   localStorage.removeItem('hotels_cache');
   localStorage.removeItem('hotels_cache_time');
   location.reload();
   ```

3. **Vérifier**
   - La page se recharge
   - Les données sont rechargées depuis le serveur
   - Les images s'affichent correctement

---

## 📋 Méthode 2: Vider Tout le Cache

### Console
```javascript
localStorage.clear();
location.reload();
```

---

## 📋 Méthode 3: Vérifier le Cache

### Voir les informations du cache
```javascript
const cacheData = localStorage.getItem('hotels_cache');
const cacheTime = localStorage.getItem('hotels_cache_time');

console.log('Cache présent:', !!cacheData);
console.log('Taille:', cacheData ? (cacheData.length / 1024).toFixed(2) + ' KB' : 0);
console.log('Dernière mise à jour:', cacheTime ? new Date(parseInt(cacheTime)).toLocaleString() : 'Jamais');
```

---

## 🔧 Méthode 4: Utiliser le Composant (Frontend)

### Importer le composant
```typescript
import { ClearCacheButton } from '../components/ClearCacheButton';

// Ajouter dans le layout
<ClearCacheButton />
```

### Utiliser l'utilitaire
```typescript
import { clearCache, getCacheInfo } from '../utils/clearCache';

// Vider le cache
clearCache();

// Voir les infos
const info = getCacheInfo();
console.log(info);
```

---

## 🎯 Quand Vider le Cache?

- ✅ Après une mise à jour d'image
- ✅ Après une modification d'hôtel
- ✅ Si les données sont obsolètes
- ✅ Si les images ne s'affichent pas correctement

---

## 📊 Infos du Cache

### Clés stockées
- `hotels_cache` - Données des hôtels (JSON)
- `hotels_cache_time` - Timestamp de la dernière mise à jour

### Durée de validité
- **2 minutes** - Le cache expire après 2 minutes

### Taille typique
- **50-200 KB** - Dépend du nombre d'hôtels et de la taille des images base64

---

## 🔄 Cycle de Cache

```
1. Première visite
   ↓
2. Données chargées depuis le serveur
   ↓
3. Données stockées en cache (2 minutes)
   ↓
4. Visites suivantes utilisent le cache
   ↓
5. Après 2 minutes, cache expiré
   ↓
6. Nouvelles données chargées
```

---

## ⚡ Commandes Rapides

### Vider et recharger
```javascript
localStorage.removeItem('hotels_cache');
localStorage.removeItem('hotels_cache_time');
location.reload();
```

### Vider tout
```javascript
localStorage.clear();
location.reload();
```

### Voir le cache
```javascript
JSON.parse(localStorage.getItem('hotels_cache'));
```

### Voir la taille
```javascript
(localStorage.getItem('hotels_cache').length / 1024).toFixed(2) + ' KB'
```

---

## 🐛 Dépannage

### Les images ne s'affichent pas?
```javascript
// Vider le cache
localStorage.removeItem('hotels_cache');
localStorage.removeItem('hotels_cache_time');
location.reload();
```

### Le cache est trop gros?
```javascript
// Vider tout
localStorage.clear();
location.reload();
```

### Vérifier si le cache est valide
```javascript
const cacheTime = localStorage.getItem('hotels_cache_time');
const now = Date.now();
const age = now - parseInt(cacheTime);
const valid = age < 2 * 60 * 1000; // 2 minutes

console.log('Cache valide:', valid);
console.log('Age:', (age / 1000).toFixed(0) + 's');
```

---

## 📝 Fichiers Créés

- ✅ `frontend/src/utils/clearCache.ts` - Utilitaires
- ✅ `frontend/src/components/ClearCacheButton.tsx` - Composant

---

**Date:** 8 Décembre 2024
**Status:** ✅ Prêt
