
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface TimeCounterProps {
  startDate: Date;
  onTimeUpdate: (duration: {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
  }) => void;
}

const TimeCounter: React.FC<TimeCounterProps> = ({ startDate, onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0
  });

  useEffect(() => {
    const calculateTimeElapsed = () => {
      const now = new Date();
      let diff = Math.floor((now.getTime() - startDate.getTime()) / 1000); // total seconds
      
      const years = Math.floor(diff / (365 * 24 * 3600));
      diff %= (365 * 24 * 3600);
      
      const months = Math.floor(diff / (30 * 24 * 3600));
      diff %= (30 * 24 * 3600);
      
      const days = Math.floor(diff / (24 * 3600));
      diff %= (24 * 3600);
      
      const hours = Math.floor(diff / 3600);
      diff %= 3600;
      
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      
      setSeconds(seconds);
      const newTimeElapsed = { years, months, days, hours, minutes };
      setTimeElapsed(newTimeElapsed);
      onTimeUpdate(newTimeElapsed);
    };
    
    calculateTimeElapsed();
    const interval = setInterval(calculateTimeElapsed, 1000);
    return () => clearInterval(interval);
  }, [startDate, onTimeUpdate]);
  
  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold mb-4">Tempo de Relacionamento</h2>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        <TimeUnit value={timeElapsed.years} unit="Anos" />
        <TimeUnit value={timeElapsed.months} unit="Meses" />
        <TimeUnit value={timeElapsed.days} unit="Dias" />
        <TimeUnit value={timeElapsed.hours} unit="Horas" />
        <TimeUnit value={timeElapsed.minutes} unit="Min" />
        <TimeUnit value={seconds} unit="Seg" />
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; unit: string }> = ({ value, unit }) => (
  <div className="text-center">
    <div className="text-xl font-bold">{value}</div>
    <div className="text-sm text-gray-400">{unit}</div>
  </div>
);

export default TimeCounter;
