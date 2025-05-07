
import { useState, useEffect } from 'react';
import { Memory } from '@/components/Memory/types';
import { dbMemories } from '@/services/database';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export function useMemories(profileId: string | undefined, startDate: Date) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load memories from database on component mount
  useEffect(() => {
    const loadMemories = async () => {
      if (!profileId) return;
      
      try {
        setLoading(true);
        console.log("Loading memories for profileId:", profileId);
        const loadedMemories = await dbMemories.getByProfileId(profileId);
        console.log("Loaded memories:", loadedMemories);
        
        setMemories(loadedMemories);
      } catch (error) {
        console.error("Failed to load memories from database:", error);
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar suas memórias.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadMemories();
  }, [profileId]);

  // Function to handle adding new memory
  const handleAddMemory = async (data: any) => {
    if (!profileId) {
      console.error("No profileId provided");
      return;
    }
    
    const newMemory: Memory = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      isFavorite: false,
    };
    
    console.log("Adding new memory:", newMemory, "for profileId:", profileId);
    
    try {
      // Save to database
      const success = await dbMemories.create(newMemory, profileId);
      
      if (!success) {
        throw new Error("Failed to save memory to database");
      }
      
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
      const success = await dbMemories.update(updatedMemory, profileId);
      
      if (!success) {
        throw new Error("Failed to update memory in database");
      }
      
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
    if (!profileId) return false;
    
    console.log("Deleting memory:", memoryToDelete.id, "from profileId:", profileId);
    
    try {
      // Delete from database
      const success = await dbMemories.deleteById(memoryToDelete.id, profileId);
      
      if (!success) {
        throw new Error("Failed to delete memory from database");
      }
      
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
