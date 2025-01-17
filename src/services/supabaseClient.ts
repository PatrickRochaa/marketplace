import { createClient } from "@supabase/supabase-js";

// URL do seu projeto no Supabase e a chave pública (anon key)

const supabaseUrl = "https://ucnupjpomoiuvfneeurh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbnVwanBvbW9pdXZmbmVldXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMjA0MTksImV4cCI6MjA0NzY5NjQxOX0.dWJrmcZVEjUZ4l-WUiWNf6Uc3fRuO8P2do208_r5qFk";

export const supabase = createClient(supabaseUrl, supabaseKey);
