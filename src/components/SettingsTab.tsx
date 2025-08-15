
import React, { useState } from 'react';
import { GlowCard } from "@/components/ui/spotlight-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Image } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import ProfilePhotosGallery from "@/components/ProfilePhotosGallery";
import { useAuth } from '@/hooks/useAuth/AuthContext';

interface SettingsTabProps {
  title: string;
  startDate: Date;
  onTitleChange: (title: string) => void;
  onDateChange: (date: Date) => void;
  onImageChange: (imageUrl: string) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  title,
  startDate,
  onTitleChange,
  onDateChange,
  onImageChange
}) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const { currentUser } = useAuth();

  const handleImageUpdate = async () => {
    if (newImageUrl.trim()) {
      try {
        await onImageChange(newImageUrl);
        setNewImageUrl("");
      } catch (error) {
        console.error("Erro ao atualizar imagem:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Configurações
        </h2>
        <p className="text-muted-foreground text-sm">
          Personalize o aplicativo conforme suas preferências
        </p>
      </div>

      <GlowCard glowColor="blue" customSize className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Configurações do Perfil</h3>
        </div>
        <div className="space-y-4">
          {/* App Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título do App</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Digite o título do seu app"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>Data de Início do Relacionamento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && onDateChange(date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem Principal</Label>
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Cole a URL da imagem aqui"
              />
              <Button 
                onClick={handleImageUpdate}
                disabled={!newImageUrl.trim()}
                size="sm"
                type="button"
              >
                <Image className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Profile Photos Gallery */}
      {currentUser && (
        <ProfilePhotosGallery 
          userId={currentUser.id} 
          className="w-full"
        />
      )}
    </div>
  );
};

export default SettingsTab;
