
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import TimeCounter from '../TimeCounter';
import FlowerAnimation from '../FlowerAnimation';
import ThemeSwitcher from '../ThemeSwitcher';
import DatePicker from '../DatePicker';

interface MainTabProps {
  startDate: Date;
  theme: 'default' | 'purple' | 'green';
  onThemeChange: (theme: 'default' | 'purple' | 'green') => void;
  onDateChange: (date: Date) => void;
  onTimeUpdate: (duration: any) => void;
}

const MainTab: React.FC<MainTabProps> = ({
  startDate,
  theme,
  onThemeChange,
  onDateChange,
  onTimeUpdate
}) => {
  return (
    <div className="space-y-8">
      <DatePicker date={startDate} onDateChange={onDateChange} />
      
      <TimeCounter startDate={startDate} onTimeUpdate={onTimeUpdate} />
      
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <FlowerAnimation relationshipDuration={onTimeUpdate} />
        </CardContent>
      </Card>
      
      <ThemeSwitcher currentTheme={theme} onThemeChange={onThemeChange} />
    </div>
  );
};

export default MainTab;
