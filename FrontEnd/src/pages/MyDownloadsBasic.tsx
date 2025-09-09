import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Download {
  _id: string;
  livreId: {
    titre: string;
    auteur: string;
  };
  utilisateurId?: {
    nom: string;
    email: string;
  };
  dateTelechargement: string;
}

const MyDownloadsBasic = () => {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const endpoint = 'http://localhost:5000/api/telechargements/my-downloads';
        
      console.log('Fetching downloads from:', endpoint);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Downloads data received:', data);
      
      // Vérifier la structure des données et filtrer les livres supprimés
      const validDownloads = Array.isArray(data) ? data.filter(download => 
        download && download._id && download.livreId && download.livreId.titre
      ) : [];
      
      console.log('Valid downloads:', validDownloads);
      setDownloads(validDownloads);
    } catch (err) {
      console.error('Fetch downloads error:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des téléchargements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Mes Téléchargements
          </h1>
          
          <div className="space-y-6">
            {loading && (
              <div className="p-4 bg-blue-100 rounded-lg">
                <p className="text-blue-800">🔄 Chargement des téléchargements...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-100 rounded-lg">
                <p className="text-red-800">❌ Erreur: {error}</p>
                <button 
                  onClick={fetchDownloads}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}

            {!loading && (
              <div className="p-4 bg-green-100 rounded-lg">
                <h2 className="text-green-800 font-semibold mb-2">
                  ✅ Téléchargements ({downloads.length})
                </h2>
                <p className="text-green-700">
                  Bienvenue {user?.nom} ! {downloads.length > 0 ? `Vous avez ${downloads.length} téléchargement(s).` : 'Aucun téléchargement trouvé.'}
                </p>
              </div>
            )}

            {downloads.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Vos livres téléchargés:
                </h3>
                {downloads.map((download) => (
                  <div key={download._id} className="p-4 bg-gray-100 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {download.livreId?.titre || 'Titre non disponible'}
                        </h4>
                        <p className="text-gray-600">
                          Par {download.livreId?.auteur || 'Auteur non disponible'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Téléchargé le: {new Date(download.dateTelechargement).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex space-x-4">
              <Link 
                to="/"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Accueil
              </Link>
              <Link 
                to="/catalogue"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Catalogue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDownloadsBasic;
