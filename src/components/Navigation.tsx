
import React from 'react';
import { Heart, Clock, Flower, Info } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
  return (
    <nav className="w-full max-w-4xl mx-auto px-4 py-3">
      <ul className="flex flex-wrap justify-center gap-3 sm:gap-6">
        <NavItem to="/" icon={<Heart className="stroke-primary" />} label="Início" />
        <NavItem to="/rosa" icon={<Flower className="stroke-primary" />} label="Rosa do Amor" />
        <NavItem to="/contador" icon={<Clock className="stroke-primary" />} label="Contador" />
        <NavItem to="/sobre" icon={<Info className="stroke-primary" />} label="Sobre" />
      </ul>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const isActive = window.location.pathname === to;
  
  return (
    <li>
      <Link 
        to={to} 
        className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
          isActive 
            ? 'text-primary bg-primary/10' 
            : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
        }`}
      >
        <span className="mb-1">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </Link>
    </li>
  );
};

export default Navigation;
