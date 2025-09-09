import axios from 'axios';

// Configuration de base d'axios
const API_BASE_URL = 'http://localhost:5000/api';

// Créer une instance axios avec configuration de base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide, rediriger vers la page de connexion
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Services API organisés par catégorie

// Types pour l'authentification
interface LoginData {
  email: string;
  motDePasse: string;
}

interface RegisterData {
  nom: string;
  email: string;
  motDePasse: string;
}

interface AdminData {
  nom: string;
  email: string;
  motDePasse: string;
}

// Services d'authentification
export const authService = {
  login: (email: string, motDePasse: string) =>
    api.post('/login', { email, motDePasse }),
  
  register: (userData: RegisterData) =>
    api.post('/users', userData),
  
  createAdmin: (adminData: AdminData) =>
    api.post('/create-admin', adminData),
  
  getProfile: () =>
    api.get('/users/profile'),
  
  updateProfile: (updateData: any) =>
    api.put('/users/profile', updateData),
};

// Types pour les livres
interface BookParams {
  search?: string;
  category?: string;
  limit?: number;
  page?: number;
}

// Services des livres
export const bookService = {
  getAll: (params?: BookParams) =>
    api.get('/livres', { params: { ...params, limit: params?.limit || 100 } }),
  
  getById: (id: string) =>
    api.get(`/livres/${id}`),
  
  download: (id: string) =>
    api.get(`/livres/${id}/telecharger`, { responseType: 'blob' }),
  
  create: (bookData: FormData) =>
    api.post('/livres', bookData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  update: (id: string, bookData: FormData) =>
    api.put(`/livres/${id}`, bookData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  delete: (id: string) =>
    api.delete(`/livres/${id}`),
};

// Types pour les catégories
interface CategoryData {
  nom: string;
  description?: string;
}

// Services des catégories
export const categoryService = {
  getAll: () =>
    api.get('/categories'),
  
  create: (categoryData: CategoryData) =>
    api.post('/categories', categoryData),
  
  update: (id: string, categoryData: CategoryData) =>
    api.put(`/categories/${id}`, categoryData),
  
  delete: (id: string) =>
    api.delete(`/categories/${id}`),
};

// Services des téléchargements
export const downloadService = {
  getAll: () =>
    api.get('/telechargements/all'),
  
  getByUserId: (userId: string) =>
    api.get(`/telechargements/user/${userId}`),
  
  getTopBooks: (limit = 5) =>
    api.get(`/telechargements/top-books?limit=${limit}`),
  
  getMyDownloads: () =>
    api.get('/telechargements/my-downloads'),
  
  addDownload: (downloadData: DownloadData) =>
    api.post('/telechargements', downloadData),
};

// Types pour les utilisateurs
interface UserData {
  nom?: string;
  email?: string;
  role?: string;
}

interface DownloadData {
  livreId: string;
  utilisateurId: string;
}

// Services des utilisateurs
export const userService = {
  getAll: () =>
    api.get('/users'),
  
  update: (id: string, userData: UserData) =>
    api.put(`/users/${id}`, userData),
  
  delete: (id: string) =>
    api.delete(`/users/${id}`),
};

