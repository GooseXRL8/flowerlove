import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type Theme = 'default' | 'purple' | 'green';

export function useProfileData() {
  const { profileId } = useParams<{ profileId: string }>();
  const { profiles, updateProfile } = useAuth();
  
  // Find current profile
  const currentProfile = profiles.find(p => p.id === profileId);
  
  // Initialize state with profile data or defaults
  const [profileData, setProfileData] = useState({
    theme: 'default' as Theme,
    appTitle: currentProfile?.customTitle || "Nosso Amor",
    mainImageUrl: currentProfile?.imageUrl || "/lovable-uploads/7257428d-662d-455e-9541-5f4a07cc87c2.png",
    startDate: currentProfile?.startDate || new Date(2024, 8, 7),
  });

  // Load theme from localStorage
  useEffect(() => {
    if (!profileId) return;
    
    const savedTheme = localStorage.getItem(`theme_${profileId}`) as Theme;
    if (savedTheme) {
      setProfileData(prev => ({ ...prev, theme: savedTheme }));
    }
  }, [profileId]);

  // Sync with profile data changes
  useEffect(() => {
    if (!currentProfile) return;
    
    setProfileData(prev => ({
      ...prev,
      appTitle: currentProfile.customTitle || "Nosso Amor",
      mainImageUrl: currentProfile.imageUrl || "/lovable-uploads/7257428d-662d-455e-9541-5f4a07cc87c2.png",
      startDate: currentProfile.startDate || new Date(2024, 8, 7),
    }));
  }, [currentProfile]);

  // Apply theme to document
  useEffect(() => {
    document.body.classList.remove('theme-purple', 'theme-green');
    if (profileData.theme === 'purple') document.body.classList.add('theme-purple');
    if (profileData.theme === 'green') document.body.classList.add('theme-green');
  }, [profileData.theme]);

  // Update handlers
  const updateTheme = useCallback((newTheme: Theme) => {
    setProfileData(prev => ({ ...prev, theme: newTheme }));
    if (profileId) {
      localStorage.setItem(`theme_${profileId}`, newTheme);
    }
    toast({
      title: "Tema alterado",
      description: `O tema foi alterado para ${getThemeName(newTheme)}.`,
    });
  }, [profileId]);

  const updateTitle = useCallback(async (newTitle: string) => {
    if (!profileId) return;
    
    try {
      setProfileData(prev => ({ ...prev, appTitle: newTitle }));
      await updateProfile(profileId, { customTitle: newTitle });
      toast({
        title: "Título salvo",
        description: "O título foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Failed to update profile title:", error);
      // Revert local state on error
      setProfileData(prev => ({ ...prev, appTitle: currentProfile?.customTitle || "Nosso Amor" }));
      toast({
        title: "Erro",
        description: "Não foi possível salvar o título.",
        variant: "destructive"
      });
    }
  }, [profileId, updateProfile, currentProfile]);

  const updateStartDate = useCallback(async (newDate: Date) => {
    if (!profileId) return;
    
    try {
      setProfileData(prev => ({ ...prev, startDate: newDate }));
      await updateProfile(profileId, { startDate: newDate });
      toast({
        title: "Data salva",
        description: "A data foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Failed to update profile date:", error);
      // Revert local state on error
      setProfileData(prev => ({ ...prev, startDate: currentProfile?.startDate || new Date(2024, 8, 7) }));
      toast({
        title: "Erro",
        description: "Não foi possível salvar a data.",
        variant: "destructive"
      });
    }
  }, [profileId, updateProfile, currentProfile]);

  const updateImage = useCallback(async (newImageUrl: string) => {
    if (!profileId) return;
    
    try {
      setProfileData(prev => ({ ...prev, mainImageUrl: newImageUrl }));
      await updateProfile(profileId, { imageUrl: newImageUrl });
      toast({
        title: "Imagem salva",
        description: "A imagem foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Failed to update profile image:", error);
      // Revert local state on error
      setProfileData(prev => ({ 
        ...prev, 
        mainImageUrl: currentProfile?.imageUrl || "/lovable-uploads/7257428d-662d-455e-9541-5f4a07cc87c2.png" 
      }));
      toast({
        title: "Erro",
        description: "Não foi possível salvar a imagem.",
        variant: "destructive"
      });
    }
  }, [profileId, updateProfile, currentProfile]);

  return {
    profileId,
    ...profileData,
    currentProfile,
    updateTheme,
    updateTitle,
    updateStartDate,
    updateImage,
  };
}

function getThemeName(theme: Theme): string {
  switch (theme) {
    case 'default': return 'Rosa';
    case 'purple': return 'Roxo';
    case 'green': return 'Verde';
    default: return 'Padrão';
  }
}