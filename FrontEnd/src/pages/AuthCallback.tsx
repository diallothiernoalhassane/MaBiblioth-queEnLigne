import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code) {
          console.error('Code d\'autorisation manquant');
          navigate('/login?error=auth_failed');
          return;
        }

        // Envoyer le code au backend pour échanger contre un token
        const response = await fetch('http://localhost:5000/api/auth/google/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            state: state
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Stocker le token et les infos utilisateur
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Rediriger selon le rôle
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          console.error('Erreur lors de l\'authentification:', data.message);
          navigate('/login?error=auth_failed');
        }
      } catch (error) {
        console.error('Erreur lors du callback Google:', error);
        navigate('/login?error=auth_failed');
      }
    };

    handleGoogleCallback();
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Connexion en cours...</h2>
        <p className="text-gray-500 mt-2">Veuillez patienter pendant que nous finalisons votre connexion.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
