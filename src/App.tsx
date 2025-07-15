import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext'; 
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Lazy-loaded components
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Pricing = lazy(() => import('./pages/Pricing'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Gallery = lazy(() => import('./pages/Gallery'));
const ReservationHistory = lazy(() => import('./pages/ReservationHistory'));
const Blog = lazy(() => import('./pages/Blog'));
const Directory = lazy(() => import('./pages/Directory'));
const Profile = lazy(() => import('./pages/Profile'));
const Subscription = lazy(() => import('./pages/Subscription'));
const Billing = lazy(() => import('./pages/Billing'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const CreateUser = lazy(() => import('./pages/admin/CreateUser'));
const SubscriptionManagement = lazy(() => import('./pages/admin/SubscriptionManagement'));
const ContentManagement = lazy(() => import('./pages/admin/ContentManagement'));
const BlogManagement = lazy(() => import('./pages/admin/BlogManagement'));
const GalleryManagement = lazy(() => import('./pages/admin/GalleryManagement'));
const ReservationManagement = lazy(() => import('./pages/admin/ReservationManagement'));
const DirectoryManagement = lazy(() => import('./pages/admin/DirectoryManagement'));
const AnalyticsManagement = lazy(() => import('./pages/admin/AnalyticsManagement'));
const CommentModerationPanel = lazy(() => import('./components/comments/CommentModerationPanel'));
const InitializeAdmin = lazy(() => import('./pages/admin/InitializeAdmin'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement...</p>
    </div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Une erreur est survenue</h2>
            <p className="text-gray-700 mb-6">Nous sommes désolés, une erreur inattendue s'est produite.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
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
                  <Route path="reservations" element={<ReservationManagement />} />
                  <Route path="directory" element={<DirectoryManagement />} />
                  <Route path="analytics" element={<AnalyticsManagement />} />
                  <Route path="moderation" element={<CommentModerationPanel />} />
                </Route>

                {/* Initialization route */}
                <Route path="/initialize-admin" element={<InitializeAdmin />} />
              </Routes>
            </Suspense>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;