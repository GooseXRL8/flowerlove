
import { createClient } from '@libsql/client';
import { User, CoupleProfile } from '@/types/auth';
import { Memory } from '@/components/Memory/types';

// Initialize the Turso client with the connection URL and auth token
const client = createClient({
  url: 'libsql://site-flowerlove-goosexrl8.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicm8iLCJpYXQiOjE3NDY0NjQzMDYsImlkIjoiOWNlM2I3OTgtZjM4Zi00YmI5LWJhNmYtM2ZhM2RhNjk5ODc0IiwicmlkIjoiNzNlMDA3MGEtMzVjZC00MWFmLWE1OTItNWM5MDUxNjhhYTg5In0.LCGmvwIjfABhvE_NlDn3YEIrEo_D791Lf7k9S0Rl_TVE0egdSOVL1PHTRS6nx36ntNhEktUtygqoLnIUWQyuBQ'
});

// Initialize database tables if they don't exist
export const initDatabase = async () => {
  try {
    // Create users table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        isAdmin INTEGER NOT NULL,
        assignedProfileId TEXT
      )
    `);

    // Create profiles table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        createdBy TEXT NOT NULL,
        startDate TEXT NOT NULL,
        assignedUserId TEXT
      )
    `);

    // Create memories table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        isFavorite INTEGER NOT NULL,
        profileId TEXT NOT NULL
      )
    `);

    // Check if admin user exists
    const adminResult = await client.execute({
      sql: "SELECT * FROM users WHERE username = ?",
      args: ["admin"]
    });

    // If no admin user exists, create default admin
    if (adminResult.rows.length === 0) {
      await client.execute({
        sql: "INSERT INTO users (id, username, password, isAdmin) VALUES (?, ?, ?, ?)",
        args: ["1", "admin", "admin123", 1]
      });

      // Create default profile
      await client.execute({
        sql: "INSERT INTO profiles (id, name, createdBy, startDate) VALUES (?, ?, ?, ?)",
        args: ["1", "Casal Padrão", "1", new Date().toISOString()]
      });
    }
    
    // Check if "joao" admin user exists
    const joaoResult = await client.execute({
      sql: "SELECT * FROM users WHERE username = ?",
      args: ["joao"]
    });
    
    // If "joao" admin user doesn't exist, create it
    if (joaoResult.rows.length === 0) {
      await client.execute({
        sql: "INSERT INTO users (id, username, password, isAdmin) VALUES (?, ?, ?, ?)",
        args: ["joao_admin", "joao", "joao123", 1]
      });
    }
    
    // Check if "teste" regular user exists
    const testeResult = await client.execute({
      sql: "SELECT * FROM users WHERE username = ?",
      args: ["teste"]
    });
    
    // If "teste" user doesn't exist, create it along with a profile
    if (testeResult.rows.length === 0) {
      // Create profile for teste user
      const profileId = "teste_profile";
      await client.execute({
        sql: "INSERT INTO profiles (id, name, createdBy, startDate, assignedUserId) VALUES (?, ?, ?, ?, ?)",
        args: [profileId, "Perfil Teste", "joao_admin", new Date().toISOString(), "teste_user"]
      });
      
      // Create teste user
      await client.execute({
        sql: "INSERT INTO users (id, username, password, isAdmin, assignedProfileId) VALUES (?, ?, ?, ?, ?)",
        args: ["teste_user", "teste", "abacate123", 0, profileId]
      });
    }

    console.log("Database initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return false;
  }
};

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
      }));
    } catch (error) {
      console.error("Failed to get memories:", error);
      return [];
    }
  },

  create: async (memory: Memory, profileId: string): Promise<boolean> => {
    try {
      await client.execute({
        sql: "INSERT INTO memories (id, title, description, date, isFavorite, profileId) VALUES (?, ?, ?, ?, ?, ?)",
        args: [
          memory.id,
          memory.title,
          memory.description,
          memory.date.toISOString(),
          memory.isFavorite ? 1 : 0,
          profileId
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
        sql: "UPDATE memories SET title = ?, description = ?, date = ?, isFavorite = ? WHERE id = ? AND profileId = ?",
        args: [
          memory.title,
          memory.description,
          memory.date.toISOString(),
          memory.isFavorite ? 1 : 0,
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
