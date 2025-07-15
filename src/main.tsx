import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("main.tsx - Début du chargement", new Date().toISOString());

// Mettre à jour le statut de chargement
const updateLoadingStatus = (status) => {
  const loadingStatus = document.getElementById('loading-status');
  if (loadingStatus) loadingStatus.textContent = status;
};

// Afficher une erreur dans le loader
const showLoadingError = (message) => {
  const loadingError = document.getElementById('loading-error');
  if (loadingError) {
    loadingError.style.display = "block";
    loadingError.innerHTML = `
      <h2 style="color: #dc2626; margin-bottom: 16px;">Erreur</h2>
      <p style="margin-bottom: 16px;">${message}</p>
      <button onclick="window.location.reload()" style="background-color: #f97316; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        Recharger la page
      </button>
    `;
  }
};

try {
  updateLoadingStatus("Recherche de l'élément root");
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error("Élément root non trouvé dans le DOM");
  }
  
  console.log("main.tsx - Élément root trouvé, création du root React", new Date().toISOString());
  updateLoadingStatus("Création du root React");
  
  const root = createRoot(rootElement);
  
  console.log("main.tsx - Root React créé, rendu de l'application", new Date().toISOString());
  updateLoadingStatus("Rendu de l'application");
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log("main.tsx - Rendu de l'application terminé", new Date().toISOString());
  updateLoadingStatus("Rendu terminé");
  
  // Masquer le loader initial une fois que React est chargé
  // Attendre un court délai pour s'assurer que le rendu est complet
  setTimeout(() => {
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) {
      initialLoader.style.display = 'none';
    }
  }, 500);
} catch (error) {
  console.error("Erreur critique lors du chargement de l'application:", error, new Date().toISOString());
  updateLoadingStatus("Erreur critique");
  
  // Afficher l'erreur dans le loader initial
  showLoadingError(error instanceof Error ? error.message : String(error));
}