# Guide de Déploiement - RED PRODUCT

## 🚀 Déploiement Frontend sur Vercel

### Étapes

1. **Préparer le build**
```bash
cd frontend
npm run build
```

2. **Connecter à Vercel**
```bash
npm install -g vercel
vercel login
```

3. **Déployer**
```bash
vercel deploy --prod
```

### Configuration Vercel

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: URL de l'API backend

### Preview Deployments

Chaque PR crée automatiquement une preview:
```bash
vercel deploy
```

## 🐍 Déploiement Backend sur Render

### Prérequis

- Compte Render
- Repo GitHub connecté
- Base de données PostgreSQL (AlwaysData ou autre)

### Étapes

1. **Créer un Web Service sur Render**
   - Connecter le repo GitHub
   - Sélectionner la branche `main`

2. **Configuration du Service**

   **Build Command:**
   ```
   pip install -r requirements.txt && python manage.py migrate
   ```

   **Start Command:**
   ```
   gunicorn config.wsgi
   ```

3. **Variables d'Environnement**

   Ajouter dans Render:
   ```
   DEBUG=False
   SECRET_KEY=<generate-a-strong-key>
   ALLOWED_HOSTS=your-app.onrender.com
   
   DATABASE_NAME=abdoul-salam-diallo_red_product
   DATABASE_USER=abdoul-salam-diallo_red_product
   DATABASE_PASSWORD=Asd781209169#
   DATABASE_HOST=postgresql-abdoul-salam-diallo.alwaysdata.net
   DATABASE_PORT=5432
   
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

4. **Déployer**
   - Cliquer sur "Deploy"
   - Attendre la fin du déploiement

### Commandes Post-Déploiement

Après le premier déploiement:

```bash
# Créer un superuser
python manage.py createsuperuser

# Charger les fixtures
python manage.py loaddata hotels/fixtures/hotels.json
```

## 🗄️ Configuration PostgreSQL AlwaysData

### Connexion

```
HOST: postgresql-abdoul-salam-diallo.alwaysdata.net
PORT: 5432
DATABASE: abdoul-salam-diallo_red_product
USER: abdoul-salam-diallo_red_product
PASSWORD: Asd781209169#
```

### Connexion Locale

```bash
psql -h postgresql-abdoul-salam-diallo.alwaysdata.net \
     -U abdoul-salam-diallo_red_product \
     -d abdoul-salam-diallo_red_product
```

## 📋 Checklist de Déploiement

### Avant le déploiement

- [ ] Tous les tests passent
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Fixtures chargées
- [ ] Superuser créé
- [ ] CORS configuré correctement
- [ ] SECRET_KEY changé (pas la clé de dev)
- [ ] DEBUG = False en production

### Après le déploiement

- [ ] Frontend accessible
- [ ] Backend accessible
- [ ] Authentification fonctionne
- [ ] API endpoints répondent
- [ ] Admin Django accessible
- [ ] Emails configurés (si applicable)
- [ ] Logs vérifiés pour erreurs

## 🔄 Workflow CI/CD

### GitHub Actions (Optionnel)

Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 🐛 Dépannage

### Erreur: "CORS policy"
- Vérifier `CORS_ALLOWED_ORIGINS` dans settings.py
- Vérifier l'URL du frontend dans la variable

### Erreur: "Database connection refused"
- Vérifier les identifiants PostgreSQL
- Vérifier que la base de données existe
- Vérifier la connectivité réseau

### Erreur: "Module not found"
- Vérifier que `requirements.txt` est à jour
- Vérifier que toutes les dépendances sont listées

### Erreur: "Static files not found"
- Exécuter: `python manage.py collectstatic --noinput`
- Vérifier `STATIC_ROOT` et `STATIC_URL`

## 📊 Monitoring

### Logs Render
```bash
# Voir les logs en temps réel
render logs <service-id>
```

### Logs Vercel
```bash
# Voir les logs
vercel logs
```

## 🔐 Sécurité

- Utiliser HTTPS en production
- Changer SECRET_KEY en production
- Ne pas commiter les fichiers .env
- Utiliser des variables d'environnement pour les secrets
- Activer 2FA sur les comptes Render et Vercel
- Mettre à jour régulièrement les dépendances

## 📞 Support

Pour des problèmes de déploiement:
- Vérifier les logs
- Consulter la documentation Render/Vercel
- Créer une issue sur GitHub
