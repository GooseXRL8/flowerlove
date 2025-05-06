
import { createClient } from '@libsql/client';

// Initialize the Turso client with the connection URL and auth token
export const client = createClient({
  url: 'libsql://site-flowerlove-goosexrl8.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicm8iLCJpYXQiOjE3NDY0NjQzMDYsImlkIjoiOWNlM2I3OTgtZjM4Zi00YmI5LWJhNmYtM2ZhM2RhNjk5ODc0IiwicmlkIjoiNzNlMDA3MGEtMzVjZC00MWFmLWE1OTItNWM5MDUxNjhhYTg5In0.LCGmvwIjfABhvE_NlDn3YEIrEo_D791Lf7k9S0Rl_TVE0egdSOVL1PHTRS6nx36ntNhEktUtygqoLnIUWQyuBQ'
});
