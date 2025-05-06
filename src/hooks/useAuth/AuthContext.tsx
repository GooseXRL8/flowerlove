
import React, { createContext, useContext } from 'react';
import { User, CoupleProfile } from '@/types/auth';

export interface AuthContextType {
  currentUser: User | null;
  profiles: CoupleProfile[];
  users: User[];
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (username: string, isAdmin: boolean, profileId?: string) => Promise<User>;
  createProfile: (name: string) => Promise<CoupleProfile>;
  deleteProfile: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateProfile: (id: string, data: Partial<CoupleProfile>) => Promise<void>;
  assignUserToProfile: (userId: string, profileId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
