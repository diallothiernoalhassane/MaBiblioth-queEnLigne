const multer = require('multer');
const { uploadImage, uploadPDF } = require('../config/cloudinary');

// Middleware pour l'upload d'un livre complet (image + PDF)
const uploadBookFiles = multer({
  storage: multer.memoryStorage(), // Utiliser memory storage temporairement
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

// Middleware wrapper pour gérer l'upload vers Cloudinary
const handleBookUpload = async (req, res, next) => {
  try {
    // Si pas de fichiers, continuer normalement
    if (!req.files || (!req.files.image && !req.files.pdf)) {
      return next();
    }

    const { cloudinary } = require('../config/cloudinary');
    const uploadedFiles = {};

    // Upload de l'image si présente
    if (req.files.image && req.files.image[0]) {
      const imageBuffer = req.files.image[0].buffer;
      const originalName = req.files.image[0].originalname.split('.')[0];
      const timestamp = Date.now();
      
      const imageResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'bibliotheque/images-couvertures',
            public_id: `${originalName}_${timestamp}`,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [
              { width: 800, height: 1200, crop: 'limit', quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(imageBuffer);
      });

      uploadedFiles.image = [{
        path: imageResult.secure_url,
        originalname: req.files.image[0].originalname,
        mimetype: req.files.image[0].mimetype
      }];
    }

    // Upload du PDF si présent
    if (req.files.pdf && req.files.pdf[0]) {
      const pdfBuffer = req.files.pdf[0].buffer;
      const originalName = req.files.pdf[0].originalname.split('.')[0];
      const timestamp = Date.now();
      
      const pdfResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'bibliotheque/pdf-livres',
            public_id: `${originalName}_${timestamp}`,
            resource_type: 'raw',
            format: 'pdf'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(pdfBuffer);
      });

      uploadedFiles.pdf = [{
        path: pdfResult.secure_url,
        originalname: req.files.pdf[0].originalname,
        mimetype: req.files.pdf[0].mimetype
      }];
    }

    // Remplacer req.files par les fichiers uploadés sur Cloudinary
    req.files = uploadedFiles;
    next();

  } catch (error) {
    console.error('Erreur lors de l\'upload vers Cloudinary:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'upload des fichiers',
      error: error.message 
    });
  }
};

// Middleware pour l'upload d'image seule
const uploadImageOnly = uploadImage.single('image');

// Middleware pour l'upload de PDF seul
const uploadPDFOnly = uploadPDF.single('pdf');

module.exports = {
  uploadBookFiles,
  handleBookUpload,
  uploadImageOnly,
  uploadPDFOnly
};
