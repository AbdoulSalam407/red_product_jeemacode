# ✅ Vérifier que le CRUD Fonctionne

## 🧪 Tests Rapides (5 minutes)

### 1. Backend Fonctionne?

```bash
cd backend
python manage.py runserver
```

Vérifier:
- ✅ Server démarre sans erreur
- ✅ "Starting development server at http://127.0.0.1:8000/"

### 2. Frontend Fonctionne?

```bash
cd frontend
npm run dev
```

Vérifier:
- ✅ Vite démarre sans erreur
- ✅ "Local: http://localhost:5173"

### 3. API Fonctionne?

Ouvrir: `http://localhost:8000/api/hotels/`

Vérifier:
- ✅ Réponse JSON
- ✅ Liste des hôtels (ou liste vide)

### 4. Frontend Fonctionne?

Ouvrir: `http://localhost:5173`

Vérifier:
- ✅ Page charge
- ✅ Menu visible
- ✅ Section "Hôtels" visible

---

## 🔐 Authentification

### 1. Se Connecter

1. Cliquer sur "Connexion" ou "Déconnexion"
2. Entrer email: `admin@example.com`
3. Entrer password: `admin123`
4. Cliquer "Se connecter"

Vérifier:
- ✅ Connexion réussie
- ✅ Redirection vers page hôtels
- ✅ Bouton "Ajouter un hôtel" visible

---

## 🏨 Tester le CRUD

### CREATE - Créer un Hôtel

1. Cliquer "Ajouter un hôtel"
2. Remplir le formulaire:
   - **Nom:** Hotel Test
   - **Ville:** Dakar
   - **Adresse:** 123 Rue
   - **Téléphone:** +221 33 123 45 67
   - **Email:** hotel@test.com
   - **Prix:** 150000
   - **Rating:** 4.5
   - **Chambres:** 50
   - **Disponibles:** 20
   - **Image:** Sélectionner une image

3. Cliquer "Enregistrer"

Vérifier:
- ✅ Alerte de succès
- ✅ Hôtel apparaît dans la liste
- ✅ Image s'affiche

### READ - Afficher les Hôtels

1. Aller à la page "Hôtels"
2. Voir la liste des hôtels

Vérifier:
- ✅ Hôtels affichés
- ✅ Images visibles
- ✅ Informations correctes

### UPDATE - Modifier un Hôtel

1. Cliquer "Modifier" sur un hôtel
2. Changer le nom: "Hotel Test Updated"
3. Changer le rating: 5.0
4. Cliquer "Enregistrer"

Vérifier:
- ✅ Alerte de succès
- ✅ Hôtel mis à jour dans la liste
- ✅ Changements visibles

### UPDATE IMAGE - Changer l'Image

1. Cliquer "Modifier" sur un hôtel
2. Sélectionner une nouvelle image
3. Cliquer "Enregistrer"

Vérifier:
- ✅ Alerte de succès
- ✅ Image mise à jour
- ✅ Nouvelle image affichée

### DELETE - Supprimer un Hôtel

1. Cliquer "Supprimer" sur un hôtel
2. Confirmer la suppression

Vérifier:
- ✅ Alerte de confirmation
- ✅ Alerte de succès
- ✅ Hôtel supprimé de la liste

---

## 📊 Vérifier les Images Base64

### Dans la Console du Navigateur

```javascript
// Voir les données en cache
const cache = JSON.parse(localStorage.getItem('hotels_cache'));
console.log(cache);

// Vérifier une image
console.log(cache[0].image_base64);

// Vérifier les métadonnées
console.log('Type:', cache[0].image_type);
console.log('Size:', cache[0].image_size, 'bytes');
console.log('Size MB:', cache[0].image_size_mb, 'MB');
```

Vérifier:
- ✅ `image_base64` commence par "data:image/"
- ✅ `image_type` est "jpeg", "png", etc.
- ✅ `image_size` > 0

---

## 🔄 Vérifier le Cache

### Voir les Infos du Cache

```javascript
const cacheData = localStorage.getItem('hotels_cache');
const cacheTime = localStorage.getItem('hotels_cache_time');

console.log('Cache présent:', !!cacheData);
console.log('Taille:', (cacheData.length / 1024).toFixed(2), 'KB');
console.log('Dernière mise à jour:', new Date(parseInt(cacheTime)).toLocaleString());
```

Vérifier:
- ✅ Cache présent
- ✅ Taille > 0
- ✅ Timestamp récent

### Vider le Cache

```javascript
localStorage.removeItem('hotels_cache');
localStorage.removeItem('hotels_cache_time');
location.reload();
```

Vérifier:
- ✅ Page recharge
- ✅ Données rechargées depuis le serveur

---

## 🚀 Vérifier la Performance

### Temps de Réponse

Ouvrir DevTools (F12) → Network

1. Créer un hôtel
2. Voir le temps de réponse
3. Doit être < 1 seconde

Vérifier:
- ✅ POST /api/hotels/ < 1s
- ✅ PATCH /api/hotels/{id}/ < 1s
- ✅ DELETE /api/hotels/{id}/ < 500ms

### Taille des Images

```javascript
const cache = JSON.parse(localStorage.getItem('hotels_cache'));
cache.forEach(hotel => {
  console.log(`${hotel.name}: ${hotel.image_size_mb} MB`);
});
```

Vérifier:
- ✅ Chaque image < 10 MB
- ✅ Total cache < 50 MB

---

## 🐛 Dépannage

### Les images ne s'affichent pas

```javascript
// Vider le cache
localStorage.clear();
location.reload();
```

### Erreur 401 Unauthorized

- Vérifier que vous êtes connecté
- Vérifier le token JWT
- Se reconnecter

### Erreur 400 Bad Request

- Vérifier que tous les champs requis sont remplis
- Vérifier le format de l'image (base64)
- Vérifier la taille de l'image (< 10 MB)

### Erreur 500 Server Error

- Vérifier les logs du backend
- Vérifier la base de données
- Redémarrer le serveur

---

## ✅ Checklist Final

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] API répond correctement
- [ ] Authentification fonctionne
- [ ] CREATE fonctionne
- [ ] READ fonctionne
- [ ] UPDATE fonctionne
- [ ] UPDATE IMAGE fonctionne
- [ ] DELETE fonctionne
- [ ] Images s'affichent
- [ ] Cache fonctionne
- [ ] Performance acceptable

---

## 🎯 Résumé

Si tous les tests passent:
✅ **CRUD Hôtels 100% Fonctionnel**

Prêt pour:
- ✅ Développement
- ✅ Tests
- ✅ Production

---

**Date:** 8 Décembre 2024
**Status:** ✅ Prêt à Tester
