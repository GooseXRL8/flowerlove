import React, { useState, useEffect } from 'react';
import { GlowCard } from "@/components/ui/spotlight-card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getWeddingAnniversaryName } from '@/utils/weddingAnniversary';
import { useParams } from 'react-router-dom';

interface TimeCounterProps {
  startDate: Date;
  onTimeUpdate: (duration: { years: number; months: number; days: number; hours: number; minutes: number; }) => void;
  mainImageUrl: string;
}

const TimeCounter: React.FC<TimeCounterProps> = ({ startDate, onTimeUpdate, mainImageUrl }) => {
  const { profileId } = useParams<{ profileId: string }>();
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [anniversaryName, setAnniversaryName] = useState<string>("Namoro");

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

  
  return (
    <GlowCard 
      glowColor="red" 
      customSize 
      className="w-full max-w-md mx-auto shadow-romantic border-2 border-primary/20 overflow-hidden animate-fade-in p-0"
    >
      <div className="w-full relative">
        <AspectRatio ratio={16/12} className="bg-secondary/20">
          <img 
            key={mainImageUrl} // Force re-render when URL changes
            src={mainImageUrl || "/lovable-uploads/7257428d-662d-455e-9541-5f4a07cc87c2.png"} 
            alt="Couple photo" 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              // If image fails to load, revert to default
              const target = e.target as HTMLImageElement;
              target.src = "/lovable-uploads/7257428d-662d-455e-9541-5f4a07cc87c2.png";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </AspectRatio>
      </div>
      
      <div className="py-8 px-6 bg-gradient-to-b from-card to-secondary/10">
        <h2 className="text-center font-romantic text-2xl mb-6 text-primary animate-pulse-soft">
          💕 Tempo de Relacionamento 💕
        </h2>
        
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          <TimeUnit value={timeElapsed.years} unit="Anos" />
          <TimeUnit value={timeElapsed.months} unit="Meses" />
          <TimeUnit value={timeElapsed.days} unit="Dias" />
          <TimeUnit value={timeElapsed.hours} unit="Horas" />
          <TimeUnit value={timeElapsed.minutes} unit="Minutos" />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-lg font-romantic text-primary/80">{anniversaryName}</p>
        </div>
      </div>
    </GlowCard>
  );
};

interface TimeUnitProps {
  value: number;
  unit: string;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ value, unit }) => (
  <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-xl shadow-soft hover:shadow-card transition-all duration-300 hover:scale-105 animate-float">
    <div className="text-xl sm:text-3xl font-bold text-primary animate-heart-beat">{value}</div>
    <div className="text-xs sm:text-sm text-muted-foreground font-medium">{unit}</div>
  </div>
);

export default TimeCounter;
