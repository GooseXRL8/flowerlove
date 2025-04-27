
import React from 'react';
import Layout from '@/components/Layout';
import TimeCounter from '@/components/TimeCounter';

interface CounterPageProps {
  startDate: Date;
  onTimeUpdate: (duration: { years: number; months: number; days: number; hours: number; minutes: number; }) => void;
  coupleNames: { partner1: string; partner2: string; } | null;
}

const CounterPage: React.FC<CounterPageProps> = ({ startDate, onTimeUpdate, coupleNames }) => {
  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Contador de Tempo
        </h1>
        
        <div className="prose dark:prose-invert prose-pink mx-auto mb-8">
          <p className="text-lg text-center text-muted-foreground">
            Celebrando cada segundo do amor de vocês
          </p>
        </div>
        
        <div className="my-8">
          <TimeCounter 
            startDate={startDate} 
            onTimeUpdate={onTimeUpdate} 
            coupleNames={coupleNames} 
          />
        </div>
        
        <div className="mt-12 text-center">
          <h3 className="text-xl font-medium mb-4">Marcos Importantes</h3>
          <p className="text-muted-foreground mb-8">
            A jornada de vocês começou em {startDate.toLocaleDateString('pt-BR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MilestoneCard title="Primeiro Mês" description="O início de tudo" />
            <MilestoneCard title="100 Dias" description="Um centena de dias juntos" />
            <MilestoneCard title="Primeiro Ano" description="365 dias de amor" />
            <MilestoneCard title="Para Sempre" description="Um amor sem fim" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface MilestoneCardProps {
  title: string;
  description: string;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ title, description }) => (
  <div className="border border-primary/20 rounded-lg p-4 bg-background/50 hover:shadow-md transition-shadow">
    <h4 className="font-medium text-primary mb-1">{title}</h4>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
);

export default CounterPage;
