const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: false }, // Optionnel pour les comptes Google
    googleId: { type: String, unique: true, sparse: true }, // ID Google unique
    profilePicture: { type: String }, // URL de la photo de profil Google
    role: { type: String, enum: ['admin', 'utilisateur'], default: 'utilisateur' },
    dateCreation: { type: Date, default: Date.now },
    dateInscription: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
