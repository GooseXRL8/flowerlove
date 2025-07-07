
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from '@/hooks/useProfile';
import ProfileHeader from './Profile/ProfileHeader';
import MainTab from './Profile/MainTab';
import MemorialsTab from './MemorialsTab';
import SettingsTab from './SettingsTab';

const HomePage: React.FC = () => {
  const {
    theme,
    activeTab,
    appTitle,
    startDate,
    duration,
    setActiveTab,
    setDuration,
    handleThemeChange,
    handleTitleChange,
    handleDateChange,
    handleImageChange
  } = useProfile();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 relative overflow-hidden">
      {/* Romantic background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-6 h-6 text-secondary/30 animate-float">💐</div>
        <div className="absolute top-32 right-16 w-8 h-8 text-secondary/20 animate-pulse-soft">🌸</div>
        <div className="absolute bottom-40 left-8 w-5 h-5 text-secondary/25 animate-heart-beat">💕</div>
        <div className="absolute bottom-60 right-12 w-7 h-7 text-secondary/30 animate-float">🌹</div>
      </div>
      
      <ProfileHeader 
        appTitle={appTitle} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <main className="w-full max-w-md space-y-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="main">Principal</TabsTrigger>
            <TabsTrigger value="memorials">Memórias</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="space-y-8 animate-fade-in">
            <MainTab 
              startDate={startDate}
              theme={theme}
              onThemeChange={handleThemeChange}
              onDateChange={handleDateChange}
              onTimeUpdate={setDuration}
              appTitle={appTitle}
            />
          </TabsContent>
          
          <TabsContent value="memorials" className="space-y-8 animate-fade-in">
            <MemorialsTab startDate={startDate} />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-8 animate-fade-in">
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
      
      <footer className="mt-auto pt-12 text-center text-sm text-muted-foreground relative z-10">
        <div className="flex items-center justify-center gap-2 animate-pulse-soft">
          <span className="text-primary">💖</span>
          <p className="font-body">Feito com amor para casais apaixonados</p>
          <span className="text-primary">💖</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
