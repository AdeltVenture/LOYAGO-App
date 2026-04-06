import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, X } from "lucide-react";
import { popularInsurers, type OnboardingData } from "../../data/onboarding";

const PRODUKT_SUGGESTIONS = [
  "Berufsunfähigkeit (BU)",
  "Haftpflicht",
  "Hausrat",
  "KFZ",
  "Krankenversicherung (PKV)",
  "Krankenzusatz",
  "Lebensversicherung",
  "Pflegezusatz",
  "Reisekranken",
  "Reiserücktritt",
  "Rechtsschutz",
  "Risikoleben",
  "Tierkranken",
  "Unfallversicherung",
  "Wohngebäude",
  "Zahnzusatz",
];

const SORTED_INSURERS = [...popularInsurers].sort((a, b) =>
  a.name.localeCompare(b.name, "de")
);

interface Step3InsurersProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export default function Step3Insurers({ data, onChange, onNext }: Step3InsurersProps) {
  const [insurerSearch, setInsurerSearch] = useState("");
  const [insurerFocused, setInsurerFocused] = useState(false);
  const [produktSearch, setProduktSearch] = useState("");
  const insurerRef = useRef<HTMLDivElement>(null);
  const produktRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (insurerRef.current && !insurerRef.current.contains(e.target as Node)) {
        setInsurerFocused(false);
      }
      if (produktRef.current && !produktRef.current.contains(e.target as Node)) {
        setProduktFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredInsurers = SORTED_INSURERS.filter(
    (ins) =>
      ins.name.toLowerCase().includes(insurerSearch.toLowerCase()) &&
      !data.selectedInsurers.includes(ins.id)
  );

  const [produktFocused, setProduktFocused] = useState(false);

  const filteredProdukte = PRODUKT_SUGGESTIONS.filter((p) =>
    p.toLowerCase().includes(produktSearch.toLowerCase()) &&
    p.toLowerCase() !== data.contractName.toLowerCase()
  );

  function selectInsurer(id: string) {
    onChange({ selectedInsurers: [...data.selectedInsurers, id] });
    setInsurerSearch("");
    setInsurerFocused(false);
  }

  function removeInsurer(id: string) {
    onChange({ selectedInsurers: data.selectedInsurers.filter((x) => x !== id) });
  }

  function getInsurerName(id: string) {
    const found = popularInsurers.find((ins) => ins.id === id);
    return found ? found.name : id.replace("custom-", "").replace(/-/g, " ");
  }

  function addCustomInsurer() {
    const name = insurerSearch.trim();
    if (!name) return;
    const id = `custom-${name.toLowerCase().replace(/\s+/g, "-")}`;
    if (!data.selectedInsurers.includes(id)) {
      onChange({ selectedInsurers: [...data.selectedInsurers, id] });
    }
    setInsurerSearch("");
    setInsurerFocused(false);
  }

  const selectedCount = data.selectedInsurers.length;
  const canProceed = selectedCount > 0 || data.contractName.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      <div className="mb-1">
        <h3 className="text-lg font-bold" style={{ color: "#1a1f3a" }}>
          Versicherer &amp; Produkt
        </h3>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Wählen Sie den Versicherer und die Produktart aus.
        </p>
      </div>

      {/* ── Versicherer ── */}
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
          Versicherer
        </label>

        {/* Selected chips */}
        <AnimatePresence>
          {selectedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-1.5 mb-2"
            >
              {data.selectedInsurers.map((id) => (
                <motion.span
                  key={id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                  style={{ background: "#1a1f3a", color: "white" }}
                >
                  {getInsurerName(id)}
                  <button
                    onClick={() => removeInsurer(id)}
                    className="flex items-center justify-center rounded-full"
                    style={{ width: 14, height: 14, background: "rgba(255,255,255,0.2)", flexShrink: 0 }}
                  >
                    <X size={9} style={{ color: "white" }} />
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search input with dropdown */}
        <div ref={insurerRef} className="relative">
          <div
            className="flex items-center gap-2 px-3 rounded-xl"
            style={{
              background: "white",
              border: `1.5px solid ${insurerFocused ? "#4a6da8" : "#e2e8f0"}`,
              height: 46,
              transition: "border-color 0.15s",
            }}
          >
            <Search size={15} style={{ color: "#94a3b8", flexShrink: 0 }} />
            <input
              value={insurerSearch}
              onChange={(e) => setInsurerSearch(e.target.value)}
              onFocus={() => setInsurerFocused(true)}
              onKeyDown={(e) => { if (e.key === "Enter" && filteredInsurers.length === 0 && insurerSearch.trim()) addCustomInsurer(); }}
              placeholder="Versicherer suchen …"
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color: "#1a1f3a" }}
            />
          </div>

          <AnimatePresence>
            {insurerFocused && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 z-20 rounded-2xl overflow-hidden"
                style={{
                  top: "calc(100% + 6px)",
                  background: "white",
                  boxShadow: "0 8px 24px rgba(26,31,58,0.12)",
                  border: "1px solid #e2e8f0",
                  maxHeight: 240,
                  overflowY: "auto",
                }}
              >
                {filteredInsurers.length > 0 ? (
                  filteredInsurers.map((ins) => (
                    <button
                      key={ins.id}
                      onMouseDown={() => selectInsurer(ins.id)}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium"
                      style={{ color: "#1a1f3a", borderBottom: "1px solid #f1f5f9" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f4f8fe")}
                      onMouseLeave={e => (e.currentTarget.style.background = "white")}
                    >
                      {ins.name}
                    </button>
                  ))
                ) : insurerSearch.trim() ? (
                  <button
                    onMouseDown={addCustomInsurer}
                    className="w-full px-4 py-2.5 text-left text-sm"
                    style={{ color: "#4a6da8" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f4f8fe")}
                    onMouseLeave={e => (e.currentTarget.style.background = "white")}
                  >
                    „{insurerSearch}" hinzufügen
                  </button>
                ) : (
                  SORTED_INSURERS
                    .filter((ins) => !data.selectedInsurers.includes(ins.id))
                    .map((ins) => (
                      <button
                        key={ins.id}
                        onMouseDown={() => selectInsurer(ins.id)}
                        className="w-full px-4 py-2.5 text-left text-sm font-medium"
                        style={{ color: "#1a1f3a", borderBottom: "1px solid #f1f5f9" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#f4f8fe")}
                        onMouseLeave={e => (e.currentTarget.style.background = "white")}
                      >
                        {ins.name}
                      </button>
                    ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Produktart ── */}
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
          Produktart / Vertragsart
        </label>

        {/* Selected chip */}
        <AnimatePresence>
          {data.contractName && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-1.5 mb-2"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{ background: "#1a1f3a", color: "white" }}
              >
                {data.contractName}
                <button
                  onClick={() => { onChange({ contractName: "" }); setProduktSearch(""); }}
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 14, height: 14, background: "rgba(255,255,255,0.2)", flexShrink: 0 }}
                >
                  <X size={9} style={{ color: "white" }} />
                </button>
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search input with dropdown */}
        <div ref={produktRef} className="relative">
          <div
            className="flex items-center gap-2 px-3 rounded-xl"
            style={{
              background: "white",
              border: `1.5px solid ${produktFocused ? "#4a6da8" : "#e2e8f0"}`,
              height: 46,
              transition: "border-color 0.15s",
            }}
          >
            <Search size={15} style={{ color: "#94a3b8", flexShrink: 0 }} />
            <input
              type="text"
              value={produktSearch}
              onChange={(e) => setProduktSearch(e.target.value)}
              onFocus={() => setProduktFocused(true)}
              placeholder="Produktart suchen …"
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color: "#1a1f3a" }}
            />
          </div>

          <AnimatePresence>
            {produktFocused && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 z-20 rounded-2xl overflow-hidden"
                style={{
                  top: "calc(100% + 6px)",
                  background: "white",
                  boxShadow: "0 8px 24px rgba(26,31,58,0.12)",
                  border: "1px solid #e2e8f0",
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                {(filteredProdukte.length > 0
                  ? filteredProdukte
                  : PRODUKT_SUGGESTIONS.filter((p) => p.toLowerCase() !== data.contractName.toLowerCase())
                ).map((p) => (
                  <button
                    key={p}
                    onMouseDown={() => { onChange({ contractName: p }); setProduktSearch(""); setProduktFocused(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium"
                    style={{ color: "#1a1f3a", borderBottom: "1px solid #f1f5f9" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f4f8fe")}
                    onMouseLeave={e => (e.currentTarget.style.background = "white")}
                  >
                    {p}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold mt-2"
        style={{ background: "#1a1f3a", color: "white" }}
      >
        {canProceed ? "Weiter" : "Überspringen"}
        <ChevronRight size={18} />
      </motion.button>

      {!canProceed && (
        <p className="text-center text-xs" style={{ color: "#94a3b8" }}>
          Angaben können auch später ergänzt werden
        </p>
      )}
    </motion.div>
  );
}
