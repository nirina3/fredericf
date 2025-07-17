import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout/Layout';
import AdminLayout from './pages/admin/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Gallery from './pages/Gallery';
import ReservationHistory from './pages/ReservationHistory';
import Blog from './pages/Blog';
import Directory from './pages/Directory';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import Billing from './pages/Billing';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import CreateUser from './pages/admin/CreateUser';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';
import SettingsManagement from './pages/admin/SettingsManagement';
import InitializeAdmin from './pages/admin/InitializeAdmin';
import ContentManagement from './pages/admin/ContentManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import BlogManagement from './pages/admin/BlogManagement';
import LogoManagement from './pages/admin/LogoManagement';
import ReservationManagement from './pages/admin/ReservationManagement';
import DirectoryManagement from './pages/admin/DirectoryManagement';
import AnalyticsManagement from './pages/admin/AnalyticsManagement';
import CommentModerationPanel from './components/comments/CommentModerationPanel';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="blog" element={<Blog />} />
              <Route path="directory" element={<Directory />} />
              <Route path="reservations" element={<ReservationHistory />} />
              <Route path="profile" element={<Profile />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="billing" element={<Billing />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="create-user" element={<CreateUser />} />
              <Route path="subscriptions" element={<SubscriptionManagement />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="blog" element={<BlogManagement />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="logos" element={<LogoManagement />} />
              <Route path="reservations" element={<ReservationManagement />} />
              <Route path="directory" element={<DirectoryManagement />} />
              <Route path="analytics" element={<AnalyticsManagement />} />
              <Route path="moderation" element={<CommentModerationPanel />} />
              <Route path="settings" element={<SettingsManagement />} />
            </Route>

            {/* Initialization route */}
            <Route path="initialize-admin" element={<InitializeAdmin />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;