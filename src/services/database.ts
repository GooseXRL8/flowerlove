
// Re-export database services for backward compatibility
import { initDatabase } from './db/init';
import { dbUsers } from './db/users';
import { dbProfiles } from './db/profiles';
import { dbMemories } from './db/memories';

export { initDatabase, dbUsers, dbProfiles, dbMemories };
