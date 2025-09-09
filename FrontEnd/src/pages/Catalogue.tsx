import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../contexts/AuthContext';
import { SortAsc, SortDesc, Grid, List, BookOpen } from 'lucide-react';

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

interface Category {
  _id: string;
  nom: string;
}

const Catalogue = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'titre' | 'auteur' | 'dateAjout'>('titre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [booksPerPage] = useState(20);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Appliquer le filtre de catégorie depuis l'URL
    const categoryFilter = searchParams.get('categorie');
    if (categoryFilter) {
      handleCategoryFilter(categoryFilter);
    }
  }, [searchParams, books]);

  // Empêcher le reset automatique de currentPage
  // useEffect(() => {
  //   if (filteredBooks.length > 0) {
  //     setCurrentPage(1);
  //   }
  // }, [sortBy, sortOrder]);

  const fetchData = async () => {
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/livres?limit=1000'),
        axios.get('http://localhost:5000/api/categories')
      ]);

      const livres = booksRes.data.livres || [];
      setBooks(livres);
      setFilteredBooks(livres);
      setTotalPages(Math.ceil(livres.length / booksPerPage));
      setCategories(categoriesRes.data.categories || categoriesRes.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    applyFilters(query, searchParams.get('categorie') || '');
    setCurrentPage(1); // Reset page après filtrage
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    if (categoryId) {
      setSearchParams({ categorie: categoryId });
    } else {
      setSearchParams({});
    }
    applyFilters('', categoryId || '');
    setCurrentPage(1); // Reset page après filtrage
  };

  const applyFilters = (search: string, category: string) => {
    let filtered = [...books];

    // Filtrage par recherche
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(book => 
        book.titre.toLowerCase().includes(searchLower) ||
        book.auteur.toLowerCase().includes(searchLower) ||
        book.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtrage par catégorie
    if (category) {
      filtered = filtered.filter(book => 
        book.categorie?._id === category || book.categorieId?._id === category
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'titre':
          aValue = a.titre.toLowerCase();
          bValue = b.titre.toLowerCase();
          break;
        case 'auteur':
          aValue = a.auteur.toLowerCase();
          bValue = b.auteur.toLowerCase();
          break;
        case 'dateAjout':
          aValue = new Date(a.dateAjout || 0);
          bValue = new Date(b.dateAjout || 0);
          break;
        default:
          aValue = a.titre.toLowerCase();
          bValue = b.titre.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredBooks(filtered);
    setTotalPages(Math.ceil(filtered.length / booksPerPage));
    // Ne pas reset currentPage ici car cela cause un conflit avec useEffect
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll vers le haut
  };

  const handleDownload = async (bookId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/livres/${bookId}/telecharger`,
        { 
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const book = books.find(b => b._id === bookId);
      const fileName = book ? `${book.titre}.pdf` : 'livre.pdf';
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Le téléchargement est déjà enregistré côté backend
      // Pas besoin de l'enregistrer à nouveau ici

    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      if (error.response?.status === 401) {
        alert('Veuillez vous reconnecter pour télécharger ce livre');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Erreur lors du téléchargement du livre');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Catalogue Complet
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-purple-100 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Explorez notre collection complète de livres numériques
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-4 sm:py-6 lg:py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar 
            onSearch={handleSearch}
            onCategoryFilter={handleCategoryFilter}
            categories={categories}
            selectedCategory={searchParams.get('categorie')}
            searchQuery=""
          />
        </div>
      </section>

      {/* Controls */}
      <section className="py-4 sm:py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm sm:text-base text-gray-600">
                {filteredBooks.length} livre{filteredBooks.length > 1 ? 's' : ''} trouvé{filteredBooks.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setViewMode('grid');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-2 sm:p-3 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => {
                    setViewMode('list');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-2 sm:p-3 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setSortBy('titre');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-colors ${
                    sortBy === 'titre' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Titre
                </button>
                <button
                  onClick={() => {
                    setSortBy('auteur');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-colors ${
                    sortBy === 'auteur' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Auteur
                </button>
                <button
                  onClick={() => {
                    setSortBy('dateAjout');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-2 sm:px-4 py-2 text-xs sm:text-base rounded-lg transition-colors ${
                    sortBy === 'dateAjout' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">Date d'ajout</span>
                  <span className="sm:hidden">Date</span>
                </button>
                
                <button
                  onClick={() => {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    applyFilters('', searchParams.get('categorie') || '');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-2 sm:p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid/List */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pagination Logic */}
          {(() => {
            const indexOfLastBook = currentPage * booksPerPage;
            const indexOfFirstBook = indexOfLastBook - booksPerPage;
            const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

            return (
              <>
                {filteredBooks.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentBooks.map((book, index) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                  >
                    <BookCard
                      book={book}
                      onDownload={handleDownload}
                      isAuthenticated={isAuthenticated}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentBooks.map((book, index) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      <div className="w-16 h-24 sm:w-20 sm:h-28 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                        {(book.imageCouverture || book.image) ? (
                          <img
                            src={`http://localhost:5000/${(book.imageCouverture || book.image)?.replace(/\\/g, '/')}`}
                            alt={book.titre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{book.titre}</h3>
                        <p className="text-base sm:text-lg text-gray-600 mb-2">Par {book.auteur}</p>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{book.description}</p>
                        
                        <div className="flex flex-col items-center sm:items-start space-y-3">
                          {(book.categorie || book.categorieId) && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full">
                              {(book.categorie || book.categorieId)?.nom}
                            </span>
                          )}
                          
                          <button
                            onClick={() => handleDownload(book._id)}
                            disabled={!isAuthenticated}
                            className="w-full sm:w-auto px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
                          >
                            {isAuthenticated ? 'Télécharger' : 'Se connecter'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                  Aucun livre trouvé
                </h3>
                <p className="text-gray-500 text-base leading-relaxed">
                  Aucun livre ne correspond à vos critères de recherche. 
                  Essayez de modifier vos filtres ou votre recherche.
                </p>
              </div>
            </motion.div>
          )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-12">
                    <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => {
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 text-sm"
                      >
                        ← Précédent
                      </button>
                      
                      <div className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-x border-gray-200">
                        <span className="text-lg font-bold text-gray-800 min-w-[2rem] text-center">
                          {currentPage}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setCurrentPage(prev => Math.min(prev + 1, totalPages));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 text-sm"
                      >
                        Suivant →
                      </button>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>
    </div>
  );
};

export default Catalogue;

