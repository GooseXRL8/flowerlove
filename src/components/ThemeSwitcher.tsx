
import React from 'react';
import { Button } from "@/components/ui/button";

type Theme = 'default' | 'purple' | 'green';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center justify-center space-x-2 my-4">
      <Button 
        variant={currentTheme === 'default' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onThemeChange('default')}
        className="bg-love-pink text-white hover:bg-love-pink/80"
        disabled={currentTheme === 'default'}
      >
        Rosa
      </Button>
      <Button 
        variant={currentTheme === 'purple' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onThemeChange('purple')}
        className={`${currentTheme === 'purple' ? 'bg-love-purple text-white' : ''} hover:bg-love-purple/80 hover:text-white`}
        disabled={currentTheme === 'purple'}
      >
        Roxo
      </Button>
      <Button 
        variant={currentTheme === 'green' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onThemeChange('green')}
        className={`${currentTheme === 'green' ? 'bg-love-green text-white' : ''} hover:bg-love-green/80 hover:text-white`}
        disabled={currentTheme === 'green'}
      >
        Verde
      </Button>
    </div>
  );
};

export default ThemeSwitcher;
