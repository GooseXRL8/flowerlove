
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
          onClick={() => onTabChange(activeTab === "settings" ? "main" : "settings")}
        >
          <Settings size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="opacity-50 hover:opacity-100 transition-opacity"
          onClick={() => onTabChange(activeTab === "memorials" ? "main" : "memorials")}
        >
          <Menu size={16} />
        </Button>
      </div>
    </header>
  );
};

export default ProfileHeader;
