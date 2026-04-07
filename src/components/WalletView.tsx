import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { type Contract, type ContractStatus } from "../data/contracts";
import ContractCard from "./ContractCard";
import CareRequestsSection from "./CareRequestsSection";

interface WalletViewProps {
  contracts: Contract[];
  onSelectContract: (contract: Contract) => void;
  onAddContract?: () => void;
}

const filters: { label: string; value: ContractStatus | "all" }[] = [
  { label: "Alle", value: "all" },
  { label: "Gut", value: "gut" },
  { label: "Mangelhaft", value: "mangelhaft" },
];

export default function WalletView({ contracts, onSelectContract, onAddContract }: WalletViewProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ContractStatus | "all">("all");

  const filtered = contracts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.insurer.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "all" || c.status === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      <div
        className="flex items-center gap-2 px-3 rounded-xl"
        style={{
          background: "white",
          border: "1.5px solid #e8f0fd",
          height: "44px",
        }}
      >
        <Search size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Versicherung oder Anbieter suchen …"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: "#1a1f3a" }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "#f1f5f9", color: "#64748b" }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className="flex-shrink-0 text-xs font-medium px-4 py-1.5 rounded-full transition-all"
            style={{
              background: activeFilter === f.value ? "#1a1f3a" : "white",
              color: activeFilter === f.value ? "white" : "#64748b",
              border: "1.5px solid",
              borderColor: activeFilter === f.value ? "#1a1f3a" : "#e8f0fd",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Contract list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
            style={{ color: "#94a3b8" }}
          >
            <p className="text-sm">Keine Verträge gefunden</p>
          </motion.div>
        ) : (
          filtered.map((contract, i) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              index={i}
              onClick={onSelectContract}
            />
          ))
        )}
      </div>

      {/* Submitted care requests */}
      <CareRequestsSection />

      {/* Add contract CTA — shimmer sweep draws attention without being loud */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onAddContract}
        className="relative overflow-hidden flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold mt-2"
        style={{
          background: "linear-gradient(135deg, #cbdafb 0%, #a8c0f8 100%)",
          color: "#1a1f3a",
          border: "none",
        }}
      >
        {/* Shimmer overlay */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)",
            borderRadius: "inherit",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "160%" }}
          transition={{
            duration: 0.75,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 3.5,
          }}
        />
        <span className="relative z-10">+ Betreuungswunsch für weiteren Vertrag</span>
      </motion.button>
    </div>
  );
}
