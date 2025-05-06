
import { useState, useEffect } from 'react';
import { Memory } from '@/components/Memory/types';
import { dbMemories } from '@/services/database';
import { toast } from '@/hooks/use-toast';

export function useMemories(profileId: string | undefined, startDate: Date) {
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

  // Function to handle adding new memory
  const handleAddMemory = async (data: any) => {
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
      
      toast({
        title: "Memória excluída",
        description: `"${memoryToDelete.title}" foi removida das suas memórias.`,
      });
      
      return true;
    } catch (error) {
      console.error("Failed to delete memory from database:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a memória.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    memories,
    loading,
    handleAddMemory,
    handleToggleFavorite,
    handleDeleteMemory
  };
}
