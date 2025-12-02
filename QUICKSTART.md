# Quick Start - RED PRODUCT

Démarrez le projet en 5 minutes !

## ⚡ Démarrage Rapide (Local)

### 1️⃣ Prérequis

- Node.js 18+ ([télécharger](https://nodejs.org/))
- Python 3.9+ ([télécharger](https://www.python.org/))
- PostgreSQL 12+ ([télécharger](https://www.postgresql.org/))
- Git ([télécharger](https://git-scm.com/))

### 2️⃣ Cloner le Projet

```bash
git clone <repo-url>
cd RED\ PRODUCT
```

### 3️⃣ Backend Django

#### Installation

```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer (Windows)
venv\Scripts\activate

# Activer (Linux/Mac)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

#### Configuration

Créer `backend/.env`:

```env
DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_NAME=red_product
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

#### Démarrage

```bash
# Migrations
python manage.py migrate

# Créer un superuser
python manage.py createsuperuser

# Charger les données de test
python manage.py loaddata hotels/fixtures/hotels.json

# Démarrer le serveur
python manage.py runserver
```

✅ Backend accessible sur `http://localhost:8000`

### 4️⃣ Frontend React

#### Installation

```bash
cd frontend
npm install
```

#### Configuration

Créer `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

#### Démarrage

```bash
npm run dev
```

✅ Frontend accessible sur `http://localhost:5173`

## 🎯 Tester l'Application

### 1. Connexion Admin

1. Aller sur `http://localhost:5173/login`
2. Utiliser les identifiants du superuser créé
3. Cliquer sur "Se connecter"

### 2. Tableau de Bord

- Voir les statistiques
- Accéder à la liste des hôtels
- Naviguer dans l'application

### 3. Admin Django

1. Aller sur `http://localhost:8000/admin`
2. Se connecter avec le superuser
3. Gérer les hôtels, utilisateurs, etc.

## 📝 Commandes Essentielles

### Backend

```bash
# Démarrer le serveur
python manage.py runserver

# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Accéder au shell Django
python manage.py shell

# Charger les fixtures
python manage.py loaddata hotels/fixtures/hotels.json
```

### Frontend

```bash
# Démarrer le serveur de dev
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## 🔍 Tester les Endpoints API

### Avec cURL

```bash
# Connexion
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Récupérer les hôtels
curl -X GET http://localhost:8000/api/hotels/ \
  -H "Authorization: Bearer <access_token>"
```

### Avec Postman

1. Importer la collection (à créer)
2. Configurer les variables d'environnement
3. Tester les endpoints

## 🐛 Dépannage Rapide

### Erreur: "Database connection refused"

```bash
# Vérifier que PostgreSQL est en cours d'exécution
# Windows
net start PostgreSQL-x64-XX

# Linux
sudo systemctl start postgresql

# Mac
brew services start postgresql
```

### Erreur: "Module not found"

```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### Erreur: "Port already in use"

```bash
# Backend sur un autre port
python manage.py runserver 8001

# Frontend sur un autre port
npm run dev -- --port 5174
```

### Erreur: "CORS policy"

Vérifier que `CORS_ALLOWED_ORIGINS` dans `backend/.env` contient l'URL du frontend.

## 📚 Documentation Complète

- [README.md](./README.md) - Documentation générale
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement
- [COMMANDS.md](./COMMANDS.md) - Commandes utiles
- [STRUCTURE.md](./STRUCTURE.md) - Structure du projet

## 🚀 Prochaines Étapes

1. ✅ Démarrer l'application
2. ✅ Tester la connexion
3. ✅ Explorer le dashboard
4. ✅ Consulter la documentation
5. ✅ Commencer le développement

## 💡 Tips

- Utiliser les DevTools du navigateur (F12)
- Consulter les logs du terminal
- Vérifier les variables d'environnement
- Lire les messages d'erreur attentivement

## 🆘 Besoin d'Aide ?

1. Consulter la documentation
2. Vérifier les logs
3. Créer une issue sur GitHub
4. Contacter le support

---

**Bon développement ! 🎉**
