import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  street: string;
  zip: string;
  city: string;
  score: number;
  role: "user" | "admin";
}

interface DbProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  phone: string | null;
  street: string | null;
  zip: string | null;
  city: string | null;
  score: number | null;
  role: string | null;
}

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (!data) return null;
  const row = data as DbProfile;
  return {
    id: row.id,
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    title: row.title ?? "",
    phone: row.phone ?? "",
    street: row.street ?? "",
    zip: row.zip ?? "",
    city: row.city ?? "",
    score: row.score ?? 75,
    role: row.role === "admin" ? "admin" : "user",
  };
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load profile for current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setLoading(false); return; }
      setProfile(await fetchProfile(session.user.id));
      setLoading(false);
    });

    // Re-load whenever auth state changes (login / logout / user switch)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          setProfile(null);
        } else {
          setProfile(await fetchProfile(session.user.id));
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { profile, loading };
}
