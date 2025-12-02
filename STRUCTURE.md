# Structure du Projet RED PRODUCT

## 📁 Arborescence Complète

```
RED PRODUCT/
│
├── frontend/                          # Application React
│   ├── src/
│   │   ├── components/                # Composants réutilisables
│   │   │   ├── Input.tsx              # Composant Input avec validation
│   │   │   ├── Button.tsx             # Composant Button
│   │   │   ├── Card.tsx               # Composant Card
│   │   │   ├── Navbar.tsx             # Barre de navigation
│   │   │   ├── Sidebar.tsx            # Barre latérale
│   │   │   └── index.ts               # Exports
│   │   │
│   │   ├── pages/                     # Pages principales
│   │   │   ├── Login.tsx              # Page de connexion
│   │   │   ├── Signup.tsx             # Page d'inscription
│   │   │   ├── ForgotPassword.tsx     # Page réinitialisation
│   │   │   ├── Dashboard.tsx          # Tableau de bord
│   │   │   ├── Hotels.tsx             # Liste des hôtels
│   │   │   └── index.ts               # Exports
│   │   │
│   │   ├── routes/
│   │   │   └── ProtectedRoute.tsx     # Route protégée
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                 # Configuration Axios
│   │   │   └── auth.ts                # Service d'authentification
│   │   │
│   │   ├── schemas/
│   │   │   └── auth.ts                # Schémas Zod
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.ts             # Hook d'authentification
│   │   │
│   │   ├── styles/
│   │   │   └── index.css              # Styles Tailwind
│   │   │
│   │   ├── App.tsx                    # Composant racine
│   │   └── main.tsx                   # Point d'entrée
│   │
│   ├── index.html                     # HTML principal
│   ├── package.json                   # Dépendances npm
│   ├── tsconfig.json                  # Configuration TypeScript
│   ├── tsconfig.node.json             # TypeScript Vite
│   ├── vite.config.ts                 # Configuration Vite
│   ├── tailwind.config.js             # Configuration Tailwind
│   ├── postcss.config.js              # Configuration PostCSS
│   ├── .env.example                   # Variables d'environnement exemple
│   └── .gitignore                     # Fichiers ignorés Git
│
├── backend/                           # API Django
│   ├── config/                        # Configuration Django
│   │   ├── __init__.py
│   │   ├── settings.py                # Paramètres Django
│   │   ├── urls.py                    # URLs principales
│   │   └── wsgi.py                    # WSGI pour production
│   │
│   ├── users/                         # App Utilisateurs
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── models.py                  # Modèle CustomUser
│   │   ├── serializers.py             # Sérialiseurs
│   │   ├── views.py                   # Vues (login, register, etc.)
│   │   ├── urls.py                    # URLs
│   │   ├── admin.py                   # Admin Django
│   │   └── apps.py                    # Configuration app
│   │
│   ├── hotels/                        # App Hôtels
│   │   ├── migrations/
│   │   ├── fixtures/
│   │   │   └── hotels.json            # Données de test (8 hôtels)
│   │   ├── __init__.py
│   │   ├── models.py                  # Modèle Hotel
│   │   ├── serializers.py             # Sérialiseurs
│   │   ├── views.py                   # ViewSet Hotels
│   │   ├── urls.py                    # URLs
│   │   ├── admin.py                   # Admin Django
│   │   └── apps.py                    # Configuration app
│   │
│   ├── tickets/                       # App Tickets
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── models.py                  # Modèle Ticket
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── apps.py
│   │
│   ├── messages/                      # App Messages
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── models.py                  # Modèle Message
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── apps.py
│   │
│   ├── emails/                        # App Emails
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── models.py                  # Modèle Email
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── apps.py
│   │
│   ├── forms/                         # App Formulaires
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── models.py                  # Modèle Form
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── apps.py
│   │
│   ├── entries/                       # App Entrées
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── models.py                  # Modèle Entry
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── apps.py
│   │
│   ├── manage.py                      # Gestionnaire Django
│   ├── requirements.txt               # Dépendances Python
│   ├── Procfile                       # Configuration Render
│   ├── .env.example                   # Variables d'environnement
│   └── .gitignore                     # Fichiers ignorés Git
│
├── README.md                          # Documentation principale
├── DEPLOYMENT.md                      # Guide de déploiement
├── COMMANDS.md                        # Commandes utiles
├── STRUCTURE.md                       # Ce fichier
└── .gitignore                         # Fichiers ignorés Git
```

