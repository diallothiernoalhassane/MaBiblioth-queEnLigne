import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Download, BookOpen } from 'lucide-react';
import axios from 'axios';

interface Book {
  _id: string;
  titre: string;
  auteur: string;
  description: string;
  image?: string;
  imageCouverture?: string;
  fichier?: string;
  fichierPdf?: string;
  dateAjout?: string;
  dateCreation?: string;
  dateModification?: string;
  categorie?: {
    nom: string;
  };
  categorieId?: {
    _id: string;
    nom: string;
  };
}

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/livres/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du livre:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setDownloading(true);
    try {
      // Appeler l'API de téléchargement avec le token d'authentification
      const response = await axios.get(
        `http://localhost:5000/api/livres/${id}/telecharger`,
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
      link.setAttribute('download', `${book?.titre}.pdf`);
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
        navigate('/login');
      } else {
        alert('Erreur lors du téléchargement du livre');
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleReadOnline = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const pdfFile = book?.fichier || book?.fichierPdf;
    if (!pdfFile) {
      alert('Aucun fichier PDF disponible pour ce livre');
      return;
    }
    
    // Ouvrir le PDF dans un nouvel onglet pour éviter les problèmes CSP
    const pdfUrl = `http://localhost:5000/${pdfFile.replace(/\\/g, '/')}`;
    window.open(pdfUrl, '_blank');
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Livre non trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image du livre */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg shadow-lg max-w-sm mx-auto h-96">
            {(book.imageCouverture || book.image) ? (
              <img
                src={`http://localhost:5000/${(book.imageCouverture || book.image)?.replace(/\\/g, '/')}`}
                alt={book.titre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Aucune image</span>
              </div>
            )}
          </div>
        </div>

        {/* Informations du livre */}
        <div className="lg:col-span-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {book.titre}
            </h1>
            <p className="text-lg text-gray-600">
              Par {book.auteur}
            </p>
          </div>

          {(book.categorie || book.categorieId) && (
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {(book.categorie || book.categorieId)?.nom}
              </span>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {book.description}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Date d'ajout:</span>{' '}
              {(() => {
                const dateToUse = book.dateAjout || book.dateCreation;
                if (!dateToUse) return 'Non disponible';
                try {
                  return new Date(dateToUse).toLocaleDateString('fr-FR');
                } catch {
                  return 'Non disponible';
                }
              })()}
            </p>
            {book.dateModification && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Dernière modification:</span>{' '}
                {new Date(book.dateModification).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>

        {/* Section Actions - Boutons et Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {isAuthenticated ? (
              <div className="space-y-4">
                {/* Bouton Lire en ligne - Design premium */}
                <button
                  onClick={handleReadOnline}
                  className="group w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <BookOpen className="w-6 h-6 relative z-10" />
                  <span className="text-lg font-semibold relative z-10">Lire en ligne</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </button>
                
                {/* Séparateur avec "OU" */}
                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative bg-white px-4">
                    <span className="text-sm text-gray-500 font-medium">OU</span>
                  </div>
                </div>
                
                {/* Bouton Télécharger - Design élégant */}
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent relative z-10"></div>
                      <span className="text-lg font-semibold relative z-10">Téléchargement...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6 relative z-10" />
                      <span className="text-lg font-semibold relative z-10">Télécharger le livre</span>
                    </>
                  )}
                </button>
                
                {/* Informations supplémentaires */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Lecture instantanée</h4>
                      <p className="text-xs text-blue-700">Commencez à lire immédiatement dans votre navigateur</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Message d'invitation élégant */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Accès Premium</h3>
                  <p className="text-gray-600 mb-4">
                    Connectez-vous pour accéder à la lecture en ligne et au téléchargement
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Lecture illimitée</span>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Téléchargement gratuit</span>
                  </div>
                </div>
                
                {/* Boutons de connexion améliorés */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="font-semibold">Se connecter</span>
                    <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="group w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="font-semibold">S'inscrire</span>
                    <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default BookDetails;
