# 📚 Frontend - Ma Bibliothèque En Ligne

Application React moderne pour la gestion et consultation d'une bibliothèque numérique avec interface utilisateur élégante et responsive.

## ✨ Fonctionnalités

### 🌐 Pour tous les visiteurs
- **Catalogue complet** : Navigation dans la collection de livres avec pagination moderne
- **Recherche avancée** : Filtrage par titre, auteur, description et catégorie
- **Interface responsive** : Design adaptatif pour mobile, tablette et desktop
- **Aperçu des livres** : Visualisation des couvertures et détails sans connexion

### 👤 Utilisateurs authentifiés
- **Téléchargement PDF** : Accès direct aux fichiers numériques
- **Authentification Google OAuth** : Connexion rapide avec compte Google
- **Historique personnel** : Suivi des téléchargements effectués
- **Profil utilisateur** : Gestion des informations personnelles

### 🛡️ Administrateurs
- **Dashboard complet** : Statistiques et vue d'ensemble
- **Gestion des livres** : CRUD avec upload de fichiers PDF et images
- **Gestion des catégories** : Organisation de la bibliothèque
- **Gestion des utilisateurs** : Administration des comptes et permissions
- **Analytics** : Suivi des téléchargements et activités

## 🚀 Technologies & Stack

### Core
- **React 18.2** avec TypeScript pour la robustesse
- **Vite 4.4** pour un développement ultra-rapide
- **React Router 6** pour la navigation SPA

### UI/UX
- **Tailwind CSS 3.3** pour un design system cohérent
- **Framer Motion 10** pour les animations fluides
- **Lucide React** pour les icônes modernes
- **Design responsive** avec approche mobile-first

### État & API
- **Context API** pour la gestion d'état globale
- **Axios** pour les requêtes HTTP avec intercepteurs
- **React Hooks** personnalisés pour la logique métier

### Authentification
- **JWT** pour la sécurisation des sessions
- **Google OAuth 2.0** via @react-oauth/google
- **Protection des routes** avec composants dédiés

## 🛠️ Installation & Démarrage

### Prérequis
- **Node.js** 18+ et npm
- **Backend** en cours d'exécution sur `http://localhost:5000`

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd MaBibliothequeEnLigne/FrontEnd

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

### Scripts disponibles
```bash
npm run dev      # Serveur de développement (http://localhost:3000)
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Vérification du code
```

## 📁 Architecture du Projet

```
src/
├── 📂 components/           # Composants réutilisables
│   ├── 🧩 AdminRoute.tsx   # Protection routes admin
│   ├── 🧩 BookCard.tsx     # Carte d'affichage livre
│   ├── 🧩 Navbar.tsx       # Navigation principale
│   ├── 🧩 ProtectedRoute.tsx # Protection routes utilisateur
│   └── 🧩 SearchBar.tsx    # Barre de recherche avancée
├── 📂 contexts/            # Gestion d'état globale
│   └── 🔐 AuthContext.tsx  # Authentification & autorisation
├── 📂 hooks/               # Hooks personnalisés
│   └── 🔄 useScrollToTop.ts # Scroll automatique
├── 📂 pages/               # Pages de l'application
│   ├── 🏠 Home.tsx         # Accueil avec hero section
│   ├── 📖 Catalogue.tsx    # Liste des livres avec filtres
│   ├── 🔍 BookDetails.tsx  # Détails d'un livre
│   ├── 🔑 Login.tsx        # Connexion + Google OAuth
│   ├── 📝 Register.tsx     # Inscription + Google OAuth
│   ├── 👤 Profile.tsx      # Profil utilisateur
│   ├── 📊 AdminDashboard.tsx # Dashboard administrateur
│   ├── 📚 AdminBooks.tsx   # Gestion des livres
│   ├── 🏷️ AdminCategories.tsx # Gestion des catégories
│   └── 👥 AdminUsers.tsx   # Gestion des utilisateurs
├── 📂 assets/              # Ressources statiques
└── 📄 App.tsx              # Composant racine + routing
```

## ⚙️ Configuration

### Variables d'environnement
```env
# .env (optionnel)
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=532933002424-v36a8fe010srfmfpseno5m109ni5b9g7.apps.googleusercontent.com
```

### Configuration Google OAuth
- **Client ID** configuré pour l'authentification Google
- **Domaines autorisés** : localhost pour le développement
- **Callbacks** : `/auth/callback` pour la redirection post-connexion

## 🎯 Guide d'Utilisation

