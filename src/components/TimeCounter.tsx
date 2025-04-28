
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glowing effects background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 rounded-full animate-falling-glow ${
              i % 2 === 0 ? 'bg-rose-400' : 'bg-red-500'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 30 - 40}%`,
              opacity: 0.7,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-primary/20 bg-gradient-to-b from-background to-accent/50 overflow-hidden relative z-10">
        <CardContent className="p-0">
          <div className="w-full">
            <AspectRatio ratio={16/12} className="bg-accent/20">
              <img 
                src="/lovable-uploads/a60a0dbc-45be-4ae8-9b7d-eb2cbc8e133e.png" 
                alt="Couple photo" 
                className="w-full h-full object-cover rounded-t-lg"
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
    </div>
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
