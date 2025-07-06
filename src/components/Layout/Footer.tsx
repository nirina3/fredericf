import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg mr-3">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">MonFritkot</span>
                <span className="text-sm text-orange-400">.be</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre plateforme de référence pour la friterie belge. Découvrez nos services premium et rejoignez notre communauté passionnée.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-400">Navigation</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2">Accueil</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2">À propos</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2">Services</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2">Galerie</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2">Blog</Link></li>
              <li><Link to="/directory" className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2">Annuaire</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-400">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2">Abonnements</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2">Support</Link></li>
              <li><Link to="/documentation" className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2">Documentation</Link></li>
              <li><Link to="/api" className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2">API</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2">Confidentialité</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2">Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-400">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 group">
                <div className="bg-orange-600 p-2 rounded-lg group-hover:bg-orange-500 transition-colors">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors">contact@monfritkot.be</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="bg-orange-600 p-2 rounded-lg group-hover:bg-orange-500 transition-colors">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors">+32 2 123 45 67</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="bg-orange-600 p-2 rounded-lg group-hover:bg-orange-500 transition-colors">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors">Bruxelles, Belgique</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} MonFritkot.be. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-orange-400 transition-colors">Politique de confidentialité</Link>
              <Link to="/terms" className="hover:text-orange-400 transition-colors">Conditions d'utilisation</Link>
              <Link to="/cookies" className="hover:text-orange-400 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;