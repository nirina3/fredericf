import React, { Suspense, lazy } from 'react';
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
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement...</p>
    </div>
  </div>
);

// Composant simple pour tester le rendu
const TestComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">Test de rendu réussi</h1>
      <p className="text-gray-700">Si vous voyez ce message, React fonctionne correctement.</p>
    </div>
  </div>
);

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
  
  return (
    <ErrorBoundary>
      <div>
        <TestComponent />
      </div>
    </ErrorBoundary>
  );
}

export default App;