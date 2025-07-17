import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Crown, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logoService from '../../services/logoService';
import NotificationBell from '../notifications/NotificationBell';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const url = await logoService.getLogoUrl('main-logo');
        if (url) {
          setLogoUrl(url);
        }
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    };
    
    loadLogo();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Annuaire', href: '/directory' },
    { name: 'À propos', href: '/about' },
    { name: 'Galerie', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-orange-200 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="" 
                  className="h-8 md:h-10 w-auto object-contain"
                />
              ) : (
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
                  <Crown className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1 ml-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser && <NotificationBell />}
            
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-1 md:space-x-2 text-gray-700 hover:text-orange-600 transition-colors duration-200 bg-gray-50 hover:bg-orange-50 px-2 md:px-3 py-2 rounded-lg"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block font-medium">{currentUser.name}</span>
                  <div className="hidden sm:block">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      currentUser?.subscription?.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {currentUser?.subscription?.plan?.name || 'Gratuit'}
                    </span>
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Mon Profil
                    </Link>
                    <Link
                      to="/subscription"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <Crown className="h-4 w-4 mr-3" />
                      Mon Abonnement
                    </Link>
                    <Link
                      to="/reservations"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <Calendar className="h-4 w-4 mr-3" />
                      Mes Réservations
                    </Link>
                    <Link
                      to="/billing"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Facturation
                    </Link>
                    {currentUser.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Administration
                      </Link>
                    )}
                    {!currentUser && (
                      <Link
                        to="/initialize-admin"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <Crown className="h-4 w-4 mr-3" />
                        Initialiser Admin
                      </Link>
                    )}
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login" 
                  className="text-gray-700 hover:text-orange-600 px-2 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors duration-200 rounded-md hover:bg-orange-50"
                >
                  Connexion
                </Link>
                <Link
                  to="/pricing"
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 md:px-6 py-2 rounded-lg text-xs md:text-sm font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  S'abonner
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1 md:p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-orange-200 bg-white mt-2 absolute left-0 right-0 z-50 shadow-lg">
            <div className="px-2 pt-4 pb-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!currentUser && (
                <div className="pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/pricing"
                    className="block px-4 py-3 text-base font-medium bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    S'abonner
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;