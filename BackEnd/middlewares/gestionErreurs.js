const gestionErreurs = (err,req,res,next) =>{
    console.error("Erreur trouvée :",err.message);
    res.status(500).json({error: "Erreur interne du serveur !"})
};

module.exports = gestionErreurs;