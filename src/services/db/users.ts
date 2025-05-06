
import { User } from '@/types/auth';
import { client } from './client';

// User-related database operations
export const dbUsers = {
  getAll: async (): Promise<User[]> => {
    try {
      const result = await client.execute("SELECT * FROM users");
      return result.rows.map(row => ({
        id: row.id as string,
        username: row.username as string,
        password: row.password as string,
        isAdmin: Boolean(row.isAdmin),
        assignedProfileId: row.assignedProfileId as string | undefined
      }));
    } catch (error) {
      console.error("Failed to get users:", error);
      return [];
    }
  },

  getById: async (id: string): Promise<User | null> => {
    try {
      const result = await client.execute({
        sql: "SELECT * FROM users WHERE id = ?",
        args: [id]
      });

      if (result.rows.length === 0) return null;
      
      const user = result.rows[0];
      return {
        id: user.id as string,
        username: user.username as string,
        password: user.password as string,
        isAdmin: Boolean(user.isAdmin),
        assignedProfileId: user.assignedProfileId as string | undefined
      };
    } catch (error) {
      console.error("Failed to get user by ID:", error);
      return null;
    }
  },

  create: async (user: User): Promise<boolean> => {
    try {
      await client.execute({
        sql: "INSERT INTO users (id, username, password, isAdmin, assignedProfileId) VALUES (?, ?, ?, ?, ?)",
        args: [
          user.id,
          user.username,
          user.password,
          user.isAdmin ? 1 : 0,
          user.assignedProfileId || null
        ]
      });
      return true;
    } catch (error) {
      console.error("Failed to create user:", error);
      return false;
    }
  },

  update: async (user: User): Promise<boolean> => {
    try {
      await client.execute({
        sql: "UPDATE users SET username = ?, password = ?, isAdmin = ?, assignedProfileId = ? WHERE id = ?",
        args: [
          user.username,
          user.password,
          user.isAdmin ? 1 : 0,
          user.assignedProfileId || null,
          user.id
        ]
      });
      return true;
    } catch (error) {
      console.error("Failed to update user:", error);
      return false;
    }
  },

  deleteById: async (id: string): Promise<boolean> => {
    try {
      await client.execute({
        sql: "DELETE FROM users WHERE id = ?",
        args: [id]
      });
      return true;
    } catch (error) {
      console.error("Failed to delete user:", error);
      return false;
    }
  }
};
