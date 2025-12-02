# Configuration des Variables d'Environnement

Guide complet pour configurer les variables d'environnement du projet RED PRODUCT.

## 📋 Backend (.env)

### Fichier: `backend/.env`

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-super-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database PostgreSQL
DATABASE_NAME=red_product
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://your-frontend.vercel.app

# JWT
JWT_SECRET_KEY=your-jwt-secret-key

# Email (optionnel)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Exemple pour Développement Local

```env
DEBUG=True
SECRET_KEY=dev-key-12345-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_NAME=red_product
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173

JWT_SECRET_KEY=dev-jwt-key-12345
```

### Exemple pour Production (Render)

```env
DEBUG=False
SECRET_KEY=generate-strong-key-here
ALLOWED_HOSTS=your-app.onrender.com,your-domain.com

DATABASE_NAME=abdoul-salam-diallo_red_product
DATABASE_USER=abdoul-salam-diallo_red_product
DATABASE_PASSWORD=Asd781209169#
DATABASE_HOST=postgresql-abdoul-salam-diallo.alwaysdata.net
DATABASE_PORT=5432

CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app

JWT_SECRET_KEY=generate-strong-key-here
```

## 🎨 Frontend (.env)

### Fichier: `frontend/.env`

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Optional: Analytics, etc.
VITE_APP_NAME=RED PRODUCT
VITE_APP_VERSION=1.0.0
```

### Exemple pour Développement Local

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=RED PRODUCT
VITE_APP_VERSION=1.0.0
```

### Exemple pour Production (Vercel)

```env
VITE_API_URL=https://your-api.onrender.com/api
VITE_APP_NAME=RED PRODUCT
VITE_APP_VERSION=1.0.0
```

## 🔐 Générer des Clés Sécurisées

### SECRET_KEY Django

```python
# Exécuter dans le shell Python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Ou utiliser:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### JWT Secret Key

```python
import secrets
print(secrets.token_urlsafe(50))
```

Ou utiliser:
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

## 📝 Checklist de Configuration

### Backend

- [ ] Créer `backend/.env`
- [ ] Configurer `DEBUG` (True pour dev, False pour prod)
- [ ] Générer et configurer `SECRET_KEY`
- [ ] Configurer `ALLOWED_HOSTS`
- [ ] Configurer les identifiants PostgreSQL
- [ ] Configurer `CORS_ALLOWED_ORIGINS`
- [ ] Vérifier les permissions du fichier `.env`

### Frontend

- [ ] Créer `frontend/.env`
- [ ] Configurer `VITE_API_URL`
- [ ] Vérifier l'accès à l'API

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne jamais commiter `.env`**
   ```bash
   # .gitignore
   .env
   .env.local
   .env.*.local
   ```

2. **Utiliser `.env.example`**
   ```bash
   # Créer un fichier exemple sans secrets
   cp .env .env.example
   # Éditer .env.example pour retirer les secrets
   ```

3. **Permissions du fichier**
   ```bash
   # Linux/Mac
   chmod 600 .env
   ```

4. **Secrets en Production**
   - Utiliser les variables d'environnement du platform (Render, Vercel)
   - Ne jamais hardcoder les secrets
   - Utiliser des gestionnaires de secrets (AWS Secrets Manager, etc.)

## 🚀 Variables d'Environnement par Plateforme

### Render (Backend)

Dans le dashboard Render, ajouter les variables:

```
DEBUG=False
SECRET_KEY=<generated-key>
ALLOWED_HOSTS=your-app.onrender.com
DATABASE_NAME=abdoul-salam-diallo_red_product
DATABASE_USER=abdoul-salam-diallo_red_product
DATABASE_PASSWORD=Asd781209169#
DATABASE_HOST=postgresql-abdoul-salam-diallo.alwaysdata.net
DATABASE_PORT=5432
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Vercel (Frontend)

Dans le dashboard Vercel, ajouter les variables:

```
VITE_API_URL=https://your-api.onrender.com/api
```

## 📚 Références

### Variables Django Importantes

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DEBUG` | Mode debug | `True` ou `False` |
| `SECRET_KEY` | Clé secrète Django | `django-insecure-...` |
| `ALLOWED_HOSTS` | Hôtes autorisés | `localhost,127.0.0.1` |
| `DATABASE_NAME` | Nom de la base | `red_product` |
| `DATABASE_USER` | Utilisateur DB | `postgres` |
| `DATABASE_PASSWORD` | Mot de passe DB | `password` |
| `DATABASE_HOST` | Hôte DB | `localhost` |
| `DATABASE_PORT` | Port DB | `5432` |
| `CORS_ALLOWED_ORIGINS` | Origines CORS | `http://localhost:5173` |

### Variables Vite Importantes

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL de l'API | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Nom de l'app | `RED PRODUCT` |
| `VITE_APP_VERSION` | Version | `1.0.0` |

## 🔧 Dépannage

### Erreur: "SECRET_KEY not found"

```bash
# Vérifier que .env existe
ls -la backend/.env

# Vérifier le contenu
cat backend/.env | grep SECRET_KEY
```

### Erreur: "Database connection refused"

```bash
# Vérifier les identifiants
echo $DATABASE_HOST
echo $DATABASE_USER

# Tester la connexion
psql -h $DATABASE_HOST -U $DATABASE_USER -d $DATABASE_NAME
```

### Erreur: "CORS policy"

```bash
# Vérifier CORS_ALLOWED_ORIGINS
echo $CORS_ALLOWED_ORIGINS

# Doit contenir l'URL du frontend
# http://localhost:5173 pour dev
# https://your-domain.vercel.app pour prod
```

## 💡 Tips

1. **Utiliser des fichiers `.env.local`** pour les secrets locaux
2. **Documenter les variables** dans `.env.example`
3. **Valider les variables** au démarrage de l'app
4. **Utiliser des valeurs par défaut** pour les variables optionnelles
5. **Recharger l'app** après modification des variables

## 📞 Support

Pour des problèmes de configuration:
1. Vérifier les fichiers `.env`
2. Consulter les logs
3. Vérifier les permissions
4. Créer une issue sur GitHub

---

**Dernière mise à jour**: 1 Décembre 2025
