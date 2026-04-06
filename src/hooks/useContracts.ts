import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Contract, ContractStatus } from "../data/contracts";

interface DbContract {
  id: string;
  name: string;
  insurer: string;
  category: string;
  category_icon: string;
  monthly_premium: number;
  annual_premium: number;
  status: ContractStatus;
  policy_number: string;
  start_date: string;
  renewal_date: string;
  coverage: string;
  deductible: string;
  notes: string | null;
  cancellation_period: string | null;
  coverage_details: string | null;
  color: string;
  document_url: string | null;
  optimization: { headline: string; saving: string; detail: string } | null;
  sort_order: number;
}

function toContract(row: DbContract): Contract {
  return {
    id: row.id,
    name: row.name,
    insurer: row.insurer,
    category: row.category,
    categoryIcon: row.category_icon,
    monthlyPremium: row.monthly_premium,
    annualPremium: row.annual_premium,
    status: row.status,
    policyNumber: row.policy_number ?? "",
    startDate: row.start_date
      ? new Date(row.start_date).toLocaleDateString("de-DE")
      : "",
    renewalDate: row.renewal_date
      ? new Date(row.renewal_date).toLocaleDateString("de-DE")
      : "",
    coverage: row.coverage ?? "",
    deductible: row.deductible ?? "",
    notes: row.notes ?? undefined,
    cancellationPeriod: row.cancellation_period ?? undefined,
    coverageDetails: row.coverage_details ?? undefined,
    color: row.color,
    documentUrl: row.document_url ?? undefined,
    optimization: row.optimization ?? undefined,
  };
}

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) {
        setError(error.message);
        setContracts([]);
      } else {
        setContracts((data as DbContract[]).map(toContract));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verträge konnten nicht geladen werden.");
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    // Re-fetch when user changes (login / logout / switch)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { contracts, loading, error };
}
