
import { useState, useEffect } from 'react';
import { User, CoupleProfile } from '@/types/auth';
import { dbUsers, dbProfiles } from '@/services/database';

export function useDataLoader(dbInitialized: boolean, setLoading: (loading: boolean) => void) {
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<CoupleProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load data from database when it's initialized
  useEffect(() => {
    const loadData = async () => {
      if (!dbInitialized) {
        console.log("Database not initialized yet, skipping data load");
        return;
      }
      
      try {
        console.log("Loading data from database...");
        setLoading(true);
        
        // Load users
        const dbLoadedUsers = await dbUsers.getAll();
        console.log("Loaded users:", dbLoadedUsers);
        setUsers(dbLoadedUsers);
        
        // Load profiles
        const dbLoadedProfiles = await dbProfiles.getAll();
        console.log("Loaded profiles:", dbLoadedProfiles);
        setProfiles(dbLoadedProfiles);
        
        // Load current user from localStorage (just the ID)
        const savedUserId = localStorage.getItem('currentUserId');
        if (savedUserId) {
          try {
            const user = await dbUsers.getById(savedUserId);
            if (user) {
              setCurrentUser(user);
            } else {
              console.log("User not found in database, clearing localStorage");
              localStorage.removeItem('currentUserId');
            }
          } catch (error) {
            console.error("Error loading current user:", error);
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
  }, [dbInitialized, setLoading]);

  return {
    users,
    setUsers,
    profiles,
    setProfiles,
    currentUser,
    setCurrentUser
  };
}
