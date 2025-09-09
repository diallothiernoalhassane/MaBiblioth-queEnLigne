# 🚀 Backend - Ma Bibliothèque En Ligne

API REST Node.js/Express pour la gestion d'une bibliothèque numérique avec authentification JWT, upload de fichiers et administration complète.

## 🌐 Configuration de Base

**Base URL** : `http://localhost:5000/api`  
**Port** : 5000  
**Database** : MongoDB  
**Authentification** : JWT + Google OAuth  

## 📋 Table des Matières

- [🔐 Authentification](#authentification)
- [📚 Gestion des Livres](#livres)
- [🏷️ Gestion des Catégories](#categories)
- [📊 Téléchargements & Analytics](#telechargements)
- [👥 Gestion des Utilisateurs (Admin)](#utilisateurs)
- [🛠️ Installation & Configuration](#installation)
- [📁 Structure du Projet](#structure)

---

## 🔐 Authentification

### Inscription Classique
```http
POST /api/users
Content-Type: application/json

{
  "nom": "John Doe",
  "email": "john@example.com",
  "motDePasse": "motdepasse123"
}
```

**Réponse** :
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "user_id",
    "nom": "John Doe",
    "email": "john@example.com",
    "role": "utilisateur"
  }
}
```

### Connexion Classique
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "motDePasse": "motdepasse123"
}
```

**Réponse** :
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "nom": "John Doe",
    "email": "john@example.com",
    "role": "utilisateur"
  }
}
```

### Authentification Google OAuth
```http
POST /api/auth/google
Content-Type: application/json

{
  "credential": "google_jwt_token"
}
```

**Réponse** :
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "nom": "John Doe",
    "email": "john@gmail.com",
    "googleId": "google_user_id",
    "profilePicture": "profile_url",
    "role": "utilisateur"
  }
}
```

---

## 📚 Gestion des Livres

### Liste des Livres (Public)
```http
GET /api/livres?page=1&limit=20&sortBy=titre&order=asc&categorieId=cat_id&search=javascript
```

**Query Parameters** :
- `page` : Numéro de page (défaut: 1)
- `limit` : Livres par page (défaut: 10, max: 100)
- `sortBy` : Champ de tri (`titre`, `auteur`, `dateAjout`)
- `order` : Ordre (`asc`, `desc`)
- `categorieId` : Filtrer par catégorie
- `search` : Recherche dans titre, auteur, description

**Réponse** :
```json
{
  "livres": [
    {
      "_id": "livre_id",
      "titre": "JavaScript: The Good Parts",
      "auteur": "Douglas Crockford",
      "description": "Guide des bonnes pratiques JavaScript",
      "image": "/uploads/images/cover.jpg",
      "pdf": "/uploads/pdfs/book.pdf",
      "categorie": {
        "_id": "cat_id",
        "nom": "Programmation"
      },
      "dateAjout": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalLivres": 42,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Détails d’un livre

Route : /livres/:id

Méthode : GET

Public : Oui

Description : Affiche toutes les informations d’un livre spécifique.

**Réponse** :
```json
{
  "_id": "livre_id",
  "titre": "Clean Code",
  "auteur": "Robert C. Martin",
  "description": "Manuel de développement logiciel agile",
  "image": "/uploads/images/clean-code.jpg",
  "pdf": "/uploads/pdfs/clean-code.pdf",
  "categorie": {
    "_id": "cat_id",
    "nom": "Développement"
  },
  "dateAjout": "2024-01-15T10:30:00Z",
  "nombreTelechargements": 156
}
```

### Ajouter un livre

Route : /livres

Méthode : POST

Public : Non (Admin)

Headers : Authorization: Bearer <token>

Description : Permet à un admin d’ajouter un livre avec PDF et image.

Body (form-data) :

titre : string

auteur : string

description : string (optionnel)

categorieId : ObjectId

pdf : fichier PDF

image : image de couverture

**Réponse** :
```json
{
  "message": "Livre ajouté avec succès",
  "livre": {
    "_id": "nouveau_livre_id",
    "titre": "Clean Architecture",
    "auteur": "Robert C. Martin",
    "description": "Guide d'architecture logicielle",
    "image": "/uploads/images/1642156789-cover.jpg",
    "pdf": "/uploads/pdfs/1642156789-clean-architecture.pdf",
    "categorieId": "cat_id",
    "dateAjout": "2024-01-15T10:30:00Z"
  }
}
```

### Modifier un livre

Route : /livres/:id

Méthode : PUT

Public : Non (Admin)

Headers : Authorization: Bearer <token>

Description : Modifie un livre existant. Les fichiers PDF ou image sont optionnels.

**Réponse** :
```json
{
  "message": "Livre modifié avec succès"
}
```

### Supprimer un livre

Route : /livres/:id

Méthode : DELETE

Public : Non (Admin)

Headers : Authorization: Bearer <token>

Description : Supprime le livre et ses fichiers associés.

**Réponse** :
```json
{
  "message": "Livre supprimé avec succès"
}
```

### Télécharger un livre

Route : /livres/:id/telecharger

Méthode : GET

Public : Non (Utilisateur connecté)

Headers : Authorization: Bearer <token>

Description : Télécharge le PDF et enregistre le téléchargement dans la collection telechargements.

---

## 🏷️ Gestion des Catégories

### Liste des Catégories (Public)
```http
GET /api/categories
```

**Réponse** :
```json
{
  "categories": [
    {
      "_id": "cat_id_1",
      "nom": "Programmation",
      "description": "Livres sur la programmation",
      "dateCreation": "2024-01-01T00:00:00Z",
      "nombreLivres": 25
    },
    {
      "_id": "cat_id_2",
      "nom": "Design",
      "description": "Livres sur le design",
      "dateCreation": "2024-01-02T00:00:00Z",
      "nombreLivres": 12
    }
  ]
}
```

### Ajouter une Catégorie (Admin)
```http
POST /api/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "nom": "Intelligence Artificielle",
  "description": "Livres sur l'IA et le Machine Learning"
}
```

### Modifier une Catégorie (Admin)
```http
PUT /api/categories/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "nom": "IA & Machine Learning",
  "description": "Livres sur l'intelligence artificielle"
}
```

### Supprimer une Catégorie (Admin)
```http
DELETE /api/categories/:id
Authorization: Bearer <admin_token>
```

⚠️ **Contrainte** : Impossible de supprimer une catégorie contenant des livres

Téléchargements
Historique téléchargements (utilisateur connecté)

Route : /telechargements/me

Méthode : GET

Public : Non (Utilisateur connecté)

Headers : Authorization: Bearer <token>

Description : Retourne tous les téléchargements effectués par l’utilisateur connecté, avec le titre du livre et la date de téléchargement.

Liste des téléchargements (admin)

Route : /telechargements

Méthode : GET

Public : Non (Admin)

Headers : Authorization: Bearer <token>

Description : Retourne tous les téléchargements effectués par tous les utilisateurs.

Top 5 des livres les plus téléchargés

Route : /telechargement/top5Livres

Méthode : GET

Public : Non (Admin ou Utilisateur connecté)

Headers : Authorization: Bearer <token>

Description : Retourne les 5 livres les plus téléchargés avec le nombre de téléchargements.

Téléchargements par catégorie

Route : /telechargement/parCategorie

Méthode : GET

Public : Non (Admin)

Headers : Authorization: Bearer <token>

Description : Retourne le nombre de téléchargements pour chaque catégorie de livre.

Évolution des téléchargements dans le temps

Route : /telechargement/evolution

Méthode : GET

Public : Non (Admin)

Headers : Authorization: Bearer <token>

Description : Retourne le nombre de téléchargements par jour (ou période) pour suivre l’évolution dans le temps.

Notes importantes

Fichiers PDF et images : stockés dans uploads/ et accessibles via express.static ou res.download().

Sécurité :

Toutes les routes protégées nécessitent un JWT valide.

Les actions admin nécessitent le rôle admin.

Téléchargements : lorsqu’un utilisateur télécharge un PDF, un enregistrement est créé dans la collection telechargements.

Pagination et filtres : disponibles sur la liste des livres pour faciliter la navigation.

---

## 👥 Gestion des Utilisateurs

### Liste des Utilisateurs (Admin)
```http
GET /api/users
Authorization: Bearer <admin_token>
```

### Profil Utilisateur
```http
GET /api/users/me
Authorization: Bearer <user_token>
```

### Modifier le Rôle (Admin)
```http
PUT /api/users/:id/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "admin"
}
```

---

## 🛠️ Installation & Configuration

### Prérequis
- **Node.js** 18+
- **MongoDB** 6.0+
- **npm** ou **yarn**

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd MaBibliothequeEnLigne/BackEnd

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Démarrer MongoDB
mongod

# Lancer le serveur
npm start
```

