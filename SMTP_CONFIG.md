# Configuration SMTP

Pour que les emails fonctionnent, vous devez configurer les variables d'environnement suivantes dans votre fichier `.env` :

## Variables requises

```env
# Configuration SMTP
SMTP_HOST=smtp.example.com          # Adresse du serveur SMTP (ex: smtp.gmail.com, smtp.sendgrid.net)
SMTP_PORT=587                        # Port SMTP (587 pour TLS, 465 pour SSL, 25 pour non sécurisé)
SMTP_SECURE=false                    # true pour SSL (port 465), false pour TLS (port 587)
SMTP_USER=votre-email@example.com    # Email d'authentification SMTP
SMTP_PASSWORD=votre-mot-de-passe     # Mot de passe SMTP
SMTP_FROM=noreply@yaplyx.fr          # Adresse email de l'expéditeur (optionnel, utilise SMTP_USER par défaut)

# Pour les emails de suspension (script expire-services.js)
INTERNAL_API_KEY=votre-cle-secrete   # Clé secrète pour l'API interne
NEXT_PUBLIC_APP_URL=http://localhost:3000  # URL de l'application (pour le script expire-services.js)
```

## Exemples de configuration

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app  # Utiliser un mot de passe d'application Gmail
SMTP_FROM=noreply@yaplyx.fr
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=votre-api-key-sendgrid
SMTP_FROM=noreply@yaplyx.fr
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@votre-domaine.mailgun.org
SMTP_PASSWORD=votre-mot-de-passe-mailgun
SMTP_FROM=noreply@yaplyx.fr
```

### OVH
```env
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@votre-domaine.fr
SMTP_PASSWORD=votre-mot-de-passe
SMTP_FROM=noreply@yaplyx.fr
```

## Emails envoyés

Le système envoie automatiquement les emails suivants :

1. **Email de bienvenue** - Lors de l'inscription d'un nouvel utilisateur
2. **Email de confirmation de paiement** - Lors d'un paiement réussi (avec facture PDF en pièce jointe)
3. **Email d'installation de cluster** - Lors de l'installation d'un cluster (avec identifiants)
4. **Email de suspension de service** - Lorsqu'un service expire (via le script `expire-services.js`)

## Notes importantes

- Tous les envois d'emails sont **non-bloquants** : si l'envoi échoue, cela n'empêche pas l'opération principale de se terminer
- Les erreurs d'envoi d'email sont loggées et envoyées via Notify.ts (Telegram/Teams)
- Si la configuration SMTP n'est pas présente, les emails ne seront simplement pas envoyés (avec un avertissement dans les logs)

