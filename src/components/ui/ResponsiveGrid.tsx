import React, { ReactNode } from 'react';

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  className?: string;
}

/**
 * Composant de grille responsive qui s'adapte à toutes les tailles d'écran
 */
const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'gap-4 sm:gap-6 md:gap-8',
  className = '' 
}) => {
  // Construire les classes de colonnes
  const getColsClass = () => {
    const classes = [];
    
    if (cols.xs) classes.push(`grid-cols-${cols.xs}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    
    return classes.join(' ');
  };

  return (
    <div className={`grid ${getColsClass()} ${gap} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;