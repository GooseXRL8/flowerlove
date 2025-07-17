import React from 'react';
import { Memory } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Star, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoryCardProps {
  memory: Memory;
  onRememberClick: (memory: Memory) => void;
  onToggleFavorite?: (memory: Memory) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onRememberClick, onToggleFavorite }) => {
  const timeAgo = formatDistanceToNow(memory.date, { 
    addSuffix: true, 
    locale: ptBR 
  });

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(memory);
    }
  };

  return (
    <Card className={cn(
      "w-full transition-all duration-200 hover:shadow-md",
      memory.isFavorite && "border-yellow-500 bg-yellow-50/30 dark:bg-yellow-950/30"
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            {memory.title}
            {memory.isFavorite && (
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            )}
          </CardTitle>
          <CardDescription>
            {memory.date.toLocaleDateString('pt-BR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })} • {timeAgo}
          </CardDescription>
        </div>
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className="h-8 w-8 p-0"
            title={memory.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Star 
              className={cn(
                "h-4 w-4 transition-colors",
                memory.isFavorite 
                  ? "fill-yellow-500 text-yellow-500" 
                  : "text-muted-foreground hover:text-yellow-500"
              )} 
            />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {memory.description}
        </p>
        <Button 
          onClick={() => onRememberClick(memory)}
          variant="outline"
          size="sm"
          className="text-primary"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Relembrar
        </Button>
      </CardContent>
    </Card>
  );
};

export default MemoryCard;