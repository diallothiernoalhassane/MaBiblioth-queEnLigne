const mongoose = require('mongoose');
const Livre = require('./models/livreModel');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL)
  .then(async () => {
    try {
      const livres = await Livre.find({}).limit(3);
      console.log('Premiers livres:');
      livres.forEach(livre => {
        console.log(`- ${livre.titre}`);
        console.log(`  PDF: ${livre.fichierPdf}`);
        console.log(`  Image: ${livre.imageCouverture}`);
        console.log('---');
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => console.error('Erreur de connexion:', err));
