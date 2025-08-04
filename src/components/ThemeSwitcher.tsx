
import React from 'react';
import { Button } from "@/components/ui/button";

type Theme = 'default' | 'purple' | 'green';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center justify-center gap-3 p-4">
      <div className="flex rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-1 shadow-soft">
        <Button 
          variant={currentTheme === 'default' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => onThemeChange('default')}
          className={`relative rounded-xl px-6 py-2 transition-all duration-300 ${
            currentTheme === 'default' 
              ? 'bg-primary text-primary-foreground shadow-romantic hover:shadow-glow' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
          disabled={currentTheme === 'default'}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-love-pink shadow-sm"></div>
            Rosa
          </div>
        </Button>
        <Button 
          variant={currentTheme === 'purple' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => onThemeChange('purple')}
          className={`relative rounded-xl px-6 py-2 transition-all duration-300 ${
            currentTheme === 'purple' 
              ? 'bg-love-purple text-white shadow-romantic hover:shadow-glow' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
          disabled={currentTheme === 'purple'}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-love-purple shadow-sm"></div>
            Roxo
          </div>
        </Button>
        <Button 
          variant={currentTheme === 'green' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => onThemeChange('green')}
          className={`relative rounded-xl px-6 py-2 transition-all duration-300 ${
            currentTheme === 'green' 
              ? 'bg-love-green text-white shadow-romantic hover:shadow-glow' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
          disabled={currentTheme === 'green'}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-love-green shadow-sm"></div>
            Verde
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
