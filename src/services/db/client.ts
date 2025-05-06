
import { createClient } from '@libsql/client';

// Initialize the Turso client with the connection URL and auth token
export const client = createClient({
  url: 'libsql://site-flowerlove-goosexrl8.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDY0NjU5NzgsImlkIjoiOWNlM2I3OTgtZjM4Zi00YmI5LWJhNmYtM2ZhM2RhNjk5ODc0IiwicmlkIjoiNzNlMDA3MGEtMzVjZC00MWFmLWE1OTItNWM5MDUxNjhhYTg5In0.4UCZCqWJC35GujgQ5C9wlXWfK3pN4zN0jwSUy01FxHvphGwFiG_0cQ4ZNLTx3batoB4gom5lBZTNwm_04H9SCA'
});
