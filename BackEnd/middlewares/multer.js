const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = '';
        if (file.mimetype === 'application/pdf') folder = 'uploads/pdf';
        else if (file.mimetype.startsWith('image/')) folder = 'uploads/images';
        else return cb(new Error('Fichier non supporté'));

        // Crée le dossier si inexistant
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Fichier non supporté'), false);
    }
};

const uploadLivre = multer({ storage, fileFilter });

module.exports = uploadLivre;
