import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { type Contract } from "../data/contracts";
import StatusBadge from "./StatusBadge";
import CategoryIcon from "./CategoryIcon";

interface ContractCardProps {
  contract: Contract;
  index: number;
  onClick: (contract: Contract) => void;
}

export default function ContractCard({ contract, index, onClick }: ContractCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(contract)}
      className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer active:scale-98"
      style={{
        background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <CategoryIcon icon={contract.categoryIcon} color={contract.color} size={20} />

      <div className="flex-1 min-w-0">
        <p
          className="font-semibold text-sm leading-tight truncate"
          style={{ color: "#1a1f3a" }}
        >
          {contract.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
          {contract.insurer}
        </p>
        <p className="text-xs mt-1 font-medium" style={{ color: "#475569" }}>
          {contract.annualPremium > 0
            ? `${contract.annualPremium.toLocaleString("de-DE")} € / Jahr`
            : "Beitragsfreie Leistung"}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <StatusBadge status={contract.status} size="sm" />
        <ChevronRight size={16} style={{ color: "#cbd5e1" }} />
      </div>
    </motion.div>
  );
}
