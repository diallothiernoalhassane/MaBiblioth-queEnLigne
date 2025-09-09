import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  FolderOpen,
  BookOpen
} from 'lucide-react';
import { categoryService, bookService } from '../../services/api';

interface Category {
  _id: string;
  nom: string;
  description?: string;
  dateCreation?: string;
}

interface CategoryWithStats extends Category {
  bookCount: number;
}

const CategoriesSection = () => {
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const [categoriesRes, booksRes] = await Promise.all([
        categoryService.getAll(),
        bookService.getAll()
      ]);
      
      const categoriesData = categoriesRes.data.categories || categoriesRes.data || [];
      const booksData = booksRes.data.livres || booksRes.data || [];
      
      // Compter les livres par catégorie
      const categoriesWithStats = categoriesData.map((category: Category) => ({
        ...category,
        bookCount: booksData.filter((book: any) => 
          book.categorieId?._id === category._id || book.categorieId === category._id
        ).length
      }));
      
      setCategories(categoriesWithStats);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory._id, formData);
      } else {
        await categoryService.create(formData);
      }
      
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await categoryService.delete(id);
        fetchCategories();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nom: category.nom,
      description: category.description || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const filteredCategories = categories.filter(category =>
    category.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h2>
          <p className="text-gray-600">Organisez votre bibliothèque par catégories thématiques</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter une catégorie</span>
        </motion.button>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-6">
            {editingCategory ? 'Modifier la catégorie' : 'Ajouter une nouvelle catégorie'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la catégorie *
              </label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ex: Science-Fiction, Histoire, Biographie..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Description de la catégorie (optionnel)"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                {editingCategory ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Grille des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {category.nom}
              </h3>
              
              {category.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <BookOpen className="w-4 h-4" />
                  <span>{category.bookCount} livre{category.bookCount !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, (category.bookCount / Math.max(...filteredCategories.map(c => c.bookCount), 1)) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Message si aucune catégorie */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Aucune catégorie trouvée' : 'Aucune catégorie'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Essayez avec d\'autres mots-clés'
              : 'Commencez par créer votre première catégorie'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Créer une catégorie
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesSection;
