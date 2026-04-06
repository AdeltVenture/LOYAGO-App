import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, ChevronRight, Plus } from "lucide-react";
import { popularInsurers, type OnboardingData } from "../../data/onboarding";

interface Step3InsurersProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export default function Step3Insurers({ data, onChange, onNext }: Step3InsurersProps) {
  const [search, setSearch] = useState("");
  const [customInsurer, setCustomInsurer] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const filtered = popularInsurers.filter((ins) =>
    ins.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggleInsurer(id: string) {
    const current = data.selectedInsurers;
    if (current.includes(id)) {
      onChange({ selectedInsurers: current.filter((x) => x !== id) });
    } else {
      onChange({ selectedInsurers: [...current, id] });
    }
  }

  function addCustom() {
    if (!customInsurer.trim()) return;
    const id = `custom-${customInsurer.toLowerCase().replace(/\s/g, "-")}`;
    onChange({ selectedInsurers: [...data.selectedInsurers, id] });
    setCustomInsurer("");
    setShowCustomInput(false);
  }

  const selectedCount = data.selectedInsurers.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4"
    >
      <div className="mb-1">
        <h3 className="text-lg font-bold" style={{ color: "#1a1f3a" }}>
          Versicherer & Produkt
        </h3>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Wählen Sie den Versicherer und geben Sie die Produktart an.
        </p>
      </div>

      {/* Contract name */}
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
          Produktart / Vertragsart
        </label>
        <input
          type="text"
          value={data.contractName}
          onChange={(e) => onChange({ contractName: e.target.value })}
          placeholder="z. B. Reisekrankenversicherung, KFZ-Haftpflicht …"
          className="w-full rounded-xl px-3 py-3 text-sm outline-none"
          style={{ background: "white", border: "1.5px solid #e2e8f0", color: "#1a1f3a" }}
          onFocus={e => (e.target.style.borderColor = "#4a6da8")}
          onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
        />
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 rounded-xl"
        style={{ background: "white", border: "1.5px solid #e2e8f0", height: 44 }}
      >
        <Search size={15} style={{ color: "#94a3b8" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Versicherer suchen …"
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: "#1a1f3a" }}
        />
      </div>

      {/* Insurer grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((ins) => {
          const isSelected = data.selectedInsurers.includes(ins.id);
          return (
            <motion.button
              key={ins.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleInsurer(ins.id)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-left relative"
              style={{
                background: isSelected ? "#1a1f3a" : "white",
                border: `1.5px solid ${isSelected ? "#1a1f3a" : "#e2e8f0"}`,
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 20 }}>{ins.logo}</span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-semibold truncate"
                  style={{ color: isSelected ? "white" : "#1a1f3a" }}
                >
                  {ins.name}
                </p>
                <p
                  className="text-xs truncate mt-0.5"
                  style={{ color: isSelected ? "rgba(255,255,255,0.6)" : "#94a3b8", fontSize: "10px" }}
                >
                  {ins.categories[0]}
                  {ins.categories.length > 1 ? ` +${ins.categories.length - 1}` : ""}
                </p>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 rounded-full flex items-center justify-center"
                  style={{ width: 18, height: 18, background: "#22c55e" }}
                >
                  <Check size={11} style={{ color: "white" }} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Add custom insurer */}
      <AnimatePresence>
        {showCustomInput ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
          >
            <div
              className="flex-1 flex items-center gap-2 px-3 rounded-xl"
              style={{ background: "white", border: "1.5px solid #cbdafb", height: 44 }}
            >
              <input
                value={customInsurer}
                onChange={(e) => setCustomInsurer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustom()}
                placeholder="Name des Versicherers …"
                autoFocus
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: "#1a1f3a" }}
              />
            </div>
            <button
              onClick={addCustom}
              className="px-4 rounded-xl text-sm font-semibold"
              style={{ background: "#1a1f3a", color: "white" }}
            >
              Hinzufügen
            </button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowCustomInput(true)}
            className="flex items-center gap-2 text-sm font-medium py-2"
            style={{ color: "#3b82f6", background: "transparent", border: "none" }}
          >
            <Plus size={15} />
            Anderer Versicherer (nicht in der Liste)
          </motion.button>
        )}
      </AnimatePresence>

      {/* Selection summary */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-xl px-4 py-3 flex items-center gap-2"
            style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
          >
            <Check size={14} style={{ color: "#16a34a" }} />
            <p className="text-sm font-medium" style={{ color: "#166534" }}>
              {selectedCount} Versicherer ausgewählt
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold"
        style={{ background: "#1a1f3a", color: "white", border: "none" }}
      >
        {selectedCount === 0 ? "Überspringen" : "Weiter"}
        <ChevronRight size={18} />
      </motion.button>

      {selectedCount === 0 && (
        <p className="text-center text-xs" style={{ color: "#94a3b8" }}>
          Sie können Versicherer auch später manuell eintragen
        </p>
      )}
    </motion.div>
  );
}
