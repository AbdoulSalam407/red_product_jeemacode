# Tests CRUD Hôtels - Checklist Complète

## 🧪 Environnement de Test

### Prérequis
- [ ] Backend Django en cours d'exécution (`python manage.py runserver`)
- [ ] Frontend Vite en cours d'exécution (`npm run dev`)
- [ ] Utilisateur authentifié
- [ ] Navigateur avec DevTools ouvert (F12)

### Variables d'Environnement
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:8000/api

# Backend (.env)
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## 📋 Tests CREATE (Création)

### Test 1: Créer un hôtel simple (sans image)

**Étapes:**
1. Cliquer sur "Ajouter un hôtel"
2. Remplir les champs:
   - Nom: "Hotel Test 1"
   - Ville: "Dakar"
   - Adresse: "123 Rue de la Paix"
   - Téléphone: "+221 33 123 45 67"
   - Email: "test1@hotel.com"
   - Prix: "50000"
   - Note: "4.5"
   - Chambres: "50"
   - Disponibles: "20"
3. Cliquer "Créer"

**Vérifications:**
- [ ] L'hôtel apparaît immédiatement dans la liste
- [ ] Pas de délai d'attente
- [ ] Alerte succès s'affiche (3s)
- [ ] Modal se ferme automatiquement
- [ ] Hôtel persiste après refresh

**Logs attendus:**
```
[Frontend] Form data before submit: { name: "Hotel Test 1", ... }
[Frontend] Create data: { name: "Hotel Test 1", ... }
[Backend] Create hotel request data: <QueryDict: {...}>
[Backend] Hotel creation validation errors: {} (vide = succès)
```

---

### Test 2: Créer un hôtel avec image

**Étapes:**
1. Cliquer sur "Ajouter un hôtel"
2. Remplir les champs (comme Test 1)
3. Cliquer sur "Ajouter" dans la section Image
4. Sélectionner une image (JPG/PNG)
5. Vérifier le preview
6. Cliquer "Créer"

**Vérifications:**
- [ ] Image preview s'affiche
- [ ] Hôtel créé avec image
- [ ] Image visible dans la liste
- [ ] Image persiste après refresh
- [ ] Pas d'erreur "Image invalide"

**Logs attendus:**
```
[Frontend] Form data before submit: { ..., image: File }
[Backend] Create hotel request data: <QueryDict: {...}> (inclut image)
```

---

### Test 3: Validation des champs requis

**Étapes:**
1. Cliquer sur "Ajouter un hôtel"
2. Laisser les champs vides
3. Cliquer "Créer"

**Vérifications:**
- [ ] Erreurs de validation affichées
- [ ] Hôtel non créé
- [ ] Alerte erreur avec détails

**Erreurs attendues:**
```
{
  "name": "name est requis",
  "city": "city est requis",
  "address": "address est requis",
  "phone": "phone est requis",
  "email": "email est requis",
  "price_per_night": "price_per_night est requis"
}
```

---

## ✏️ Tests UPDATE (Mise à Jour)

### Test 4: Modifier le nom et le prix

**Étapes:**
1. Cliquer "Modifier" sur un hôtel
2. Changer le nom: "Hotel Test 1" → "Hotel Test 1 Premium"
3. Changer le prix: "50000" → "75000"
4. Cliquer "Mettre à jour"

**Vérifications:**
- [ ] Spinner apparaît pendant la sync
- [ ] Modifications visibles immédiatement
- [ ] Alerte succès s'affiche (3s)
- [ ] Modifications persistées après refresh
- [ ] Autres champs inchangés

**Logs attendus:**
```
[Frontend] Modified data: { name: "Hotel Test 1 Premium", price_per_night: 75000 }
[Backend] Update hotel request data: <QueryDict: {...}>
```

---

### Test 5: Modifier l'image

**Étapes:**
1. Cliquer "Modifier" sur un hôtel
2. Cliquer sur l'image existante
3. Sélectionner une nouvelle image
4. Vérifier le preview
5. Cliquer "Mettre à jour"

**Vérifications:**
- [ ] Nouvelle image visible immédiatement
- [ ] Spinner pendant la sync
- [ ] Alerte succès s'affiche
- [ ] Nouvelle image persistée après refresh
- [ ] Ancienne image remplacée

---

### Test 6: Modification partielle

**Étapes:**
1. Cliquer "Modifier" sur un hôtel
2. Changer SEULEMENT le prix
3. Laisser les autres champs inchangés
4. Cliquer "Mettre à jour"

**Vérifications:**
- [ ] Seul le prix est modifié
- [ ] Autres champs restent inchangés
- [ ] Alerte succès affiche seulement le prix
- [ ] Pas d'erreur "champ requis"

