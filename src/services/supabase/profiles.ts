import { supabase } from '@/integrations/supabase/client';
import { CoupleProfile } from '@/types/auth';

export const supabaseProfiles = {
  async getAll(): Promise<CoupleProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      return data.map(profile => ({
        id: profile.id,
        name: profile.name,
        createdBy: profile.created_by,
        startDate: new Date(profile.start_date),
        customTitle: profile.custom_title,
        assignedUserId: profile.assigned_user_id,
        imageUrl: profile.image_url
      }));
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
  },

  async getById(id: string): Promise<CoupleProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        createdBy: data.created_by,
        startDate: new Date(data.start_date),
        customTitle: data.custom_title,
        assignedUserId: data.assigned_user_id,
        imageUrl: data.image_url
      };
    } catch (error) {
      console.error('Error fetching profile by id:', error);
      return null;
    }
  },

  async create(profile: CoupleProfile): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          // Remove id from insert - let Supabase generate UUID
          name: profile.name,
          created_by: profile.createdBy,
          start_date: profile.startDate.toISOString().split('T')[0],
          custom_title: profile.customTitle,
          assigned_user_id: profile.assignedUserId,
          image_url: profile.imageUrl
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating profile:', error);
      return false;
    }
  },

  async update(profile: CoupleProfile): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          created_by: profile.createdBy,
          start_date: profile.startDate.toISOString().split('T')[0],
          custom_title: profile.customTitle,
          assigned_user_id: profile.assignedUserId,
          image_url: profile.imageUrl
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  },

  async deleteById(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting profile:', error);
      return false;
    }
  }
};