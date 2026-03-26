import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  FileText,
  ShieldCheck,
  Banknote,
  ChevronRight,
  MessageCircle,
  Phone,
} from "lucide-react";
import { type Contract } from "../data/contracts";
import StatusBadge from "./StatusBadge";
import CategoryIcon from "./CategoryIcon";

interface ContractDetailProps {
  contract: Contract;
  onBack: () => void;
  onAskExpert: () => void;
  onCall: () => void;
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className="flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ width: 34, height: 34, background: "#f4f8fe" }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs" style={{ color: "#94a3b8" }}>
          {label}
        </p>
        <p className="text-sm font-medium mt-0.5" style={{ color: "#1a1f3a" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ContractDetail({
  contract,
  onBack,
  onAskExpert,
  onCall,
}: ContractDetailProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
        style={{ background: "#f4f8fe" }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 pt-12 pb-5 sticky top-0 z-10"
          style={{
            background: "rgba(244,248,254,0.92)",
            backdropFilter: "blur(12px)",
          }}
        >
          <button
            onClick={onBack}
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 38,
              height: 38,
              background: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <ArrowLeft size={18} style={{ color: "#1a1f3a" }} />
          </button>
          <div className="flex-1">
            <h2 className="font-bold text-base leading-tight" style={{ color: "#1a1f3a" }}>
              {contract.name}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
              {contract.insurer}
            </p>
          </div>
          <StatusBadge status={contract.status} />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 pb-32">
          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl p-5 mb-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${contract.color}22 0%, ${contract.color}10 100%)`,
              border: `1.5px solid ${contract.color}30`,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <CategoryIcon icon={contract.categoryIcon} color={contract.color} size={22} />
              <div className="text-right">
                <p className="text-xs font-medium" style={{ color: "#64748b" }}>
                  Policen-Nr.
                </p>
                <p
                  className="text-xs font-mono mt-0.5"
                  style={{ color: "#1a1f3a", fontSize: "11px" }}
                >
                  {contract.policyNumber}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  Monatlich
                </p>
                <p className="text-xl font-bold mt-0.5" style={{ color: "#1a1f3a" }}>
                  {contract.monthlyPremium > 0
                    ? `${contract.monthlyPremium.toLocaleString("de-DE", {
                        minimumFractionDigits: 2,
                      })} €`
                    : "Beitragsfrei"}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  Jährlich
                </p>
                <p className="text-xl font-bold mt-0.5" style={{ color: "#1a1f3a" }}>
                  {contract.annualPremium > 0
                    ? `${contract.annualPremium.toLocaleString("de-DE")} €`
                    : "–"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Details card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl px-4 mb-4"
            style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <InfoRow
              label="Deckungssumme / Leistung"
              value={contract.coverage}
              icon={<ShieldCheck size={16} style={{ color: contract.color }} />}
            />
            <div style={{ height: "1px", background: "#f1f5f9" }} />
            <InfoRow
              label="Selbstbeteiligung"
              value={contract.deductible}
              icon={<Banknote size={16} style={{ color: "#94a3b8" }} />}
            />
            <div style={{ height: "1px", background: "#f1f5f9" }} />
            <InfoRow
              label="Vertragsbeginn"
              value={contract.startDate}
              icon={<Calendar size={16} style={{ color: "#94a3b8" }} />}
            />
            <div style={{ height: "1px", background: "#f1f5f9" }} />
            <InfoRow
              label="Nächste Verlängerung"
              value={contract.renewalDate}
              icon={<Calendar size={16} style={{ color: "#f59e0b" }} />}
            />
          </motion.div>

          {/* Notes */}
          {contract.notes && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-4 mb-4"
              style={{
                background: "#fef9ec",
                border: "1.5px solid #fde68a",
              }}
            >
              <div className="flex items-start gap-2">
                <FileText size={15} style={{ color: "#d97706", marginTop: 1, flexShrink: 0 }} />
                <p className="text-sm" style={{ color: "#92400e", lineHeight: 1.5 }}>
                  {contract.notes}
                </p>
              </div>
            </motion.div>
          )}

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl mb-4"
            style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <button className="flex items-center gap-3 w-full px-4 py-3.5">
              <FileText size={17} style={{ color: "#3b82f6" }} />
              <span className="flex-1 text-sm font-medium text-left" style={{ color: "#1a1f3a" }}>
                Versicherungsschein anzeigen
              </span>
              <ChevronRight size={16} style={{ color: "#cbd5e1" }} />
            </button>
            <div style={{ height: "1px", background: "#f1f5f9", marginLeft: 52 }} />
            <button className="flex items-center gap-3 w-full px-4 py-3.5">
              <FileText size={17} style={{ color: "#3b82f6" }} />
              <span className="flex-1 text-sm font-medium text-left" style={{ color: "#1a1f3a" }}>
                Alle Dokumente
              </span>
              <ChevronRight size={16} style={{ color: "#cbd5e1" }} />
            </button>
          </motion.div>
        </div>

        {/* Bottom actions */}
        <div
          className="fixed bottom-0 left-0 right-0 px-4 pb-8 pt-4"
          style={{
            background: "linear-gradient(to top, #f4f8fe 70%, transparent)",
            maxWidth: "430px",
            marginInline: "auto",
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onAskExpert}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #cbdafb 0%, #a8c0f8 100%)",
                color: "#1a1f3a",
                border: "none",
              }}
            >
              <MessageCircle size={16} />
              Experte fragen
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onCall}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
              style={{
                background: "#1a1f3a",
                color: "white",
                border: "none",
              }}
            >
              <Phone size={16} />
              Jetzt anrufen
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
