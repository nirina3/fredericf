import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Crown, Calendar, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logoService from '../../services/logoService';
import NotificationBell from '../notifications/NotificationBell';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate(); 
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current && 
        !profileMenuRef.current.contains(event.target as Node) &&
        profileButtonRef.current && 
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAdminClick = () => {
    setIsProfileMenuOpen(false);
    navigate('/admin');
  };

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Annuaire', href: '/directory' },
    { name: 'Galerie', href: '/gallery' },
    { name: 'À propos', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-orange-200 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 mr-2">
            <Link to="/" className="flex items-center">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="" 
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-1.5 rounded-lg">
                  <Crown className="h-6 w-6 text-white" />
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
              <div className="flex items-center space-x-2">
                {currentUser.role === 'admin' && (
                  <a 
                    href="/admin" 
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Admin
                  </a>
                )}
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors duration-200 bg-gray-50 hover:bg-orange-50 px-2 py-2 rounded-lg"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block font-medium truncate max-w-[80px]">{currentUser.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-2 py-2 text-sm font-medium transition-colors rounded-md hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                </button>
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
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden border-t border-orange-200 bg-white fixed left-0 right-0 z-40 shadow-lg transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-2 pb-4 space-y-1 max-h-[80vh] overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!currentUser && (
              <div className="pt-2 space-y-1">
                <div className="px-4 py-2">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 text-center mb-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/pricing"
                    className="block w-full px-4 py-2 text-base font-medium bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    S'abonner
                  </Link>
                </div>
              </div>
            )}
            {currentUser && (
              <div className="pt-2 border-t border-gray-200 mt-2">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                  onClick={() => {setIsMobileMenuOpen(false)}}
                >
                  Mon Profil
                </Link>
                <Link
                  to="/subscription"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mon Abonnement
                </Link>
                <Link
                  to="/reservations"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mes Réservations
                </Link>
                <Link
                  to="/billing"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Facturation
                </Link>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.location.href = '/admin';
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    Administration
                  </button>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;