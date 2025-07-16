import { supabase } from '@/integrations/supabase/client';
import { Memory } from '@/components/Memory/types';

export const supabaseMemories = {
  async getByProfileId(profileId: string): Promise<Memory[]> {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('profile_id', profileId)
        .order('memory_date', { ascending: false });
      
      if (error) throw error;
      
      return data.map(memory => ({
        id: memory.id,
        title: memory.title,
        description: memory.description || '',
        date: new Date(memory.memory_date),
        location: memory.location,
        imageUrl: memory.image_url,
        tags: memory.tags || [],
        isFavorite: memory.is_favorite || false
      }));
    } catch (error) {
      console.error('Error fetching memories:', error);
      return [];
    }
  },

  async create(memory: Memory, profileId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('memories')
        .insert({
          // Remove id from insert - let Supabase generate UUID
          profile_id: profileId,
          title: memory.title,
          description: memory.description,
          memory_date: memory.date.toISOString().split('T')[0],
          location: memory.location,
          image_url: memory.imageUrl,
          tags: memory.tags,
          is_favorite: memory.isFavorite
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating memory:', error);
      return false;
    }
  },

  async update(memory: Memory, profileId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('memories')
        .update({
          title: memory.title,
          description: memory.description,
          memory_date: memory.date.toISOString().split('T')[0],
          location: memory.location,
          image_url: memory.imageUrl,
          tags: memory.tags,
          is_favorite: memory.isFavorite
        })
        .eq('id', memory.id)
        .eq('profile_id', profileId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating memory:', error);
      return false;
    }
  },

  async deleteById(id: string, profileId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id)
        .eq('profile_id', profileId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting memory:', error);
      return false;
    }
  }
};