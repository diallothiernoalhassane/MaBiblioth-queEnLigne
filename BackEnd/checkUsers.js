const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL)
  .then(async () => {
    try {
      const users = await User.find({}).limit(5);
      console.log('Utilisateurs trouvés:');
      users.forEach(user => {
        console.log(`- ${user.email} (${user.role})`);
      });
      
      if (users.length === 0) {
        console.log('Aucun utilisateur trouvé. Création d\'un utilisateur de test...');
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const testUser = new User({
          nom: 'Test User',
          email: 'test@example.com',
          motDePasse: hashedPassword,
          role: 'user'
        });
        
        await testUser.save();
        console.log('Utilisateur de test créé: test@example.com / password123');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => console.error('Erreur de connexion:', err));
