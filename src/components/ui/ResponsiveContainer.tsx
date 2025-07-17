import React, { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Composant conteneur responsive qui s'adapte à toutes les tailles d'écran
 */
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full px-4 sm:px-6 md:px-8 mx-auto max-w-7xl ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;