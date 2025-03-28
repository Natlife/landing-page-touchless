let supabase = null;

async function initSupabase() {
  const response = await fetch("config.json");
  const config = await response.json();
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm");
  
  supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
  return supabase;
}

// Khởi tạo ngay lập tức khi file được import
const supabasePromise = initSupabase();

export { supabasePromise };