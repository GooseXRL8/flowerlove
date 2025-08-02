
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type Theme = 'default' | 'purple' | 'green';

export function useProfile() {
  const { profileId } = useParams<{ profileId: string }>();
  const { profiles, updateProfile, currentUser } = useAuth();
  
  // State for theme
  const [theme, setTheme] = useState<Theme>('default');
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("main");
  
  // State for app title
  const [appTitle, setAppTitle] = useState<string>("Nosso Amor");
  
  // State for the main image URL
  const [mainImageUrl, setMainImageUrl] = useState<string>("/lovable-uploads/7257428d-662d-455e-9541-5f4a07cc87c2.png");
  
  // State for relationship start date
  const [startDate, setStartDate] = useState<Date>(new Date(2024, 8, 7)); // Note: Month is 0-indexed, so 8 = September
  
  // State for duration
  const [duration, setDuration] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0
  });

  // Effect to load profile data
  useEffect(() => {
    if (!profileId || !profiles.length) {
      console.log("Profile loading skipped - missing profileId or profiles:", { profileId, profilesLength: profiles.length });
      return;
    }
    
    // Find the profile in the profiles array
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) {
      console.log("Profile not found for ID:", profileId);
      return;
    }
    
    console.log("Loading profile data for", profileId, ":", profile);
    
    // Use a ref to track if we need to update state to avoid loops
    let shouldUpdate = false;
    
    // Check if we need to update each piece of state
    if (profile.customTitle && profile.customTitle !== appTitle) {
      console.log("Updating title:", profile.customTitle);
      setAppTitle(profile.customTitle);
      shouldUpdate = true;
    }
    
    if (profile.startDate && profile.startDate.getTime() !== startDate.getTime()) {
      console.log("Updating start date:", profile.startDate);
      setStartDate(profile.startDate);
      shouldUpdate = true;
    }
    
    if (profile.imageUrl && profile.imageUrl !== mainImageUrl) {
      console.log("Updating image URL from:", mainImageUrl, "to:", profile.imageUrl);
      setMainImageUrl(profile.imageUrl);
      shouldUpdate = true;
    }
    
    if (shouldUpdate) {
      console.log("Profile state updated successfully");
    }
  }, [profileId, profiles]); // Remove state dependencies to prevent loops
  
  // Separate effect for theme
  useEffect(() => {
    if (!profileId) return;
    
    // Load theme from localStorage as it's user-specific
    const savedTheme = localStorage.getItem(`theme_${profileId}`) as Theme;
    if (savedTheme && savedTheme !== theme) {
      console.log("Loading saved theme:", savedTheme);
      setTheme(savedTheme);
    }
  }, [profileId]);
  
  // Effect to apply theme
  useEffect(() => {
    document.body.classList.remove('theme-purple', 'theme-green');
    if (theme === 'purple') document.body.classList.add('theme-purple');
    if (theme === 'green') document.body.classList.add('theme-green');
  }, [theme]);
  
  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    if (profileId) {
      localStorage.setItem(`theme_${profileId}`, newTheme);
    }
    toast({
      title: "Tema alterado",
      description: `O tema foi alterado para ${getThemeName(newTheme)}.`,
    });
  };
  
  // Handle title change
  const handleTitleChange = async (newTitle: string) => {
    setAppTitle(newTitle);
    
    // Save to database if we have a profile ID
    if (profileId) {
      try {
        await updateProfile(profileId, { customTitle: newTitle });
        toast({
          title: "Título salvo",
          description: "O título foi atualizado com sucesso.",
        });
      } catch (error) {
        console.error("Failed to update profile title:", error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar o título.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Handle date change
  const handleDateChange = async (newDate: Date) => {
    setStartDate(newDate);
    
    // Save to database if we have a profile ID
    if (profileId) {
      try {
        await updateProfile(profileId, { startDate: newDate });
        toast({
          title: "Data salva",
          description: "A data foi atualizada com sucesso.",
        });
      } catch (error) {
        console.error("Failed to update profile date:", error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar a data.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Handle image change - now saves to database
  const handleImageChange = async (newImageUrl: string) => {
    setMainImageUrl(newImageUrl);
    
    // Save to database if we have a profile ID
    if (profileId) {
      try {
        await updateProfile(profileId, { imageUrl: newImageUrl });
        toast({
          title: "Imagem salva",
          description: "A imagem foi atualizada com sucesso.",
        });
      } catch (error) {
        console.error("Failed to update profile image:", error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar a imagem.",
          variant: "destructive"
        });
      }
    }
  };

  return {
    profileId,
    theme,
    activeTab,
    appTitle,
    mainImageUrl,
    startDate,
    duration,
    setActiveTab,
    setDuration,
    handleThemeChange,
    handleTitleChange,
    handleDateChange,
    handleImageChange
  };
}

// Helper function for theme names
function getThemeName(theme: 'default' | 'purple' | 'green'): string {
  switch (theme) {
    case 'default': return 'Rosa';
    case 'purple': return 'Roxo';
    case 'green': return 'Verde';
    default: return 'Padrão';
  }
}
