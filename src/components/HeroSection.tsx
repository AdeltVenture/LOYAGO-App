import { motion } from "framer-motion";
import CloudBackground from "./CloudBackground";
import { contracts } from "../data/contracts";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function HeroSection() {
  const totalMonthly = contracts.reduce((s, c) => s + c.monthlyPremium, 0);
  const totalAnnual = contracts.reduce((s, c) => s + c.annualPremium, 0);
  const optimalCount = contracts.filter((c) => c.status === "optimal" || c.status === "gut").length;
  const issueCount = contracts.filter((c) => c.status === "mangelhaft").length;

  const coverageScore = Math.round((optimalCount / contracts.length) * 100);

  return (
    <div className="relative overflow-hidden" style={{ minHeight: "340px" }}>
      <CloudBackground />

      <div className="relative z-10 px-4 pt-0 pb-8">
        {/* LOYAGO brand header — sits on the sky */}
        <div className="flex items-center justify-between pb-2" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
          <div>
            <span
              className="font-black tracking-tight"
              style={{ fontSize: "22px", color: "#1a1f3a", letterSpacing: "-0.5px" }}
            >
              LOYAGO
            </span>
          </div>
          <div
            className="relative flex items-center justify-center rounded-xl"
            style={{ width: 36, height: 36, background: "rgba(255,255,255,0.45)", backdropFilter: "blur(8px)" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1a1f3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span
              className="absolute rounded-full"
              style={{ width: 8, height: 8, background: "#ef4444", top: 7, right: 7, border: "1.5px solid rgba(203,218,251,0.9)" }}
            />
          </div>
        </div>
        {/* Personal greeting */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="font-semibold" style={{ fontSize: "15px", color: "#1a1f3a" }}>
            Hallo, Marco 👋
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#3d4a6a", opacity: 0.8 }}>
            Ihr persönliches Versicherungscockpit
          </p>
        </motion.div>

        {/* Score ring */}
        <motion.div
          className="flex flex-col items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative" style={{ width: 110, height: 110 }}>
            {/* SVG ring */}
            <svg width="110" height="110" viewBox="0 0 110 110" className="absolute inset-0">
              <circle
                cx="55"
                cy="55"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="8"
              />
              <motion.circle
                cx="55"
                cy="55"
                r="46"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - coverageScore / 100)}`}
                transform="rotate(-90 55 55)"
                initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 46 * (1 - coverageScore / 100),
                }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              />
              <motion.circle
                cx="55"
                cy="55"
                r="46"
                fill="none"
                stroke="rgba(59,130,246,0.5)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 46 * 0.25} ${2 * Math.PI * 46 * 0.75}`}
                strokeDashoffset={`${-2 * Math.PI * 46 * coverageScore / 100}`}
                transform="rotate(-90 55 55)"
              />
            </svg>
            {/* Inner content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-bold leading-none"
                style={{ fontSize: "22px", color: "#1a1f3a" }}
              >
                {coverageScore}%
              </span>
              <span style={{ fontSize: "9px", color: "#1a1f3a", opacity: 0.7, marginTop: 2 }}>
                Geschützt
              </span>
            </div>
          </div>

          <motion.div
            className="mt-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="font-bold text-2xl" style={{ color: "#1a1f3a" }}>
              {coverageScore >= 80 ? "Gut versichert" : "Verbesserungsbedarf"}
            </h2>
            <p className="text-sm mt-1" style={{ color: "#3d4a6a" }}>
              {contracts.length} aktive Verträge
            </p>
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

        {/* Status summary */}
        <motion.div
          className="flex gap-3 justify-center mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
            style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", color: "#16a34a" }}
          >
            <CheckCircle size={13} />
            {optimalCount} Optimal
          </div>
          {issueCount > 0 && (
            <motion.div
              className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold"
              style={{ background: "#ef4444", color: "white", boxShadow: "0 0 0 0 rgba(239,68,68,0.5)" }}
              animate={{ boxShadow: ["0 0 0 0 rgba(239,68,68,0.5)", "0 0 0 7px rgba(239,68,68,0)", "0 0 0 0 rgba(239,68,68,0)"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            >
              <AlertTriangle size={13} />
              {issueCount} Handlungsbedarf
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
