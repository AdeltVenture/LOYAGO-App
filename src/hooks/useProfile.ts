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
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { setLoading(false); return; }

      supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            const row = data as DbProfile;
            setProfile({
              id: row.id,
              firstName: row.first_name ?? "",
              lastName: row.last_name ?? "",
              title: row.title ?? "",
              phone: row.phone ?? "",
              street: row.street ?? "",
              zip: row.zip ?? "",
              city: row.city ?? "",
              score: row.score ?? 75,
            });
          }
          setLoading(false);
        });
    });
  }, []);

  return { profile, loading };
}
