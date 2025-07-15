// Error handler script to catch and report runtime errors
(function() {
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error caught:', { message, source, lineno, colno });
    
    // Display error message to user
    const errorContainer = document.createElement('div');
    errorContainer.style.position = 'fixed';
    errorContainer.style.top = '0';
    errorContainer.style.left = '0';
    errorContainer.style.right = '0';
    errorContainer.style.padding = '20px';
    errorContainer.style.backgroundColor = '#f8d7da';
    errorContainer.style.color = '#721c24';
    errorContainer.style.borderBottom = '1px solid #f5c6cb';
    errorContainer.style.zIndex = '9999';
    errorContainer.style.textAlign = 'center';
    errorContainer.style.fontFamily = 'sans-serif';
    
    errorContainer.innerHTML = `
      <p><strong>Une erreur est survenue</strong></p>
      <p>${message}</p>
      <p>Ligne: ${lineno}, Colonne: ${colno}</p>
      <button id="reload-btn" style="background-color: #721c24; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Recharger la page</button>
    `;
    
    document.body.prepend(errorContainer);
    
    document.getElementById('reload-btn').addEventListener('click', function() {
      window.location.reload();
    });
    
    return true; // Prevent default error handling
  };
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
  });
  
  console.log('Error handler initialized');
})();