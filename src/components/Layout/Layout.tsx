import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useRealTimeNotifications } from '../../hooks/useRealTimeNotifications';

const Layout: React.FC = () => {
  // Activer les notifications en temps réel
  useRealTimeNotifications();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;