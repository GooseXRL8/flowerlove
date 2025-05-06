
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Memory } from "./Memory/types";
import MemoryCard from "./Memory/MemoryCard";
import MemoryDialog from "./Memory/MemoryDialog";
import { useMemories } from "@/hooks/useMemories";
import MemoryHeader from "./Memory/MemoryHeader";
import MemoryAddButton from "./Memory/MemoryAddButton";
import { MemoryFormValues } from "./Memory/MemoryForm";

interface MemorialsTabProps {
  startDate: Date;
}

const MemorialsTab: React.FC<MemorialsTabProps> = ({ startDate }) => {
  // Get profile ID from URL
  const { profileId } = useParams<{ profileId: string }>();
  
  // Calculate how many days since the relationship started
  const daysSinceStart = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  
  // State for selected memory for dialog
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use our memory hook
  const { 
    memories, 
    loading, 
    handleAddMemory, 
    handleToggleFavorite, 
    handleDeleteMemory 
  } = useMemories(profileId, startDate);

  // Function to handle "Relembrar" button click
  const handleRememberClick = (memory: Memory) => {
    setSelectedMemory(memory);
    setIsDialogOpen(true);
  };

  // Function to handle deleting memory and closing dialog
  const handleDeleteAndCloseDialog = async (memory: Memory) => {
    const success = await handleDeleteMemory(memory);
    if (success) {
      setIsDialogOpen(false);
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
      <MemoryHeader daysSinceStart={daysSinceStart} />

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
      
      <MemoryAddButton onAddMemory={handleAddMemory as (data: MemoryFormValues) => Promise<void>} />
      
      <MemoryDialog 
        memory={selectedMemory} 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onToggleFavorite={handleToggleFavorite}
        onDeleteMemory={handleDeleteAndCloseDialog}
      />
    </div>
  );
};

export default MemorialsTab;
