import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kvpyzuaoanuzpihxbvzs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2cHl6dWFvYW51enBpaHhidnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNzY1NzAsImV4cCI6MjA5Mjg1MjU3MH0.7fv8WAKTu_IEiA7HiWRT1KGSXG7mkpfTJJ-IM3hXzqU'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // Kullanıcı tarayıcıyı kapatsa da oturumu açık tutar
    autoRefreshToken: true, // Oturum süresi bitince otomatik yeniler
    detectSessionInUrl: true
  }
});