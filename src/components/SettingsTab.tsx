
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "@/components/ui/use-toast";

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
  const [newTitle, setNewTitle] = useState(title);
  const [imageUrl, setImageUrl] = useState("");

  const handleTitleSave = () => {
    if (newTitle.trim()) {
      onTitleChange(newTitle);
      toast({
        title: "Título atualizado",
        description: "O título do aplicativo foi alterado com sucesso.",
      });
    }
  };

  const handleImageSave = () => {
    if (imageUrl.trim()) {
      onImageChange(imageUrl);
      setImageUrl("");
      toast({
        title: "Imagem atualizada",
        description: "A imagem principal foi atualizada com sucesso.",
      });
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

      <Card>
        <CardHeader>
          <CardTitle>Título do Aplicativo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="app-title">Título</Label>
            <Input 
              id="app-title" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nosso Amor"
            />
          </div>
          <Button onClick={handleTitleSave}>Salvar Título</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data do Relacionamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="date-picker">Data de início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                  id="date-picker"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: ptBR }) : <span>Escolher data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && onDateChange(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagem Principal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="image-url">URL da imagem</Label>
            <Input 
              id="image-url" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/sua-imagem.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Insira a URL completa de uma imagem online
            </p>
          </div>
          <Button onClick={handleImageSave} className="flex items-center gap-2">
            <Image size={16} />
            <span>Atualizar Imagem</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
