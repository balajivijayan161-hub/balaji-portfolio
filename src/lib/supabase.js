let clientPromise;

export function supabaseEnv() {
  const url = String(import.meta.env.VITE_SUPABASE_URL || "").trim();
  const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
  return { url, anonKey };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = supabaseEnv();
  return Boolean(url && anonKey);
}

export function getSupabase() {
  if (!isSupabaseConfigured()) return Promise.resolve(null);
  if (!clientPromise) {
    const { url, anonKey } = supabaseEnv();
    clientPromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce",
        },
      }),
    );
  }
  return clientPromise;
}

/**
 * Record one sign-in. Skips session restores: only a last_sign_in_at from the
 * last two minutes is treated as a new sign-in, and each stamp is logged once.
 */
export async function recordVisitIfNew(session) {
  const supabase = await getSupabase();
  const stamp = session?.user?.last_sign_in_at;
  const userId = session?.user?.id;
  if (!supabase || !stamp || !userId) return;

  const signedInAt = new Date(stamp).getTime();
  if (Number.isNaN(signedInAt)) return;
  const age = Date.now() - signedInAt;
  if (age > 2 * 60 * 1000) return;

  const key = `visitor-log:${userId}:${stamp}`;
  if (localStorage.getItem(key) === "1") return;
  localStorage.setItem(key, "1");

  const { error } = await supabase.rpc("log_visit");
  if (error) localStorage.removeItem(key);
}
