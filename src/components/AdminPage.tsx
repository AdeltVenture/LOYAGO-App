import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, ChevronDown } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useCareRequests, type CareRequest } from "../hooks/useCareRequests";

const STATUS_OPTIONS: { value: CareRequest["status"]; label: string }[] = [
  { value: "pending",    label: "Eingereicht" },
  { value: "processing", label: "In Bearbeitung" },
  { value: "confirmed",  label: "Abgeschlossen" },
];

const statusStyle: Record<CareRequest["status"], { bg: string; text: string }> = {
  pending:    { bg: "#fef9c3", text: "#854d0e" },
  processing: { bg: "#dbeafe", text: "#1d4ed8" },
  confirmed:  { bg: "#dcfce7", text: "#15803d" },
};

function StatusSelect({ id, value }: { id: string; value: CareRequest["status"] }) {
  const [current, setCurrent] = useState(value);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: CareRequest["status"]) {
    setSaving(true);
    await supabase.from("care_requests").update({ status: next }).eq("id", id);
    setCurrent(next);
    setSaving(false);
  }

  const style = statusStyle[current];

  return (
    <div className="relative inline-flex items-center">
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value as CareRequest["status"])}
        disabled={saving}
        className="appearance-none rounded-full pr-7 pl-3 py-1 text-xs font-semibold border-0 outline-none"
        style={{ background: style.bg, color: style.text, cursor: "pointer" }}
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2 pointer-events-none" style={{ color: style.text }} />
    </div>
  );
}

function RequestRow({ req }: { req: CareRequest }) {
  const [open, setOpen] = useState(false);
  const date = new Date(req.createdAt).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 1px 4px rgba(26,31,58,0.07)" }}>
      {/* Row header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full px-4 py-3.5 text-left"
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-semibold truncate" style={{ color: "#1a1f3a" }}>
            {req.firstName} {req.lastName}
          </span>
          <span className="text-xs truncate" style={{ color: "#94a3b8" }}>{date} · {req.email}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <StatusSelect id={req.id} value={req.status} />
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={15} color="#94a3b8" />
          </motion.span>
        </div>
      </button>

      {/* Expandable detail */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-2 border-t" style={{ borderColor: "#f1f5f9" }}>
              <div className="pt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                <Detail label="Adresse" value={[req.street, `${req.zip} ${req.city}`].filter(Boolean).join(", ")} />
                <Detail label="Telefon" value={req.phone ?? "–"} />
                <Detail label="Versicherer" value={req.insurers.length > 0 ? req.insurers.join(", ") : "–"} />
              </div>
              {req.documentUrl && (
                <a
                  href={req.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold mt-1"
                  style={{ color: "#4a6da8" }}
                >
                  <ExternalLink size={13} />
                  Dokument ansehen
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs" style={{ color: "#94a3b8" }}>{label}</p>
      <p className="text-xs font-medium" style={{ color: "#1a1f3a" }}>{value || "–"}</p>
    </div>
  );
}

interface AdminPageProps {
  onBack: () => void;
  backLabel?: string;
}

export default function AdminPage({ onBack, backLabel }: AdminPageProps) {
  const { requests, loading } = useCareRequests();
  const [filter, setFilter] = useState<CareRequest["status"] | "all">("all");

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const counts = {
    all:        requests.length,
    pending:    requests.filter((r) => r.status === "pending").length,
    processing: requests.filter((r) => r.status === "processing").length,
    confirmed:  requests.filter((r) => r.status === "confirmed").length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#f4f8fe", maxWidth: "430px", marginInline: "auto" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pb-4" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)", background: "rgba(244,248,254,0.95)", backdropFilter: "blur(12px)" }}>
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 rounded-xl flex-shrink-0 px-3"
          style={{ height: 38, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        >
          <ArrowLeft size={15} color="#1a1f3a" />
          {backLabel && <span className="text-xs font-semibold" style={{ color: "#1a1f3a" }}>{backLabel}</span>}
        </button>
        <div>
          <h1 className="text-base font-bold" style={{ color: "#1a1f3a" }}>Betreuungsanfragen</h1>
          <p className="text-xs" style={{ color: "#94a3b8" }}>LOYAGO Admin</p>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {([
          { value: "all",        label: "Alle" },
          { value: "pending",    label: "Eingereicht" },
          { value: "processing", label: "In Bearbeitung" },
          { value: "confirmed",  label: "Abgeschlossen" },
        ] as const).map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all"
            style={{
              background: filter === f.value ? "#1a1f3a" : "white",
              color: filter === f.value ? "white" : "#64748b",
              border: "1.5px solid",
              borderColor: filter === f.value ? "#1a1f3a" : "#e8f0fd",
            }}
          >
            {f.label}
            <span
              className="rounded-full px-1.5 py-0.5 text-xs font-bold"
              style={{
                background: filter === f.value ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                color: filter === f.value ? "white" : "#64748b",
                minWidth: 18,
                textAlign: "center",
              }}
            >
              {counts[f.value]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {loading ? (
          <p className="text-center text-sm mt-12" style={{ color: "#94a3b8" }}>Lädt …</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm mt-12" style={{ color: "#94a3b8" }}>Keine Anfragen in dieser Kategorie</p>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((req) => <RequestRow key={req.id} req={req} />)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
