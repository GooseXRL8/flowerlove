
import { CoupleProfile } from '@/types/auth';
import { client } from './client';

// Profile-related database operations
export const dbProfiles = {
  getAll: async (): Promise<CoupleProfile[]> => {
    try {
      const result = await client.execute("SELECT * FROM profiles");
      return result.rows.map(row => ({
        id: row.id as string,
        name: row.name as string,
        createdBy: row.createdBy as string,
        startDate: new Date(row.startDate as string),
        assignedUserId: row.assignedUserId as string | undefined
      }));
    } catch (error) {
      console.error("Failed to get profiles:", error);
      return [];
    }
  },

  getById: async (id: string): Promise<CoupleProfile | null> => {
    try {
      const result = await client.execute({
        sql: "SELECT * FROM profiles WHERE id = ?",
        args: [id]
      });

      if (result.rows.length === 0) return null;
      
      const profile = result.rows[0];
      return {
        id: profile.id as string,
        name: profile.name as string,
        createdBy: profile.createdBy as string,
        startDate: new Date(profile.startDate as string),
        assignedUserId: profile.assignedUserId as string | undefined
      };
    } catch (error) {
      console.error("Failed to get profile by ID:", error);
      return null;
    }
  },

  create: async (profile: CoupleProfile): Promise<boolean> => {
    try {
      await client.execute({
        sql: "INSERT INTO profiles (id, name, createdBy, startDate, assignedUserId) VALUES (?, ?, ?, ?, ?)",
        args: [
          profile.id,
          profile.name,
          profile.createdBy,
          profile.startDate.toISOString(),
          profile.assignedUserId || null
        ]
      });
      return true;
    } catch (error) {
      console.error("Failed to create profile:", error);
      return false;
    }
  },

  update: async (profile: CoupleProfile): Promise<boolean> => {
    try {
      await client.execute({
        sql: "UPDATE profiles SET name = ?, createdBy = ?, startDate = ?, assignedUserId = ? WHERE id = ?",
        args: [
          profile.name,
          profile.createdBy,
          profile.startDate.toISOString(),
          profile.assignedUserId || null,
          profile.id
        ]
      });
      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);
      return false;
    }
  },

  deleteById: async (id: string): Promise<boolean> => {
    try {
      await client.execute({
        sql: "DELETE FROM profiles WHERE id = ?",
        args: [id]
      });
      return true;
    } catch (error) {
      console.error("Failed to delete profile:", error);
      return false;
    }
  }
};
