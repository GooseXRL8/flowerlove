
import React, { useEffect, useState } from 'react';
import { Flower2 } from "lucide-react";

interface FlowerAnimationProps {
  relationshipDuration: {
    years: number;
    months: number;
    days: number;
  };
}

const FlowerAnimation: React.FC<FlowerAnimationProps> = ({ relationshipDuration }) => {
  const [growthStage, setGrowthStage] = useState(1);
  
  useEffect(() => {
    // Calculate growth stage based on relationship duration
    const totalDays = relationshipDuration.years * 365 + relationshipDuration.months * 30 + relationshipDuration.days;
    
    // Define growth stages:
    // Stage 1: < 30 days (1 month)
    // Stage 2: 30-90 days (1-3 months)
    // Stage 3: 91-365 days (3 months-1 year)
    // Stage 4: 366-730 days (1-2 years)
    // Stage 5: > 730 days (>2 years)
    
    if (totalDays < 30) {
      setGrowthStage(1);
    } else if (totalDays < 90) {
      setGrowthStage(2);
    } else if (totalDays < 365) {
      setGrowthStage(3);
    } else if (totalDays < 730) {
      setGrowthStage(4);
    } else {
      setGrowthStage(5);
    }
  }, [relationshipDuration]);
  
  // Size based on growth stage
  const flowerSize = 24 + (growthStage - 1) * 6;
  
  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      <div className="text-center mb-4 text-muted-foreground">
        <span className="font-medium">Seu amor está {getGrowthDescription(growthStage)}</span>
      </div>
      
      <div 
        className="animate-flower-grow animate-pulse-slow"
        style={{ 
          animationDelay: '0.3s',
          animationDuration: `${3 + growthStage * 0.5}s` 
        }}
      >
        <Flower2 
          size={flowerSize} 
          className={`text-love-${getFlowerColor(growthStage)} stroke-[1.5px]`} 
        />
      </div>
      
      <div className="h-20 w-1 bg-love-green mt-2 rounded-full"></div>
    </div>
  );
};

function getFlowerColor(stage: number): string {
  switch(stage) {
    case 1: return 'light-pink';
    case 2: return 'pink';
    case 3: return 'light-purple';
    case 4: return 'purple';
    case 5: return 'purple';
    default: return 'pink';
  }
}

function getGrowthDescription(stage: number): string {
  switch(stage) {
    case 1: return 'brotando';
    case 2: return 'crescendo';
    case 3: return 'florescendo';
    case 4: return 'em plena floração';
    case 5: return 'completamente florescido';
    default: return 'crescendo';
  }
}

export default FlowerAnimation;
