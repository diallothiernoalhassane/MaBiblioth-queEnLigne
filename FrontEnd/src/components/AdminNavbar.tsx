import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { 
  BookOpen, 
  LogOut,
  Settings,
  BarChart3,
  Users,
  FolderOpen
} from 'lucide-react';

const AdminNavbar = () => {
  const { logout, user } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg border-b border-red-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Admin */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <span className="text-xl font-bold">Admin Panel</span>
              <div className="text-xs text-red-100">LibraTech</div>
            </div>
          </motion.div>

          {/* Navigation Admin */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-white/80">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Tableau de bord</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Gestion des livres</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <FolderOpen className="w-4 h-4" />
              <span className="text-sm">Catégories</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Users className="w-4 h-4" />
              <span className="text-sm">Utilisateurs</span>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-white text-sm">
              <div className="font-medium">{user?.nom || 'Administrateur'}</div>
              <div className="text-xs text-red-100">{user?.email}</div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-white hover:bg-white/20 border border-white/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default AdminNavbar;
