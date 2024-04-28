import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mmwcfcubgquexxujjutu.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1td2NmY3ViZ3F1ZXh4dWpqdXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ5NjM1NDksImV4cCI6MjAyMDUzOTU0OX0.zhzzBz8hqUMTFzI7Ph22maQO4rQw76ekfHXhAILJCk8'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase;