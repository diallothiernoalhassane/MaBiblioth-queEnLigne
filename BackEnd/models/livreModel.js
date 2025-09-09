const mongoose = require('mongoose');

const livreSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    auteur: { type: String, required: true },
    description: { type: String },
    categorieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', required: true },
    fichierPdf: { type: String, required: true }, // chemin du fichier PDF
    imageCouverture: { type: String, required: true }, // chemin de l'image de couverture
    dateAjout: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Livre', livreSchema);
