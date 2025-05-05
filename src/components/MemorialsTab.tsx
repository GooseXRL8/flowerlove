
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Memory } from "./Memory/types";
import MemoryCard from "./Memory/MemoryCard";
import MemoryDialog from "./Memory/MemoryDialog";
import MemoryForm, { MemoryFormValues } from "./Memory/MemoryForm";
import { dbMemories } from '@/services/database';
import { useParams } from 'react-router-dom';

interface MemorialsTabProps {
  startDate: Date;
}

const MemorialsTab: React.FC<MemorialsTabProps> = ({ startDate }) => {
  // Get profile ID from URL
  const { profileId } = useParams<{ profileId: string }>();
  
  // Calculate how many days since the relationship started
  const daysSinceStart = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  
  // State for memories
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load memories from database on component mount
  useEffect(() => {
    const loadMemories = async () => {
      if (!profileId) return;
      
      try {
        setLoading(true);
        const loadedMemories = await dbMemories.getByProfileId(profileId);
        
        if (loadedMemories.length > 0) {
          setMemories(loadedMemories);
        } else {
          // If no memories in database, initialize with defaults
          initializeDefaultMemories();
        }
      } catch (error) {
        console.error("Failed to load memories from database:", error);
        // If there's an error loading, initialize with default memories
        initializeDefaultMemories();
      } finally {
        setLoading(false);
      }
    };
    
    loadMemories();
  }, [profileId, startDate]);
  
  // Function to initialize default memories
  const initializeDefaultMemories = async () => {
    if (!profileId) return;
    
    const defaultMemories = [
      {
        id: '1',
        title: "Primeiro Encontro",
        description: "O dia em que nos conhecemos pessoalmente pela primeira vez.",
        date: new Date(startDate.getTime()),
        isFavorite: false,
      },
      {
        id: '2',
        title: "Primeira Viagem Juntos",
        description: "Nossa primeira aventura viajando juntos.",
        date: new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days after start
        isFavorite: false,
      }
    ];
    
    try {
      // Save default memories to database
      for (const memory of defaultMemories) {
        await dbMemories.create(memory, profileId);
      }
      
      setMemories(defaultMemories);
    } catch (error) {
      console.error("Failed to save default memories to database:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas memórias.",
      });
    }
  };

  // State for selected memory for dialog
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // For responsive drawer/dialog
  const isMobile = useIsMobile();

  // Function to handle "Relembrar" button click
  const handleRememberClick = (memory: Memory) => {
    setSelectedMemory(memory);
    setIsDialogOpen(true);
  };

  // Function to handle adding new memory
  const handleAddMemory = async (data: MemoryFormValues) => {
    if (!profileId) return;
    
    const newMemory: Memory = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      isFavorite: false,
    };
    
    try {
      // Save to database
      await dbMemories.create(newMemory, profileId);
      
      // Update state
      setMemories(prev => [...prev, newMemory]);
      
      toast({
        title: "Memória adicionada",
        description: `"${data.title}" foi adicionada às suas memórias.`,
      });
    } catch (error) {
      console.error("Failed to save memory to database:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a memória.",
        variant: "destructive"
      });
    }
  };
  
  // Function to toggle favorite status of a memory
  const handleToggleFavorite = async (memory: Memory) => {
    if (!profileId) return;
    
    const updatedMemory = { ...memory, isFavorite: !memory.isFavorite };
    
    try {
      // Update in database
      await dbMemories.update(updatedMemory, profileId);
      
      // Update state
      const updatedMemories = memories.map((item) => 
        item.id === memory.id ? updatedMemory : item
      );
      
      setMemories(updatedMemories);
      
      toast({
        title: updatedMemory.isFavorite ? "Memória favoritada" : "Memória desfavoritada",
        description: `"${updatedMemory.title}" foi ${updatedMemory.isFavorite ? 'adicionada aos' : 'removida dos'} favoritos.`,
      });
    } catch (error) {
      console.error("Failed to update memory in database:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a memória.",
        variant: "destructive"
      });
    }
  };
  
  // Function to delete a memory
  const handleDeleteMemory = async (memoryToDelete: Memory) => {
    if (!profileId) return;
    
    try {
      // Delete from database
      await dbMemories.deleteById(memoryToDelete.id, profileId);
      
      // Update state
      setMemories(prev => prev.filter(memory => memory.id !== memoryToDelete.id));
      setIsDialogOpen(false);
      
      toast({
        title: "Memória excluída",
        description: `"${memoryToDelete.title}" foi removida das suas memórias.`,
      });
    } catch (error) {
      console.error("Failed to delete memory from database:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a memória.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Carregando memórias...</p>
      </div>
    );
  }

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

      {memories.length === 0 ? (
        <div className="text-center p-6 border rounded-lg">
          <p className="text-muted-foreground">Nenhuma memória encontrada. Adicione sua primeira memória!</p>
        </div>
      ) : (
        memories.map((memory) => (
          <MemoryCard 
            key={memory.id} 
            memory={memory} 
            onRememberClick={handleRememberClick} 
          />
        ))
      )}
      
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
              <MemoryForm onSubmit={handleAddMemory} />
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
                <MemoryForm onSubmit={handleAddMemory} />
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
      
      <MemoryDialog 
        memory={selectedMemory} 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onToggleFavorite={handleToggleFavorite}
        onDeleteMemory={handleDeleteMemory}
      />
    </div>
  );
};

export default MemorialsTab;
