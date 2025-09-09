const mongoose = require('mongoose');

const telechargementSchema = new mongoose.Schema({
    livreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Livre', required: true },
    utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateTelechargement: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Telechargement || mongoose.model('Telechargement', telechargementSchema);
