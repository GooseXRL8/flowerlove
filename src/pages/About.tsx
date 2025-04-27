
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar, Flower2, Settings } from "lucide-react";

const About: React.FC = () => {
  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Sobre Nosso Amor
        </h1>
        
        <div className="prose dark:prose-invert prose-pink mx-auto mb-8">
          <p className="text-lg text-center text-muted-foreground">
            Uma celebração digital do amor de vocês, onde cada segundo juntos é valorizado.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <FeatureCard 
            icon={<Calendar className="h-6 w-6 text-primary" />}
            title="Contador de Tempo"
            description="Celebre cada segundo, minuto, hora, dia, mês e ano do seu relacionamento com nosso contador preciso em tempo real."
          />
          
          <FeatureCard 
            icon={<Flower2 className="h-6 w-6 text-primary" />}
            title="Rosa do Amor"
            description="Veja seu amor florescer visualmente com nossa rosa que cresce junto com o tempo do seu relacionamento."
          />
          
          <FeatureCard 
            icon={<Heart className="h-6 w-6 text-primary" />}
            title="Personalização"
            description="Torne a experiência única adicionando os nomes do casal e vendo-os exibidos no contador."
          />
          
          <FeatureCard 
            icon={<Settings className="h-6 w-6 text-primary" />}
            title="Temas Personalizados"
            description="Escolha entre diferentes temas de cores que combinam com a personalidade do seu relacionamento."
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Nossa História</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              "Nosso Amor" nasceu da ideia de que cada momento em um relacionamento é precioso e merece ser celebrado. Inspirado pela beleza do amor e pelo site iLavaYou, criamos uma experiência digital para casais acompanharem o crescimento do seu relacionamento.
            </p>
            <p className="text-muted-foreground mb-4">
              A rosa que cresce simboliza o amor que floresce com o tempo, enquanto o contador preciso registra cada segundo dessa jornada juntos.
            </p>
            <p className="text-muted-foreground">
              Esperamos que esta ferramenta ajude a tornar sua história de amor ainda mais especial, criando um espaço digital para celebrar cada momento compartilhado.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card className="hover:shadow-md transition-shadow border-primary/20">
    <CardContent className="flex flex-col items-center text-center p-6">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default About;
