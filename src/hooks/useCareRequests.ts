import { useEffect, useState } from "react";
import { getUserId, getToken } from "../lib/supabaseDirect";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export interface CareRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  insurers: string[];
  contractName: string | null;
  status: "pending" | "processing" | "confirmed";
  createdAt: string;
  documentUrl: string | null;
}

interface DbCareRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  insurers: string[] | null;
  contract_name: string | null;
  status: string;
  created_at: string;
  document_url: string | null;
}

function toRequest(r: DbCareRequest): CareRequest {
  return {
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    phone: r.phone,
    insurers: r.insurers ?? [],
    contractName: r.contract_name ?? null,
    status: (r.status as CareRequest["status"]) ?? "pending",
    createdAt: r.created_at,
    documentUrl: r.document_url,
  };
}

export function useCareRequests() {
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    // Initial load via direct REST — avoids getSession() hang
    const params = new URLSearchParams({
      user_id: `eq.${userId}`,
      order: "created_at.desc",
      select: "id,first_name,last_name,email,phone,insurers,contract_name,status,created_at,document_url",
    });
    fetch(`${SUPABASE_URL}/rest/v1/care_requests?${params}`, {
      headers: {
        "Authorization": `Bearer ${getToken()}`,
        "apikey": SUPABASE_ANON_KEY,
        "Accept": "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: DbCareRequest[]) => {
        if (!cancelled) {
          setRequests(data.map(toRequest));
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { requests, loading };
}
