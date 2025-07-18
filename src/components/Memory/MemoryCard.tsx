import React from 'react';
import { Memory } from "./types";
import { GlowCard } from "@/components/ui/spotlight-card";
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
    <GlowCard 
      className={cn(
        "w-full transition-all duration-200 hover:shadow-md p-6",
        memory.isFavorite && "border-yellow-500 bg-yellow-50/30 dark:bg-yellow-950/30"
      )}
      glowColor={memory.isFavorite ? "orange" : "purple"}
      customSize
    >
      <div className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="text-lg flex items-center gap-2 font-semibold">
            {memory.title}
            {memory.isFavorite && (
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {memory.date.toLocaleDateString('pt-BR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })} • {timeAgo}
          </p>
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
      </div>
      <div className="pt-4">
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
      </div>
    </GlowCard>
  );
};

export default MemoryCard;