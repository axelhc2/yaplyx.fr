# Script d'expiration des services

Ce script désactive automatiquement les services dont la date d'expiration (`expiresAt`) est dépassée.

## Installation dans crontab

Pour exécuter ce script automatiquement, ajoutez une ligne dans votre crontab :

```bash
crontab -e
```

### Exemple : Exécution toutes les heures

```bash
0 * * * * cd /root/yaplyx.fr && /usr/bin/node scripts/expire-services.js >> /var/log/expire-services.log 2>&1
```

### Exemple : Exécution tous les jours à minuit

```bash
0 0 * * * cd /root/yaplyx.fr && /usr/bin/node scripts/expire-services.js >> /var/log/expire-services.log 2>&1
```

### Exemple : Exécution toutes les 6 heures

```bash
0 */6 * * * cd /root/yaplyx.fr && /usr/bin/node scripts/expire-services.js >> /var/log/expire-services.log 2>&1
```

## Test manuel

Pour tester le script manuellement :

```bash
cd /root/yaplyx.fr
node scripts/expire-services.js
```

## Notes

- Le script met à jour le champ `active` à `false` pour les services expirés
- Seuls les services avec `active = true` et `expiresAt < maintenant` sont affectés
- Les services avec `expiresAt = null` ne sont pas affectés
- Les logs sont écrits dans `/var/log/expire-services.log` (ajustez le chemin selon vos besoins)

