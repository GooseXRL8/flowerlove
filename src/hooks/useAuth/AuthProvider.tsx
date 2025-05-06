
import React, { useState, useEffect } from 'react';
import { User, CoupleProfile } from '@/types/auth';
import { initDatabase, dbUsers, dbProfiles } from '@/services/database';
import { AuthContext, AuthContextType } from './AuthContext';
import { generatePassword } from './utils';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<CoupleProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Initialize database and load data
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const initialized = await initDatabase();
        if (initialized) {
          setDbInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Load data from database when it's initialized
  useEffect(() => {
    const loadData = async () => {
      if (!dbInitialized) return;
      
      try {
        setLoading(true);
        
        // Load users
        const dbLoadedUsers = await dbUsers.getAll();
        setUsers(dbLoadedUsers);
        
        // Load profiles
        const dbLoadedProfiles = await dbProfiles.getAll();
        setProfiles(dbLoadedProfiles);
        
        // Load current user from localStorage (just the ID)
        const savedUserId = localStorage.getItem('currentUserId');
        if (savedUserId) {
          const user = await dbUsers.getById(savedUserId);
          if (user) {
            setCurrentUser(user);
          } else {
            localStorage.removeItem('currentUserId');
          }
        }
      } catch (error) {
        console.error("Failed to load data from database:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dbInitialized]);

  const login = async (username: string, password: string) => {
    console.log("Login attempt:", username, password);
    console.log("Available users:", users);
    
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password
    );
    
    if (user) {
      console.log("User found, logging in:", user);
      setCurrentUser(user);
      localStorage.setItem('currentUserId', user.id);
      return true;
    }
    console.log("User not found or password incorrect");
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
  };

  const createUser = async (username: string, isAdmin: boolean, profileId?: string) => {
    const password = generatePassword();
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      isAdmin,
      assignedProfileId: profileId
    };
    
    const success = await dbUsers.create(newUser);
    if (!success) {
      throw new Error('Failed to create user in database');
    }
    
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const createProfile = async (name: string) => {
    if (!currentUser?.isAdmin) {
      throw new Error('Only admins can create profiles');
    }
    
    const newProfile: CoupleProfile = {
      id: Date.now().toString(),
      name,
      createdBy: currentUser.id,
      startDate: new Date(),
    };
    
    await dbProfiles.create(newProfile);
    setProfiles(prev => [...prev, newProfile]);
    return newProfile;
  };

  const deleteProfile = async (id: string) => {
    if (!currentUser?.isAdmin) {
      throw new Error('Only admins can delete profiles');
    }
    
    // Update any users assigned to this profile
    const updatedUsers = users.map(user => {
      if (user.assignedProfileId === id) {
        const updatedUser = {...user, assignedProfileId: undefined};
        dbUsers.update(updatedUser);
        return updatedUser;
      }
      return user;
    });
    
    await dbProfiles.deleteById(id);
    setUsers(updatedUsers);
    setProfiles(prev => prev.filter(profile => profile.id !== id));
  };

  const updateProfile = async (id: string, data: Partial<CoupleProfile>) => {
    const profileToUpdate = profiles.find(p => p.id === id);
    if (!profileToUpdate) return;
    
    const updatedProfile = { ...profileToUpdate, ...data };
    await dbProfiles.update(updatedProfile);
    
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === id ? updatedProfile : profile
      )
    );
  };

  const assignUserToProfile = async (userId: string, profileId: string) => {
    if (!currentUser?.isAdmin) {
      throw new Error('Only admins can assign users to profiles');
    }
    
    // Update user
    const userToUpdate = users.find(u => u.id === userId);
    if (userToUpdate) {
      const updatedUser = { ...userToUpdate, assignedProfileId: profileId };
      await dbUsers.update(updatedUser);
      
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? updatedUser : user
        )
      );
    }
    
    // Update profile
    const profileToUpdate = profiles.find(p => p.id === profileId);
    if (profileToUpdate) {
      const updatedProfile = { ...profileToUpdate, assignedUserId: userId };
      await dbProfiles.update(updatedProfile);
      
      setProfiles(prev => 
        prev.map(profile => 
          profile.id === profileId ? updatedProfile : profile
        )
      );
    }
  };

  const contextValue: AuthContextType = {
    currentUser,
    profiles,
    login,
    logout,
    createUser,
    createProfile,
    deleteProfile,
    updateProfile,
    assignUserToProfile,
    users,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
