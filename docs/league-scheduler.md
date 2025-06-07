# Automatisation de la clôture des ligues

Cette procédure permet de clôturer les salles de ligues chaque semaine sans que les utilisateurs aient besoin d'ouvrir l'application.

## 1. Initialiser les fonctions Firebase

1. Installez l'interface Firebase et connectez‑vous :
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
2. Dans le dossier du projet, exécutez :
   ```bash
   firebase init functions
   ```
   Choisissez Node.js 18 et TypeScript quand cela est proposé.

## 2. Déploiement

1. Copiez le contenu du dossier `functions` de ce dépôt dans le dossier généré par `firebase init` (ou utilisez‑le tel quel s'il n'existait pas).
2. Installez les dépendances :
   ```bash
   cd functions
   npm install
   ```
3. Compilez puis déployez :
   ```bash
   npm run build
   firebase deploy --only functions
   ```

La fonction planifiée `handleWeeklyLeagues` s'exécutera chaque jour et fermera automatiquement les salles arrivées à terme tout en mettant à jour les membres et leurs récompenses.
