import { motion } from "framer-motion";
import { FileText, ShieldCheck, Info } from "lucide-react";
import { type OnboardingData, popularInsurers } from "../../data/onboarding";

interface Step4ConsentProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
  onSubmit: () => void;
}

export default function Step4Consent({ data, onChange, onSubmit }: Step4ConsentProps) {
  const selectedInsurerNames = data.selectedInsurers.map((id) => {
    const found = popularInsurers.find((ins) => ins.id === id);
    return found ? found.name : id.replace("custom-", "").replace(/-/g, " ");
  });

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
          Betreuungswunsch bestätigen
        </h3>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Bitte lesen und bestätigen Sie kurz, was wir für Sie tun.
        </p>
      </div>

      {/* Summary card */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <p className="text-xs font-semibold uppercase mb-3" style={{ color: "#94a3b8", letterSpacing: "0.05em" }}>
          Ihre Angaben
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span style={{ color: "#64748b" }}>Name</span>
            <span className="font-medium" style={{ color: "#1a1f3a" }}>
              {data.firstName} {data.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#64748b" }}>E-Mail</span>
            <span className="font-medium" style={{ color: "#1a1f3a" }}>
              {data.email}
            </span>
          </div>
          {selectedInsurerNames.length > 0 && (
            <div className="flex justify-between items-start gap-3">
              <span style={{ color: "#64748b", flexShrink: 0 }}>Versicherer</span>
              <span className="font-medium text-right" style={{ color: "#1a1f3a" }}>
                {selectedInsurerNames.join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* What we do */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Info size={15} style={{ color: "#0284c7" }} />
          <p className="text-xs font-semibold" style={{ color: "#0284c7" }}>
            Was LOYAGO für Sie tut
          </p>
        </div>
        <ul className="flex flex-col gap-2">
          {[
            "Wir fordern bei Ihren Versicherern Ihre Vertragsunterlagen an",
            "Wir analysieren Ihren Versicherungsschutz und geben Empfehlungen",
            "Sie erhalten einen persönlichen Ansprechpartner",
            "Der Service ist für Sie kostenlos und unverbindlich",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs" style={{ color: "#0c4a6e" }}>
              <span className="mt-0.5 flex-shrink-0" style={{ color: "#0284c7" }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Consent checkbox */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange({ consentGiven: !data.consentGiven })}
        className="flex items-start gap-3 p-4 rounded-2xl text-left"
        style={{
          background: data.consentGiven ? "#f0fdf4" : "white",
          border: `1.5px solid ${data.consentGiven ? "#86efac" : "#e2e8f0"}`,
          transition: "all 0.2s",
        }}
      >
        <div
          className="flex items-center justify-center rounded-md flex-shrink-0 mt-0.5"
          style={{
            width: 22,
            height: 22,
            background: data.consentGiven ? "#22c55e" : "white",
            border: `2px solid ${data.consentGiven ? "#22c55e" : "#cbd5e1"}`,
            transition: "all 0.2s",
          }}
        >
          {data.consentGiven && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ color: "white", fontSize: 14, lineHeight: 1 }}
            >
              ✓
            </motion.span>
          )}
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
          Ich beauftrage LOYAGO Mehrfachagentur GmbH, meinen{" "}
          <strong>Betreuungswunsch</strong> für die oben genannten Versicherungsverträge
          zu übernehmen. Ich bestätige, dass meine Angaben korrekt sind.{" "}
          <span style={{ color: "#3b82f6" }}>Datenschutzerklärung & Details</span>
        </p>
      </motion.button>

      {/* Legal note */}
      <div
        className="rounded-xl p-3 flex items-start gap-2"
        style={{ background: "#fafafa", border: "1px solid #f1f5f9" }}
      >
        <ShieldCheck size={14} style={{ color: "#94a3b8", flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: "#94a3b8", lineHeight: 1.5 }}>
          LOYAGO ist eine eingetragene Mehrfachagentur, kein Makler. Sie erteilen uns
          keinen Maklerauftrag, sondern einen unverbindlichen Betreuungswunsch.
          Jederzeit widerrufbar.
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onSubmit}
        disabled={!data.consentGiven}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold"
        style={{
          background: data.consentGiven
            ? "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)"
            : "#e2e8f0",
          color: data.consentGiven ? "white" : "#94a3b8",
          border: "none",
          transition: "background 0.2s",
        }}
      >
        <FileText size={17} />
        Betreuungswunsch abschicken
      </motion.button>
    </motion.div>
  );
}
