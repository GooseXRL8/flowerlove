
import { client } from './client';

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
