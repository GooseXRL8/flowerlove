
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CoupleProfile } from '@/types/auth';

interface AuthContextType {
  currentUser: User | null;
  profiles: CoupleProfile[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  createUser: (username: string, isAdmin: boolean, profileId?: string) => User;
  createProfile: (name: string) => CoupleProfile;
  deleteProfile: (id: string) => void;
  updateProfile: (id: string, data: Partial<CoupleProfile>) => void;
  assignUserToProfile: (userId: string, profileId: string) => void;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<CoupleProfile[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('users');
    const savedProfiles = localStorage.getItem('profiles');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (e) {
        console.error('Failed to parse users from localStorage');
        setupDefaultUsers();
      }
    } else {
      setupDefaultUsers();
    }
    
    if (savedProfiles) {
      try {
        // Convert date strings back to Date objects
        const parsedProfiles = JSON.parse(savedProfiles).map((profile: any) => ({
          ...profile,
          startDate: new Date(profile.startDate)
        }));
        setProfiles(parsedProfiles);
      } catch (e) {
        console.error('Failed to parse profiles from localStorage');
        setupDefaultProfiles();
      }
    } else {
      setupDefaultProfiles();
    }
  }, []);

  const setupDefaultUsers = () => {
    const defaultUsers = [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
        isAdmin: true
      }
    ];
    setUsers(defaultUsers);
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  };

  const setupDefaultProfiles = () => {
    const defaultProfiles = [
      {
        id: '1',
        name: 'Casal Padrão',
        createdBy: '1', // admin user id
        startDate: new Date(),
      }
    ];
    setProfiles(defaultProfiles);
    localStorage.setItem('profiles', JSON.stringify(defaultProfiles));
  };

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('profiles', JSON.stringify(profiles));
  }, [profiles]);

  // Helper function to generate random password
  const generatePassword = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let password = '';
    
    // Generate 5 random letters
    for (let i = 0; i < 5; i++) {
      password += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Generate 3 random numbers
    for (let i = 0; i < 3; i++) {
      password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return password;
  };

  const login = (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createUser = (username: string, isAdmin: boolean, profileId?: string) => {
    const password = generatePassword();
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      isAdmin,
      assignedProfileId: profileId
    };
    
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const createProfile = (name: string) => {
    if (!currentUser?.isAdmin) {
      throw new Error('Only admins can create profiles');
    }
    
    const newProfile: CoupleProfile = {
      id: Date.now().toString(),
      name,
      createdBy: currentUser.id,
      startDate: new Date(),
    };
    
    setProfiles(prev => [...prev, newProfile]);
    return newProfile;
  };

  const deleteProfile = (id: string) => {
    if (!currentUser?.isAdmin) {
      throw new Error('Only admins can delete profiles');
    }
    
    // Remove any users assigned to this profile
    const updatedUsers = users.map(user => {
      if (user.assignedProfileId === id) {
        return {...user, assignedProfileId: undefined};
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setProfiles(prev => prev.filter(profile => profile.id !== id));
  };

  const updateProfile = (id: string, data: Partial<CoupleProfile>) => {
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === id ? { ...profile, ...data } : profile
      )
    );
  };

  const assignUserToProfile = (userId: string, profileId: string) => {
    if (!currentUser?.isAdmin) {
      throw new Error('Only admins can assign users to profiles');
    }
    
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, assignedProfileId: profileId } : user
      )
    );
    
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === profileId ? { ...profile, assignedUserId: userId } : profile
      )
    );
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      profiles, 
      login, 
      logout,
      createUser,
      createProfile,
      deleteProfile,
      updateProfile,
      assignUserToProfile,
      users
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
