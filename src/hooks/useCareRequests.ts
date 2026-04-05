import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface CareRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  street: string | null;
  zip: string | null;
  city: string | null;
  insurers: string[];
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
  street: string | null;
  zip: string | null;
  city: string | null;
  insurers: string[] | null;
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
    street: r.street,
    zip: r.zip,
    city: r.city,
    insurers: r.insurers ?? [],
    status: (r.status as CareRequest["status"]) ?? "pending",
    createdAt: r.created_at,
    documentUrl: r.document_url,
  };
}

const SELECT = "id, first_name, last_name, email, phone, street, zip, city, insurers, status, created_at, document_url";

export function useCareRequests() {
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeError, setRealtimeError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Initial load
    supabase
      .from("care_requests")
      .select(SELECT)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error("care_requests load error:", error.message);
        if (data) setRequests((data as DbCareRequest[]).map(toRequest));
        setLoading(false);
      });

    // Realtime: status updates arrive instantly
    const channel = supabase
      .channel("care_requests_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "care_requests" },
        (payload) => {
          if (cancelled) return;
          if (payload.eventType === "INSERT") {
            setRequests((prev) => [toRequest(payload.new as DbCareRequest), ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setRequests((prev) =>
              prev.map((r) => (r.id === payload.new.id ? toRequest(payload.new as DbCareRequest) : r))
            );
          } else if (payload.eventType === "DELETE") {
            setRequests((prev) => prev.filter((r) => r.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription failed for care_requests");
          setRealtimeError(true);
        }
      });

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { requests, loading, realtimeError };
}