### Variables d'Environnement
```env
# .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bibliotheque
JWT_SECRET=votre_secret_jwt_super_securise
GOOGLE_CLIENT_ID=532933002424-v36a8fe010srfmfpseno5m109ni5b9g7.apps.googleusercontent.com
NODE_ENV=development
```

### Scripts Disponibles
```bash
npm start          # Serveur de production
npm run dev        # Serveur de développement avec nodemon
npm run seed       # Peupler la base avec des données de test
npm test           # Lancer les tests
npm run lint       # Vérifier le code
```

---

## 📁 Structure du Projet

```
BackEnd/
├── 📂 config/              # Configuration
│   └── 🔧 db.js            # Connexion MongoDB
├── 📂 controllers/         # Logique métier
│   ├── 👤 userController.js    # Gestion utilisateurs
│   ├── 📚 livreController.js   # Gestion livres
│   ├── 🏷️ categorieController.js # Gestion catégories
│   ├── 📊 ratingController.js   # Système de notation
│   └── 📈 telechargementController.js # Analytics
├── 📂 middlewares/         # Middlewares Express
│   ├── 🔐 auth.js          # Authentification JWT
│   ├── 🛡️ adminAuth.js     # Autorisation admin
│   ├── 📝 logs.js          # Logging des requêtes
│   ├── 🚫 gestionErreurs.js # Gestion d'erreurs globale
│   └── 📤 upload.js        # Upload de fichiers
├── 📂 models/              # Modèles Mongoose
│   ├── 👤 userModel.js     # Schéma utilisateur
│   ├── 📚 livreModel.js    # Schéma livre
│   ├── 🏷️ categorieModel.js # Schéma catégorie
│   ├── ⭐ ratingModel.js   # Schéma notation
│   └── 📊 telechargementModel.js # Schéma téléchargement
├── 📂 routes/              # Routes API
│   ├── 👤 usersRoutes.js   # Routes utilisateurs
│   ├── 📚 livresRoutes.js  # Routes livres
│   ├── 🏷️ categoriesRoutes.js # Routes catégories
│   ├── ⭐ ratingsRoutes.js # Routes notations
│   └── 📊 telechargementRoutes.js # Routes analytics
├── 📂 uploads/             # Fichiers uploadés
│   ├── 📂 pdfs/           # Fichiers PDF
│   └── 📂 images/         # Images de couverture
├── 📄 server.js           # Point d'entrée
├── 📄 package.json        # Dépendances
└── 📄 .env                # Variables d'environnement
```

