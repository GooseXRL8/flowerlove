
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface MemorialsTabProps {
  startDate: Date;
}

const MemorialsTab: React.FC<MemorialsTabProps> = ({ startDate }) => {
  // Calculate how many days since the relationship started
  const daysSinceStart = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  
  // Example memories (placeholder data)
  const memories = [
    {
      title: "Primeiro Encontro",
      description: "O dia em que nos conhecemos pessoalmente pela primeira vez.",
      date: new Date(startDate.getTime()),
    },
    {
      title: "Primeira Viagem Juntos",
      description: "Nossa primeira aventura viajando juntos.",
      date: new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days after start
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Nossas Memórias
        </h2>
        <p className="text-muted-foreground text-sm">
          {daysSinceStart} dias de amor e momentos especiais
        </p>
      </div>

      {memories.map((memory, index) => (
        <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>{memory.title}</CardTitle>
            <CardDescription>
              {memory.date.toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{memory.description}</p>
          </CardContent>
          <CardFooter className="flex justify-end bg-muted/20">
            <Button variant="ghost" size="sm" className="text-primary">
              <Heart size={16} className="mr-2" />
              Relembrar
            </Button>
          </CardFooter>
        </Card>
      ))}
      
      <div className="text-center pt-4">
        <Button variant="outline" size="sm">
          Adicionar memória
        </Button>
      </div>
    </div>
  );
};

export default MemorialsTab;
