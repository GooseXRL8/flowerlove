
import { useState, useEffect } from 'react';
import { initDatabase } from '@/services/database';

export function useDbInitialization() {
  const [loading, setLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Initialize database
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        console.log("Starting database initialization...");
        const initialized = await initDatabase();
        if (initialized) {
          console.log("Database initialized successfully, setting dbInitialized to true");
          setDbInitialized(true);
        } else {
          console.error("Database initialization returned false");
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return { loading, dbInitialized, setLoading };
}
