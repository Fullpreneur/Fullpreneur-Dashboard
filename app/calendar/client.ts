import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Only log once to avoid console spam
  if (typeof window !== "undefined" && !(window as any).__supabaseClientLogged) {
    console.log("Supabase Client Init:", {
      url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "MISSING",
      keyExists: !!supabaseKey,
      keyPreview: supabaseKey ? `${supabaseKey.substring(0, 10)}...` : "MISSING",
    });
    (window as any).__supabaseClientLogged = true;
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables!");
    console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Present" : "MISSING");
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseKey ? "Present" : "MISSING");
    // Return a client anyway to prevent crashes, but it will fail on queries
  }

  return createBrowserClient(supabaseUrl || "", supabaseKey || "");
}
