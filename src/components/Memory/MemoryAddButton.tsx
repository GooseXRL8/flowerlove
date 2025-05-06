
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import MemoryForm, { MemoryFormValues } from "./MemoryForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface MemoryAddButtonProps {
  onAddMemory: (data: MemoryFormValues) => Promise<void>;
}

const MemoryAddButton: React.FC<MemoryAddButtonProps> = ({ onAddMemory }) => {
  const isMobile = useIsMobile();

  return (
    <div className="text-center pt-4">
      {!isMobile ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Plus size={16} />
              Adicionar memória
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar nova memória</DialogTitle>
              <DialogDescription>
                Registre um momento especial que vocês compartilharam juntos.
              </DialogDescription>
            </DialogHeader>
            <MemoryForm onSubmit={onAddMemory} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Plus size={16} />
              Adicionar memória
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Adicionar nova memória</DrawerTitle>
              <DrawerDescription>
                Registre um momento especial que vocês compartilharam juntos.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <MemoryForm onSubmit={onAddMemory} />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default MemoryAddButton;
