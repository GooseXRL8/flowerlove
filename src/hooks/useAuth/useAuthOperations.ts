
import { User, CoupleProfile } from '@/types/auth';
import { dbUsers, dbProfiles } from '@/services/database';
import { generatePassword } from './utils';

export function useAuthOperations(
  users: User[], 
  setUsers: React.Dispatch<React.SetStateAction<User[]>>, 
  profiles: CoupleProfile[], 
  setProfiles: React.Dispatch<React.SetStateAction<CoupleProfile[]>>,
  currentUser: User | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>
) {
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
      id: '', // Let Supabase generate UUID - this will be ignored
      username,
      password,
      isAdmin,
      assignedProfileId: profileId
    };
    
    const success = await dbUsers.create(newUser);
    if (!success) {
      throw new Error('Failed to create user in database');
    }
    
    // Reload users to get the new user with proper UUID
    const updatedUsers = await dbUsers.getAll();
    setUsers(updatedUsers);
    
    return newUser;
  };

  const deleteUser = async (id: string) => {
    if (!currentUser?.isAdmin) {
      throw new Error('Only admins can delete users');
    }
    
    // Find the user and their associated profile
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;
    
    // If the user has an assigned profile, update the profile
    if (userToDelete.assignedProfileId) {
      const profileToUpdate = profiles.find(p => p.id === userToDelete.assignedProfileId);
      if (profileToUpdate) {
        const updatedProfile = { ...profileToUpdate, assignedUserId: undefined };
        await dbProfiles.update(updatedProfile);
        
        setProfiles(prev => 
          prev.map(profile => 
            profile.id === userToDelete.assignedProfileId ? updatedProfile : profile
          )
        );
      }
    }
    
    // Delete the user from the database
    const success = await dbUsers.deleteById(id);
    if (!success) {
      throw new Error('Failed to delete user from database');
    }
    
    // Update state
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const createProfile = async (name: string) => {
    if (!currentUser?.isAdmin) {
      throw new Error('Only admins can create profiles');
    }
    
    const newProfile: CoupleProfile = {
      id: '', // Let Supabase generate UUID - this will be ignored
      name,
      createdBy: currentUser.id,
      startDate: new Date(),
    };
    
    const success = await dbProfiles.create(newProfile);
    if (!success) {
      throw new Error('Failed to create profile in database');
    }
    
    // Reload profiles to get the new profile with proper UUID
    const updatedProfiles = await dbProfiles.getAll();
    setProfiles(updatedProfiles);
    
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

  return {
    login,
    logout,
    createUser,
    deleteUser,
    createProfile,
    deleteProfile,
    updateProfile,
    assignUserToProfile,
  };
}
