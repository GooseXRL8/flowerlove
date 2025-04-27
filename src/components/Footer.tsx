
import React from 'react';
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-12 border-t border-primary/20">
      <div className="max-w-4xl mx-auto px-4 flex flex-col gap-4 items-center">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm text-muted-foreground">Feito com amor para casais apaixonados</span>
        </div>
        <div className="text-xs text-muted-foreground flex flex-wrap gap-4 justify-center">
          <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-primary transition-colors">Contato</a>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          © {new Date().getFullYear()} Nosso Amor • Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
};

export default Footer;
