
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import TimeCounter from './TimeCounter';
import RoseSvg from './RoseSvg';
import ThemeSwitcher from './ThemeSwitcher';
import DatePicker from './DatePicker';

type Theme = 'default' | 'purple' | 'green';

const HomePage: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('default');
  const startDate = new Date(2024, 0, 14, 12, 0, 0);
  const [duration, setDuration] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0
  });
  
  const [scale, setScale] = useState(0.5);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    document.body.classList.remove('theme-purple', 'theme-green');
    if (theme === 'purple') document.body.classList.add('theme-purple');
    if (theme === 'green') document.body.classList.add('theme-green');
  }, [theme]);
  
  useEffect(() => {
    // Calculate rose scale based on duration
    const totalMonths = duration.years * 12 + duration.months;
    const newScale = 0.5 + totalMonths * 0.1 + (duration.days / 30) * 0.1;
    setScale(newScale);
  }, [duration]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 bg-[#121212] text-white">
      <header className="w-full max-w-md mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Juan & Ana</h1>
      </header>
      
      <main className="w-full max-w-md space-y-8">
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="h-[300px] overflow-hidden relative">
            <RoseSvg scale={scale} />
          </CardContent>
        </Card>
        
        <TimeCounter startDate={startDate} onTimeUpdate={setDuration} />
        <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
      </main>
      
      <footer className="mt-auto pt-8 text-center text-sm text-gray-400">
        <p>Feito com ❤️ para casais apaixonados</p>
      </footer>
    </div>
  );
};

export default HomePage;
