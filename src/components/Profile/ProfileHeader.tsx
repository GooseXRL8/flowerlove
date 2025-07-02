
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Settings } from "lucide-react";

interface ProfileHeaderProps {
  appTitle: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  appTitle, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <header className="w-full max-w-md mb-8 text-center relative animate-fade-in">
      <div className="mb-4">
        <h1 className="text-4xl sm:text-5xl font-romantic font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent animate-pulse-soft">
          {appTitle}
        </h1>
        <div className="flex items-center justify-center gap-2 text-lg text-primary/70">
          <span className="animate-heart-beat">💖</span>
          <p className="font-body text-muted-foreground">Acompanhe o crescimento do seu amor</p>
          <span className="animate-heart-beat">💖</span>
        </div>
      </div>
      
      <div className="absolute right-0 top-0 flex gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-secondary/30"
          onClick={() => onTabChange(activeTab === "settings" ? "main" : "settings")}
        >
          <Settings size={18} className="text-primary" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-secondary/30"
          onClick={() => onTabChange(activeTab === "memorials" ? "main" : "memorials")}
        >
          <Menu size={18} className="text-primary" />
        </Button>
      </div>
    </header>
  );
};

export default ProfileHeader;
