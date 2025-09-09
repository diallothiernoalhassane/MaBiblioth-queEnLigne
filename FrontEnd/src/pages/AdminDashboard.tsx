import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/AdminSidebar';
import BooksSection from '../components/admin/BooksSection';
import UsersSection from '../components/admin/UsersSection';
import CategoriesSection from '../components/admin/CategoriesSection';
import DownloadsSection from '../components/admin/DownloadsSection';
import DashboardOverview from '../components/admin/DashboardOverview';
import ProfileSection from '../components/admin/ProfileSection';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);


  const renderContent = () => {
    switch (activeSection) {
      case 'books':
        return <BooksSection />;
      case 'users':
        return <UsersSection />;
      case 'categories':
        return <CategoriesSection />;
      case 'downloads':
        return <DownloadsSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <DashboardOverview />;
    }
  };


  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden relative">
      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-300/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-indigo-300/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-slate-300/25 rounded-full animate-ping"></div>
        <div className="absolute top-60 right-1/3 w-2 h-2 bg-blue-300/20 rounded-full animate-pulse delay-300"></div>
      </div>
      {/* Bouton hamburger pour mobile */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-30 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 md:hidden hover:shadow-2xl transition-all duration-300"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </motion.button>

      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-4 sm:p-6 pt-16 md:pt-6 min-h-full"
        >
          <div className="max-w-full">
            {renderContent()}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
