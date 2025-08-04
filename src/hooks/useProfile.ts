
// DEPRECATED: Use useProfileData instead
// This file is kept for backward compatibility only
import { useProfileData } from './useProfileData';

export function useProfile() {
  const {
    profileId,
    theme,
    appTitle,
    mainImageUrl,
    startDate,
    updateTheme,
    updateTitle,
    updateStartDate,
    updateImage,
  } = useProfileData();

  // Legacy state for compatibility
  const duration = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0
  };
  
  const activeTab = "main";
  
  return {
    profileId,
    theme,
    activeTab,
    appTitle,
    mainImageUrl,
    startDate,
    duration,
    setActiveTab: () => {}, // Legacy compatibility
    setDuration: () => {}, // Legacy compatibility
    handleThemeChange: updateTheme,
    handleTitleChange: updateTitle,
    handleDateChange: updateStartDate,
    handleImageChange: updateImage,
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
