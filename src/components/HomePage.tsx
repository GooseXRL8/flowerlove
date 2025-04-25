
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import TimeCounter from './TimeCounter';
import FlowerAnimation from './FlowerAnimation';
import ThemeSwitcher from './ThemeSwitcher';
import DatePicker from './DatePicker';
import { toast } from "@/components/ui/use-toast";

type Theme = 'default' | 'purple' | 'green';

const HomePage: React.FC = () => {
  // State for theme
  const [theme, setTheme] = useState<Theme>('default');
  
  // State for relationship start date
  const [startDate, setStartDate] = useState<Date>(() => {
    const saved = localStorage.getItem('relationshipStartDate');
    return saved ? new Date(saved) : new Date(2023, 0, 1); // Default: January 1, 2023
  });
  
  // State for duration
  const [duration, setDuration] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0
  });
  
  // Effect to apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    document.body.classList.remove('theme-purple', 'theme-green');
    if (theme === 'purple') document.body.classList.add('theme-purple');
    if (theme === 'green') document.body.classList.add('theme-green');
  }, [theme]);
  
  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    toast({
      title: "Tema alterado",
      description: `O tema foi alterado para ${getThemeName(newTheme)}.`,
    });
  };
  
  // Handle date change
  const handleDateChange = (date: Date) => {
    setStartDate(date);
    localStorage.setItem('relationshipStartDate', date.toISOString());
    toast({
      title: "Data atualizada",
      description: "A data de início do relacionamento foi atualizada.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 animate-fade-in">
      <header className="w-full max-w-md mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Nosso Amor
        </h1>
        <p className="text-muted-foreground">Acompanhe o crescimento do seu amor</p>
      </header>
      
      <main className="w-full max-w-md space-y-8">
        <DatePicker date={startDate} onDateChange={handleDateChange} />
        
        <TimeCounter startDate={startDate} onTimeUpdate={setDuration} />
        
        <Card>
          <CardContent className="flex items-center justify-center py-6">
            <FlowerAnimation relationshipDuration={duration} />
          </CardContent>
        </Card>
        
        <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />
      </main>
      
      <footer className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        <p>Feito com ❤️ para casais apaixonados</p>
      </footer>
    </div>
  );
};

function getThemeName(theme: Theme): string {
  switch (theme) {
    case 'default': return 'Rosa';
    case 'purple': return 'Roxo';
    case 'green': return 'Verde';
    default: return 'Padrão';
  }
}

export default HomePage;
