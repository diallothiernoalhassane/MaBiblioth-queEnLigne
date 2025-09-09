const jwt = require('jsonwebtoken');

const verificationToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Vérifie que le token est présent et commence par "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Accès non autorisé. Token manquant." });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Vérifie le token et récupère les infos (_id et role)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // On pourra utiliser req.user._id et req.user.role
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token invalide ou expiré." });
    }
};

module.exports = verificationToken;
