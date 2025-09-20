import { motion } from 'framer-motion';
import { BookOpen, Users, Globe, Award, Code, GraduationCap, MapPin, Mail, Github, Linkedin } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white py-12 sm:py-16 lg:py-24">
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-white via-purple-100 to-indigo-100 bg-clip-text text-transparent drop-shadow-2xl px-4"
            >
              À Propos de LibraTech
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-purple-100 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-light tracking-wide px-4"
            >
              Votre bibliothèque numérique moderne et accessible
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-purple-50/30 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent px-4">
              Notre Mission
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              LibraTech est née de la vision de démocratiser l'accès au savoir. 
              Nous croyons que la connaissance doit être accessible à tous, partout dans le monde. 
              Notre plateforme offre une collection diversifiée de livres numériques, 
              organisée par catégories pour faciliter la découverte et l'apprentissage.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6"
            >
              <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
            >
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Collection Variée
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Des milliers de livres couvrant tous les domaines : informatique, science, 
                littérature, histoire, philosophie et bien plus encore.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
              >
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Accessible à Tous
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Une interface intuitive et responsive, accessible depuis n'importe quel appareil. 
                Inscription gratuite pour accéder à tous nos contenus.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
              >
                <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Disponible 24/7
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Accédez à votre bibliothèque personnelle à tout moment, 
                téléchargez vos livres préférés et lisez hors ligne.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-indigo-50/50 via-purple-50/50 to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent px-4">
              Le Développeur
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Découvrez l'esprit créatif derrière LibraTech
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="lg:flex">
                {/* Developer Photo */}
                <div className="lg:w-1/3 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 p-6 sm:p-8 lg:p-10 flex items-center justify-center relative overflow-hidden">
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                  <div className="text-center text-white relative z-10">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm border border-white/30"
                    >
                      <Code className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 sm:mb-3">Thierno Alhassane Diallo</h3>
                    <p className="text-purple-100 text-base sm:text-lg font-medium">Développeur Full-Stack</p>
                  </div>
                </div>

                {/* Developer Info */}
                <div className="lg:w-2/3 p-6 sm:p-8 lg:p-10">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                        À Propos de Moi
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Passionné de technologie et de développement web, je suis un étudiant en MIAGE 
                        (Méthodes Informatiques Appliquées à la Gestion des Entreprises) à l'Université de Labé. 
                        Mon objectif est de créer des solutions numériques innovantes qui améliorent 
                        l'expérience utilisateur et facilitent l'accès à l'information.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        <span className="text-sm sm:text-base text-gray-700">Étudiant MIAGE</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="text-sm sm:text-base text-gray-700">Université de Labé</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-purple-600" />
                        <span className="text-sm sm:text-base text-gray-700">Développeur Full-Stack</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Code className="w-5 h-5 text-orange-600" />
                        <span className="text-sm sm:text-base text-gray-700">React, Node.js, MongoDB</span>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                        Technologies Utilisées
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Framer Motion'].map((tech) => (
                          <span
                            key={tech}
                            className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                      <motion.a
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        href="mailto:diallothiernoalhassane9588@gmail.com"
                        className="flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="font-semibold">Contact</span>
                      </motion.a>
                      
                      <motion.a
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://github.com/diallothiernoalhassane"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        <Github className="w-5 h-5" />
                        <span className="font-semibold">GitHub</span>
                      </motion.a>
                      
                      <motion.a
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://www.linkedin.com/in/thierno-alhassane-diallo-104515349/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        <Linkedin className="w-5 h-5" />
                        <span className="font-semibold">LinkedIn</span>
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent px-4">
              Notre Vision
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
              LibraTech aspire à devenir la référence en matière de bibliothèque numérique en Afrique de l'Ouest, 
              offrant un accès démocratique au savoir et contribuant à l'éducation et au développement culturel de la région.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl"
            >
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
              
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-4 sm:mb-6">
                  Rejoignez l'Aventure
                </h3>
                <p className="text-purple-100 mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Découvrez notre collection, créez votre compte et commencez votre voyage 
                  dans l'univers fascinant de la connaissance numérique.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                  <motion.a
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    href="/catalogue"
                    className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-white text-indigo-600 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                  >
                    Explorer le Catalogue
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    href="/register"
                    className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 border-2 border-white text-white rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                  >
                    Créer un Compte
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
