import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Search,
  Filter
} from 'lucide-react';
import { bookService, categoryService } from '../../services/api';

interface Book {
  _id: string;
  titre: string;
  auteur: string;
  description: string;
  imageCouverture?: string;
  fichierPDF?: string;
  categorieId?: {
    _id: string;
    nom: string;
  };
  dateAjout: string;
}

interface Category {
  _id: string;
  nom: string;
}

const BooksSection = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [formData, setFormData] = useState({
    titre: '',
    auteur: '',
    description: '',
    categorieId: '',
  });

  const [files, setFiles] = useState<{
    pdf: File | null;
    image: File | null;
  }>({
    pdf: null,
    image: null,
  });

  // Dropzone pour PDF
  const {
    getRootProps: getPdfRootProps,
    getInputProps: getPdfInputProps,
    isDragActive: isPdfDragActive
  } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setFiles(prev => ({ ...prev, pdf: acceptedFiles[0] }));
      }
    }
  });

  // Dropzone pour image
  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive
  } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setFiles(prev => ({ ...prev, image: acceptedFiles[0] }));
      }
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        bookService.getAll(),
        categoryService.getAll()
      ]);
      
      setBooks(booksRes.data.livres || booksRes.data || []);
      setCategories(categoriesRes.data.categories || categoriesRes.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('titre', formData.titre);
    formDataToSend.append('auteur', formData.auteur);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('categorieId', formData.categorieId);
    
    if (files.pdf) {
      formDataToSend.append('pdf', files.pdf);
    }
    if (files.image) {
      formDataToSend.append('image', files.image);
    }

    try {
      if (editingBook) {
        await bookService.update(editingBook._id, formDataToSend);
        alert('Livre modifié avec succès !');
      } else {
        await bookService.create(formDataToSend);
        alert('Livre ajouté avec succès !');
      }
      
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du livre');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      try {
        await bookService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      titre: book.titre,
      auteur: book.auteur,
      description: book.description,
      categorieId: book.categorieId?._id || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      auteur: '',
      description: '',
      categorieId: '',
    });
    setFiles({ pdf: null, image: null });
    setEditingBook(null);
    setShowForm(false);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.auteur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || book.categorieId?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Livres</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Ajoutez, modifiez et gérez votre collection de livres
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un livre</span>
        </motion.button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par titre ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.nom}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-4 sm:p-6"
        >
          <h3 className="text-xl font-semibold mb-6">
            {editingBook ? 'Modifier le livre' : 'Ajouter un nouveau livre'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titre}
                  onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auteur *
                </label>
                <input
                  type="text"
                  required
                  value={formData.auteur}
                  onChange={(e) => setFormData(prev => ({ ...prev, auteur: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                required
                value={formData.categorieId}
                onChange={(e) => setFormData(prev => ({ ...prev, categorieId: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Upload de fichiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload PDF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fichier PDF *
                </label>
                <div
                  {...getPdfRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isPdfDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <input {...getPdfInputProps()} />
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {files.pdf ? (
                    <p className="text-sm text-green-600 font-medium">{files.pdf.name}</p>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        Glissez un fichier PDF ici ou cliquez pour sélectionner
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PDF uniquement</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de couverture
                </label>
                <div
                  {...getImageRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isImageDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <input {...getImageInputProps()} />
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {files.image ? (
                    <p className="text-sm text-green-600 font-medium">{files.image.name}</p>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        Glissez une image ici ou cliquez pour sélectionner
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, GIF</p>
                    </div>
                  )}
                </div>
              </div>
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
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                {editingBook ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Liste des livres */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Livres ({filteredBooks.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'ajout
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <motion.tr
                  key={book._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {book.titre}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {book.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.auteur}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {book.categorieId?.nom || 'Non catégorisé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(book.dateAjout).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BooksSection;
