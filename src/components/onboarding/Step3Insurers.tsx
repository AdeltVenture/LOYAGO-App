import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, ChevronRight, X } from "lucide-react";
import { popularInsurers, type OnboardingData } from "../../data/onboarding";

const PRODUKT_SUGGESTIONS = [
  "KFZ-Haftpflicht",
  "Vollkaskoversicherung",
  "Teilkaskoversicherung",
  "Hausratversicherung",
  "Privathaftpflicht",
  "Berufsunfähigkeitsversicherung (BU)",
  "Lebensversicherung",
  "Risikolebensversicherung",
  "Private Krankenversicherung (PKV)",
  "Zahnzusatzversicherung",
  "Reisekrankenversicherung",
  "Reiserücktrittsversicherung",
  "Unfallversicherung",
  "Rechtsschutzversicherung",
  "Wohngebäudeversicherung",
  "Elementarschadenversicherung",
  "Tierkrankenversicherung",
  "Pflegezusatzversicherung",
];

interface Step3InsurersProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export default function Step3Insurers({ data, onChange, onNext }: Step3InsurersProps) {
  const [insurerSearch, setInsurerSearch] = useState("");
  const [insurerFocused, setInsurerFocused] = useState(false);
  const [produktFocused, setProduktFocused] = useState(false);
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

  const filteredInsurers = popularInsurers.filter(
    (ins) =>
      ins.name.toLowerCase().includes(insurerSearch.toLowerCase()) &&
      !data.selectedInsurers.includes(ins.id)
  );

  const filteredProdukte = PRODUKT_SUGGESTIONS.filter((p) =>
    p.toLowerCase().includes(data.contractName.toLowerCase()) &&
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

  function getInsurerLogo(id: string) {
    return popularInsurers.find((ins) => ins.id === id)?.logo ?? "🏢";
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
                  <span>{getInsurerLogo(id)}</span>
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
                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                      style={{ borderBottom: "1px solid #f8fafc" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f4f8fe")}
                      onMouseLeave={e => (e.currentTarget.style.background = "white")}
                    >
                      <span style={{ fontSize: 18 }}>{ins.logo}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "#1a1f3a" }}>{ins.name}</p>
                        <p className="text-xs truncate" style={{ color: "#94a3b8" }}>{ins.categories.join(", ")}</p>
                      </div>
                    </button>
                  ))
                ) : insurerSearch.trim() ? (
                  <button
                    onMouseDown={addCustomInsurer}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    onMouseEnter={e => (e.currentTarget.style.background = "#f4f8fe")}
                    onMouseLeave={e => (e.currentTarget.style.background = "white")}
                  >
                    <span style={{ fontSize: 18 }}>🏢</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#1a1f3a" }}>„{insurerSearch}" hinzufügen</p>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>Nicht in der Liste</p>
                    </div>
                  </button>
                ) : (
                  popularInsurers
                    .filter((ins) => !data.selectedInsurers.includes(ins.id))
                    .map((ins) => (
                      <button
                        key={ins.id}
                        onMouseDown={() => selectInsurer(ins.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left"
                        style={{ borderBottom: "1px solid #f8fafc" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#f4f8fe")}
                        onMouseLeave={e => (e.currentTarget.style.background = "white")}
                      >
                        <span style={{ fontSize: 18 }}>{ins.logo}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "#1a1f3a" }}>{ins.name}</p>
                          <p className="text-xs truncate" style={{ color: "#94a3b8" }}>{ins.categories.join(", ")}</p>
                        </div>
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
        <div ref={produktRef} className="relative">
          <input
            type="text"
            value={data.contractName}
            onChange={(e) => onChange({ contractName: e.target.value })}
            onFocus={() => setProduktFocused(true)}
            placeholder="z. B. Reisekrankenversicherung …"
            className="w-full rounded-xl px-3 py-3 text-sm outline-none"
            style={{
              background: "white",
              border: `1.5px solid ${produktFocused ? "#4a6da8" : "#e2e8f0"}`,
              color: "#1a1f3a",
              transition: "border-color 0.15s",
            }}
          />

          <AnimatePresence>
            {produktFocused && filteredProdukte.length > 0 && (
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
                {filteredProdukte.map((p) => (
                  <button
                    key={p}
                    onMouseDown={() => { onChange({ contractName: p }); setProduktFocused(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm"
                    style={{ borderBottom: "1px solid #f8fafc", color: "#1a1f3a" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f4f8fe")}
                    onMouseLeave={e => (e.currentTarget.style.background = "white")}
                  >
                    <Check size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
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
