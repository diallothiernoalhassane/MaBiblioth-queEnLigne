const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dobohc0mb',
  api_key: process.env.CLOUDINARY_API_KEY || '871298931676751',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'uNy30tUNhlmzTt-m7zKZuRHNoLk'
});

// Configuration du stockage pour les images de couverture
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bibliotheque/images-couvertures',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    public_id: (req, file) => {
      // Générer un nom unique basé sur le timestamp et le nom original
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `${originalName}_${timestamp}`;
    },
    transformation: [
      { width: 800, height: 1200, crop: 'limit', quality: 'auto' }, // Limiter la taille mais garder la qualité
      { fetch_format: 'auto' } // Optimiser automatiquement le format
    ]
  }
});

// Configuration du stockage pour les fichiers PDF
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bibliotheque/pdf-livres',
    allowed_formats: ['pdf'],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `${originalName}_${timestamp}`;
    },
    resource_type: 'raw', // Important pour les fichiers PDF
    format: 'pdf'
  }
});

// Middleware pour l'upload des images
const uploadImage = require('multer')({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max pour les images
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
  }
});

// Middleware pour l'upload des PDFs
const uploadPDF = require('multer')({
  storage: pdfStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max pour les PDFs
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
    }
  }
});

// Middleware pour l'upload simultané (image + PDF)
const uploadBookFiles = require('multer')({
  storage: imageStorage, // Utiliser imageStorage par défaut
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

// Fonction pour supprimer un fichier de Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadPDF,
  uploadBookFiles,
  deleteFromCloudinary
};
