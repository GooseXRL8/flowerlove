
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import TimeCounter from '../TimeCounter';
import FlowerAnimation from '../FlowerAnimation';
import ThemeSwitcher from '../ThemeSwitcher';
import DatePicker from '../DatePicker';
import InstagramShareButton from '../InstagramShareButton';
import { formatRelationshipTime } from '@/utils/timeFormatter';

interface MainTabProps {
  startDate: Date;
  theme: 'default' | 'purple' | 'green';
  onThemeChange: (theme: 'default' | 'purple' | 'green') => void;
  onDateChange: (date: Date) => void;
  onTimeUpdate: (duration: { years: number; months: number; days: number; hours: number; minutes: number; }) => void;
  appTitle: string;
  mainImageUrl: string;
}

const MainTab: React.FC<MainTabProps> = ({
  startDate,
  theme,
  onThemeChange,
  onDateChange,
  onTimeUpdate,
  appTitle,
  mainImageUrl
}) => {
  // Initialize relationship duration state
  const [relationshipDuration, setRelationshipDuration] = React.useState({
    years: 0,
    months: 0,
    days: 0
  });
  
  // Update relationship duration when time updates
  const handleTimeUpdate = (duration: { years: number; months: number; days: number; hours: number; minutes: number; }) => {
    // Update the parent component
    onTimeUpdate(duration);
    
    // Update local state for FlowerAnimation
    setRelationshipDuration({
      years: duration.years,
      months: duration.months,
      days: duration.days
    });
  };
  
  return (
    <div className="space-y-8">
      <DatePicker date={startDate} onDateChange={onDateChange} />
      
      <TimeCounter startDate={startDate} onTimeUpdate={handleTimeUpdate} />
      
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <FlowerAnimation relationshipDuration={relationshipDuration} />
        </CardContent>
      </Card>
      
      <ThemeSwitcher currentTheme={theme} onThemeChange={onThemeChange} />
      
      <Card>
        <CardContent className="p-6">
          <InstagramShareButton
            coupleImageUrl={mainImageUrl}
            timeText={formatRelationshipTime(relationshipDuration)}
            appTitle={appTitle}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MainTab;
