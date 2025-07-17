import { useState, useEffect } from 'react';
import { supabaseProfilePhotos, ProfilePhoto } from '@/services/supabase/profilePhotos';
import { toast } from '@/hooks/use-toast';

export const useProfilePhotos = (userId?: string) => {
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  // Load photos from database
  useEffect(() => {
    const loadPhotos = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const [loadedPhotos, photoCount] = await Promise.all([
          supabaseProfilePhotos.getByUserId(userId),
          supabaseProfilePhotos.countByUserId(userId)
        ]);
        
        setPhotos(loadedPhotos);
        setCount(photoCount);
      } catch (error) {
        console.error("Failed to load photos:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar fotos.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [userId]);

  // Add new photo
  const addPhoto = async (url: string) => {
    if (!userId) {
      toast({
        title: "Erro",
        description: "Usuário não identificado.",
        variant: "destructive"
      });
      return false;
    }

    if (count >= 5) {
      toast({
        title: "Limite atingido",
        description: "Máximo de 5 fotos por perfil.",
        variant: "destructive"
      });
      return false;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const success = await supabaseProfilePhotos.create({
        url,
        user_id: userId
      });

      if (success) {
        // Reload photos to get the new one
        const [updatedPhotos, updatedCount] = await Promise.all([
          supabaseProfilePhotos.getByUserId(userId),
          supabaseProfilePhotos.countByUserId(userId)
        ]);
        
        setPhotos(updatedPhotos);
        setCount(updatedCount);
        
        toast({
          title: "Foto adicionada",
          description: "Sua foto foi salva com sucesso."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding photo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a foto.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Delete photo
  const deletePhoto = async (photoId: string) => {
    try {
      const success = await supabaseProfilePhotos.deleteById(photoId);

      if (success) {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
        setCount(prev => prev - 1);
        
        toast({
          title: "Foto removida",
          description: "A foto foi removida com sucesso."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a foto.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    photos,
    loading,
    count,
    maxPhotos: 5,
    canAddMore: count < 5,
    addPhoto,
    deletePhoto
  };
};