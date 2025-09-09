import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const UserToAdminButton = () => {
  const handleSwitchToAdmin = () => {
    // Restaurer le token admin si on est en mode utilisateur temporaire
    const isTemporaryUser = localStorage.getItem('isTemporaryUser');
    const adminToken = localStorage.getItem('adminToken');
    
    if (isTemporaryUser === 'true' && adminToken) {
      // Restaurer le token admin
      localStorage.setItem('token', adminToken);
      localStorage.removeItem('isTemporaryUser');
      localStorage.removeItem('adminToken');
      // Rediriger vers l'interface admin
      window.location.href = '/admin';
    }
  };

  // Afficher le bouton seulement si on est en mode utilisateur temporaire
  const isTemporaryUser = localStorage.getItem('isTemporaryUser') === 'true';
  
  if (!isTemporaryUser) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleSwitchToAdmin}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 z-50"
    >
      <Shield className="w-5 h-5" />
      <span className="font-medium">Retour Admin</span>
    </motion.button>
  );
};

export default UserToAdminButton;
