
import { Memory } from '@/components/Memory/types';
import { client } from './client';

// Memory-related database operations
export const dbMemories = {
  getByProfileId: async (profileId: string): Promise<Memory[]> => {
    try {
      const result = await client.execute({
        sql: "SELECT * FROM memories WHERE profileId = ?",
        args: [profileId]
      });
      
      return result.rows.map(row => ({
        id: row.id as string,
        title: row.title as string,
        description: row.description as string,
        date: new Date(row.date as string),
        isFavorite: Boolean(row.isFavorite),
        location: row.location as string | undefined,
        imageUrl: row.imageUrl as string | undefined,
        tags: row.tags ? (row.tags as string).split(',') : undefined
      }));
    } catch (error) {
      console.error("Failed to get memories:", error);
      return [];
    }
  },

  create: async (memory: Memory, profileId: string): Promise<boolean> => {
    try {
      await client.execute({
        sql: "INSERT INTO memories (id, title, description, date, isFavorite, profileId, location, imageUrl, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args: [
          memory.id,
          memory.title,
          memory.description,
          memory.date.toISOString(),
          memory.isFavorite ? 1 : 0,
          profileId,
          memory.location || null,
          memory.imageUrl || null,
          memory.tags ? memory.tags.join(',') : null
        ]
      });
      return true;
    } catch (error) {
      console.error("Failed to create memory:", error);
      return false;
    }
  },

  update: async (memory: Memory, profileId: string): Promise<boolean> => {
    try {
      await client.execute({
        sql: "UPDATE memories SET title = ?, description = ?, date = ?, isFavorite = ?, location = ?, imageUrl = ?, tags = ? WHERE id = ? AND profileId = ?",
        args: [
          memory.title,
          memory.description,
          memory.date.toISOString(),
          memory.isFavorite ? 1 : 0,
          memory.location || null,
          memory.imageUrl || null,
          memory.tags ? memory.tags.join(',') : null,
          memory.id,
          profileId
        ]
      });
      return true;
    } catch (error) {
      console.error("Failed to update memory:", error);
      return false;
    }
  },

  deleteById: async (id: string, profileId: string): Promise<boolean> => {
    try {
      await client.execute({
        sql: "DELETE FROM memories WHERE id = ? AND profileId = ?",
        args: [id, profileId]
      });
      return true;
    } catch (error) {
      console.error("Failed to delete memory:", error);
      return false;
    }
  }
};
