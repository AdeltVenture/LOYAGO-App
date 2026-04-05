import { motion } from "framer-motion";
import { Phone, ArrowRight, CheckCircle, Clock, MessageCircle } from "lucide-react";

interface Step5SuccessProps {
  firstName: string;
  insurerNames?: string[];
  contractName?: string;
  onFinish: () => void;
  onChat: () => void;
  onCall: () => void;
}

export default function Step5Success({ firstName, insurerNames = [], contractName, onFinish, onChat, onCall }: Step5SuccessProps) {
  const name = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : "";
  const details = [insurerNames.join(", "), contractName].filter(Boolean).join(" – ");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center pt-6 pb-4"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 320, damping: 22 }}
        className="relative mb-7"
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 80, height: 80, background: "linear-gradient(140deg, #1a1f3a, #2d3a6b)" }}
        >
          <CheckCircle size={36} color="white" strokeWidth={1.8} />
        </div>
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ border: "1.5px solid #4a6da8" }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ delay: 0.25 + i * 0.25, duration: 0.9 }}
          />
        ))}
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-7 px-2"
      >
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#1a1f3a" }}>
          Vielen Dank{name ? `, ${name}` : ""}!
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
          Ihr Betreuungsauftrag ist bei uns eingegangen. Wir kümmern uns ab sofort darum.
        </p>
        {details && (
          <p className="text-sm font-semibold mt-2" style={{ color: "#1a1f3a" }}>
            {details}
          </p>
        )}
      </motion.div>

      {/* What happens next — single card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
        className="w-full rounded-3xl p-5 mb-5"
        style={{ background: "white", boxShadow: "0 1px 4px rgba(26,31,58,0.07)" }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#94a3b8" }}>
          Wie es weitergeht
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 34, height: 34, background: "#eaeff8" }}>
              <ArrowRight size={15} color="#4a6da8" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1a1f3a" }}>Wir gehen auf Ihren Versicherer zu</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#64748b" }}>
                LOYAGO meldet sich als betreuender Vermittler bei Ihrer Versicherungsgesellschaft an und fordert Ihre Vertragsunterlagen an.
              </p>
            </div>
          </div>

          <div style={{ height: 1, background: "#f1f5f9" }} />

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 34, height: 34, background: "#eaeff8" }}>
              <Clock size={15} color="#4a6da8" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1a1f3a" }}>Bestätigung in 2–3 Wochen</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#64748b" }}>
                Die Bearbeitungszeit beim Versicherer beträgt in der Regel 2 bis 3 Wochen. Sobald die Bestätigung vorliegt, melden wir uns umgehend bei Ihnen.
              </p>
            </div>
          </div>

          <div style={{ height: 1, background: "#f1f5f9" }} />

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 34, height: 34, background: "#eaeff8" }}>
              <Phone size={15} color="#4a6da8" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1a1f3a" }}>Jederzeit persönlich für Sie da</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#64748b" }}>
                Haben Sie zwischenzeitlich Fragen? Wir sind Mo–Fr von 8 bis 18 Uhr telefonisch und per Chat erreichbar – ganz ohne Wartezeit.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full flex flex-col gap-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onChat}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
            style={{ background: "#eaeff8", color: "#1a1f3a" }}
          >
            <MessageCircle size={15} />
            Chat
          </button>
          <button
            onClick={onCall}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
            style={{ background: "#1a1f3a", color: "white" }}
          >
            <Phone size={15} />
            Anrufen
          </button>
        </div>
        <button
          onClick={onFinish}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-medium"
          style={{ color: "#94a3b8" }}
        >
          Zum Dashboard
          <ArrowRight size={15} />
        </button>
      </motion.div>
    </motion.div>
  );
}
