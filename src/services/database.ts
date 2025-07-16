
// Updated to use Supabase services
import { initSupabase } from './supabase/init';
import { supabaseUsers } from './supabase/users';
import { supabaseProfiles } from './supabase/profiles';
import { supabaseMemories } from './supabase/memories';

// Export Supabase services with legacy names for compatibility
export const initDatabase = initSupabase;
export const dbUsers = supabaseUsers;
export const dbProfiles = supabaseProfiles;
export const dbMemories = supabaseMemories;
