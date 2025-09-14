import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface NewBook {
  _id: string;
  titre: string;
  auteur: string;
  dateAjout: string;
  categorieId?: {
    nom: string;
  };
}

const NotificationBell = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [newBooks, setNewBooks] = useState<NewBook[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  console.log('🔍 État du composant:', { isAuthenticated, userId: user?._id, newBooks: newBooks.length, hasNewNotifications });

  useEffect(() => {
    if (isAuthenticated) {
      fetchNewBooks();
    }
  }, [isAuthenticated]);

  const fetchNewBooks = async () => {
    try {
      console.log('🔔 Début fetchNewBooks');
      
      // Créer une clé unique par utilisateur
      const userId = user?._id;
      if (!userId) {
        console.log('❌ Pas d\'ID utilisateur disponible');
        return;
      }
      
      const lastReadTime = localStorage.getItem(`lastNotificationReadTime_${userId}`);
      
      const response = await axios.get('http://localhost:5000/api/livres?limit=1000');
      const allBooks = response.data.livres || [];
      
      console.log('📚 Tous les livres récupérés:', allBooks.length);
      console.log('📅 Dernière lecture pour utilisateur', userId, ':', lastReadTime);
      
      // Trier les livres par date d'ajout (plus récent en premier)
      const sortedBooks = allBooks.sort((a: any, b: any) => {
        const dateA = new Date(a.dateAjout || a.createdAt || 0);
        const dateB = new Date(b.dateAjout || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      // Si pas de dernière lecture, prendre les livres des dernières 24h
      const timeThreshold = lastReadTime || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      // Filtrer les livres ajoutés depuis la dernière lecture des notifications
      const newBooksFiltered = sortedBooks.filter((book: any) => {
        const bookDate = new Date(book.dateAjout || book.createdAt);
        const thresholdDate = new Date(timeThreshold);
        const isNew = bookDate > thresholdDate;
        console.log(`� ${book.titre}: ${bookDate.toISOString()} > ${thresholdDate.toISOString()} = ${isNew}`);
        return isNew;
      });
      
      console.log('🆕 Nouveaux livres filtrés pour utilisateur', userId, ':', newBooksFiltered.length);
      
      setNewBooks(newBooksFiltered.slice(0, 10));
      setHasNewNotifications(newBooksFiltered.length > 0);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des nouveaux livres:', error);
    }
  };

  const markAsRead = () => {
    const currentTime = new Date().toISOString();
    const userId = user?._id;
    if (!userId) {
      console.log('❌ Pas d\'ID utilisateur disponible');
      return;
    }
    localStorage.setItem(`lastNotificationReadTime_${userId}`, currentTime);
    
    setHasNewNotifications(false);
    setNewBooks([]);
    
    console.log('✅ Notifications marquées comme lues à:', currentTime);
    
    // Rafraîchir les notifications après avoir marqué comme lu
    setTimeout(() => {
      fetchNewBooks();
    }, 100);
  };

  const handleBookClick = (bookId: string) => {
    const userId = user?._id;
    if (!userId) {
      console.log('❌ Pas d\'ID utilisateur disponible pour handleBookClick');
      return;
    }
    
    // Marquer ce livre spécifique comme lu en mettant à jour le timestamp
    const currentTime = new Date().toISOString();
    localStorage.setItem(`lastNotificationReadTime_${userId}`, currentTime);
    
    navigate(`/livre/${bookId}`);
    setIsOpen(false);
    
    console.log('📖 Livre cliqué et marqué comme lu pour utilisateur', userId, ':', bookId);
    console.log('🕒 Timestamp mis à jour:', currentTime);
    
    // Rafraîchir les notifications après avoir cliqué sur un livre
    setTimeout(() => {
      fetchNewBooks();
    }, 100);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {hasNewNotifications && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Nouveaux livres</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {newBooks.length > 0 ? (
                <div className="p-2">
                  {newBooks.map((book) => (
                    <motion.div
                      key={book._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      onClick={() => handleBookClick(book._id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {book.titre}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            par {book.auteur}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {new Date(book.dateAjout).toLocaleDateString('fr-FR')}
                            </span>
                            {book.categorieId && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                {book.categorieId.nom}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div className="p-3 border-t border-gray-100">
                    <button
                      onClick={markAsRead}
                      className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Marquer comme lu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Aucun nouveau livre</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
