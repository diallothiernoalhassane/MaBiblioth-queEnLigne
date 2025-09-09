import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { User, Edit3, Save, X, Mail, Calendar, Shield } from 'lucide-react';
import axios from 'axios';

interface UserProfile {
  _id: string;
  nom: string;
  email: string;
  dateCreation: string;
  role: string;
}

const Profile = () => {
  const { } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nom: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Réponse profil:', response.data);
      setProfile(response.data.user);
      setEditForm({
        nom: response.data.user.nom,
        email: response.data.user.email
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error as Error);
      console.error('Détails de l\'erreur:', (error as any).response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        nom: profile.nom,
        email: profile.email
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        editForm,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setProfile(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Impossible de charger le profil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mon Profil</h1>
          <p className="text-lg text-gray-600">Gérez vos informations personnelles</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white relative">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{profile.nom}</h2>
                <p className="text-blue-100 text-lg">{profile.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm capitalize">{profile.role}</span>
                </div>
              </div>
            </div>
            
            {/* Edit Button */}
            <div className="absolute top-6 right-6">
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/30 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Modifier</span>
                </motion.button>
              ) : (
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-500/80 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-500 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="bg-red-500/80 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Annuler</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nom"
                    value={editForm.nom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 font-medium">{profile.nom}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 font-medium">{profile.email}</span>
                  </div>
                )}
              </div>

              {/* Date de création */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'inscription
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">
                    {new Date(profile.dateCreation || profile.dateInscription || Date.now()).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Rôle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 font-medium capitalize">{profile.role}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
