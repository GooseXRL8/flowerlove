
import { useState, useEffect } from 'react';
import { Memory } from '@/components/Memory/types';
import { dbMemories } from '@/services/database';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { MemoryFormValues } from '@/components/Memory/MemoryForm';

export const useMemories = (profileId?: string, startDate?: Date) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load memories from database
  useEffect(() => {
    const loadMemories = async () => {
      if (!profileId) {
        setLoading(false);
        return;
      }

      try {
        const loadedMemories = await dbMemories.getByProfileId(profileId);
        console.log("Loaded memories:", loadedMemories);
        setMemories(loadedMemories);
      } catch (error) {
        console.error("Failed to load memories:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar memórias.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadMemories();
  }, [profileId]);

  // Add new memory
  const handleAddMemory = async (data: MemoryFormValues) => {
    if (!profileId) {
      toast({
        title: "Erro",
        description: "Nenhum perfil selecionado.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create new memory object
      const newMemory: Memory = {
        id: uuidv4(),
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        isFavorite: false
      };

      // Save to database
      console.log("Saving memory to profile:", profileId);
      const success = await dbMemories.create(newMemory, profileId);
      
      if (success) {
        // Update local state
        setMemories(prev => [...prev, newMemory]);
        toast({
          title: "Memória adicionada",
          description: "Sua memória foi salva com sucesso."
        });
      } else {
        throw new Error("Failed to save memory");
      }
    } catch (error) {
      console.error("Error adding memory:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a memória.",
        variant: "destructive"
      });
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async (memory: Memory) => {
    if (!profileId) return false;

    try {
      const updatedMemory = { ...memory, isFavorite: !memory.isFavorite };
      const success = await dbMemories.update(updatedMemory, profileId);
      
      if (success) {
        setMemories(prev => 
          prev.map(m => m.id === memory.id ? updatedMemory : m)
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update memory:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a memória.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Delete memory
  const handleDeleteMemory = async (memory: Memory) => {
    if (!profileId) return false;

    try {
      const success = await dbMemories.deleteById(memory.id, profileId);
      
      if (success) {
        setMemories(prev => prev.filter(m => m.id !== memory.id));
        toast({
          title: "Memória excluída",
          description: "A memória foi excluída com sucesso."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete memory:", error);
      toast({
        title: "Erro",
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
};
