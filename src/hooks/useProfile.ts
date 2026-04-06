import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getUserId } from "../lib/supabaseDirect";

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

function defaultProfile(id: string): UserProfile {
  return { id, firstName: "", lastName: "", title: "", phone: "", street: "", zip: "", city: "", score: 75, role: "user" };
}

async function fetchProfile(userId: string): Promise<UserProfile> {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error || !data) return defaultProfile(userId);
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
  } catch {
    return defaultProfile(userId);
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Initial load: read userId directly from localStorage (no getSession() hang)
    const userId = getUserId();
    if (userId) {
      fetchProfile(userId).then((p) => {
        if (!cancelled) { setProfile(p); setLoading(false); }
      });
    } else {
      setLoading(false);
    }

    // Keep in sync when auth state changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return;
      if (!session) {
        setProfile(null);
        setLoading(false);
      } else {
        const p = await fetchProfile(session.user.id);
        if (!cancelled) { setProfile(p); setLoading(false); }
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return { profile, loading };
}
