
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface TimeCounterProps {
  startDate: Date;
  onTimeUpdate: (duration: { years: number; months: number; days: number; hours: number; minutes: number; }) => void;
  coupleNames?: { partner1: string; partner2: string; } | null;
}

const TimeCounter: React.FC<TimeCounterProps> = ({ startDate, onTimeUpdate, coupleNames }) => {
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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
      
      // Update parent component with time duration (excluding seconds)
      onTimeUpdate({ years, months, days, hours, minutes });
    };
    
    // Calculate initial time
    calculateTimeElapsed();
    
    // Update time every second
    const interval = setInterval(calculateTimeElapsed, 1000);
    
    return () => clearInterval(interval);
  }, [startDate, onTimeUpdate]);
  
  const heading = coupleNames 
    ? `${coupleNames.partner1} ❤️ ${coupleNames.partner2}` 
    : "Tempo de Amor";
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-md border-2 border-primary/30 bg-gradient-to-b from-background to-accent/50 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 opacity-5">
        <Heart size={120} className="fill-primary text-transparent" />
      </div>
      <CardContent className="py-6 relative z-10">
        <h2 className="text-center font-medium text-xl mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {heading}
        </h2>
        
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          <TimeUnit value={timeElapsed.years} unit="Anos" />
          <TimeUnit value={timeElapsed.months} unit="Meses" />
          <TimeUnit value={timeElapsed.days} unit="Dias" />
          <TimeUnit value={timeElapsed.hours} unit="Horas" />
          <TimeUnit value={timeElapsed.minutes} unit="Minutos" />
          <TimeUnit value={timeElapsed.seconds} unit="Segundos" className="animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};

interface TimeUnitProps {
  value: number;
  unit: string;
  className?: string;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ value, unit, className = "" }) => (
  <div className={`flex flex-col items-center p-2 ${className}`}>
    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
      {value}
    </div>
    <div className="text-xs sm:text-sm text-muted-foreground">{unit}</div>
  </div>
);

export default TimeCounter;
