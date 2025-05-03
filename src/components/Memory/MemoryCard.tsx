
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Memory } from "./types";

interface MemoryCardProps {
  memory: Memory;
  onRememberClick: (memory: Memory) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onRememberClick }) => {
  return (
    <Card key={memory.id} className="overflow-hidden transition-all hover:shadow-md">
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
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary"
          onClick={() => onRememberClick(memory)}
        >
          <BookOpen size={16} className="mr-2" />
          Relembrar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemoryCard;
