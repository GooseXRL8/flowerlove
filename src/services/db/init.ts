
import { client } from './client';
import { dbUsers } from './users';
import { dbProfiles } from './profiles';
import { User } from '@/types/auth';

// Function to ensure admin and test users exist
const ensureDefaultUsersExist = async () => {
  console.log("Checking if default users exist...");
  const users = await dbUsers.getAll();
  
  // Check if admin user exists
  const adminUser = users.find(u => u.username === 'joao');
  if (!adminUser) {
    console.log("Creating admin user 'joao'");
    const newAdmin: User = {
      id: 'admin-' + Date.now().toString(),
      username: 'joao',
      password: 'joao123',
      isAdmin: true
    };
    await dbUsers.create(newAdmin);
  } else {
    console.log("Admin user 'joao' already exists");
  }
  
  // Check if test user exists
  const testUser = users.find(u => u.username === 'teste');
  if (!testUser) {
    console.log("Creating test user 'teste'");
    
    // Create a test profile first
    const profileId = 'profile-' + Date.now().toString();
    await dbProfiles.create({
      id: profileId,
      name: 'Perfil de Teste',
      createdBy: 'system',
      startDate: new Date()
    });
    
    const newUser: User = {
      id: 'user-' + Date.now().toString(),
      username: 'teste',
      password: 'abacate123',
      isAdmin: false,
      assignedProfileId: profileId
    };
    await dbUsers.create(newUser);
  } else {
    console.log("Test user 'teste' already exists");
  }
};

// Initialize database
export const initDatabase = async () => {
  try {
    console.log("Initializing database...");
    
    // Create users table if not exists
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        isAdmin INTEGER NOT NULL,
        assignedProfileId TEXT
      )
    `);
    
    // Create profiles table if not exists
    await client.execute(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        createdBy TEXT NOT NULL,
        startDate TEXT NOT NULL,
        customTitle TEXT,
        assignedUserId TEXT
      )
    `);
    
    // Create memories table if not exists
    await client.execute(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        profileId TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        location TEXT,
        imageUrl TEXT,
        tags TEXT,
        isFavorite INTEGER DEFAULT 0
      )
    `);
    
    // Ensure default users exist
    await ensureDefaultUsersExist();
    
    console.log("Database initialized successfully");
    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    return false;
  }
};
