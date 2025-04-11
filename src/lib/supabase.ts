
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zdayyazgurydouuoogyg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkYXl5YXpndXJ5ZG91dW9vZ3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNTM5MzMsImV4cCI6MjA1OTgyOTkzM30.GM0Bb0dfMyBn3gdM458AJRnk7pi7QRSweegKzpDmWrk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
