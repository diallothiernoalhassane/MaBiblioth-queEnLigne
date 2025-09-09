import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Download,
  LogOut,
  Home,
  FolderOpen,
  ChevronRight,
  ChevronLeft,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const AdminSidebar = ({ activeSection, onSectionChange, isMobileOpen, setIsMobileOpen }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  const handleMenuItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    // Fermer la sidebar sur mobile après sélection
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleGoHome = () => {
    // Sauvegarder le token admin et créer un token utilisateur temporaire
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
      } catch (error) {
        console.error('Erreur lors de la création du token utilisateur:', error);
      }
    }
    window.location.href = '/';
  };

  const menuItems = [
    { id: 'dashboard', name: 'Tableau de bord', icon: BarChart3 },
    { id: 'books', name: 'Livres', icon: BookOpen },
    { id: 'users', name: 'Utilisateurs', icon: Users },
    { id: 'categories', name: 'Catégories', icon: FolderOpen },
    { id: 'downloads', name: 'Téléchargements', icon: Download },
    { id: 'profile', name: 'Profil', icon: User },
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <motion.div
        initial={{ x: -300 }}
        animate={{ 
          x: isMobileOpen || window.innerWidth >= 768 ? 0 : -300,
          width: isCollapsed ? 80 : 280 
        }}
        className={`bg-white shadow-xl border-r border-gray-200 h-full flex flex-col fixed md:relative z-50 ${
          isMobileOpen ? 'block' : 'hidden md:flex'
        }`}
      >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Administration</h2>
            <p className="text-xs sm:text-sm text-gray-500">Gestion de la bibliothèque</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {/* Bouton fermer pour mobile */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMenuItemClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer avec boutons */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* Bouton Home */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoHome}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-green-100 hover:text-green-600 transition-all duration-200"
        >
          <Home className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Retour Accueil</span>}
        </motion.button>

        {/* Bouton Déconnexion */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Déconnexion</span>}
        </motion.button>

        {!isCollapsed && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              BiblioTech Admin
            </h3>
            <p className="text-xs text-gray-600">
              Interface d'administration moderne
            </p>
          </div>
        )}
      </div>
    </motion.div>
    </>
  );
};

export default AdminSidebar;
