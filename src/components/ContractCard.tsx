import { motion } from "framer-motion";
import { ChevronRight, Bell, Car, Shield, Home, Heart, Plane, TrendingUp, FileText, Umbrella, Stethoscope, Zap } from "lucide-react";
import { type Contract } from "../data/contracts";
import StatusBadge from "./StatusBadge";

const iconMap: Record<string, React.ElementType> = {
  car:          Car,
  shield:       Shield,
  home:         Home,
  heart:        Heart,
  plane:        Plane,
  "trending-up": TrendingUp,
  umbrella:     Umbrella,
  stethoscope:  Stethoscope,
  zap:          Zap,
};

function CategoryIcon({ icon, color, index, status }: { icon: string; color: string; index: number; status: string }) {
  const Icon = iconMap[icon] ?? FileText;
  const isUrgent = status === "mangelhaft";

  return (
    <div className="relative flex-shrink-0">
      {isUrgent && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: color }}
          animate={{ opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.div
        initial={{ scale: 0.55, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 18, delay: index * 0.06 + 0.05 }}
        whileHover={{ scale: 1.08 }}
        className="flex items-center justify-center rounded-2xl relative"
        style={{
          width: 46,
          height: 46,
          background: `linear-gradient(140deg, ${color}ee 0%, ${color}99 100%)`,
          boxShadow: `0 4px 14px ${color}45`,
        }}
      >
        <Icon size={22} color="white" strokeWidth={2.2} />
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
      <CategoryIcon icon={contract.categoryIcon} color={contract.color} index={index} status={contract.status} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight truncate" style={{ color: "#1a1f3a" }}>
          {contract.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
          {contract.insurer}
        </p>

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
                ? "Läuft heute aus"
                : `Läuft in ${daysUntilRenewal} Tagen aus`}
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
