import { motion } from "framer-motion";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";

interface Step5SuccessProps {
  firstName: string;
  onFinish: () => void;
  onChat: () => void;
  onCall: () => void;
}

const nextSteps = [
  {
    icon: "📬",
    title: "Kontaktaufnahme zu Ihren Versicherern",
    desc: "Wir fordern Ihre Vertragsunterlagen in den nächsten 1–3 Werktagen an.",
  },
  {
    icon: "🔍",
    title: "Analyse Ihres Versicherungsschutzes",
    desc: "Ein LOYAGO-Experte prüft Ihre Verträge und bereitet eine Übersicht vor.",
  },
  {
    icon: "📞",
    title: "Persönliches Beratungsgespräch",
    desc: "Wir melden uns bei Ihnen — oder Sie rufen einfach jederzeit an.",
  },
];

export default function Step5Success({ firstName, onFinish, onChat, onCall }: Step5SuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center"
    >
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", damping: 15 }}
        className="relative mb-6"
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 90, height: 90, background: "#f0fdf4" }}
        >
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.25, type: "spring", damping: 12 }}
            style={{ fontSize: 44 }}
          >
            ✅
          </motion.span>
        </div>
        {/* Pulse rings */}
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid #22c55e", opacity: 0 }}
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ delay: 0.3 + i * 0.3, duration: 1, repeat: 2 }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold" style={{ color: "#1a1f3a" }}>
          Alles erledigt{firstName ? `, ${firstName}` : ""}!
        </h2>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: "#64748b" }}>
          Ihr Betreuungswunsch ist eingegangen. Wir kümmern uns ab sofort um Ihre Verträge.
        </p>
      </motion.div>

      {/* Next steps */}
      <div className="w-full flex flex-col gap-3 mb-8">
        {nextSteps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex items-start gap-3 p-4 rounded-2xl"
            style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width: 40, height: 40, background: "#f4f8fe" }}
            >
              <span style={{ fontSize: 20 }}>{step.icon}</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1a1f3a" }}>
                {step.title}
              </p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#64748b" }}>
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTAs */}
      <div className="w-full flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onChat}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, #cbdafb 0%, #a8c0f8 100%)",
              color: "#1a1f3a",
              border: "none",
            }}
          >
            <MessageCircle size={16} />
            Experte fragen
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onCall}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
            style={{ background: "#1a1f3a", color: "white", border: "none" }}
          >
            <Phone size={16} />
            Anrufen
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onFinish}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-semibold"
          style={{ background: "#f4f8fe", color: "#475569", border: "none" }}
        >
          Zum Dashboard
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}
