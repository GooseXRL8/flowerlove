
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
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 animate-fade-in">
      <ProfileHeader 
        appTitle={appTitle} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <main className="w-full max-w-md space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="main">Principal</TabsTrigger>
            <TabsTrigger value="memorials">Memórias</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="space-y-8">
            <MainTab 
              startDate={startDate}
              theme={theme}
              onThemeChange={handleThemeChange}
              onDateChange={handleDateChange}
              onTimeUpdate={setDuration}
            />
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

export default HomePage;
