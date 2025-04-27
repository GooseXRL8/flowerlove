
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CoupleNameFormProps {
  onNamesSet: (names: { partner1: string; partner2: string }) => void;
  initialNames?: { partner1: string; partner2: string } | null;
}

const CoupleNameForm: React.FC<CoupleNameFormProps> = ({ onNamesSet, initialNames }) => {
  const [partner1, setPartner1] = useState(initialNames?.partner1 || '');
  const [partner2, setPartner2] = useState(initialNames?.partner2 || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (partner1.trim() && partner2.trim()) {
      onNamesSet({ partner1: partner1.trim(), partner2: partner2.trim() });
      toast({
        title: "Nomes salvos",
        description: "Os nomes do casal foram salvos com sucesso.",
      });
    } else {
      toast({
        title: "Por favor, preencha os dois nomes",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <Heart className="h-4 w-4 text-primary" />
          <span>Personalize com seus nomes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="partner1" className="text-sm text-muted-foreground">
                Primeiro nome
              </label>
              <Input
                id="partner1"
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                placeholder="Ex: Maria"
                className="border-primary/30 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="partner2" className="text-sm text-muted-foreground">
                Segundo nome
              </label>
              <Input
                id="partner2"
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                placeholder="Ex: João"
                className="border-primary/30 focus:border-primary"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Salvar nomes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CoupleNameForm;
