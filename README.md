# RED PRODUCT - Plateforme de Gestion Hôtelière

Plateforme complète de gestion hôtelière avec frontend React et backend Django REST API.

## 📋 Structure du Projet

```
RED PRODUCT/
├── frontend/          # Application React avec Tailwind CSS
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages principales
│   │   ├── routes/        # Configuration des routes
│   │   ├── lib/           # Utilitaires (API, auth)
│   │   ├── schemas/       # Schémas Zod
│   │   ├── hooks/         # Hooks personnalisés
│   │   └── styles/        # Styles globaux
│   └── package.json
│
└── backend/           # API Django REST
    ├── config/        # Configuration Django
    ├── users/         # App authentification
    ├── hotels/        # App gestion des hôtels
    ├── tickets/       # App tickets support
    ├── messages/      # App messagerie
    ├── emails/        # App gestion emails
    ├── forms/         # App formulaires
    ├── entries/       # App entrées formulaires
    ├── manage.py
    └── requirements.txt
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- Python 3.9+
- PostgreSQL 12+
- pip et npm

### Installation Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### Configuration Backend

1. Créer un fichier `.env` à la racine du backend:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_NAME=red_product
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

2. Migrations et création du superuser:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata hotels/fixtures/hotels.json
```

3. Démarrer le serveur:

```bash
python manage.py runserver
```

Le backend sera accessible sur `http://localhost:8000`

### Installation Frontend

```bash
cd frontend
npm install
```

### Configuration Frontend

Créer un fichier `.env` à la racine du frontend:

```env
VITE_API_URL=http://localhost:8000/api
```

### Démarrer le Frontend

```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 📚 API Endpoints

### Authentification

- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/refresh/` - Rafraîchir le token
- `POST /api/auth/forgot-password/` - Réinitialiser mot de passe
- `GET /api/auth/profile/` - Profil utilisateur

### Hôtels

- `GET /api/hotels/` - Liste des hôtels
- `POST /api/hotels/` - Créer un hôtel
- `GET /api/hotels/{id}/` - Détails d'un hôtel
- `PUT /api/hotels/{id}/` - Modifier un hôtel
- `DELETE /api/hotels/{id}/` - Supprimer un hôtel

**Filtres disponibles:**
- `?city=Dakar` - Filtrer par ville
- `?search=Palace` - Rechercher par nom
- `?ordering=-price_per_night` - Trier par prix

### Tickets

- `GET /api/tickets/` - Liste des tickets
- `POST /api/tickets/` - Créer un ticket
- `GET /api/tickets/{id}/` - Détails d'un ticket
- `PUT /api/tickets/{id}/` - Modifier un ticket
- `DELETE /api/tickets/{id}/` - Supprimer un ticket

### Messages

- `GET /api/messages/` - Liste des messages reçus
- `POST /api/messages/` - Envoyer un message
- `GET /api/messages/{id}/` - Détails d'un message
- `PUT /api/messages/{id}/` - Modifier un message

### Emails

- `GET /api/emails/` - Liste des emails
- `POST /api/emails/` - Créer un email
- `GET /api/emails/{id}/` - Détails d'un email

### Formulaires

- `GET /api/forms/` - Liste des formulaires
- `POST /api/forms/` - Créer un formulaire
- `GET /api/forms/{id}/` - Détails d'un formulaire

### Entrées

- `GET /api/entries/` - Liste des entrées
- `POST /api/entries/` - Créer une entrée
- `GET /api/entries/{id}/` - Détails d'une entrée

## 🔐 Authentification JWT

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

1. Obtenir les tokens via `/api/auth/login/`
2. Inclure le token dans le header: `Authorization: Bearer <access_token>`
3. Rafraîchir le token avec `/api/auth/refresh/` quand il expire

## 🌐 Déploiement

### Frontend sur Vercel

```bash
cd frontend
npm run build
# Connecter à Vercel et déployer
vercel deploy
```

### Backend sur Render

1. Créer un compte sur [render.com](https://render.com)
2. Connecter le repo GitHub
3. Créer un nouveau Web Service
4. Configuration:
   - Build Command: `pip install -r requirements.txt && python manage.py migrate`
   - Start Command: `gunicorn config.wsgi`
5. Ajouter les variables d'environnement
6. Déployer

## 📊 Base de Données

### Données de Test

8 hôtels sont inclus dans les fixtures:
- Dakar Palace
- Saly Beach Resort
- Thiès Comfort Inn
- Kaolack Luxury Hotel
- Saint-Louis Riverside
- Tambacounda Desert Lodge
- Ziguinchor Eco-Hotel
- Kolda Heritage Hotel

Charger les fixtures:
```bash
python manage.py loaddata hotels/fixtures/hotels.json
```

## 🛠️ Technologies

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- React Hook Form
- Zod (validation)
- SweetAlert2
- Axios
- Lucide Icons

### Backend
- Django 4.2
- Django REST Framework
- Simple JWT
- PostgreSQL
- Gunicorn
- WhiteNoise

## 📝 Workflow Git

1. Créer une branche pour chaque fonctionnalité:
   ```bash
   git checkout -b feat/auth-login
   ```

2. Commit avec messages descriptifs:
   ```bash
   git commit -m "feat(auth): ajout login JWT avec Zod + SweetAlert2"
   ```

3. Push et créer une Pull Request:
   ```bash
   git push origin feat/auth-login
   ```

4. Utiliser les Preview Deployments pour tester avant merge

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifier que PostgreSQL est en cours d'exécution
- Vérifier les identifiants dans `.env`
- Vérifier que la base de données existe

### Erreur CORS
- Vérifier `CORS_ALLOWED_ORIGINS` dans `settings.py`
- S'assurer que l'URL du frontend est incluse

### Erreur d'authentification
- Vérifier que le token JWT est valide
- Vérifier que le header `Authorization` est correctement formaté
- Vérifier que le token n'a pas expiré

## 📞 Support

Pour toute question ou problème, veuillez créer une issue sur le repo.

## 📄 Licence

Ce projet est sous licence MIT.
