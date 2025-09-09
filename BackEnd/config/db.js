const mongoose = require('mongoose');

function connectDb(){
    const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/bibliotheque';
    return mongoose.connect(MONGODB_URL)
    .then(()=> console.log("Connexion réussie à MongoDB !"))
    .catch((err)=> console.log("Echec de connexion à MongoDB:", err))
}

module.exports = connectDb;
