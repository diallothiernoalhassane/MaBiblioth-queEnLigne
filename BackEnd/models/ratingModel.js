const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    livreId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Livre', 
        required: true 
    },
    utilisateurId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 5 
    },
    commentaire: { 
        type: String, 
        maxlength: 500 
    },
    dateCreation: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

// Index composé pour éviter les doublons (un utilisateur ne peut noter qu'une fois par livre)
ratingSchema.index({ livreId: 1, utilisateurId: 1 }, { unique: true });

module.exports = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);
