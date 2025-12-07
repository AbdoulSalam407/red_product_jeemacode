# 🧪 Test: Créer des Messages de Test

## 📋 Problème Identifié

L'API retourne `{"count":0,"next":null,"previous":null,"results":[]}` → **Aucun message en base de données!**

## ✅ Solution: Créer des Messages de Test

### Option 1: Via l'Interface Web (Recommandé)

1. **Ouvre http://localhost:5173/messages**
2. **Clique sur "Envoyer un message"**
3. **Remplis le formulaire:**
   - Destinataire: Sélectionne un autre utilisateur
   - Message: Écris un message de test
4. **Clique sur "Envoyer"**
5. **Rafraîchis la page (F5)**
6. **Vérifies que le message s'affiche**

### Option 2: Via Django Shell

```bash
# Terminal
cd backend
python manage.py shell

# Dans le shell:
from django.contrib.auth import get_user_model
from messaging.models import Message

User = get_user_model()

# Récupère 2 utilisateurs
user1 = User.objects.first()
user2 = User.objects.all()[1] if User.objects.count() > 1 else None

if user1 and user2:
    # Crée un message
    msg = Message.objects.create(
        sender=user1,
        recipient=user2,
        content="Ceci est un message de test"
    )
    print(f"Message créé: {msg.id}")
else:
    print("Pas assez d'utilisateurs")

# Quitte
exit()
```

### Option 3: Via cURL

```bash
# Récupère le token JWT
TOKEN=$(curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.access')

# Crée un message
curl -X POST http://localhost:8000/api/messages/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_id": 2,
    "content": "Ceci est un message de test"
  }'
```

---

## 🔍 Vérifier les Messages Créés

### Via Django Shell

```bash
python manage.py shell

from messaging.models import Message
print(f"Total messages: {Message.objects.count()}")
for msg in Message.objects.all():
    print(f"- {msg.sender.email} → {msg.recipient.email}: {msg.content}")

exit()
```

### Via PostgreSQL

```bash
psql -U postgres -d red_product

SELECT COUNT(*) FROM messaging_message;
SELECT id, sender_id, recipient_id, content, created_at FROM messaging_message ORDER BY created_at DESC;
```

### Via l'API

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/messages/
```

---

## 🎯 Checklist

- [ ] Créer au moins 1 message
- [ ] Vérifier que le message est en base de données
- [ ] Rafraîchir la page `/messages`
- [ ] Vérifier que le message s'affiche
- [ ] Créer plusieurs messages
- [ ] Vérifier que tous les messages s'affichent

---

## 💡 Après Créer les Messages

1. Rafraîchis la page (F5)
2. Ouvre la console (F12)
3. Cherche "Messages count: X" (X > 0)
4. Vérifies que les messages s'affichent

---

**Bon test! 🚀**
