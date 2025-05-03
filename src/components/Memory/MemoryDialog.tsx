
import React, { useState } from 'react';
import { Memory } from "./types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface MemoryDialogProps {
  memory: Memory | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFavorite: (memory: Memory) => void;
  onDeleteMemory: (memory: Memory) => void;
}

const MemoryDialog: React.FC<MemoryDialogProps> = ({ 
  memory, 
  isOpen, 
  onOpenChange, 
  onToggleFavorite, 
  onDeleteMemory 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!memory) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{memory.title}</DialogTitle>
            <DialogDescription>
              {memory.date.toLocaleDateString('pt-BR', { 
                day: 'numeric',
                month: 'long', 
                year: 'numeric'
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">Detalhes desta memória:</p>
            <p>{memory.description}</p>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash size={16} />
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
              <Button 
                variant={memory.isFavorite ? "secondary" : "ghost"} 
                className={`flex items-center gap-2 ${memory.isFavorite ? "bg-pink-100 text-pink-700 hover:bg-pink-200" : ""}`}
                onClick={() => onToggleFavorite(memory)}
              >
                <Heart size={16} fill={memory.isFavorite ? "currentColor" : "none"} />
                <span>{memory.isFavorite ? "Favoritado" : "Favoritar"}</span>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Esta memória será permanentemente excluída
              dos seus registros.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDeleteMemory(memory);
                setIsDeleteDialogOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MemoryDialog;
