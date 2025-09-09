const express = require('express');
require('dotenv').config()
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/bibliotheque';
console.log("MONGODB_URL:", MONGODB_URL);
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const logs = require('./middlewares/logs');
const gestionErreurs = require('./middlewares/gestionErreurs');

// Routes
const usersRoutes = require('./routes/usersRoutes');
const livresRoutes = require('./routes/livresRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const telechargementsRoutes = require('./routes/telechargementsRoutes');
const profileRoutes = require('./routes/profileRoutes');
const ratingsRoutes = require('./routes/ratingsRoutes');

// connexion à MongoDB
connectDB(); 

const app = express();

// Middlewares globaux
app.use(logs)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:5000", "http://localhost:5173"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://accounts.google.com", "https://www.googleapis.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
    },
  },
}));

// Configuration CORS pour permettre les requêtes du frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5000', 'http://localhost:4173', 'https://accounts.google.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Content-Length', 'Content-Disposition']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (images et PDFs) avec CORS
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, 'uploads')));

app.use('/api', usersRoutes);
app.use('/api', livresRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', telechargementsRoutes);
app.use('/api', profileRoutes);
app.use('/api/ratings', ratingsRoutes);


// Gestion des erreurs:
app.use(gestionErreurs);

// Lancement du server:
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
