import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("main.tsx - Début du chargement");

// Fonction pour masquer le loader initial
const hideInitialLoader = () => {
  const initialLoader = document.getElementById('initial-loader');
  if (initialLoader) {
    initialLoader.style.display = 'none';
    console.log("Loader initial masqué");
  }
};

try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error("Élément root non trouvé dans le DOM");
  }
  
  console.log("Création du root React");
  const root = ReactDOM.createRoot(rootElement);
  
  console.log("Rendu de l'application");
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log("Rendu terminé");
  
  // Masquer le loader après un court délai
  setTimeout(hideInitialLoader, 500);
} catch (error) {
  console.error("Erreur critique lors du chargement:", error);
  
  // Afficher l'erreur dans le loader
  const loadingStatus = document.getElementById('loading-status');
  if (loadingStatus) loadingStatus.textContent = "Erreur critique";
  
  const loadingError = document.getElementById('loading-error');
  if (loadingError) {
    loadingError.style.display = "block";
    loadingError.innerHTML = `
      <h2 style="color: #dc2626; margin-bottom: 16px;">Erreur critique</h2>
      <p style="margin-bottom: 16px;">${error instanceof Error ? error.message : String(error)}</p>
      <button onclick="window.location.reload()" style="background-color: #f97316; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        Recharger la page
      </button>
    `;
  }
}