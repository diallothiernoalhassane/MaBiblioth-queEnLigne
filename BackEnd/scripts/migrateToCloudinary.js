const mongoose = require('mongoose');
const Livre = require('../models/livreModel');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/bibliotheque')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

const migrateToCloudinary = async () => {
  try {
    console.log('Début de la migration vers Cloudinary...');
    
    // Récupérer tous les livres
    const livres = await Livre.find({});
    console.log(`Trouvé ${livres.length} livres à migrer`);

    for (const livre of livres) {
      console.log(`Traitement du livre: ${livre.titre}`);
      
      let pdfUploaded = false;
      let imageUploaded = false;

      // Migration du PDF
      if (livre.fichierPdf && !livre.fichierPdf.includes('cloudinary')) {
        try {
          const pdfPath = path.resolve(livre.fichierPdf);
          if (fs.existsSync(pdfPath)) {
            console.log(`Upload du PDF: ${pdfPath}`);
            
            const pdfResult = await new Promise((resolve, reject) => {
              cloudinary.uploader.upload_stream(
                {
                  folder: 'bibliotheque/pdf-livres',
                  public_id: `${livre.titre.replace(/[^a-zA-Z0-9]/g, '_')}_${livre._id}`,
                  resource_type: 'raw',
                  format: 'pdf'
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              ).end(fs.readFileSync(pdfPath));
            });

            livre.fichierPdf = pdfResult.secure_url;
            pdfUploaded = true;
            console.log(`PDF uploadé: ${pdfResult.secure_url}`);
          } else {
            console.log(`Fichier PDF non trouvé: ${pdfPath}`);
          }
        } catch (error) {
          console.error(`Erreur upload PDF pour ${livre.titre}:`, error.message);
        }
      }

      // Migration de l'image
      if (livre.imageCouverture && !livre.imageCouverture.includes('cloudinary')) {
        try {
          const imagePath = path.resolve(livre.imageCouverture);
          if (fs.existsSync(imagePath)) {
            console.log(`Upload de l'image: ${imagePath}`);
            
            const imageResult = await new Promise((resolve, reject) => {
              cloudinary.uploader.upload_stream(
                {
                  folder: 'bibliotheque/images-couvertures',
                  public_id: `${livre.titre.replace(/[^a-zA-Z0-9]/g, '_')}_${livre._id}`,
                  transformation: [
                    { width: 800, height: 1200, crop: 'limit', quality: 'auto' },
                    { fetch_format: 'auto' }
                  ]
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              ).end(fs.readFileSync(imagePath));
            });

            livre.imageCouverture = imageResult.secure_url;
            imageUploaded = true;
            console.log(`Image uploadée: ${imageResult.secure_url}`);
          } else {
            console.log(`Fichier image non trouvé: ${imagePath}`);
          }
        } catch (error) {
          console.error(`Erreur upload image pour ${livre.titre}:`, error.message);
        }
      }

      // Sauvegarder les changements
      if (pdfUploaded || imageUploaded) {
        await livre.save();
        console.log(`Livre ${livre.titre} mis à jour`);
      }
    }

    console.log('Migration terminée avec succès!');
    
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
  } finally {
    mongoose.disconnect();
  }
};

// Exécuter la migration
if (require.main === module) {
  migrateToCloudinary();
}

module.exports = migrateToCloudinary;
