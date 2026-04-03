import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, ChevronDown, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useCareRequests, type CareRequest } from "../hooks/useCareRequests";

const statusConfig: Record<
  CareRequest["status"],
  { label: string; bg: string; text: string; dot: string; Icon: React.ComponentType<{ size: number; color: string }> }
> = {
  pending:    { label: "Eingereicht",    bg: "#fef9c3", text: "#854d0e", dot: "#eab308", Icon: Clock },
  processing: { label: "In Bearbeitung", bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6", Icon: Loader2 },
  confirmed:  { label: "Abgeschlossen",  bg: "#dcfce7", text: "#15803d", dot: "#22c55e", Icon: CheckCircle2 },
};

function StatusPill({ status }: { status: CareRequest["status"] }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-semibold"
      style={{ background: cfg.bg, color: cfg.text, fontSize: 11, padding: "3px 9px" }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block", flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function RequestCard({ req }: { req: CareRequest }) {
  const date = new Date(req.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const insurerText = req.insurers.length > 0 ? req.insurers.join(", ") : "Keine Anbieter angegeben";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl px-4 py-3.5 flex flex-col gap-2"
      style={{ background: "white", boxShadow: "0 1px 4px rgba(26,31,58,0.07)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug" style={{ color: "#1a1f3a" }}>
          Betreuungsauftrag
        </p>
        <StatusPill status={req.status} />
      </div>
      <p className="text-xs leading-snug" style={{ color: "#64748b" }}>
        {insurerText}
      </p>
      <p className="text-xs" style={{ color: "#94a3b8" }}>
        Eingereicht am {date}
      </p>
    </motion.div>
  );
}

export default function CareRequestsSection() {
  const { requests, loading } = useCareRequests();
  const [expanded, setExpanded] = useState(true);

  if (loading || requests.length === 0) return null;

  return (
    <div className="mt-4">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between w-full mb-3"
      >
        <div className="flex items-center gap-2">
          <ClipboardList size={15} color="#4a6da8" />
          <span className="text-sm font-semibold" style={{ color: "#1a1f3a" }}>
            Meine Betreuungsanfragen
          </span>
          <span
            className="text-xs font-bold rounded-full px-1.5 py-0.5"
            style={{ background: "#e8f0fd", color: "#4a6da8", minWidth: 20, textAlign: "center" }}
          >
            {requests.length}
          </span>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} color="#94a3b8" />
        </motion.span>
      </button>

      {/* Cards */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2 overflow-hidden"
          >
            {requests.map((req) => (
              <RequestCard key={req.id} req={req} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
