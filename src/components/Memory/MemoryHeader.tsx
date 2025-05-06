
import React from 'react';

interface MemoryHeaderProps {
  daysSinceStart: number;
}

const MemoryHeader: React.FC<MemoryHeaderProps> = ({ daysSinceStart }) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        Nossas Memórias
      </h2>
      <p className="text-muted-foreground text-sm">
        {daysSinceStart} dias de amor e momentos especiais
      </p>
    </div>
  );
};

export default MemoryHeader;
