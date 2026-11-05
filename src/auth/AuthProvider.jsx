import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context.js";
import { getSupabase, isSupabaseConfigured, recordVisitIfNew } from "../lib/supabase.js";

function previewSignIn() {
  if (!import.meta.env.DEV) return false;
  return new URLSearchParams(window.location.search).get("preview") === "signin";
}

export function AuthProvider({ children }) {
  const configured = isSupabaseConfigured();
  const [signInOpen, setSignInOpen] = useState(previewSignIn);
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(!configured);
  const [adminUserId, setAdminUserId] = useState(null);
  const [checkedFor, setCheckedFor] = useState(null);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    if (!configured) return undefined;
    let active = true;
    const handle = { unsubscribe() {} };

    getSupabase().then(async (supabase) => {
      if (!active || !supabase) return;
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session ?? null);
      setReady(true);
      const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
        setSession(next ?? null);
        setReady(true);
        if (event === "SIGNED_IN" && next) void recordVisitIfNew(next);
      });
      handle.unsubscribe = () => sub.subscription.unsubscribe();
    });

    return () => {
      active = false;
      handle.unsubscribe();
    };
  }, [configured]);

  useEffect(() => {
    if (!configured || !session) return undefined;
    let active = true;
    getSupabase().then((supabase) => {
      if (!active || !supabase) return;
      supabase.rpc("current_user_is_admin").then(({ data, error }) => {
        if (!active) return;
        setAdminError(error ? error.message : "");
        setAdminUserId(!error && data === true ? session.user.id : null);
        setCheckedFor(session.user.id);
      });
    });
    return () => {
      active = false;
    };
  }, [configured, session]);

  const admin = Boolean(session?.user?.id) && adminUserId === session.user.id;
  const adminChecked = !session?.user?.id || checkedFor === session.user.id;

  const value = useMemo(
    () => ({
      configured,
      ready,
      session,
      user: session?.user ?? null,
      isAdmin: admin,
      adminChecked,
      adminError,
      signInOpen,
      openSignIn() {
        setSignInOpen(true);
      },
      closeSignIn() {
        setSignInOpen(false);
      },
      async signInWithGoogle() {
        const supabase = await getSupabase();
        if (!supabase) return { error: new Error("Supabase is not configured.") };
        const redirectTo = `${window.location.origin}${window.location.pathname}`;
        return supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo },
        });
      },
      async sendMagicLink(email) {
        const supabase = await getSupabase();
        if (!supabase) return { error: new Error("Supabase is not configured.") };
        const redirectTo = `${window.location.origin}${window.location.pathname}`;
        return supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: redirectTo },
        });
      },
      async signOut() {
        const supabase = await getSupabase();
        if (!supabase) return;
        setAdminUserId(null);
        await supabase.auth.signOut();
      },
    }),
    [admin, adminChecked, adminError, configured, ready, session, signInOpen],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
