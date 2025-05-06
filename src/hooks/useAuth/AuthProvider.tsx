
import React from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import { useDbInitialization } from './useDbInitialization';
import { useDataLoader } from './useDataLoader';
import { useAuthOperations } from './useAuthOperations';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize database
  const { loading, dbInitialized, setLoading } = useDbInitialization();

  // Load users and profiles
  const { 
    users,
    setUsers,
    profiles,
    setProfiles,
    currentUser,
    setCurrentUser
  } = useDataLoader(dbInitialized, setLoading);

  // Auth operations
  const { 
    login,
    logout,
    createUser,
    deleteUser,
    createProfile,
    deleteProfile,
    updateProfile,
    assignUserToProfile,
  } = useAuthOperations(
    users,
    setUsers,
    profiles,
    setProfiles,
    currentUser,
    setCurrentUser
  );

  const contextValue: AuthContextType = {
    currentUser,
    profiles,
    users,
    login,
    logout,
    createUser,
    deleteUser,
    createProfile,
    deleteProfile,
    updateProfile,
    assignUserToProfile,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
