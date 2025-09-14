import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import NotificationBell from './NotificationBell';
import { 
  BookOpen, 
  Search, 
  User, 
  Menu, 
  X, 
  Download,
  LogOut,
  UserCircle
} from 'lucide-react';

const Navbar = () => {
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Accueil', path: '/', icon: BookOpen },
    { name: 'Catalogue', path: '/catalogue', icon: Search },
    { name: 'Catégories', path: '/categories', icon: BookOpen },
    { name: 'À propos', path: '/about', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-2xl border-b border-gradient-to-r from-blue-200/50 to-purple-200/50' 
          : 'bg-white/90 backdrop-blur-md shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
              >
                <BookOpen className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-blue-600 transition-all duration-500">
                BiblioTech
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-2.5 py-2 xl:px-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                      isActive(item.path)
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-105'
                        : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-semibold relative z-10 text-sm xl:text-base">{item.name}</span>
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 xl:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 lg:space-x-3">
                {/* Notification Bell */}
                <NotificationBell />
                
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/profil">
                    <Button variant="outline" size="sm" className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3">
                      <UserCircle className="w-4 h-4" />
                      <span className="hidden lg:inline text-xs lg:text-sm">Profil</span>
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/mes-telechargements">
                    <Button variant="outline" size="sm" className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3">
                      <Download className="w-4 h-4" />
                      <span className="hidden lg:inline text-xs lg:text-sm">Téléchargements</span>
                    </Button>
                  </Link>
                </motion.div>
                {isAdmin && (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link to="/admin">
                      <Button variant="default" size="sm" className="flex items-center space-x-1 lg:space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-2 lg:px-3">
                        <span className="text-xs lg:text-sm">Admin</span>
                      </Button>
                    </Link>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="flex items-center space-x-1 lg:space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 lg:px-3"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline text-xs lg:text-sm">Déconnexion</span>
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-3">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-xs lg:text-sm px-2 lg:px-4">
                      Se connecter
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/register">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs lg:text-sm px-2 lg:px-4">
                      S'inscrire
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'text-blue-600 bg-blue-50 border border-blue-200'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* Mobile Auth */}
                <div className="pt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Link
                        to="/profil"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      >
                        <UserCircle className="w-4 h-4" />
                        <span>Profil</span>
                      </Link>
                      <Link
                        to="/mes-telechargements"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4" />
                        <span>Mes Téléchargements</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" />
                        <span>Se connecter</span>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      >
                        <User className="w-4 h-4" />
                        <span>S'inscrire</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
