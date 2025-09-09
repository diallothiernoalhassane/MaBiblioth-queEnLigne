import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    confirmerMotDePasse: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.motDePasse !== formData.confirmerMotDePasse) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    const result = await register({
      nom: formData.nom,
      email: formData.email,
      motDePasse: formData.motDePasse
    });
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error || 'Erreur d\'inscription');
    }
    
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      setError('');
      
      // Envoyer le token Google au backend pour vérification et création/connexion du compte
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Stocker le token et les infos utilisateur
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Forcer le rechargement de la page pour que AuthContext détecte la connexion
        window.location.href = data.user.role === 'admin' ? '/admin' : '/';
      } else {
        setError(data.message || 'Erreur lors de la connexion avec Google');
      }
    } catch (error) {
      setError('Erreur de connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Erreur lors de la connexion avec Google');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-2 sm:py-4 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-emerald-300/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-teal-300/40 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-green-300/50 rounded-full animate-ping"></div>
        <div className="absolute top-60 right-1/3 w-4 h-4 bg-emerald-300/25 rounded-full animate-pulse delay-300"></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="max-w-xs w-full space-y-2 sm:space-y-3 relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="mx-auto h-10 w-10 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-lg flex items-center justify-center mb-2 shadow-lg"
          >
            <UserPlus className="h-5 w-5 text-white" />
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Créer un compte
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium px-2">
            Rejoignez notre bibliothèque
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-3 sm:p-4 relative overflow-hidden"
        >
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          
          <form className="space-y-2 sm:space-y-3 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="nom" className="block text-xs font-semibold text-gray-700 mb-1">
                Nom
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-8 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 text-sm shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md bg-white"
                  placeholder="Votre nom complet"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-8 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 text-sm shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md bg-white"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="motDePasse" className="block text-xs font-semibold text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="motDePasse"
                  name="motDePasse"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.motDePasse}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-8 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 text-sm shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md bg-white"
                  placeholder="Votre mot de passe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmerMotDePasse" className="block text-xs font-semibold text-gray-700 mb-1">
                Confirmer
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="confirmerMotDePasse"
                  name="confirmerMotDePasse"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmerMotDePasse}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-8 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 text-sm shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md bg-white"
                  placeholder="Confirmez votre mot de passe"
                />
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-3 border border-transparent text-sm font-semibold rounded-md text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-emerald-500 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <span className="relative z-10">
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Création en cours...
                    </div>
                  ) : (
                    'Créer mon compte'
                  )}
                </span>
              </motion.button>
            </div>

            {/* Séparateur */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500 font-medium">Ou</span>
              </div>
            </div>

            {/* Bouton Google */}
            <div className="flex justify-center">
              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="medium"
                  text="signup_with"
                  locale="fr"
                  width="100%"
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
