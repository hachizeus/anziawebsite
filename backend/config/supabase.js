import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kasdvsdakhvfgynmjcxi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthc2R2c2Rha2h2Zmd5bm1qY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzcxOTAsImV4cCI6MjA2ODA1MzE5MH0.OKqPtJnqh_v_M5-ImU2Ag9ovYJqS4l3o4DcVJk-Jv60';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthc2R2c2Rha2h2Zmd5bm1qY3hpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQ3NzE5MCwiZXhwIjoyMDY4MDUzMTkwfQ.n-A1TPeVE8zEYy6Vhfzg16tqptWuDKesV3xiz0xIb8U';

// Client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default supabase;