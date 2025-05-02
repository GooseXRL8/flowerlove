
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import TimeCounter from './TimeCounter';
import FlowerAnimation from './FlowerAnimation';
import ThemeSwitcher from './ThemeSwitcher';
import DatePicker from './DatePicker';
import MemorialsTab from './MemorialsTab';
import SettingsTab from './SettingsTab';
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Menu, Settings } from "lucide-react";

type Theme = 'default' | 'purple' | 'green';

const HomePage: React.FC = () => {
  // State for theme
  const [theme, setTheme] = useState<Theme>('default');
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("main");
  
  // State for app title
  const [appTitle, setAppTitle] = useState<string>("Nosso Amor");
  
  // State for the main image URL
  const [mainImageUrl, setMainImageUrl] = useState<string>("/lovable-uploads/a60a0dbc-45be-4ae8-9b7d-eb2cbc8e133e.png");
  
  // Fixed relationship start date: September 7, 2024
  const [startDate, setStartDate] = useState<Date>(new Date(2024, 8, 7)); // Note: Month is 0-indexed, so 8 = September
  
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
  
  // Effect to load saved settings from localStorage
  useEffect(() => {
    const savedTitle = localStorage.getItem('appTitle');
    if (savedTitle) setAppTitle(savedTitle);
    
    const savedImageUrl = localStorage.getItem('mainImageUrl');
    if (savedImageUrl) setMainImageUrl(savedImageUrl);
    
    const savedStartDate = localStorage.getItem('startDate');
    if (savedStartDate) setStartDate(new Date(savedStartDate));
  }, []);
  
  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    toast({
      title: "Tema alterado",
      description: `O tema foi alterado para ${getThemeName(newTheme)}.`,
    });
  };
  
  // Handle title change
  const handleTitleChange = (newTitle: string) => {
    setAppTitle(newTitle);
    localStorage.setItem('appTitle', newTitle);
  };
  
  // Handle date change
  const handleDateChange = (newDate: Date) => {
    setStartDate(newDate);
    localStorage.setItem('startDate', newDate.toISOString());
  };
  
  // Handle image change
  const handleImageChange = (newImageUrl: string) => {
    setMainImageUrl(newImageUrl);
    localStorage.setItem('mainImageUrl', newImageUrl);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 animate-fade-in">
      <header className="w-full max-w-md mb-6 text-center relative">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {appTitle}
        </h1>
        <p className="text-muted-foreground">Acompanhe o crescimento do seu amor</p>
        
        <div className="absolute right-0 top-0 flex gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            className="opacity-50 hover:opacity-100 transition-opacity"
            onClick={() => setActiveTab(activeTab === "settings" ? "main" : "settings")}
          >
            <Settings size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="opacity-50 hover:opacity-100 transition-opacity"
            onClick={() => setActiveTab(activeTab === "memorials" ? "main" : "memorials")}
          >
            <Menu size={16} />
          </Button>
        </div>
      </header>
      
      <main className="w-full max-w-md space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="main">Principal</TabsTrigger>
            <TabsTrigger value="memorials">Memórias</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="space-y-8">
            <DatePicker date={startDate} onDateChange={() => {}} />
            
            <TimeCounter startDate={startDate} onTimeUpdate={setDuration} />
            
            <Card>
              <CardContent className="flex items-center justify-center py-6">
                <FlowerAnimation relationshipDuration={duration} />
              </CardContent>
            </Card>
            
            <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />
          </TabsContent>
          
          <TabsContent value="memorials" className="space-y-8">
            <MemorialsTab startDate={startDate} />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-8">
            <SettingsTab 
              title={appTitle} 
              startDate={startDate} 
              onTitleChange={handleTitleChange} 
              onDateChange={handleDateChange} 
              onImageChange={handleImageChange}
            />
          </TabsContent>
        </Tabs>
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