## 🔑 Fichiers Clés

### Frontend

| Fichier | Description |
|---------|-------------|
| `src/App.tsx` | Composant racine avec routing |
| `src/main.tsx` | Point d'entrée React |
| `src/lib/api.ts` | Client Axios avec intercepteurs |
| `src/lib/auth.ts` | Service d'authentification JWT |
| `src/schemas/auth.ts` | Schémas Zod pour validation |
| `src/hooks/useAuth.ts` | Hook personnalisé pour auth |
| `tailwind.config.js` | Configuration des couleurs et thème |

### Backend

| Fichier | Description |
|---------|-------------|
| `config/settings.py` | Configuration Django (DB, CORS, JWT) |
| `config/urls.py` | Routing principal |
| `users/models.py` | Modèle utilisateur personnalisé |
| `users/views.py` | Endpoints d'authentification |
| `hotels/models.py` | Modèle Hotel avec tous les champs |
| `hotels/fixtures/hotels.json` | 8 hôtels de test |

## 🎨 Couleurs du Thème

```
Primary: #FF6B35 (Orange)
Secondary: #004E89 (Bleu foncé)
Accent: #F7B801 (Jaune)
```

## 📊 Modèles de Données

### CustomUser
```
- email (unique)
- password
- first_name
- last_name
- phone
- is_admin
- created_at
- updated_at
```

### Hotel
```
- name
- description
- city
- address
- phone
- email
- price_per_night
- rating
- image
- rooms_count
- available_rooms
- is_active
- created_at
- updated_at
```

### Ticket
```
- title
- description
- status (open, in_progress, closed)
- user (FK)
- created_at
- updated_at
```

### Message
```
- sender (FK)
- recipient (FK)
- content
- is_read
- created_at
- updated_at
```

### Email
```
- recipient
- subject
- body
- is_sent
- created_at
- sent_at
```

### Form
```
- title
- description
- fields (JSON)
- is_active
- created_at
- updated_at
```

### Entry
```
- form (FK)
- data (JSON)
- created_at
- updated_at
```

## 🔗 Endpoints API

### Auth
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `POST /api/auth/forgot-password/`
- `GET /api/auth/profile/`

### Hotels
- `GET /api/hotels/`
- `POST /api/hotels/`
- `GET /api/hotels/{id}/`
- `PUT /api/hotels/{id}/`
- `DELETE /api/hotels/{id}/`

### Tickets
- `GET /api/tickets/`
- `POST /api/tickets/`
- `GET /api/tickets/{id}/`
- `PUT /api/tickets/{id}/`
- `DELETE /api/tickets/{id}/`

### Messages
- `GET /api/messages/`
- `POST /api/messages/`
- `GET /api/messages/{id}/`
- `PUT /api/messages/{id}/`
- `DELETE /api/messages/{id}/`

### Emails
- `GET /api/emails/`
- `POST /api/emails/`
- `GET /api/emails/{id}/`
- `PUT /api/emails/{id}/`
- `DELETE /api/emails/{id}/`

### Forms
- `GET /api/forms/`
- `POST /api/forms/`
- `GET /api/forms/{id}/`
- `PUT /api/forms/{id}/`
- `DELETE /api/forms/{id}/`

### Entries
- `GET /api/entries/`
- `POST /api/entries/`
- `GET /api/entries/{id}/`
- `PUT /api/entries/{id}/`
- `DELETE /api/entries/{id}/`

## 🔐 Authentification

- JWT (JSON Web Tokens)
- Access Token: 1 heure
- Refresh Token: 7 jours
- Stockage: localStorage (frontend)
- Transmission: Header `Authorization: Bearer <token>`

## 📦 Dépendances Principales

### Frontend
- React 18
- React Router 6
- Axios
- Zod
- React Hook Form
- SweetAlert2
- Tailwind CSS
- Lucide Icons

### Backend
- Django 4.2
- Django REST Framework
- Simple JWT
- PostgreSQL
- Gunicorn
- WhiteNoise
- Pillow (images)

## 🚀 Déploiement

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: PostgreSQL AlwaysData
- **CI/CD**: GitHub Actions (optionnel)