**Logs attendus:**
```
[Frontend] Modified data: { price_per_night: 75000 }
```

---

## 🗑️ Tests DELETE (Suppression)

### Test 7: Supprimer un hôtel

**Étapes:**
1. Cliquer "Supprimer" sur un hôtel
2. Vérifier la confirmation
3. Cliquer "Supprimer"

**Vérifications:**
- [ ] Confirmation affichée avec le nom
- [ ] Hôtel disparaît immédiatement
- [ ] Spinner pendant la sync
- [ ] Alerte succès s'affiche (3s)
- [ ] Hôtel supprimé après refresh
- [ ] Pas d'erreur 404

**Logs attendus:**
```
[Frontend] Deleting hotel: { id: 1, name: "Hotel Test 1" }
[Backend] Delete hotel request: DELETE /hotels/1/
```

---

### Test 8: Annuler la suppression

**Étapes:**
1. Cliquer "Supprimer" sur un hôtel
2. Cliquer "Annuler"

**Vérifications:**
- [ ] Confirmation disparaît
- [ ] Hôtel reste dans la liste
- [ ] Pas de requête DELETE envoyée
- [ ] Pas d'alerte

---

## 🖼️ Tests Images

### Test 9: Affichage image locale (data URL)

**Étapes:**
1. Créer un hôtel avec image
2. Ouvrir DevTools → Network
3. Vérifier que l'image est une data URL

**Vérifications:**
- [ ] Image affichée correctement
- [ ] Pas de requête réseau pour l'image
- [ ] Preview fonctionne

---

### Test 10: Affichage image serveur

**Étapes:**
1. Créer un hôtel avec image
2. Attendre la confirmation serveur
3. Vérifier l'URL de l'image

**Vérifications:**
- [ ] Image affichée correctement
- [ ] URL: `/media/hotels/...`
- [ ] Image persiste après refresh
- [ ] Pas d'erreur 404

---

### Test 11: Fallback à première lettre

**Étapes:**
1. Créer un hôtel SANS image
2. Vérifier l'affichage

**Vérifications:**
- [ ] Première lettre du nom affichée
- [ ] Fond dégradé (primary → secondary)
- [ ] Texte blanc et lisible

---

### Test 12: Erreur image

**Étapes:**
1. Modifier l'URL d'une image dans DevTools
2. Vérifier le fallback

**Vérifications:**
- [ ] Image ne s'affiche pas
- [ ] Première lettre affichée en fallback
- [ ] Pas d'erreur console

---

## 💾 Tests Cache

### Test 13: Cache valide (< 2 min)

**Étapes:**
1. Charger la page (appel API)
2. Attendre 30 secondes
3. Recharger la page (F5)
4. Vérifier les logs

**Vérifications:**
- [ ] Pas d'appel API (cache utilisé)
- [ ] Données affichées immédiatement
- [ ] Logs: "Charger depuis localStorage"

---

### Test 14: Cache expiré (> 2 min)

**Étapes:**
1. Charger la page (appel API)
2. Attendre 2+ minutes
3. Recharger la page (F5)
4. Vérifier les logs

**Vérifications:**
- [ ] Appel API effectué
- [ ] Cache invalidé et mis à jour
- [ ] Logs: "Récupérer les hôtels depuis l'API"

---

### Test 15: Invalidation du cache après CREATE

**Étapes:**
1. Charger la page
2. Créer un nouvel hôtel
3. Vérifier le cache

**Vérifications:**
- [ ] Cache invalidé après CREATE
- [ ] Prochain fetch récupère depuis l'API
- [ ] Nouvel hôtel visible

---

## 🔄 Tests Synchronisation

### Test 16: Optimistic update

**Étapes:**
1. Ouvrir DevTools → Network (throttle: Slow 3G)
2. Modifier un hôtel
3. Observer l'UI pendant la sync

**Vérifications:**
- [ ] Modification visible immédiatement (< 100ms)
- [ ] Spinner pendant la sync
- [ ] Alerte succès après confirmation serveur
- [ ] Pas de délai d'attente perceptible

---

### Test 17: Rollback en cas d'erreur

**Étapes:**
1. Modifier un hôtel
2. Interrompre la requête (DevTools → Network → Right-click → Abort)
3. Observer le rollback

**Vérifications:**
- [ ] Modification annulée
- [ ] État précédent restauré
- [ ] Alerte erreur affichée
- [ ] Spinner retiré

---

## 🌐 Tests Mode Ligne

### Test 18: Créer hôtel en ligne

**Étapes:**
1. Vérifier la connexion réseau
2. Créer un hôtel
3. Vérifier la synchronisation

