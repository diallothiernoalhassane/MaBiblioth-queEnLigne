import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useNotification } from './hooks/useNotification';
import { useScrollToTop } from './hooks/useScrollToTop';
import NotificationToast from './components/NotificationToast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyDownloadsBasic from './pages/MyDownloadsBasic';
import Categories from './pages/Categories';
import Catalogue from './pages/Catalogue';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';
import UserToAdminButton from './components/UserToAdminButton';

function App() {
  return (
    <GoogleOAuthProvider 
      clientId="532933002424-v36a8fe010srfmfpseno5m109ni5b9g7.apps.googleusercontent.com"
      onScriptLoadError={() => console.error('Erreur de chargement du script Google')}
      onScriptLoadSuccess={() => console.log('Script Google chargé avec succès')}
    >
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AdminLayoutWrapper />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

const AdminLayoutWrapper = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { notifications, removeNotification } = useNotification();
  useScrollToTop();

  // Si l'utilisateur est admin et authentifié, afficher uniquement l'interface admin
  if (isAuthenticated && isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Interface Admin */}
        {isAuthenticated && isAdmin && (
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
            <NotificationToast 
              notifications={notifications} 
              onRemove={removeNotification} 
            />
          </div>
        )}
      </div>
    );
  }

  // Interface utilisateur normale
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/livre/:id" element={<BookDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/about" element={<About />} />
          {/* Routes protégées utilisateur */}
          <Route path="/profil" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/mes-telechargements" element={
            <ProtectedRoute>
              <MyDownloadsBasic />
            </ProtectedRoute>
          } />
          {/* Redirection admin vers interface séparée */}
          <Route path="/admin" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <UserToAdminButton />
      <NotificationToast 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};

export default App;
