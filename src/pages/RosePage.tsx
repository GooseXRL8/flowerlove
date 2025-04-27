
import React from 'react';
import Layout from '@/components/Layout';
import RoseAnimation from '@/components/RoseAnimation';
import { useParams } from 'react-router-dom';

const RosePage: React.FC<{ duration: { years: number; months: number; days: number; hours: number; minutes: number; } }> = ({ duration }) => {
  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          A Rosa do Amor
        </h1>
        
        <div className="prose dark:prose-invert prose-pink mx-auto mb-8">
          <p className="text-lg text-center text-muted-foreground">
            Um símbolo vivo do crescimento do seu amor ao longo do tempo
          </p>
        </div>
        
        <div className="flex justify-center items-center py-12">
          <RoseAnimation relationshipDuration={duration} />
        </div>
        
        <div className="mt-12">
          <h2 className="text-xl font-medium mb-4 text-center">Os estágios da Rosa</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-primary/20 rounded-lg">
              <p className="font-medium text-primary mb-2">Primeiros Dias</p>
              <p className="text-sm text-muted-foreground">Um botão delicado, contendo todo o potencial de um amor que está começando</p>
            </div>
            
            <div className="text-center p-4 border border-primary/20 rounded-lg">
              <p className="font-medium text-primary mb-2">Meses Juntos</p>
              <p className="text-sm text-muted-foreground">As pétalas começam a se abrir, revelando a beleza que cresce a cada novo dia</p>
            </div>
            
            <div className="text-center p-4 border border-primary/20 rounded-lg">
              <p className="font-medium text-primary mb-2">Anos de Amor</p>
              <p className="text-sm text-muted-foreground">Uma rosa em plena floração, exibindo todas as suas cores e beleza</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RosePage;
