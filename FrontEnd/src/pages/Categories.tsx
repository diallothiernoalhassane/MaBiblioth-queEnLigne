import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';

interface Category {
  _id: string;
  nom: string;
  description?: string;
}

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
  [key: string]: any; // Pour gérer d'autres propriétés dynamiques
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [booksByCategory, setBooksByCategory] = useState<Record<string, Book[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const [categoriesRes, booksRes] = await Promise.all([
        axios.get('http://localhost:5000/api/categories'),
        axios.get('http://localhost:5000/api/livres')
      ]);

      // Gestion de la réponse des catégories
      let categoriesData: Category[] = [];
      if (Array.isArray(categoriesRes.data)) {
        categoriesData = categoriesRes.data;
      } else if (categoriesRes.data && Array.isArray(categoriesRes.data.categories)) {
        categoriesData = categoriesRes.data.categories;
      }
      setCategories(categoriesData);

      // Gestion de la réponse des livres
      let books: Book[] = [];
      if (Array.isArray(booksRes.data)) {
        books = booksRes.data;
      } else if (booksRes.data && Array.isArray(booksRes.data.livres)) {
        books = booksRes.data.livres;
      }

      // Organiser les livres par catégorie
      const organized: Record<string, Book[]> = {};
      
      categoriesData.forEach((category: Category) => {
        organized[category._id] = books.filter((book: Book) => {
          const categoryId = book.categorie?._id || book.categorieId?._id;
          return categoryId === category._id;
        });
      });
      
      setBooksByCategory(organized);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Aucune catégorie disponible</h2>
          <p className="text-gray-600 mb-6">Les catégories n'ont pas pu être chargées.</p>
          <button 
            onClick={fetchCategories}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white py-24">
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
          <div className="absolute top-60 right-1/3 w-4 h-4 bg-white/25 rounded-full animate-pulse delay-300"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent drop-shadow-2xl"
            >
              Explorez par Catégories
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl md:text-3xl text-emerald-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light tracking-wide"
            >
              Découvrez notre collection organisée par domaines d'intérêt
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Nos Catégories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explorez nos collections thématiques soigneusement organisées
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group relative"
              >
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                
                <div className="p-8 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                    >
                      <BookOpen className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="text-right">
                      <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        {booksByCategory[category._id]?.length || 0}
                      </span>
                      <p className="text-sm text-gray-500 font-medium">
                        livre{booksByCategory[category._id]?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                    {category.nom}
                  </h3>
                  
                  {category.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="space-y-4 mb-8">
                    {booksByCategory[category._id]?.slice(0, 3).map((book, bookIndex) => (
                      <motion.div 
                        key={book._id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + bookIndex * 0.05 }}
                        className="flex items-center space-x-4 p-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 rounded-xl transition-all duration-300 group/book"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center overflow-hidden shadow-md group-hover/book:shadow-lg transition-all duration-300">
                          {book.image || book.imageCouverture ? (
                            <img 
                              src={`http://localhost:5000/${(book.image || book.imageCouverture)?.replace(/\\/g, '/')}`}
                              alt={book.titre} 
                              className="w-full h-full object-cover group-hover/book:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <BookOpen className={`w-6 h-6 text-emerald-600 ${book.image || book.imageCouverture ? 'hidden' : ''}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate group-hover/book:text-emerald-600 transition-colors duration-300">
                            {book.titre}
                          </p>
                          <p className="text-xs text-gray-500 truncate font-medium">
                            {book.auteur}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Link to={`/catalogue?categorie=${category._id}`}>
                    <motion.button 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white rounded-xl hover:from-emerald-700 hover:via-teal-700 hover:to-blue-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 font-semibold text-lg group/btn relative overflow-hidden"
                    >
                      <span className="relative z-10">Voir tous les livres</span>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" />
                      {/* Effet de brillance */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;

