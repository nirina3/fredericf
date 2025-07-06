import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import AdminLayout from './pages/admin/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Directory from './pages/Directory';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import Billing from './pages/Billing';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import CreateUser from './pages/admin/CreateUser';
import InitializeAdmin from './pages/admin/InitializeAdmin';
import ContentManagement from './pages/admin/ContentManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="blog" element={<Blog />} />
            <Route path="directory" element={<Directory />} />
            <Route path="profile" element={<Profile />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="billing" element={<Billing />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="subscriptions" element={<div className="text-center py-12"><h1 className="text-2xl">Gestion des abonnements - Coming Soon</h1></div>} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="blog" element={<div className="text-center py-12"><h1 className="text-2xl">Gestion du blog - Coming Soon</h1></div>} />
            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="directory" element={<div className="text-center py-12"><h1 className="text-2xl">Gestion de l'annuaire - Coming Soon</h1></div>} />
            <Route path="analytics" element={<div className="text-center py-12"><h1 className="text-2xl">Statistiques - Coming Soon</h1></div>} />
            <Route path="settings" element={<div className="text-center py-12"><h1 className="text-2xl">Paramètres - Coming Soon</h1></div>} />
          </Route>

          {/* Initialization route */}
          <Route path="/initialize-admin" element={<InitializeAdmin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;