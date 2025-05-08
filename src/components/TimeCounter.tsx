
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getWeddingAnniversaryName } from '@/utils/weddingAnniversary';

interface TimeCounterProps {
  startDate: Date;
  onTimeUpdate: (duration: { years: number; months: number; days: number; hours: number; minutes: number; }) => void;
}

const TimeCounter: React.FC<TimeCounterProps> = ({ startDate, onTimeUpdate }) => {
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [anniversaryName, setAnniversaryName] = useState<string>("Namoro");
  const [mainImageUrl, setMainImageUrl] = useState<string>("/lovable-uploads/7257428d-662d-455e-9541-5f4a07cc87c2.png");

  useEffect(() => {
    // Get saved image URL from localStorage
    const savedImageUrl = localStorage.getItem('mainImageUrl');
    if (savedImageUrl) {
      setMainImageUrl(savedImageUrl);
    }
  }, []);

  useEffect(() => {
    const calculateTimeElapsed = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      // Calculate years, months, days, hours, minutes, seconds
      const seconds = Math.floor(diff / 1000) % 60;
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      
      // Use a more accurate calculation for years, months, days
      let startDateCopy = new Date(startDate);
      let years = 0, months = 0, days = 0;
      
      // Calculate years
      while (true) {
        const nextYear = new Date(startDateCopy);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        if (nextYear > now) break;
        startDateCopy = nextYear;
        years++;
      }
      
      // Calculate months
      while (true) {
        const nextMonth = new Date(startDateCopy);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        if (nextMonth > now) break;
        startDateCopy = nextMonth;
        months++;
      }
      
      // Calculate days
      while (true) {
        const nextDay = new Date(startDateCopy);
        nextDay.setDate(nextDay.getDate() + 1);
        if (nextDay > now) break;
        startDateCopy = nextDay;
        days++;
      }
      
      const newTimeElapsed = { years, months, days, hours, minutes, seconds };
      setTimeElapsed(newTimeElapsed);
      
      // Get anniversary name based on years and months
      // Se for menos de 1 ano, usar meses; caso contrário, usar anos
      const monthsForAnniversary = years === 0 ? months : 0;
      const anniversary = getWeddingAnniversaryName(years, monthsForAnniversary);
      setAnniversaryName(anniversary);
      
      // Update parent component with time duration (excluding seconds)
      onTimeUpdate({ years, months, days, hours, minutes });
    };
    
    // Calculate initial time
    calculateTimeElapsed();
    
    // Update time every second
    const interval = setInterval(calculateTimeElapsed, 1000);
    
    return () => clearInterval(interval);
  }, [startDate, onTimeUpdate]);

  // Listen for storage events to update the image when changed from settings
  useEffect(() => {
    const handleStorageChange = () => {
      const savedImageUrl = localStorage.getItem('mainImageUrl');
      if (savedImageUrl) {
        setMainImageUrl(savedImageUrl);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-primary/20 bg-gradient-to-b from-background to-accent/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="w-full">
          <AspectRatio ratio={16/12} className="bg-accent/20">
            <img 
              src={mainImageUrl} 
              alt="Couple photo" 
              className="w-full h-full object-cover rounded-t-lg"
              onError={(e) => {
                // If image fails to load, revert to default
                const target = e.target as HTMLImageElement;
                target.src = "/lovable-uploads/7257428d-662d-455e-9541-5f4a07cc87c2.png";
              }}
            />
          </AspectRatio>
        </div>
        
        <div className="py-6 px-4">
          <h2 className="text-center font-medium text-lg mb-4 text-foreground">Tempo de Relacionamento</h2>
          
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            <TimeUnit value={timeElapsed.years} unit="Anos" />
            <TimeUnit value={timeElapsed.months} unit="Meses" />
            <TimeUnit value={timeElapsed.days} unit="Dias" />
            <TimeUnit value={timeElapsed.hours} unit="Horas" />
            <TimeUnit value={timeElapsed.minutes} unit="Minutos" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface TimeUnitProps {
  value: number;
  unit: string;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ value, unit }) => (
  <div className="flex flex-col items-center p-2">
    <div className="text-xl sm:text-2xl font-bold text-primary">{value}</div>
    <div className="text-xs sm:text-sm text-muted-foreground">{unit}</div>
  </div>
);

export default TimeCounter;
