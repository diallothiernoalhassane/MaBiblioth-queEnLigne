import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Download, 
  TrendingUp,
  BarChart3
} from 'lucide-react';
import axios from 'axios';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalLivres: 0,
    totalUtilisateurs: 0,
    totalTelechargements: 0,
    activiteRecente: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [livresRes, usersRes, downloadsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/livres?limit=1000', { headers }),
        axios.get('http://localhost:5000/api/users', { headers }),
        axios.get('http://localhost:5000/api/telechargements/all', { headers })
      ]);

      // Calculer l'activité récente (téléchargements des 7 derniers jours)
      const downloads = downloadsRes.data.telechargements || downloadsRes.data || [];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentDownloads = downloads.filter((download: any) => {
        const downloadDate = new Date(download.dateTelechargement);
        return downloadDate >= sevenDaysAgo;
      });

      setStats({
        totalLivres: livresRes.data.livres?.length || livresRes.data.length || 0,
        totalUtilisateurs: usersRes.data.users?.length || usersRes.data.length || 0,
        totalTelechargements: downloads.length,
        activiteRecente: recentDownloads.length
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-2 sm:px-0 text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Tableau de Bord Admin
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 font-medium">
          Interface d'administration moderne et intuitive
        </p>
      </motion.div>

      {/* Cartes de statistiques rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ y: -8, scale: 1.03 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-8 border border-white/20 relative overflow-hidden group"
        >
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm sm:text-base font-bold text-gray-600 mb-2">Total des livres</p>
              <p className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {loading ? '--' : stats.totalLivres}
              </p>
            </div>
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -8, scale: 1.03 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-8 border border-white/20 relative overflow-hidden group"
        >
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm sm:text-base font-bold text-gray-600 mb-2">Utilisateurs</p>
              <p className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {loading ? '--' : stats.totalUtilisateurs}
              </p>
            </div>
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Users className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -8, scale: 1.03 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-8 border border-white/20 relative overflow-hidden group"
        >
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm sm:text-base font-bold text-gray-600 mb-2">Téléchargements</p>
              <p className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                {loading ? '--' : stats.totalTelechargements}
              </p>
            </div>
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Download className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ y: -8, scale: 1.03 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-8 border border-white/20 relative overflow-hidden group"
        >
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm sm:text-base font-bold text-gray-600 mb-2">Activité récente</p>
              <p className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {loading ? '--' : stats.activiteRecente}
              </p>
            </div>
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <TrendingUp className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Message de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-6 sm:p-12 text-white relative overflow-hidden"
      >
        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-6">
            Interface d'Administration Moderne
          </h2>
          <p className="text-blue-100 mb-8 text-lg sm:text-xl leading-relaxed">
            Utilisez le menu de navigation à gauche pour accéder aux différentes sections :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center space-x-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm"
            >
              <BookOpen className="w-6 h-6 flex-shrink-0" />
              <span className="text-base sm:text-lg font-medium">Gestion des livres avec upload PDF et images</span>
            </motion.div>
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center space-x-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm"
            >
              <Users className="w-6 h-6 flex-shrink-0" />
              <span className="text-base sm:text-lg font-medium">Administration des utilisateurs</span>
            </motion.div>
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center space-x-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm"
            >
              <BarChart3 className="w-6 h-6 flex-shrink-0" />
              <span className="text-base sm:text-lg font-medium">Catégories et organisation</span>
            </motion.div>
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center space-x-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm"
            >
              <TrendingUp className="w-6 h-6 flex-shrink-0" />
              <span className="text-base sm:text-lg font-medium">Statistiques et graphiques en temps réel</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
