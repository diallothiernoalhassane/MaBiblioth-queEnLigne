import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  console.log('AdminRoute - État:', { 
    isAuthenticated, 
    isAdmin, 
    userEmail: user?.email,
    userRole: user?.role 
  });

  // Si l'utilisateur n'est pas authentifié, on le redirige vers la page de connexion
  if (!isAuthenticated) {
    console.log('AdminRoute - Redirection vers /login: utilisateur non authentifié');
    return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  }

  // Si l'utilisateur n'est pas admin, on le redirige vers la page d'accueil
  if (!isAdmin) {
    console.log('AdminRoute - Redirection vers /: utilisateur non admin');
    return <Navigate to="/" replace />;
  }

  // Si tout est bon, on affiche le contenu protégé
  console.log('AdminRoute - Accès autorisé au tableau de bord admin');
  return <>{children}</>;
};

export default AdminRoute;
