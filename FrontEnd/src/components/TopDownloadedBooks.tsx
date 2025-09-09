import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { TrendingUp, Star } from 'lucide-react';

interface TopBook {
  _id: string;
  titre: string;
  auteur: string;
  description: string;
  image?: string;
  imageCouverture?: string;
  categorieId?: {
    _id: string;
    nom: string;
  };
  totalDownloads: number;
  lastDownload: string;
}

const TopDownloadedBooks = () => {
  const [topBooks, setTopBooks] = useState<TopBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopBooks();
  }, []);

  const fetchTopBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/telechargements/top5Livres');
      setTopBooks(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des livres populaires:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-indigo-300/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-300/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-blue-300/25 rounded-full animate-ping"></div>
        <div className="absolute top-60 right-1/3 w-2 h-2 bg-indigo-300/20 rounded-full animate-pulse delay-300"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Top Livres
            </h2>
          </motion.div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Découvrez les livres les plus téléchargés par notre communauté de lecteurs passionnés
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-8">
          {topBooks.map((book, index) => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -12, scale: 1.03 }}
              transition={{ duration: 0.6, delay: index * 0.15, type: "spring", stiffness: 100 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl p-8 border border-white/20 relative overflow-hidden group"
            >
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* Badge de position */}
              <div className="absolute -top-2 -right-2">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                  <span className="text-white font-black text-lg transform -rotate-12">#{index + 1}</span>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <Star className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-indigo-600 mb-1">POPULAIRE</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {book.totalDownloads}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">téléchargements</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  {book.titre}
                </h3>
                
                <p className="text-gray-600 font-semibold mb-4">
                  Par {book.auteur}
                </p>
                
                {book.categorieId && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-bold rounded-full border border-indigo-200">
                      {book.categorieId.nom}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-medium">Tendance</span>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    Rang #{index + 1}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDownloadedBooks;
