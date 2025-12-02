# Commandes Utiles - RED PRODUCT

## 🔧 Backend Django

### Installation et Configuration

```bash
# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement (Windows)
venv\Scripts\activate

# Activer l'environnement (Linux/Mac)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### Migrations

```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Voir l'état des migrations
python manage.py showmigrations

# Revenir à une migration précédente
python manage.py migrate app_name 0001
```

### Utilisateurs et Admin

```bash
# Créer un superuser
python manage.py createsuperuser

# Créer un utilisateur normal
python manage.py shell
# Dans le shell:
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_user(email='user@example.com', password='password123')

# Changer le mot de passe d'un utilisateur
python manage.py changepassword username
```

### Données de Test

```bash
# Charger les fixtures (hôtels)
python manage.py loaddata hotels/fixtures/hotels.json

# Créer une fixture
python manage.py dumpdata hotels.Hotel > hotels/fixtures/hotels.json

# Charger toutes les fixtures
python manage.py loaddata --all
```

### Serveur de Développement

```bash
# Démarrer le serveur
python manage.py runserver

# Démarrer sur un port spécifique
python manage.py runserver 0.0.0.0:8001

# Avec rechargement automatique
python manage.py runserver --reload
```

### Shell Django

```bash
# Accéder au shell interactif
python manage.py shell

# Exemples dans le shell:
from django.contrib.auth import get_user_model
from hotels.models import Hotel

User = get_user_model()
users = User.objects.all()
hotels = Hotel.objects.filter(city='Dakar')
```

### Collecte des Fichiers Statiques

```bash
# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Nettoyer les fichiers statiques orphelins
python manage.py collectstatic --clear --noinput
```

### Tests

```bash
# Exécuter tous les tests
python manage.py test

# Exécuter les tests d'une app
python manage.py test users

# Exécuter un test spécifique
python manage.py test users.tests.UserTestCase.test_create_user

# Avec verbosité
python manage.py test --verbosity=2
```

### Nettoyage

```bash
# Supprimer les migrations non appliquées
python manage.py migrate --fake-initial

# Vider la base de données
python manage.py flush

# Supprimer les fichiers temporaires
python manage.py clean_pyc
```

## 📦 Frontend React

### Installation

```bash
# Installer les dépendances
npm install

# Installer une dépendance spécifique
npm install package-name

# Installer une dépendance de développement
npm install --save-dev package-name
```

### Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint
```

### Gestion des Dépendances

```bash
# Mettre à jour les dépendances
npm update

# Vérifier les dépendances obsolètes
npm outdated

# Nettoyer le cache npm
npm cache clean --force

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Git et Workflow

### Branches

```bash
# Créer une branche
git checkout -b feat/feature-name

# Lister les branches
git branch -a

# Supprimer une branche
git branch -d branch-name

# Renommer une branche
git branch -m old-name new-name
```

### Commits

```bash
# Voir le statut
git status

# Ajouter les fichiers
git add .

# Commit avec message
git commit -m "feat(auth): ajout login JWT"

# Amender le dernier commit
git commit --amend

# Voir l'historique
git log --oneline
```

### Push et Pull

```bash
# Pousser les changements
git push origin branch-name

# Tirer les changements
git pull origin main

# Récupérer les changements sans fusionner
git fetch origin

# Fusionner une branche
git merge branch-name
```

## 🐳 Docker (Optionnel)

### Build et Run

```bash
# Build l'image
docker build -t red-product-backend .

# Exécuter le conteneur
docker run -p 8000:8000 red-product-backend

# Voir les conteneurs
docker ps -a

# Arrêter un conteneur
docker stop container-id

# Supprimer un conteneur
docker rm container-id
```

## 📊 Base de Données

### PostgreSQL

```bash
# Connexion à PostgreSQL
psql -U postgres

# Lister les bases de données
\l

# Se connecter à une base
\c red_product

# Lister les tables
\dt

# Exécuter une requête SQL
SELECT * FROM users_customuser;

# Quitter
\q
```

### Backup et Restore

```bash
# Créer un backup
pg_dump -U postgres red_product > backup.sql

# Restaurer un backup
psql -U postgres red_product < backup.sql
```

## 🔍 Débogage

### Logs

```bash
# Voir les logs en temps réel (Linux/Mac)
tail -f backend/logs/debug.log

# Voir les logs (Windows)
Get-Content backend/logs/debug.log -Tail 10 -Wait
```

### Debugging Python

```bash
# Ajouter dans le code:
import pdb; pdb.set_trace()

# Ou utiliser:
breakpoint()

# Dans le debugger:
# n - next line
# s - step into
# c - continue
# l - list code
# p variable - print variable
```

## 📈 Performance

### Profiling

```bash
# Profiler une requête Django
python manage.py shell
from django.db import connection
from django.test.utils import CaptureQueriesContext

with CaptureQueriesContext(connection) as context:
    # Votre code ici
    pass

print(f"Nombre de requêtes: {len(context)}")
for query in context:
    print(query['sql'])
```

## 🚀 Déploiement Local

### Simuler la Production

```bash
# Backend
DEBUG=False python manage.py runserver

# Frontend
npm run build
npm run preview
```

## 📚 Ressources Utiles

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Git Documentation](https://git-scm.com/doc)
