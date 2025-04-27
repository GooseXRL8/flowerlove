
import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 py-2">
        <Navigation />
      </header>
      
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
