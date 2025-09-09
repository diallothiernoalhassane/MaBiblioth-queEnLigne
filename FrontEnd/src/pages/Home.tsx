import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../hooks/useNotification';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import TopDownloadedBooks from '../components/TopDownloadedBooks';
import axios from 'axios';

interface Book {
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
  categorie?: {
    _id: string;
    nom: string;
  };
  dateAjout?: string;
}

interface Category {
  _id: string;
  nom: string;
}

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { showSuccess } = useNotification();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/livres?limit=1000'),
        axios.get('http://localhost:5000/api/categories')
      ]);

      console.log('Réponse livres:', booksRes.data);
      console.log('Réponse catégories:', categoriesRes.data);

      // Gérer différents formats de réponse API
      const livres = Array.isArray(booksRes.data) ? booksRes.data : (booksRes.data.livres || booksRes.data.data || []);
      setBooks(livres);
      setFilteredBooks(livres);
      
      const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data.categories || categoriesRes.data.data || []);
      setCategories(categories);
      
      console.log('Livres chargés:', livres);
      console.log('Catégories chargées:', categories);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Afficher une erreur mais continuer avec des données vides
      setBooks([]);
      setFilteredBooks([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (bookId: string) => {
    console.log('Tentative de téléchargement pour le livre:', bookId);
    console.log('Utilisateur authentifié:', isAuthenticated);
    console.log('Token stocké:', localStorage.getItem('token'));
    
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion
      window.location.href = '/login';
      return;
    }

    try {
      // Appeler l'API de téléchargement
      const response = await axios.get(
        `http://localhost:5000/api/livres/${bookId}/telecharger`,
        { 
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Trouver le livre pour récupérer le titre
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

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    applyFilters(searchTerm, selectedCategory);
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId || '');
    applyFilters(searchTerm, categoryId || '');
  };

  const applyFilters = (search: string, category: string) => {
    let filtered = [...books];

    // Filtrage par recherche (titre, auteur, description)
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
      filtered = filtered.filter(book => {
        const categoryId = book.categorieId?._id || book.categorie?._id;
        return categoryId === category;
      });
    }

    setFilteredBooks(filtered);
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Debug: Afficher même si pas de données
  console.log('État actuel:', { books, filteredBooks, categories, loading });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-white/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
          <div className="absolute top-60 right-1/3 w-2 h-2 bg-white/25 rounded-full animate-pulse delay-300"></div>
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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl px-2"
            >
              Bienvenue sur BiblioTech
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-100 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-light tracking-wide px-4"
            >
              Découvrez notre vaste collection de livres numériques et plongez dans l'univers fascinant de la connaissance
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar 
            onSearch={handleSearch}
            onCategoryFilter={handleCategoryFilter}
            categories={categories}
            selectedCategory={selectedCategory || null}
            searchQuery={searchTerm}
          />
        </div>
      </section>

      {/* Top Downloaded Books */}
      <TopDownloadedBooks />

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="p-6 sm:p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 sm:mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{books.length}</h3>
              <p className="text-gray-600 font-medium text-base sm:text-lg">Livres disponibles</p>
            </motion.div>
            
            {/* Boutons d'action */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="lg:col-span-2 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
            >
              <Link to="/catalogue" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-white text-blue-600 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-3xl group"
                >
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="whitespace-nowrap">Explorer le Catalogue</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="w-full sm:w-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 border-3 border-white text-white rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl backdrop-blur-sm"
                  >
                    Créer un Compte
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
            {filteredBooks.slice(0, 6).map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <BookCard
                  book={book}
                  onDownload={handleDownload}
                  isAuthenticated={isAuthenticated}
                  onShowNotification={showSuccess}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8 sm:mt-12"
          >
            <Link to="/catalogue">
              <button className="px-6 sm:px-8 py-3 text-base sm:text-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors duration-200 flex items-center mx-auto">
                Voir tous les livres
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
