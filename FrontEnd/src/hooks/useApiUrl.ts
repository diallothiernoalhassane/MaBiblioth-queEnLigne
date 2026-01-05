// Hook pour gérer les URLs d'API selon l'environnement
export const useApiUrl = () => {
  const isDev = import.meta.env.DEV && window.location.hostname === 'localhost';
  const API_BASE_URL = isDev ? 'http://localhost:5000' : 'https://mabiblioth-queenligne.onrender.com';
  const FRONTEND_URL = isDev ? 'http://localhost:5173' : 'https://ma-biblioth-que-en-ligne.vercel.app';
  
  console.log('🔧 Environnement:', { isDev, hostname: window.location.hostname, API_BASE_URL });
  
  return {
    API_BASE_URL,
    FRONTEND_URL,
    // Helper pour construire les URLs d'API
    api: (endpoint: string) => `${API_BASE_URL}/api${endpoint}`,
    // Helper pour construire les URLs de fichiers
    file: (path: string) => `${API_BASE_URL}/${path.replace(/\\/g, '/')}`
  };
};
