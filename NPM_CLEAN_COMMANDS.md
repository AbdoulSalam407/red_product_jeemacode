# 🧹 Commandes npm clean

## 📋 Commandes Disponibles

### 1. Nettoyer le cache npm
```bash
npm cache clean --force
```

### 2. Supprimer node_modules et réinstaller
```bash
# Windows
rmdir /s /q node_modules
npm install

# Linux/Mac
rm -rf node_modules
npm install
```

### 3. Nettoyer et réinstaller (complet)
```bash
npm cache clean --force
rmdir /s /q node_modules
npm install
```

### 4. Nettoyer les fichiers de build
```bash
# Supprimer le dossier dist
rmdir /s /q dist

# Ou avec npm
npm run build
```

### 5. Nettoyer tout (cache + node_modules + dist)
```bash
npm cache clean --force
rmdir /s /q node_modules
rmdir /s /q dist
npm install
```

---

## 🚀 Commandes Recommandées

### Pour le Frontend (Vite)
```bash
cd frontend

# Nettoyer et réinstaller
npm cache clean --force
rmdir /s /q node_modules
npm install

# Redémarrer le serveur de développement
npm run dev
```

### Pour le Backend (Django)
```bash
cd backend

# Nettoyer le cache Python
py -m pip cache purge

# Réinstaller les dépendances
pip install -r requirements.txt

# Redémarrer le serveur
python manage.py runserver
```

---

## 🎯 Cas d'Usage

### Les modules ne se chargent pas
```bash
npm cache clean --force
npm install
npm run dev
```

### Erreur "node_modules not found"
```bash
rmdir /s /q node_modules
npm install
```

### Problèmes de build
```bash
rmdir /s /q dist
npm run build
```

### Tout réinitialiser
```bash
npm cache clean --force
rmdir /s /q node_modules
rmdir /s /q dist
npm install
npm run dev
```

---

## 📊 Résumé des Commandes

| Commande | Effet |
|----------|-------|
| `npm cache clean --force` | Vide le cache npm |
| `rmdir /s /q node_modules` | Supprime node_modules |
| `npm install` | Réinstalle les dépendances |
| `npm run build` | Construit le projet |
| `npm run dev` | Démarre le serveur de dev |

---

## ⚡ Quick Clean (Rapide)

```bash
# Frontend
cd d:\RED PRODUCT\frontend
npm cache clean --force && rmdir /s /q node_modules && npm install && npm run dev
```

```bash
# Backend
cd d:\RED PRODUCT\backend
py -m pip cache purge && pip install -r requirements.txt && python manage.py runserver
```

---

## 🔧 Dépannage

### Erreur: "Cannot find module"
```bash
npm cache clean --force
rmdir /s /q node_modules
npm install
```

### Erreur: "Port already in use"
```bash
# Trouver le processus
netstat -ano | findstr :3000

# Tuer le processus
taskkill /PID [PID] /F

# Redémarrer
npm run dev
```

### Erreur: "Permission denied"
```bash
# Exécuter en tant qu'administrateur
npm cache clean --force
```

---

**Date:** 8 Décembre 2024
**Status:** ✅ Prêt
