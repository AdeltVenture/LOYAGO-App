import { motion } from "framer-motion";
import { ChevronRight, Bell, Car, Shield, Home, Heart, Plane, TrendingUp, FileText, Umbrella, Stethoscope, Zap, Scale } from "lucide-react";
import { type Contract } from "../data/contracts";
import StatusBadge from "./StatusBadge";

// Curated palette: cool pastels tuned to harmonise with the app's navy (#1a1f3a)
const iconPalette: Record<string, { bg: string; fg: string; Icon: React.ElementType }> = {
  shield:        { bg: "#eaeff8", fg: "#4a6da8", Icon: Shield },
  home:          { bg: "#edeaf7", fg: "#5e559c", Icon: Home },
  car:           { bg: "#e5edf6", fg: "#3a6a94", Icon: Car },
  "trending-up": { bg: "#e4f2ec", fg: "#2e7d62", Icon: TrendingUp },
  heart:         { bg: "#f2eaef", fg: "#8a4a68", Icon: Heart },
  plane:         { bg: "#e4eff5", fg: "#2e7a92", Icon: Plane },
  umbrella:      { bg: "#e8edf8", fg: "#4a62a8", Icon: Umbrella },
  stethoscope:   { bg: "#eaf1f0", fg: "#3a7a78", Icon: Stethoscope },
  zap:           { bg: "#edeaf5", fg: "#6a559c", Icon: Zap },
  scale:         { bg: "#eaecf5", fg: "#4a5294", Icon: Scale },
};

function CategoryIcon({ icon, index, status }: { icon: string; index: number; status: string }) {
  const entry = iconPalette[icon] ?? { bg: "#eaeff8", fg: "#4a6da8", Icon: FileText };
  const { bg, fg, Icon } = entry;
  const isUrgent = status === "mangelhaft";

  return (
    <div className="relative flex-shrink-0">
      {isUrgent && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: "#ef4444" }}
          animate={{ opacity: [0.18, 0, 0.18] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 20, delay: index * 0.055 + 0.04 }}
        whileHover={{ scale: 1.13, transition: { type: "spring", stiffness: 500, damping: 16 } }}
        whileTap={{ scale: 0.92 }}
        className="flex items-center justify-center rounded-2xl relative"
        style={{ width: 46, height: 46, background: bg }}
      >
        <Icon size={21} color={fg} strokeWidth={2} />
      </motion.div>
    </div>
  );
}

interface ContractCardProps {
  contract: Contract;
  index: number;
  onClick: (contract: Contract) => void;
}

function getDaysUntilRenewal(dateStr: string): number | null {
  if (!dateStr || dateStr === "–") return null;
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  const diff = date.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function ContractCard({ contract, index, onClick }: ContractCardProps) {
  const daysUntilRenewal = getDaysUntilRenewal(contract.renewalDate);
  const renewalSoon = daysUntilRenewal !== null && daysUntilRenewal >= 0 && daysUntilRenewal <= 60;
  const renewalUrgent = daysUntilRenewal !== null && daysUntilRenewal >= 0 && daysUntilRenewal <= 14;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(contract)}
      className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer relative overflow-hidden"
      style={{
        background: contract.status === "mangelhaft" ? "#fff5f5" : "white",
        boxShadow: contract.status === "mangelhaft"
          ? "0 1px 3px rgba(239,68,68,0.12), 0 1px 2px rgba(239,68,68,0.08)"
          : "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        borderLeft: renewalUrgent || contract.status === "mangelhaft"
          ? "3px solid #ef4444"
          : renewalSoon
          ? "3px solid #f59e0b"
          : "3px solid transparent",
      }}
    >
      <CategoryIcon icon={contract.categoryIcon} index={index} status={contract.status} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight truncate" style={{ color: "#1a1f3a" }}>
          {contract.category}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
          {contract.insurer}
        </p>

        {contract.optimization && !renewalSoon && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-bold" style={{ color: "#d97706" }}>↗</span>
            <p className="text-xs font-semibold" style={{ color: "#d97706" }}>
              {contract.optimization.saving} Einsparpotenzial
            </p>
          </div>
        )}

        {renewalSoon ? (
          <div className="flex items-center gap-1 mt-1">
            <Bell
              size={10}
              style={{ color: renewalUrgent ? "#ef4444" : "#f59e0b", flexShrink: 0 }}
            />
            <p
              className="text-xs font-semibold"
              style={{ color: renewalUrgent ? "#ef4444" : "#d97706" }}
            >
              {daysUntilRenewal === 0
                ? "Kündigungsfrist endet heute"
                : `Kündigungsfrist endet in ${daysUntilRenewal} Tagen`}
            </p>
          </div>
        ) : (
          <p className="text-xs mt-1 font-medium" style={{ color: "#475569" }}>
            {contract.annualPremium > 0
              ? `${contract.annualPremium.toLocaleString("de-DE")} € / Jahr`
              : "Beitragsfreie Leistung"}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <StatusBadge status={contract.status} size="sm" />
        <ChevronRight size={16} style={{ color: "#cbd5e1" }} />
      </div>
    </motion.div>
  );
}
