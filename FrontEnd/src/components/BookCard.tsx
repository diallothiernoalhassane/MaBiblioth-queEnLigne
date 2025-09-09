import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, Eye, BookOpen } from 'lucide-react';
import StarRating from './StarRating';
import axios from 'axios';

interface Book {
  _id: string;
  titre: string;
  auteur: string;
  description: string;
  image?: string;
  imageCouverture?: string;
  categorie?: {
    _id: string;
    nom: string;
  };
  categorieId?: {
    _id: string;
    nom: string;
  };
  dateAjout?: string;
}

interface BookCardProps {
  book: Book;
  onDownload?: (bookId: string) => void;
  isAuthenticated?: boolean;
  onShowNotification?: (title: string, message?: string, duration?: number) => void;
}

interface RatingStats {
  averageRating: number;
  totalRatings: number;
}

const BookCard: React.FC<BookCardProps> = ({ book, onDownload, isAuthenticated = false, onShowNotification }) => {
  const [ratingStats, setRatingStats] = useState<RatingStats>({ averageRating: 0, totalRatings: 0 });
  const [userRating, setUserRating] = useState<number>(0);
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  const handleDownload = () => {
    if (onDownload) {
      onDownload(book._id);
    }
  };

  // Charger les statistiques de notation
  useEffect(() => {
    const fetchRatingStats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ratings/book/${book._id}/stats`);
        setRatingStats(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    fetchRatingStats();
  }, [book._id]);

  // Charger la note de l'utilisateur si connecté
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!isAuthenticated) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/ratings/book/${book._id}/user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserRating(response.data.rating || 0);
      } catch (error) {
        console.error('Erreur lors du chargement de la note utilisateur:', error);
      }
    };

    fetchUserRating();
  }, [book._id, isAuthenticated]);

  // Gérer le changement de note
  const handleRatingChange = async (newRating: number) => {
    if (!isAuthenticated || isRatingLoading) return;
    
    setIsRatingLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/ratings',
        { livreId: book._id, rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUserRating(newRating);
      
      // Recharger les statistiques
      const response = await axios.get(`http://localhost:5000/api/ratings/book/${book._id}/stats`);
      setRatingStats(response.data);
      
      // Afficher notification de remerciement
      if (onShowNotification) {
        if (newRating === 0) {
          onShowNotification(
            'Note supprimée',
            `Votre note pour "${book.titre}" a été supprimée`,
            3000
          );
        } else {
          const etoileText = newRating === 1 ? 'étoile' : 'étoiles';
          onShowNotification(
            'Merci pour votre avis !',
            `Vous avez attribué ${newRating} ${etoileText} à "${book.titre}"`,
            4000
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors de la notation:', error);
      if (onShowNotification) {
        onShowNotification(
          'Erreur',
          'Impossible d\'enregistrer votre note. Veuillez réessayer.',
          3000
        );
      }
    } finally {
      setIsRatingLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300
      }}
      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden w-full max-w-sm mx-auto border border-gray-100 backdrop-blur-sm"
    >
      {/* Image de couverture */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 h-52">
        {(book.imageCouverture || book.image) ? (
          <img
            src={`http://localhost:5000/${(book.imageCouverture || book.image)?.replace(/\\/g, '/')}`}
            alt={book.titre}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 filter group-hover:brightness-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Badge catégorie */}
        {(book.categorie || book.categorieId) && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur-md rounded-full shadow-lg border border-white/20">
              {(book.categorie || book.categorieId)?.nom}
            </span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 bg-gradient-to-b from-white to-gray-50/50">
        {/* Titre */}
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
          {book.titre}
        </h3>

        {/* Auteur */}
        <div className="flex items-center space-x-2 mb-3 text-gray-600">
          <span className="text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text">{book.auteur}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {book.description}
        </p>
        
        {/* Système de notation */}
        <div className="mb-4 space-y-2">
          {/* Note moyenne */}
          <div className="flex items-center justify-between">
            <StarRating 
              rating={ratingStats.averageRating}
              readonly={true}
              size="sm"
              showCount={true}
              totalRatings={ratingStats.totalRatings}
            />
          </div>
          
          {/* Note utilisateur - seulement si connecté */}
          {isAuthenticated && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">Votre note:</span>
                <StarRating 
                  rating={userRating}
                  onRatingChange={handleRatingChange}
                  readonly={isRatingLoading}
                  size="sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Link to={`/livre/${book._id}`} className="flex-1">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-3 py-2.5 text-sm font-medium border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 flex items-center justify-center group/btn"
            >
              <Eye className="w-4 h-4 mr-2 group-hover/btn:text-blue-600" />
              <span className="whitespace-nowrap">Détails</span>
            </motion.button>
          </Link>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-3 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group/btn"
            onClick={handleDownload}
            disabled={!isAuthenticated}
          >
            <Download className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
            <span className="whitespace-nowrap">{isAuthenticated ? 'Télécharger' : 'Connexion'}</span>
          </motion.button>
        </div>
      </div>
      
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
    </motion.div>
  );
};

export default BookCard;
