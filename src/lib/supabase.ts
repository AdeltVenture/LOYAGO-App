import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Fallback so createClient never receives undefined (which throws in some versions)
const url = supabaseUrl || "https://placeholder.supabase.co";
const key = supabaseAnonKey || "placeholder";

export const supabase = createClient(url, key);
export const supabaseReady = !!supabaseUrl && !!supabaseAnonKey;
