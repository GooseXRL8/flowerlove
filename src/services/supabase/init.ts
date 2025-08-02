import { supabaseUsers } from './users';
import { supabaseProfiles } from './profiles';
import { User } from '@/types/auth';

// Function to ensure admin and test users exist
const ensureDefaultUsersExist = async () => {
  console.log("Checking if default users exist in Supabase...");
  try {
    const users = await supabaseUsers.getAll();
    
    // Check if admin user exists
    const adminUser = users.find(u => u.username === 'joao');
    if (adminUser) {
      console.log("Admin user 'joao' exists in database");
    } else {
      console.log("Admin user 'joao' not found in database");
    }
    
    // Check if test user exists
    const testUser = users.find(u => u.username === 'teste');
    if (testUser) {
      console.log("Test user 'teste' exists in database");
    } else {
      console.log("Test user 'teste' not found in database");
    }
    
    console.log(`Total users found: ${users.length}`);
  } catch (error) {
    console.error("Error checking default users:", error);
    throw error;
  }
};

// Initialize Supabase connection and verify data
export const initSupabase = async () => {
  try {
    console.log("Initializing Supabase connection...");
    
    // Verify connection by checking if we can fetch users
    await ensureDefaultUsersExist();
    
    console.log("Supabase initialized successfully");
    return true;
  } catch (error) {
    console.error("Supabase initialization failed:", error);
    return false;
  }
};