### 🏠 Navigation Principale
- **Accueil** : Hero section + aperçu des livres populaires
- **Catalogue** : Collection complète avec filtres avancés
- **Connexion/Inscription** : Authentification classique + Google OAuth
- **Administration** : Dashboard réservé aux administrateurs

### 📚 Fonctionnalités Utilisateur

#### Consultation des Livres
```typescript
// Recherche multi-critères
- Filtrage par titre, auteur, description
- Sélection par catégorie
- Tri par titre, auteur, date d'ajout
- Pagination moderne avec compteur
- Vue grille/liste adaptative
```

#### Téléchargement Sécurisé
```typescript
// Processus de téléchargement
1. Authentification requise (JWT + Google OAuth)
2. Vérification des permissions
3. Téléchargement direct du PDF
4. Enregistrement automatique de l'historique
```

### 🛡️ Administration

#### Dashboard Analytics
- **Statistiques** : Livres, utilisateurs, téléchargements
- **Graphiques** : Évolution des activités
- **Monitoring** : Activité en temps réel

#### Gestion des Ressources
```typescript
// CRUD Operations
📚 Livres    : Ajout/Édition/Suppression + Upload PDF/Images
🏷️ Catégories : Organisation hiérarchique
👥 Utilisateurs : Gestion des rôles et permissions
```

## 🔧 Développement

### Architecture des Composants
```typescript
// Pattern de développement
interface ComponentProps {
  // Props typées avec TypeScript
}

const Component: React.FC<ComponentProps> = ({ prop }) => {
  // Hooks personnalisés
  const { user, isAuthenticated } = useAuth();
  
  // État local avec useState
  const [state, setState] = useState<Type>(initialValue);
  
  // Effets avec useEffect
  useEffect(() => {
    // Logic
  }, [dependencies]);
  
  return (
    // JSX avec Tailwind CSS
  );
};
```

### Ajout de Nouvelles Fonctionnalités

#### 1. Nouveau Composant
```bash
# Créer le fichier
src/components/NewComponent.tsx

# Structure recommandée
import React from 'react';
import { motion } from 'framer-motion';

interface NewComponentProps {
  // Props typées
}

export const NewComponent: React.FC<NewComponentProps> = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="tailwind-classes"
    >
      {/* Contenu */}
    </motion.div>
  );
};
```

#### 2. Nouvelle Page
```typescript
// 1. Créer src/pages/NewPage.tsx
// 2. Ajouter la route dans App.tsx
<Route path="/new-page" element={<NewPage />} />

// 3. Ajouter la navigation dans Navbar.tsx
<Link to="/new-page">Nouvelle Page</Link>
```

#### 3. Nouveau Hook Personnalisé
```typescript
// src/hooks/useCustomHook.ts
import { useState, useEffect } from 'react';

export const useCustomHook = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Logic
  }, []);
  
  return { data, setData };
};
```

### Styling & Design System

#### Tailwind CSS Classes Communes
```css
/* Layout */
.container-base: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
.section-padding: py-6 sm:py-8 lg:py-12

/* Buttons */
.btn-primary: bg-gradient-to-r from-emerald-500 to-teal-500 text-white
.btn-secondary: bg-gray-200 text-gray-700 hover:bg-gray-300

/* Cards */
.card-base: bg-white rounded-lg shadow-md border border-gray-200
.card-hover: hover:shadow-lg transition-shadow duration-200
```

#### Animations avec Framer Motion
```typescript
// Animations standards
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

## 🚀 Déploiement

### Build de Production
```bash
# Optimisation et minification
npm run build

# Vérification du build
npm run preview

# Analyse du bundle (optionnel)
npm run analyze
```

### Optimisations Performances
- **Code Splitting** automatique avec Vite
- **Tree Shaking** pour réduire la taille du bundle
- **Lazy Loading** des composants lourds
- **Images optimisées** avec formats modernes

## 🐛 Debugging & Tests

### Outils de Développement
```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Formatage
npm run format
```

### Debugging Common Issues
```typescript
// 1. Problèmes d'authentification
console.log('Auth State:', { user, token, isAuthenticated });

// 2. Erreurs API
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

// 3. Problèmes de routing
// Vérifier les routes protégées et les redirections
```

## 📞 Support & Contribution

### Ressources Utiles
- **Documentation React** : https://react.dev/
- **Tailwind CSS** : https://tailwindcss.com/docs
- **Framer Motion** : https://www.framer.com/motion/
- **Vite** : https://vitejs.dev/guide/

### Contact
Pour questions techniques ou contributions, consultez la documentation backend ou contactez l'équipe de développement.
