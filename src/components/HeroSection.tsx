import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CloudBackground from "./CloudBackground";
import { contracts } from "../data/contracts";
import { CheckCircle, AlertTriangle, Phone } from "lucide-react";

const R = 54;
const CX = 70;
const CY = 70;
const CIRCUMFERENCE = 2 * Math.PI * R;

function ScoreRing({ score }: { score: number }) {
  const [display, setDisplay] = useState(0);

  // Count-up animation
  useEffect(() => {
    const duration = 1500;
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

  // Tip dot position (arc endpoint)
  const angleDeg = -90 + (score / 100) * 360;
  const angleRad = (angleDeg * Math.PI) / 180;
  const dotX = CX + R * Math.cos(angleRad);
  const dotY = CY + R * Math.sin(angleRad);

  return (
    <div className="relative" style={{ width: 140, height: 140 }}>
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        className="absolute inset-0"
        style={{ filter: "drop-shadow(0 2px 12px rgba(37,99,235,0.18))" }}
      >
        <defs>
          <linearGradient id="arcGrad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1a1f3a" />
          </linearGradient>
        </defs>

        {/* Track ring */}
        <circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke="rgba(26,31,58,0.10)"
          strokeWidth="10"
        />

        {/* Progress arc */}
        <motion.circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform={`rotate(-90 ${CX} ${CY})`}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Glowing tip dot */}
        <motion.circle
          cx={dotX} cy={dotY} r={6}
          fill="#2563eb"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.55, duration: 0.25, ease: "backOut" }}
          style={{ filter: "drop-shadow(0 0 5px rgba(37,99,235,0.8))" }}
        />
        {/* Pulsing halo around tip */}
        <motion.circle
          cx={dotX} cy={dotY} r={6}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: [0, 0.6, 0], scale: [1, 2.2, 1] }}
          transition={{ delay: 1.8, duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      </svg>

      {/* Inner label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-black leading-none tabular-nums"
          style={{ fontSize: "28px", color: "#1a1f3a", letterSpacing: "-1px" }}
        >
          {display}%
        </span>
        <span
          className="font-semibold uppercase tracking-widest"
          style={{ fontSize: "8px", color: "#64748b", marginTop: 3, letterSpacing: "0.12em" }}
        >
          Geschützt
        </span>
      </div>
    </div>
  );
}

export default function HeroSection({ onCall }: { onCall: () => void }) {
  const totalMonthly = contracts.reduce((s, c) => s + c.monthlyPremium, 0);
  const totalAnnual = contracts.reduce((s, c) => s + c.annualPremium, 0);
  const optimalCount = contracts.filter((c) => c.status === "gut").length;
  const issueCount = contracts.filter((c) => c.status === "mangelhaft").length;
  const coverageScore = Math.round((optimalCount / contracts.length) * 100);

  return (
    <div className="relative overflow-hidden" style={{ minHeight: "340px" }}>
      <CloudBackground />

      <div className="relative z-10 px-4 pt-0 pb-8">
        {/* Header row */}
        <div className="flex items-center justify-between pb-2" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
          <span
            className="font-black tracking-tight"
            style={{ fontSize: "22px", color: "#1a1f3a", letterSpacing: "-0.5px" }}
          >
            LOYAGO
          </span>
          <button
            onClick={onCall}
            className="flex items-center gap-2 rounded-xl px-3"
            style={{ height: 36, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(10px)" }}
          >
            <Phone size={14} color="#1a1f3a" strokeWidth={2.2} />
            <span className="text-xs font-semibold" style={{ color: "#1a1f3a" }}>Anrufen</span>
          </button>
        </div>

        {/* Greeting */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="font-semibold" style={{ fontSize: "15px", color: "#1a1f3a" }}>
            Hallo, Marco.
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#3d4a6a", opacity: 0.8 }}>
            Ihr persönliches Versicherungscockpit
          </p>
        </motion.div>

        {/* Score card */}
        <motion.div
          className="flex flex-col items-center mb-5 rounded-3xl py-6 px-5 mx-auto"
          style={{
            maxWidth: 320,
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 4px 24px rgba(26,31,58,0.10), 0 1px 4px rgba(26,31,58,0.06)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <ScoreRing score={coverageScore} />

          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="font-bold text-xl" style={{ color: "#1a1f3a" }}>
              {coverageScore >= 80 ? "Gut versichert" : "Optimierungsbedarf"}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
              {contracts.length} aktive Verträge
            </p>
          </motion.div>

          {/* Status pills inside card */}
          <motion.div
            className="flex gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: "#dcfce7", color: "#16a34a" }}
            >
              <CheckCircle size={12} />
              {optimalCount} Gut
            </div>
            {issueCount > 0 && (
              <motion.div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
                style={{ background: "#ef4444", color: "white" }}
                animate={{ boxShadow: ["0 0 0 0 rgba(239,68,68,0.4)", "0 0 0 6px rgba(239,68,68,0)", "0 0 0 0 rgba(239,68,68,0)"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              >
                <AlertTriangle size={12} />
                {issueCount} Handlungsbedarf
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 gap-3 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: "#3d4a6a" }}>
              Jährlicher Beitrag
            </p>
            <p className="text-xl font-bold" style={{ color: "#1a1f3a" }}>
              {totalAnnual.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
            </p>
          </div>
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: "#3d4a6a" }}>
              Monatlicher Beitrag
            </p>
            <p className="text-xl font-bold" style={{ color: "#1a1f3a" }}>
              {totalMonthly.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
