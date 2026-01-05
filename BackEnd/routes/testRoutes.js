const express = require('express');
const router = express.Router();

// Endpoint de test pour vérifier la configuration
router.get('/config', (req, res) => {
  res.json({
    cloudinary: {
      configured: !!(process.env.CLOUDINARY_CLOUD_NAME && 
                     process.env.CLOUDINARY_API_KEY && 
                     process.env.CLOUDINARY_API_SECRET),
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? '***configured***' : 'missing',
      apiKey: process.env.CLOUDINARY_API_KEY ? '***configured***' : 'missing',
      apiSecret: process.env.CLOUDINARY_API_SECRET ? '***configured***' : 'missing'
    },
    mongodb: {
      configured: !!process.env.MONGODB_URL
    },
    jwt: {
      configured: !!process.env.JWT_SECRET
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ? '***configured***' : 'missing',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '***configured***' : 'missing'
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT
    }
  });
});

module.exports = router;
