# Melios - Personal Development App

Melios est une application de développement personnel créée avec Expo, React Native, NativeWind et Firebase. L'application aide les utilisateurs à établir et maintenir de bonnes habitudes tout en se récompensant pour leurs progrès.

## Features

- 📅 **Suivi des habitudes** : Crée et maintiens de bonnes habitudes grâce à une interface simple et intuitive.
- 🎁 **Récompenses** : Sois récompensé pour atteindre tes objectifs et développer tes habitudes.
- 🔄 **Synchronisation Firebase** : Tes données sont sécurisées et synchronisées en temps réel grâce à Firebase.
- 🎨 **Style dynamique avec NativeWind** : Profite d'une interface responsive et stylée grâce à NativeWind, inspiré de TailwindCSS.

## Prérequis

Avant de pouvoir cloner et utiliser ce projet, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- Node.js (v14 ou plus récent)
- Expo CLI
- Un compte Firebase

## Installation

1. Clonez ce dépôt :

   ```bash
   git clone https://github.com/ton-utilisateur/melios.git
   cd melios
   ```

2. Installez les dépendances

   ```bash
    npm install
   ```

3. Configurez Firebase
Récupérez la configuration Firebase et mettez-la dans un fichier .env basé sur l'exemple .env.example.
   ```bash
    EXPO_PUBLIC_API_KEY = 
    EXPO_PUBLIC_AUTH_DOMAIN =
    EXPO_PUBLIC_PROJECT_ID =
    EXPO_PUBLIC_STORAGE_BUCKET = 
    EXPO_PUBLIC_MESSAGING_SENDER_ID = 
    EXPO_PUBLIC_APP_ID = 
    EXPO_PUBLIC_MEASUREMENT_ID =
   ```

5. Lancer l'application en mode développement :

  ```bash
    npx expo start
  ```

## Structure du projet

Voici un aperçu de la structure du projet :
  ```bash
.
├── .vscode/                    # Paramètres de l'éditeur
├── app/                        # Pages de l'application
├── assets/                     # Images et autres fichiers statiques
├── components/                 # Composants réutilisables
├── constants/                  # Variables et constantes globales
├── context/                    # Contexte React pour gérer l'état global
├── db/                         # Gestion des appels Firebase
├── hooks/                      # Hooks personnalisés
├── utils/                      # Fonctions utilitaires
├── app.json                    # Configuration Expo
├── tailwind.config.js          # Configuration NativeWind
├── tsconfig.json               # Configuration TypeScript
└── .env.example                # Exemple de fichier d'environnement
  ```

## Technologies utilisées

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [NativeWind](https://www.nativewind.dev/) (basé sur TailwindCSS)
- [Firebase](https://firebase.google.com/) (Auth, Firestore)

## Contribuer

Si vous souhaitez rejoindre ce projet, contactez-moi directement pour plus d'informations. Nous sommes ouverts aux contributions pour améliorer l'application et ajouter de nouvelles fonctionnalités !

## Contact
- 👤 **Auteur** : Raphaël Plassart
- 🔗 [LinkedIn](https://www.linkedin.com/company/melios-app/posts/?feedView=all)
- 📧 **Email** : [melios.customer@gmail.com](mailto:melios.customer@gmail.com)
- 📸 **Instagram** : [melios_app](https://www.instagram.com/melios_app)


Merci d'utiliser Melios ! Nous espérons que cette application vous aidera à atteindre vos objectifs et à vivre une vie plus épanouissante.

## Automatisation des ligues

Une procédure détaillée d'installation d'une fonction planifiée Firebase pour clôturer automatiquement les ligues est disponible dans [docs/league-scheduler.md](docs/league-scheduler.md).
