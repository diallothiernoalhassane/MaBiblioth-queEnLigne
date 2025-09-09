import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const AdminToUserButton = () => {
  const handleSwitchToUser = () => {
    // Sauvegarder le token admin et basculer vers l'interface utilisateur
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Sauvegarder le token admin original
        localStorage.setItem('adminToken', token);
        // Créer un token temporaire avec rôle utilisateur
        const userPayload = { ...payload, role: 'utilisateur' };
        const header = token.split('.')[0];
        const signature = token.split('.')[2];
        const userToken = header + '.' + btoa(JSON.stringify(userPayload)) + '.' + signature;
        localStorage.setItem('token', userToken);
        // Marquer qu'on est en mode utilisateur temporaire
        localStorage.setItem('isTemporaryUser', 'true');
        // Recharger la page pour appliquer les changements
        window.location.href = '/';
      } catch (error) {
        console.error('Erreur lors du basculement vers l\'interface utilisateur:', error);
      }
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleSwitchToUser}
      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-green-100 hover:text-green-600 transition-all duration-200"
    >
      <Home className="w-5 h-5" />
      <span className="font-medium">Interface Utilisateur</span>
    </motion.button>
  );
};

export default AdminToUserButton;
