import { motion } from "framer-motion";
import { Shield, Clock, CheckCircle, ChevronRight } from "lucide-react";

interface Step1WelcomeProps {
  onNext: () => void;
}

const benefits = [
  {
    icon: Shield,
    title: "Alle Verträge auf einen Blick",
    desc: "Wir holen Ihre bestehenden Versicherungen digital ab — Sie müssen nichts suchen.",
    color: "#3b82f6",
  },
  {
    icon: Clock,
    title: "Kostenlos & unverbindlich",
    desc: "Der Betreuungswunsch ist für Sie völlig kostenlos. Keine versteckten Kosten.",
    color: "#10b981",
  },
  {
    icon: CheckCircle,
    title: "Persönlicher Ansprechpartner",
    desc: "Ein LOYAGO-Experte analysiert Ihren Schutz und ist jederzeit für Sie da.",
    color: "#8b5cf6",
  },
];

export default function Step1Welcome({ onNext }: Step1WelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col"
    >
      {/* Hero illustration */}
      <div
        className="rounded-3xl mb-6 flex flex-col items-center justify-center pt-8 pb-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #cbdafb 0%, #a8c0f8 60%, #7ba3f5 100%)",
        }}
      >
        {/* Floating cloud shapes */}
        <div
          className="absolute rounded-full opacity-40"
          style={{ width: 120, height: 60, background: "white", top: 10, left: -20 }}
        />
        <div
          className="absolute rounded-full opacity-30"
          style={{ width: 80, height: 40, background: "white", top: 30, right: -10 }}
        />

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
          style={{ fontSize: 64 }}
        >
          🛡️
        </motion.div>
        <p className="text-lg font-bold mt-3 relative z-10" style={{ color: "#1a1f3a" }}>
          Ihr Versicherungs-Check
        </p>
        <p className="text-sm mt-1 relative z-10 text-center px-6" style={{ color: "#3d4a6a" }}>
          In 3 Minuten haben wir alle Ihre Verträge im Blick
        </p>
      </div>

      {/* Benefits */}
      <div className="flex flex-col gap-3 mb-8">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-start gap-3 p-4 rounded-2xl"
              style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ width: 40, height: 40, background: `${b.color}15` }}
              >
                <Icon size={18} style={{ color: b.color }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1a1f3a" }}>
                  {b.title}
                </p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#64748b" }}>
                  {b.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold"
        style={{ background: "#1a1f3a", color: "white", border: "none" }}
      >
        Jetzt starten
        <ChevronRight size={18} />
      </motion.button>

      <p className="text-center text-xs mt-3" style={{ color: "#94a3b8" }}>
        Kein Konto erforderlich · Dauert ca. 3 Minuten
      </p>
    </motion.div>
  );
}
