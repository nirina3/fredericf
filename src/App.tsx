import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext'; 
import Layout from './components/Layout/Layout';

// Importation directe des composants essentiels pour éviter le lazy loading
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

console.log("App.tsx - Composant App chargé");

// Loading component
const LoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement...</p>
    </div>
  </div>
);

// Lazy load des pages moins critiques
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Directory = lazy(() => import('./pages/Directory'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Services = lazy(() => import('./pages/Services'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Profile = lazy(() => import('./pages/Profile'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const InitializeAdmin = lazy(() => import('./pages/admin/InitializeAdmin'));

// Error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
    console.log("ErrorBoundary - Constructeur appelé");
  }

  static getDerivedStateFromError(error: Error) {
    console.log("ErrorBoundary - getDerivedStateFromError appelé");
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Erreur capturée par ErrorBoundary:", error, errorInfo);
  }

  render() {
    console.log("ErrorBoundary - render appelé, hasError:", this.state.hasError);
    
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Une erreur est survenue</h2>
            <p className="text-gray-700 mb-4">
              {this.state.error ? this.state.error.message : "Erreur inconnue"}
            </p>
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
  console.log("App.tsx - Rendu du composant App");

  // Effet pour signaler que l'application est chargée
  useEffect(() => {
    console.log("App.tsx - Composant App monté");
    
    // Masquer le loader initial après un court délai
    const timer = setTimeout(() => {
      const initialLoader = document.getElementById('initial-loader');
      if (initialLoader) {
        initialLoader.style.display = 'none';
        console.log("App.tsx - Loader initial masqué");
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <About />
                    </Suspense>
                  } />
                  <Route path="blog" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Blog />
                    </Suspense>
                  } />
                  <Route path="contact" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Contact />
                    </Suspense>
                  } />
                  <Route path="directory" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Directory />
                    </Suspense>
                  } />
                  <Route path="gallery" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Gallery />
                    </Suspense>
                  } />
                  <Route path="services" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Services />
                    </Suspense>
                  } />
                  <Route path="pricing" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Pricing />
                    </Suspense>
                  } />
                  <Route path="profile" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Profile />
                    </Suspense>
                  } />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ForgotPassword />
                  </Suspense>
                } />
                <Route path="/initialize-admin" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <InitializeAdmin />
                  </Suspense>
                } />
              </Routes>
            </Suspense>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;