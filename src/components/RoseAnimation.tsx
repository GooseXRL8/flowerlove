
import React, { useEffect, useState } from 'react';
import { Flower2 } from "lucide-react";

interface RoseAnimationProps {
  relationshipDuration: {
    years: number;
    months: number;
    days: number;
  };
}

const RoseAnimation: React.FC<RoseAnimationProps> = ({ relationshipDuration }) => {
  const [growthStage, setGrowthStage] = useState(1);
  const [petals, setPetals] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    // Calculate growth stage based on relationship duration
    const totalDays = relationshipDuration.years * 365 + relationshipDuration.months * 30 + relationshipDuration.days;
    
    // Define growth stages with more detail
    if (totalDays < 30) {
      setGrowthStage(1); // Botão de rosa
    } else if (totalDays < 90) {
      setGrowthStage(2); // Rosa começando a abrir
    } else if (totalDays < 180) {
      setGrowthStage(3); // Rosa semi-aberta
    } else if (totalDays < 365) {
      setGrowthStage(4); // Rosa quase aberta
    } else {
      setGrowthStage(5); // Rosa completamente aberta
    }
    
    // Create petal elements based on growth stage
    const petalCount = Math.min(growthStage * 2, 8);
    const newPetals = [];
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (i * (360 / petalCount)) % 360;
      const delay = i * 0.2;
      const size = 12 + growthStage * 3;
      const distance = growthStage * 3;
      
      newPetals.push(
        <div 
          key={i}
          className="absolute rounded-full bg-love-pink"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            transform: `rotate(${angle}deg) translate(${distance}px) rotate(-${angle}deg)`,
            opacity: 0.8,
            animation: `rose-petal-appear 1s ${delay}s forwards ease-out`
          }}
        />
      );
    }
    
    setPetals(newPetals);
  }, [relationshipDuration, growthStage]);
  
  // Size based on growth stage
  const roseSize = 24 + (growthStage - 1) * 6;
  
  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      <div className="text-center mb-6 text-muted-foreground">
        <span className="font-medium text-lg">Sua rosa está {getGrowthDescription(growthStage)}</span>
      </div>
      
      <div className="relative">
        <div 
          className="relative z-10 animate-flower-grow animate-pulse-slow"
          style={{ 
            animationDelay: '0.3s',
            animationDuration: `${3 + growthStage * 0.5}s` 
          }}
        >
          <Flower2 
            size={roseSize} 
            className={`text-love-${getRoseColor(growthStage)} stroke-[1.5px]`} 
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {petals}
          </div>
        </div>
        
        <div className="h-24 w-1.5 bg-love-green mt-2 rounded-full relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-love-green before:rounded-full before:left-1 before:top-6 before:opacity-60"></div>
      </div>
      
      <div className="mt-8 text-center max-w-sm">
        <p className="text-sm text-muted-foreground italic">
          "Assim como esta rosa, nosso amor cresce e floresce a cada dia..."
        </p>
      </div>
    </div>
  );
};

function getRoseColor(stage: number): string {
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
    case 2: return 'começando a desabrochar';
    case 3: return 'se abrindo para vocês';
    case 4: return 'florescendo com seu amor';
    case 5: return 'em plena floração';
    default: return 'crescendo';
  }
}

export default RoseAnimation;
