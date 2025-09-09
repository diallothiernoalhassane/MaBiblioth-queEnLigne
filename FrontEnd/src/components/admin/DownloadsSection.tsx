import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  Calendar,
  BarChart3
} from 'lucide-react';
import { downloadService } from '../../services/api';

interface DownloadStats {
  totalDownloads: number;
  todayDownloads: number;
  weeklyDownloads: number;
  monthlyDownloads: number;
}

interface CategoryDownload {
  category: string;
  categoryShort: string;
  downloads: number;
  percentage: number;
}

interface RealtimeDownload {
  time: string;
  downloads: number;
}

interface DownloadRecord {
  _id: string;
  livreId: {
    titre: string;
    auteur: string;
    categorieId?: {
      nom: string;
    };
    categorie?: {
      nom: string;
    };
  };
  utilisateurId: {
    nom: string;
    email: string;
  };
  dateTelechargement: string;
}

const DownloadsSection = () => {
  const [stats, setStats] = useState<DownloadStats>({
    totalDownloads: 0,
    todayDownloads: 0,
    weeklyDownloads: 0,
    monthlyDownloads: 0
  });
  const [categoryData, setCategoryData] = useState<CategoryDownload[]>([]);
  const [realtimeData, setRealtimeData] = useState<RealtimeDownload[]>([]);
  const [downloadRecords, setDownloadRecords] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchDownloadData();
    
    // Simulation temps réel - mise à jour toutes les 5 secondes pour le démo
    const interval = setInterval(() => {
      updateRealtimeData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchDownloadData = async () => {
    try {
      const response = await downloadService.getAll();
      console.log('Réponse API téléchargements:', response.data);
      const downloads = response.data.telechargements || response.data || [];
      console.log('Téléchargements traités:', downloads);
      
      // Calculer les statistiques
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const todayDownloads = downloads.filter((d: any) => 
        new Date(d.dateTelechargement) >= today
      ).length;

      const weeklyDownloads = downloads.filter((d: any) => 
        new Date(d.dateTelechargement) >= weekAgo
      ).length;

      const monthlyDownloads = downloads.filter((d: any) => 
        new Date(d.dateTelechargement) >= monthAgo
      ).length;

      setStats({
        totalDownloads: downloads.length,
        todayDownloads,
        weeklyDownloads,
        monthlyDownloads
      });

      // Données par catégorie - Debug approfondi
      const categoryStats: { [key: string]: number } = {};
      downloads.forEach((download: any, index: number) => {
        console.log(`Download ${index}:`, {
          download: download,
          livreId: download.livreId,
          categorieId: download.livreId?.categorieId,
          categorieIdType: typeof download.livreId?.categorieId,
          categorieIdNom: download.livreId?.categorieId?.nom
        });
        
        let category = 'Non catégorisé';
        
        // Vérification multiple des structures possibles
        if (download.livreId?.categorieId) {
          if (typeof download.livreId.categorieId === 'string') {
            // Si categorieId est juste un ID string, pas un objet populé
            category = 'ID non populé';
          } else if (download.livreId.categorieId.nom) {
            // Si c'est un objet avec nom
            category = download.livreId.categorieId.nom;
          }
        }
        
        console.log(`Category for download ${index}:`, category);
        categoryStats[category] = (categoryStats[category] || 0) + 1;
      });

      const categoryArray = Object.entries(categoryStats).map(([category, count]) => ({
        category,
        categoryShort: category.length > 8 ? category.substring(0, 6) + '...' : category,
        downloads: count,
        percentage: Math.round((count / downloads.length) * 100)
      }));

      setCategoryData(categoryArray.sort((a, b) => b.downloads - a.downloads));

      // Stocker les enregistrements de téléchargement
      console.log('Téléchargements avec détails:', downloads);
      setDownloadRecords(downloads.slice(0, 50)); // Limiter à 50 pour performance

      // Données temps réel (simulation)
      generateRealtimeData();
      
    } catch (error) {
      console.error('Erreur lors du chargement des téléchargements:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRealtimeData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        downloads: Math.floor(Math.random() * 15) + 5 // Valeurs plus stables entre 5 et 20
      });
    }
    
    setRealtimeData(data);
  };

  const updateRealtimeData = () => {
    setRealtimeData(prev => {
      const newData = [...prev.slice(1)];
      const now = new Date();
      const lastValue = prev[prev.length - 1]?.downloads || 10;
      // Variation très douce: ±1 par rapport à la valeur précédente pour éviter les tremblements
      const variation = Math.floor(Math.random() * 3) - 1; // -1 à +1
      const newValue = Math.max(5, Math.min(20, lastValue + variation));
      
      newData.push({
        time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        downloads: newValue
      });
      return newData;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Statistiques de Téléchargement</h2>
        <p className="text-sm sm:text-base text-gray-600">Suivez l'activité de téléchargement en temps réel</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-3 sm:p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Download className="h-6 w-6" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-3 sm:p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Aujourd'hui</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.todayDownloads}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-3 sm:p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Cette semaine</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.weeklyDownloads}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-3 sm:p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Ce mois</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.monthlyDownloads}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Graphique en barres par catégorie - Pleine largeur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Téléchargements par catégorie</h3>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={250} minWidth={300}>
            <BarChart data={categoryData} barCategoryGap={10}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="categoryShort" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [value, 'Téléchargements']}
                labelFormatter={(label: any) => {
                  const fullCategory = categoryData.find(item => item.categoryShort === label);
                  return fullCategory ? fullCategory.category : label;
                }}
              />
              <Bar dataKey="downloads" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Graphique temps réel moderne */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Activité de Téléchargement (24h)
          </h3>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"></div>
            <span className="text-sm font-medium text-gray-600">Données en direct</span>
          </div>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={realtimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={{ stroke: '#D1D5DB' }}
                interval={2}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={{ stroke: '#D1D5DB' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
                labelFormatter={(label) => `${label}`}
                formatter={(value) => [`${value}`, 'Téléchargements']}
              />
              <Bar 
                dataKey="downloads" 
                fill="url(#barGradient)" 
                radius={[6, 6, 0, 0]} 
                maxBarSize={25}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Liste des téléchargements */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
          Liste des téléchargements
        </h3>
        
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livre
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Utilisateur
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {downloadRecords.length > 0 ? (
                downloadRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4">
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-32 sm:max-w-none">
                          {record.livreId?.titre || 'Titre non disponible'}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-32 sm:max-w-none sm:block">
                          par {record.livreId?.auteur || 'Auteur inconnu'}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden mt-1">
                          {record.utilisateurId?.nom || 'Utilisateur inconnu'}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.utilisateurId?.nom || 'Utilisateur inconnu'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.utilisateurId?.email || 'Email non disponible'}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {record.livreId?.categorieId?.nom || 'Non catégorisé'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      <div className="sm:hidden">
                        {new Date(record.dateTelechargement).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit'
                        })}
                      </div>
                      <div className="hidden sm:block">
                        {new Date(record.dateTelechargement).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-3 sm:px-6 py-4 text-center text-gray-500 text-sm">
                    {loading ? 'Chargement des téléchargements...' : 'Aucun téléchargement trouvé'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DownloadsSection;
