import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

export const supabaseUsers = {
  async getAll(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      return data.map(user => ({
        id: user.id,
        username: user.username,
        password: user.password,
        isAdmin: user.is_admin,
        assignedProfileId: user.assigned_profile_id
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async getById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        username: data.username,
        password: data.password,
        isAdmin: data.is_admin,
        assignedProfileId: data.assigned_profile_id
      };
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }
  },

  async create(user: User): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          // Remove id from insert - let Supabase generate UUID
          username: user.username,
          password: user.password,
          is_admin: user.isAdmin,
          assigned_profile_id: user.assignedProfileId
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  },

  async update(user: User): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          username: user.username,
          password: user.password,
          is_admin: user.isAdmin,
          assigned_profile_id: user.assignedProfileId
        })
        .eq('id', user.id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },

  async deleteById(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
};