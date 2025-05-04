
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

interface MemorialsTabProps {
  startDate: Date;
}

const MemorialsTab: React.FC<MemorialsTabProps> = ({ startDate }) => {
  // Calculate how many days since the relationship started
  const daysSinceStart = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  
  // State for memories
  const [memories, setMemories] = useState<Memory[]>([]);
  
  // Load memories from localStorage on component mount
  useEffect(() => {
    const savedMemories = localStorage.getItem('memories');
    if (savedMemories) {
      try {
        // Parse the JSON string and convert date strings back to Date objects
        const parsedMemories = JSON.parse(savedMemories).map((memory: any) => ({
          ...memory,
          date: new Date(memory.date)
        }));
        setMemories(parsedMemories);
      } catch (error) {
        console.error("Failed to parse memories from localStorage:", error);
        // If there's an error parsing, initialize with default memories
        initializeDefaultMemories();
      }
    } else {
      // If no memories in localStorage, initialize with defaults
      initializeDefaultMemories();
    }
  }, [startDate]);
  
  // Function to initialize default memories
  const initializeDefaultMemories = () => {
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
    
    setMemories(defaultMemories);
    saveMemoriesToLocalStorage(defaultMemories);
  };

  // Function to save memories to localStorage
  const saveMemoriesToLocalStorage = (memoriesToSave: Memory[]) => {
    try {
      localStorage.setItem('memories', JSON.stringify(memoriesToSave));
    } catch (error) {
      console.error("Failed to save memories to localStorage:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas memórias localmente.",
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
  const handleAddMemory = (data: MemoryFormValues) => {
    const newMemory: Memory = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      isFavorite: false,
    };
    
    const updatedMemories = [...memories, newMemory];
    setMemories(updatedMemories);
    saveMemoriesToLocalStorage(updatedMemories);
    
    toast({
      title: "Memória adicionada",
      description: `"${data.title}" foi adicionada às suas memórias.`,
    });
  };
  
  // Function to toggle favorite status of a memory
  const handleToggleFavorite = (memory: Memory) => {
    const updatedMemories = memories.map((item) => 
      item.id === memory.id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    
    setMemories(updatedMemories);
    saveMemoriesToLocalStorage(updatedMemories);
    
    // Find the updated memory to show appropriate toast message
    const updatedMemory = updatedMemories.find(item => item.id === memory.id);
    if (updatedMemory) {
      toast({
        title: updatedMemory.isFavorite ? "Memória favoritada" : "Memória desfavoritada",
        description: `"${updatedMemory.title}" foi ${updatedMemory.isFavorite ? 'adicionada aos' : 'removida dos'} favoritos.`,
      });
    }
  };
  
  // Function to delete a memory
  const handleDeleteMemory = (memoryToDelete: Memory) => {
    const filteredMemories = memories.filter(memory => memory.id !== memoryToDelete.id);
    setMemories(filteredMemories);
    saveMemoriesToLocalStorage(filteredMemories);
    
    setIsDialogOpen(false);
    
    toast({
      title: "Memória excluída",
      description: `"${memoryToDelete.title}" foi removida das suas memórias.`,
    });
  };

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

      {memories.map((memory) => (
        <MemoryCard 
          key={memory.id} 
          memory={memory} 
          onRememberClick={handleRememberClick} 
        />
      ))}
      
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
