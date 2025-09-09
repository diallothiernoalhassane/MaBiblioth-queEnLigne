import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
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

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Vérifier le token pour obtenir le rôle de l'utilisateur
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userRole = payload.role;
            
            console.log('Connexion réussie - Rôle détecté:', userRole);
            
            // Rediriger en fonction du rôle
            if (userRole === 'admin') {
              console.log('Redirection vers /admin');
              navigate('/admin');
            } else {
              console.log('Redirection vers /');
              navigate('/');
            }
          } catch (error) {
            console.error('Erreur lors de la lecture du token:', error);
            setError('Erreur lors de la vérification de la session');
            navigate('/');
          }
        } else {
          console.error('Aucun token trouvé après connexion');
          setError('Erreur lors de la connexion');
          navigate('/login');
        }
      } else {
        setError(result.error || 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      setError('');
      
      // Envoyer le token Google au backend pour vérification et connexion
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
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-indigo-300/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-purple-300/40 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-blue-300/50 rounded-full animate-ping"></div>
        <div className="absolute top-60 right-1/3 w-4 h-4 bg-indigo-300/25 rounded-full animate-pulse delay-300"></div>
      </div>
      <div className="max-w-sm w-full space-y-4 sm:space-y-5 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="mx-auto h-14 w-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg"
          >
            <LogIn className="h-7 w-7 text-white" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Connexion
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium px-2">
            Accédez à votre bibliothèque
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-5 sm:p-6 relative overflow-hidden"
        >
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          
          <form className="space-y-4 sm:space-y-5 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base shadow-md transition-all duration-300 hover:shadow-lg focus:shadow-lg bg-white"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base shadow-md transition-all duration-300 hover:shadow-lg focus:shadow-lg bg-white"
                  placeholder="Votre mot de passe"
                />
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <span className="relative z-10">
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Connexion en cours...
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </span>
              </motion.button>
            </div>

            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Ou</span>
              </div>
            </div>

            {/* Bouton Google */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  locale="fr"
                  width="100%"
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Pas encore de compte ?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  S'inscrire
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
