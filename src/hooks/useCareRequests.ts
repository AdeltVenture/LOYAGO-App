import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface CareRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  insurers: string[];
  status: "pending" | "processing" | "confirmed";
  createdAt: string;
}

interface DbCareRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  insurers: string[] | null;
  status: string;
  created_at: string;
}

export function useCareRequests() {
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("care_requests")
      .select("id, first_name, last_name, email, insurers, status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setRequests(
            (data as DbCareRequest[]).map((r) => ({
              id: r.id,
              firstName: r.first_name,
              lastName: r.last_name,
              email: r.email,
              insurers: r.insurers ?? [],
              status: (r.status as CareRequest["status"]) ?? "pending",
              createdAt: r.created_at,
            }))
          );
        }
        setLoading(false);
      });
  }, []);

  return { requests, loading };
}
