import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://jomvhjqzlqyfvssneprr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbXZoanF6bHF5ZnZzc25lcHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDgxMzYsImV4cCI6MjA1Nzg4NDEzNn0.yjce3yyEm-DDIEV9q0WCqHejtswF7CQRooaqzdhqnqI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);  