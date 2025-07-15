import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("main.tsx - Début du chargement");

try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error("Élément root non trouvé dans le DOM");
  }
  
  console.log("main.tsx - Élément root trouvé, création du root React");
  
  const root = createRoot(rootElement);
  
  console.log("main.tsx - Root React créé, rendu de l'application");
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log("main.tsx - Rendu de l'application terminé");
  
  // Masquer le loader initial une fois que React est chargé
  const initialLoader = document.getElementById('initial-loader');
  if (initialLoader) {
    initialLoader.style.display = 'none';
  }
} catch (error) {
  console.error("Erreur critique lors du chargement de l'application:", error);
  
  // Afficher l'erreur dans le loader initial
  const initialLoader = document.getElementById('initial-loader');
  if (initialLoader) {
    initialLoader.innerHTML = `
      <div class="initial-loader-content">
        <h2 style="color: #dc2626; margin-bottom: 16px;">Erreur critique</h2>
        <p style="margin-bottom: 16px;">${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="window.location.reload()" style="background-color: #f97316; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Recharger la page
        </button>
      </div>
    `;
  }
}