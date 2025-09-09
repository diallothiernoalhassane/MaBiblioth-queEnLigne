const Telechargement = require('../models/telechargement');
const Livre = require('../models/livreModel');

// Récupérer tous les téléchargements
exports.getAllTelechargements = async (req, res) => {
  try {
    const telechargements = await Telechargement.find()
      .populate('utilisateurId', 'nom email')
      .populate({
        path: 'livreId',
        select: 'titre auteur imageCouverture image categorieId',
        populate: {
          path: 'categorieId',
          select: 'nom'
        }
      })
      .sort({ dateTelechargement: -1 });
    
    console.log('Téléchargements avec populate:', JSON.stringify(telechargements.slice(0, 2), null, 2));
    res.json(telechargements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les téléchargements d'un utilisateur spécifique
exports.getTelechargementsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const telechargements = await Telechargement.find({ utilisateurId: userId })
      .populate({
        path: 'livreId',
        select: 'titre auteur description imageCouverture image categorieId dateAjout',
        populate: {
          path: 'categorieId',
          select: 'nom'
        }
      })
      .sort({ dateTelechargement: -1 });
    
    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedTelechargements = telechargements.map(t => ({
      _id: t._id,
      livre: t.livreId,
      dateTelechargement: t.dateTelechargement
    }));
    
    res.json(formattedTelechargements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les statistiques des livres les plus téléchargés
exports.getTopDownloadedBooks = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const topBooks = await Telechargement.aggregate([
      {
        $group: {
          _id: '$livreId',
          totalDownloads: { $sum: 1 },
          lastDownload: { $max: '$dateTelechargement' }
        }
      },
      {
        $sort: { totalDownloads: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    // Récupérer les détails des livres
    const booksWithDetails = await Promise.all(
      topBooks.map(async (item) => {
        const livre = await Livre.findById(item._id).populate('categorieId', 'nom');
        if (!livre) {
          return null; // Ignorer les livres qui n'existent plus
        }
        return {
          _id: livre._id,
          titre: livre.titre,
          auteur: livre.auteur,
          description: livre.description,
          imageCouverture: livre.imageCouverture,
          image: livre.image,
          categorieId: livre.categorieId ? { _id: livre.categorieId._id, nom: livre.categorieId.nom } : null,
          totalDownloads: item.totalDownloads,
          lastDownload: item.lastDownload
        };
      })
    );

    // Filtrer les livres null
    const validBooks = booksWithDetails.filter(book => book !== null);

    res.json(validBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un nouveau téléchargement
exports.addTelechargement = async (req, res) => {
  try {
    const { utilisateurId, livreId } = req.body;
    
    const nouveauTelechargement = new Telechargement({
      utilisateurId,
      livreId,
      dateTelechargement: new Date()
    });
    
    const telechargementSauvegarde = await nouveauTelechargement.save();
    res.status(201).json(telechargementSauvegarde);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Récupérer les téléchargements de l'utilisateur connecté
exports.mesTelechargements = async (req, res) => {
    try {
        console.log('mesTelechargements - User ID:', req.user._id);
        
        const telechargements = await Telechargement.find({ utilisateurId: req.user._id })
            .populate({
                path: 'livreId',
                select: 'titre auteur description imageCouverture image categorieId dateAjout',
                populate: {
                    path: 'categorieId',
                    select: 'nom'
                }
            })
            .sort({ dateTelechargement: -1 });
        
        console.log('mesTelechargements - Téléchargements trouvés:', telechargements.length);
        console.log('mesTelechargements - Premier téléchargement:', JSON.stringify(telechargements[0], null, 2));
        
        // Filtrer les téléchargements dont le livre existe encore
        const validTelechargements = telechargements.filter(t => t.livreId !== null);
        console.log('mesTelechargements - Téléchargements valides après filtrage:', validTelechargements.length);
        
        // Transformer les données pour correspondre au format attendu par le frontend
        const formattedTelechargements = validTelechargements.map(t => ({
            _id: t._id,
            livre: t.livreId,
            dateTelechargement: t.dateTelechargement
        }));
        
        res.status(200).json(formattedTelechargements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Voir tous les téléchargements (Admin)
exports.tousTelechargements = async (req, res) => {
    try {
        const telechargements = await Telechargement.find()
            .populate({
                path: 'livreId',
                select: 'titre auteur description imageCouverture image categorieId',
                populate: {
                    path: 'categorieId',
                    select: 'nom'
                }
            })
            .populate('utilisateurId', 'nom email')
            .sort({ dateTelechargement: -1 });
        
        console.log('tousTelechargements - Premier téléchargement:', JSON.stringify(telechargements[0], null, 2));
        console.log('Livre categorieId:', telechargements[0]?.livreId?.categorieId);
        res.status(200).json(telechargements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Récupérer le top 6 des livres les plus téléchargés
exports.top5Livres = async (req, res) => {
    try {
        // Agrégation par livre et comptage des téléchargements
        const topLivres = await Telechargement.aggregate([
            {
                $group: {
                    _id: "$livreId", // id du livre téléchargé
                    totalTelechargements: { $sum: 1 }
                }
            },
            { $sort: { totalTelechargements: -1 } }, // tri décroissant
            { $limit: 6 } // prendre les 6 premiers
        ]);

        // Récupérer les infos des livres
        const livresDetail = await Livre.find({
            _id: { $in: topLivres.map(l => l._id) }
        }).populate('categorieId', 'nom');

        // Fusionner les infos avec le nombre de téléchargements
        const result = topLivres.map(l => {
            const info = livresDetail.find(b => b._id.equals(l._id));
            if (!info) return null;
                     return {
           _id: info._id,
           titre: info.titre,
           auteur: info.auteur,
           description: info.description || '',
           imageCouverture: info.imageCouverture || '',
           image: info.image || '',
           categorieId: info.categorieId ? { _id: info.categorieId._id, nom: info.categorieId.nom } : null,
           totalDownloads: l.totalTelechargements,
           lastDownload: new Date().toISOString()
         };
        }).filter(item => item !== null);

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// Nombre de téléchargement par catégorie:(Pour admin)
// Téléchargements par catégorie
exports.telechargementsParCategorie = async (req, res) => {
    try {
        const result = await Telechargement.aggregate([
            // 1️⃣ Relier les téléchargements aux livres
            {
                $lookup: {
                    from: "livres",       // nom de la collection livres
                    localField: "livreId",
                    foreignField: "_id",
                    as: "livre"
                }
            },
            // 2️⃣ Transformer le tableau en objet
            { $unwind: "$livre" },
            // 3️⃣ Filtrer seulement les livres qui ont un categorieId
            { $match: { "livre.categorieId": { $ne: null } } },
            // 4️⃣ Grouper par categorieId et compter les téléchargements
            {
                $group: {
                    _id: "$livre.categorieId",
                    totalTelechargements: { $sum: 1 }
                }
            },
            // 5️⃣ Trier par nombre de téléchargements décroissant
            { $sort: { totalTelechargements: -1 } }
        ]);

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// Evolutiion des téléchargement dans le temps:
// Évolution des téléchargements par jour
exports.evolutionTelechargements = async (req, res) => {
    try {
        const result = await Telechargement.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$dateTelechargement" },
                        month: { $month: "$dateTelechargement" },
                        day: { $dayOfMonth: "$dateTelechargement" }
                    },
                    total: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Formatage pour front
        const formatted = result.map(r => ({
            date: `${r._id.year}-${r._id.month}-${r._id.day}`,
            total: r.total
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};



