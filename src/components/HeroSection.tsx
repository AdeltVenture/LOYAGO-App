import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import CloudBackground from "./CloudBackground";
import { type Contract } from "../data/contracts";
import { CheckCircle, AlertTriangle, Phone, X, ArrowRight, Sparkles } from "lucide-react";
import ContractCard from "./ContractCard";

const R = 52;
const CX = 66;
const CY = 66;
const CIRCUMFERENCE = 2 * Math.PI * R;

function ScoreRing({ score }: { score: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const offset = CIRCUMFERENCE * (1 - score / 100);
  const angleDeg = -90 + (score / 100) * 360;
  const angleRad = (angleDeg * Math.PI) / 180;
  const dotX = CX + R * Math.cos(angleRad);
  const dotY = CY + R * Math.sin(angleRad);

  return (
    <div className="relative" style={{ width: 132, height: 132 }}>
      <svg width="132" height="132" viewBox="0 0 132 132" className="absolute inset-0">
        <circle cx={CX} cy={CY} r={R + 6} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="9" />
        <motion.circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke="#1a1f3a"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform={`rotate(-90 ${CX} ${CY})`}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx={dotX} cy={dotY} r={5}
          fill="#1a1f3a"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.65, duration: 0.3, ease: "backOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black leading-none tabular-nums" style={{ fontSize: "30px", color: "#1a1f3a", letterSpacing: "-1.5px" }}>
          {display}%
        </span>
        <span className="font-bold uppercase" style={{ fontSize: "7.5px", color: "#1a1f3a", opacity: 0.55, marginTop: 3, letterSpacing: "0.14em" }}>
          Geschützt
        </span>
      </div>
    </div>
  );
}

export default function HeroSection({ contracts, firstName, onCall, onSelectContract }: { contracts: Contract[]; firstName?: string; onCall: () => void; onSelectContract: (c: Contract) => void }) {
  const [showIssues, setShowIssues] = useState(false);
  const totalMonthly = contracts.reduce((s, c) => s + c.monthlyPremium, 0);
  const totalAnnual = contracts.reduce((s, c) => s + c.annualPremium, 0);
  const optimalCount = contracts.filter((c) => c.status === "gut").length;
  const issueContracts = contracts.filter((c) => c.status === "mangelhaft");
  const issueCount = issueContracts.length;
  const coverageScore = contracts.length > 0 ? Math.round((optimalCount / contracts.length) * 100) : 0;

  return (
    <div className="relative overflow-hidden" style={{ minHeight: "360px" }}>
      <CloudBackground />
      <div className="relative z-10 px-4 pt-0 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
          <span className="font-black tracking-tight" style={{ fontSize: "22px", color: "#1a1f3a", letterSpacing: "-0.5px" }}>LOYAGO</span>
          <button onClick={onCall} className="flex items-center gap-2 rounded-xl px-3" style={{ height: 36, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(10px)" }}>
            <Phone size={14} color="#1a1f3a" strokeWidth={2.2} />
            <span className="text-xs font-semibold" style={{ color: "#1a1f3a" }}>Anrufen</span>
          </button>
        </div>

        {/* Greeting */}
        <motion.div className="text-center mb-5" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
          <p className="font-bold" style={{ fontSize: "17px", color: "#1a1f3a" }}>Hallo {firstName || "Marco"}!</p>
          <p className="text-xs mt-0.5" style={{ color: "#3d4a6a", opacity: 0.75 }}>Ihr persönliches Versicherungscockpit</p>
        </motion.div>

        {/* Ring — floats on sky, no card */}
        <motion.div className="flex flex-col items-center mb-5" initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
          <ScoreRing score={coverageScore} />
          <motion.div className="mt-3 text-center" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
            <h2 className="font-bold" style={{ fontSize: "20px", color: "#1a1f3a" }}>
              {coverageScore >= 80 ? "Gut versichert" : "Optimierungsbedarf"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#3d4a6a", opacity: 0.8 }}>{contracts.length} aktive Verträge</p>
          </motion.div>
          <motion.div className="flex gap-2 mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", color: "#16a34a" }}>
              <CheckCircle size={12} />
              {optimalCount} Gut
            </div>
            {issueCount > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowIssues(true)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
                style={{ background: "#ef4444", color: "white" }}
              >
                <AlertTriangle size={12} />
                {issueCount} Handlungsbedarf
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-2 gap-3 max-w-sm mx-auto" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.45 }}>
          <div className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", boxShadow: "0 1px 4px rgba(26,31,58,0.07)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "#3d4a6a" }}>Jährlicher Beitrag</p>
            <p className="text-lg font-bold" style={{ color: "#1a1f3a" }}>{totalAnnual.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</p>
          </div>
          <div className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", boxShadow: "0 1px 4px rgba(26,31,58,0.07)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "#3d4a6a" }}>Monatlicher Beitrag</p>
            <p className="text-lg font-bold" style={{ color: "#1a1f3a" }}>{totalMonthly.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</p>
          </div>
        </motion.div>
      </div>

      {/* Handlungsbedarf sheet */}
      <AnimatePresence>
        {showIssues && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(26,31,58,0.45)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIssues(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl pb-10"
              style={{ background: "white", maxWidth: 430, margin: "0 auto", boxShadow: "0 -4px 32px rgba(26,31,58,0.14)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center rounded-xl" style={{ width: 36, height: 36, background: "#fee2e2" }}>
                    <AlertTriangle size={17} color="#dc2626" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#1a1f3a" }}>Handlungsbedarf</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>
                      {issueCount} {issueCount === 1 ? "Vertrag" : "Verträge"} mit Optimierungspotenzial
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIssues(false)}
                  className="flex items-center justify-center rounded-xl"
                  style={{ width: 32, height: 32, background: "#f1f5f9" }}
                >
                  <X size={15} color="#64748b" />
                </button>
              </div>

              <div style={{ height: 1, background: "#f1f5f9" }} />

              <div className="px-4 pt-4 flex flex-col gap-3">
                {issueContracts.map((contract) => (
                  <div key={contract.id}>
                    <ContractCard contract={contract} index={0} onClick={() => { setShowIssues(false); onSelectContract(contract); }} />
                    {contract.optimization && (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setShowIssues(false); onSelectContract(contract); }}
                        className="flex items-center justify-between w-full rounded-2xl px-4 py-3 mt-2"
                        style={{ background: "#1a1f3a", color: "white" }}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} color="#fbbf24" />
                          <span className="text-sm font-bold">{contract.optimization.saving} / Jahr einsparen</span>
                        </div>
                        <ArrowRight size={15} color="white" />
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
