# Intégration Cloudinary pour la Bibliothèque en Ligne

## 📋 Vue d'ensemble

Ce projet utilise maintenant Cloudinary pour stocker les fichiers PDF et images des livres, offrant :
- Stockage infini dans le cloud
- Optimisation automatique des images
- CDN mondial pour un chargement rapide
- Backup automatique des fichiers

## 🔧 Configuration

### Variables d'environnement requises

Ajoutez ces variables dans votre environnement (Render, .env.local, etc.) :

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dobohc0mb
CLOUDINARY_API_KEY=871298931676751
CLOUDINARY_API_SECRET=uNy30tUNhlmzTt-m7zKZuRHNoLk
```

### Structure des dossiers Cloudinary

- **Images** : `bibliotheque/images-couvertures/`
- **PDFs** : `bibliotheque/pdf-livres/`

## 🚀 Migration depuis le stockage local

### Étape 1 : Backup des données existantes
```bash
# Créer une backup des fichiers locaux
cp -r uploads/ uploads_backup/
```

### Étape 2 : Migration vers Cloudinary
```bash
# Exécuter la migration
npm run migrate-cloudinary
```

### Étape 3 : Basculer vers Cloudinary
```bash
# Remplacer les fichiers locaux par les versions Cloudinary
npm run start-cloudinary
```

## 📁 Fichiers modifiés

### Nouveaux fichiers :
- `config/cloudinary.js` - Configuration Cloudinary
- `controllers/livreControllerCloudinary.js` - Contrôleur avec Cloudinary
- `routes/livresRoutesCloudinary.js` - Routes avec Cloudinary
- `middlewares/uploadMiddleware.js` - Middleware d'upload amélioré
- `scripts/migrateToCloudinary.js` - Script de migration

### Fichiers de configuration :
- `.env.example` - Ajout des variables Cloudinary
- `package.json` - Scripts de migration

## 🔄 Processus d'upload

### Upload d'un livre (Admin)
1. L'admin sélectionne un PDF et une image
2. Les fichiers sont uploadés sur Cloudinary
3. Les URLs Cloudinary sont stockées dans MongoDB
4. Les fichiers locaux sont supprimés automatiquement

### Téléchargement d'un livre (Utilisateur)
1. L'utilisateur clique sur "Télécharger"
2. Le téléchargement est enregistré dans MongoDB
3. Le PDF est streamé depuis Cloudinary vers l'utilisateur

## 🛠️ Fonctionnalités

### Optimisation automatique des images
- Redimensionnement intelligent (max 800x1200)
- Compression automatique
- Format optimal (WebP, AVIF si supporté)

### Gestion des erreurs
- Retry automatique en cas d'échec
- Logs détaillés pour le debugging
- Fallback vers les fichiers locaux si nécessaire

### Suppression propre
- Suppression automatique des fichiers Cloudinary lors de la suppression d'un livre
- Nettoyage des fichiers temporaires

## 📊 Monitoring

### Dashboard Cloudinary
- Accédez à votre dashboard Cloudinary
- Surveillez l'utilisation du stockage
- Analysez les performances de chargement

### Logs de l'application
```javascript
// Les logs incluent les IDs Cloudinary pour le debugging
console.log('PDF uploadé:', pdfResult.public_id);
console.log('Image uploadée:', imageResult.public_id);
```

## 🔒 Sécurité

- Les URLs Cloudinary sont signées et temporaires
- Upload limité aux formats autorisés (PDF, images)
- Validation de la taille des fichiers (5MB images, 50MB PDFs)
- Protection contre les uploads malveillants

## 🚨 Dépannage

### Erreurs communes
1. **"Invalid credentials"** : Vérifiez vos variables d'environnement Cloudinary
2. **"File too large"** : Respectez les limites de taille (5MB images, 50MB PDFs)
3. **"Upload failed"** : Vérifiez votre connexion internet et les quotas Cloudinary

### Commandes utiles
```bash
# Vérifier la configuration Cloudinary
node -e "console.log(require('./config/cloudinary').cloudinary.config())"

# Tester l'upload
node scripts/testCloudinary.js

# Nettoyer les fichiers orphelins
node scripts/cleanupOrphans.js
```

## 📈 Avantages

1. **Performance** : CDN mondial pour un chargement rapide
2. **Scalabilité** : Stockage infini et automatique
3. **Optimisation** : Images optimisées automatiquement
4. **Backup** : Double backup (local + cloud)
5. **Analytics** : Statistiques d'utilisation détaillées

## 🔄 Retour en arrière (si nécessaire)

Si vous devez revenir au stockage local :
```bash
# Restaurer les fichiers originaux
cp controllers/livreController.js.backup controllers/livreController.js
cp routes/livresRoutes.js.backup routes/livresRoutes.js
npm start
```