**Vérifications:**
- [ ] Hôtel créé immédiatement
- [ ] Synchronisation réussie
- [ ] Alerte succès
- [ ] Hôtel persiste après refresh

---

### Test 19: Erreur réseau

**Étapes:**
1. Désactiver le réseau (DevTools → Network → Offline)
2. Créer un hôtel
3. Observer l'erreur

**Vérifications:**
- [ ] Hôtel créé localement
- [ ] Erreur réseau détectée
- [ ] Alerte erreur affichée
- [ ] Hôtel supprimé du cache (rollback)

---

## 📊 Tests Performance

### Test 20: Temps de réponse CREATE

**Étapes:**
1. Ouvrir DevTools → Performance
2. Créer un hôtel
3. Mesurer le temps

**Vérifications:**
- [ ] UI update: < 100ms
- [ ] Alerte: < 500ms
- [ ] Sync serveur: < 2s

---

### Test 21: Temps de réponse UPDATE

**Étapes:**
1. Ouvrir DevTools → Performance
2. Modifier un hôtel
3. Mesurer le temps

**Vérifications:**
- [ ] UI update: < 100ms
- [ ] Spinner: visible pendant sync
- [ ] Sync serveur: < 2s

---

### Test 22: Temps de réponse DELETE

**Étapes:**
1. Ouvrir DevTools → Performance
2. Supprimer un hôtel
3. Mesurer le temps

**Vérifications:**
- [ ] UI update: < 100ms
- [ ] Spinner: visible pendant sync
- [ ] Sync serveur: < 2s

---

## 🔐 Tests Sécurité

### Test 23: Authentification requise

**Étapes:**
1. Se déconnecter
2. Essayer d'accéder à /hotels
3. Vérifier la redirection

**Vérifications:**
- [ ] Redirection vers /login
- [ ] Pas d'accès aux données
- [ ] Alerte "Session expirée"

---

### Test 24: Token refresh

**Étapes:**
1. Attendre l'expiration du token (15 min)
2. Effectuer une action
3. Vérifier le refresh automatique

**Vérifications:**
- [ ] Nouveau token obtenu
- [ ] Action réussie
- [ ] Pas de redirection vers login

---

## 📝 Résumé des Tests

| Test | Catégorie | Status | Notes |
|------|-----------|--------|-------|
| 1 | CREATE | ⬜ | Hôtel simple |
| 2 | CREATE | ⬜ | Avec image |
| 3 | CREATE | ⬜ | Validation |
| 4 | UPDATE | ⬜ | Nom + Prix |
| 5 | UPDATE | ⬜ | Image |
| 6 | UPDATE | ⬜ | Partiel |
| 7 | DELETE | ⬜ | Suppression |
| 8 | DELETE | ⬜ | Annulation |
| 9 | IMAGE | ⬜ | Data URL |
| 10 | IMAGE | ⬜ | Serveur |
| 11 | IMAGE | ⬜ | Fallback |
| 12 | IMAGE | ⬜ | Erreur |
| 13 | CACHE | ⬜ | Valide |
| 14 | CACHE | ⬜ | Expiré |
| 15 | CACHE | ⬜ | Invalidation |
| 16 | SYNC | ⬜ | Optimistic |
| 17 | SYNC | ⬜ | Rollback |
| 18 | LIGNE | ⬜ | Créer |
| 19 | LIGNE | ⬜ | Erreur |
| 20 | PERF | ⬜ | CREATE |
| 21 | PERF | ⬜ | UPDATE |
| 22 | PERF | ⬜ | DELETE |
| 23 | SÉCURITÉ | ⬜ | Auth |
| 24 | SÉCURITÉ | ⬜ | Token |

**Légende:**
- ⬜ = À tester
- ✅ = Succès
- ❌ = Échec
- ⚠️ = Avertissement

---

## 🐛 Commandes de Débogage

### Frontend (Console)

```javascript
// Vérifier le cache
localStorage.getItem('hotels_cache')
localStorage.getItem('hotels_cache_time')

// Vider le cache
localStorage.removeItem('hotels_cache')
localStorage.removeItem('hotels_cache_time')

// Vérifier les hôtels en mémoire
console.log(hotels)

// Vérifier les erreurs
console.error('Erreur:', error)
```

### Backend (Logs)

```bash
# Logs Django
tail -f /path/to/django.log

# Logs de la base de données
python manage.py dbshell

# Vérifier les images
ls -la media/hotels/
```

---

## 📞 Support

En cas de problème:
1. Vérifier les logs (Frontend + Backend)
2. Vérifier le cache (DevTools → Application)
3. Vérifier la connexion réseau (DevTools → Network)
4. Vérifier la base de données (Django admin)
5. Redémarrer le serveur