---

## 🔒 Sécurité & Bonnes Pratiques

### Authentification
- **JWT** avec expiration (24h)
- **Bcrypt** pour le hachage des mots de passe (12 rounds)
- **Google OAuth 2.0** pour l'authentification sociale
- **Validation** des tokens à chaque requête protégée

### Autorisation
- **Rôles** : `utilisateur`, `admin`
- **Middleware** de vérification des permissions
- **Protection** des routes sensibles

### Upload de Fichiers
- **Multer** pour la gestion des uploads
- **Validation** des types de fichiers (PDF, images)
- **Limitation** de taille (50MB pour PDF, 5MB pour images)
- **Noms uniques** avec timestamp

### Validation des Données
- **Mongoose** schemas avec validation
- **Sanitization** des entrées utilisateur
- **Gestion d'erreurs** centralisée

---

## 🚀 API Testing

### Avec cURL
```bash
# Inscription
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"nom":"John Doe","email":"john@test.com","motDePasse":"password123"}'

# Connexion
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","motDePasse":"password123"}'

# Liste des livres
curl http://localhost:5000/api/livres?page=1&limit=10
```

### Avec Postman
1. Importer la collection Postman (si disponible)
2. Configurer l'environnement avec `baseUrl = http://localhost:5000/api`
3. Tester les endpoints avec authentification

---

## 📈 Monitoring & Logs

### Logs
- **Morgan** pour les logs HTTP
- **Winston** pour les logs applicatifs
- **Rotation** automatique des fichiers de logs

### Métriques
- Nombre de requêtes par endpoint
- Temps de réponse moyen
- Erreurs 4xx/5xx
- Téléchargements par période

---

## 🐛 Debugging & Troubleshooting

### Problèmes Courants

#### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est démarré
sudo systemctl status mongod

# Redémarrer MongoDB
sudo systemctl restart mongod
```

#### Erreur JWT
```javascript
// Vérifier le token dans les headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Vérifier l'expiration
jwt.verify(token, process.env.JWT_SECRET)
```

#### Upload de fichiers
```javascript
// Vérifier les permissions du dossier uploads/
chmod 755 uploads/

// Vérifier l'espace disque
df -h
```

---

## 📞 Support & Contribution

### Ressources
- **Documentation MongoDB** : https://docs.mongodb.com/
- **Express.js** : https://expressjs.com/
- **Mongoose** : https://mongoosejs.com/
- **JWT** : https://jwt.io/

### Contact
Pour questions techniques ou contributions, contactez l'équipe de développement.