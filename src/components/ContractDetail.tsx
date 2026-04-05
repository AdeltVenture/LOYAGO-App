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
  Sparkles,
  CalendarClock,
} from "lucide-react";
import { useState } from "react";
import { type Contract } from "../data/contracts";
import StatusBadge from "./StatusBadge";
import CategoryIcon from "./CategoryIcon";
import BookingSheet from "./BookingSheet";

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
  const [showBooking, setShowBooking] = useState(false);

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

          {/* Optimization CTA — only shown when contract has optimization data */}
          {contract.optimization && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.13 }}
              className="rounded-3xl overflow-hidden mb-4"
              style={{ background: "#1a1f3a" }}
            >
              {/* Amber accent bar */}
              <div style={{ height: 4, background: "linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)", backgroundSize: "200% 100%" }} />

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center rounded-lg" style={{ width: 30, height: 30, background: "rgba(245,158,11,0.18)" }}>
                    <Sparkles size={15} color="#fbbf24" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#fbbf24", letterSpacing: "0.1em" }}>
                    Optimierungspotenzial
                  </span>
                </div>

                <p className="font-bold mb-2" style={{ fontSize: 22, color: "white", lineHeight: 1.2 }}>
                  {contract.optimization.headline}
                </p>
                <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  {contract.optimization.detail}
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={onAskExpert}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
                    style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1.5px solid rgba(255,255,255,0.18)" }}
                  >
                    <MessageCircle size={15} />
                    Im Chat besprechen
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setShowBooking(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold"
                    style={{ background: "#f59e0b", color: "#1a1f3a" }}
                  >
                    <CalendarClock size={15} />
                    Termin buchen
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

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
          {contract.documentUrl && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl mb-4"
              style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <button
                onClick={() => window.open(contract.documentUrl, "_blank", "noopener,noreferrer")}
                className="flex items-center gap-3 w-full px-4 py-3.5"
              >
                <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ width: 34, height: 34, background: "#eaeff8" }}>
                  <FileText size={17} style={{ color: "#4a6da8" }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium" style={{ color: "#1a1f3a" }}>Versicherungsschein</p>
                  <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>PDF öffnen</p>
                </div>
                <ChevronRight size={16} style={{ color: "#cbd5e1" }} />
              </button>
            </motion.div>
          )}
        </div>

        {/* Bottom actions — mobile: sticky bar, desktop: vertical sidebar right of content */}
        <div
          className="fixed bottom-0 px-4 pb-8 pt-4 md:bottom-auto md:top-1/2 md:px-0 md:pb-0 md:pt-0 md:flex md:flex-col md:gap-3"
          style={{
            // Mobile: full-width bottom bar centered in 430px
            left: 0,
            right: 0,
            background: "linear-gradient(to top, #f4f8fe 70%, transparent)",
            maxWidth: "430px",
            marginInline: "auto",
            // Desktop overrides via inline for positioning outside content
          }}
        >
          {/* Mobile layout */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onAskExpert}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #cbdafb 0%, #a8c0f8 100%)", color: "#1a1f3a" }}
            >
              <MessageCircle size={16} />
              Experte fragen
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onCall}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
              style={{ background: "#1a1f3a", color: "white" }}
            >
              <Phone size={16} />
              Jetzt anrufen
            </motion.button>
          </div>
        </div>

        {/* Desktop sidebar buttons — outside content column, anchored right */}
        <div
          className="hidden md:flex flex-col gap-3 fixed"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            right: "max(16px, calc((100vw - 430px) / 2 - 160px))",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onAskExpert}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold shadow-lg"
            style={{ background: "linear-gradient(135deg, #cbdafb 0%, #a8c0f8 100%)", color: "#1a1f3a", whiteSpace: "nowrap" }}
          >
            <MessageCircle size={16} />
            Experte fragen
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onCall}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold shadow-lg"
            style={{ background: "#1a1f3a", color: "white", whiteSpace: "nowrap" }}
          >
            <Phone size={16} />
            Jetzt anrufen
          </motion.button>
        </div>
      </motion.div>

      {/* Booking sheet */}
      <AnimatePresence>
        {showBooking && (
          <BookingSheet
            contractName={contract.name}
            onClose={() => setShowBooking(false)}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
