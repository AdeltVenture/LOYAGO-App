import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ShieldCheck, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { type OnboardingData, popularInsurers } from "../../data/onboarding";

interface Step4ConsentProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitError?: string | null;
}

export default function Step4Consent({ data, onChange, onSubmit, submitting = false, submitError = null }: Step4ConsentProps) {
  const [legalExpanded, setLegalExpanded] = useState(false);

  const selectedInsurerNames = data.selectedInsurers.map((id) => {
    const found = popularInsurers.find((ins) => ins.id === id);
    return found ? found.name : id.replace("custom-", "").replace(/-/g, " ");
  });

  const insurerList = selectedInsurerNames.length > 0
    ? selectedInsurerNames.join(", ")
    : "die angegebenen Versicherungsgesellschaften";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 pt-4"
    >
      <div className="mb-1">
        <h3 className="text-lg font-bold" style={{ color: "#1a1f3a" }}>
          Betreuungsauftrag erteilen
        </h3>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Bitte lesen Sie die nachstehenden Hinweise und bestätigen Sie Ihren Auftrag.
        </p>
      </div>

      {/* Summary */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <p className="text-xs font-semibold uppercase mb-3" style={{ color: "#94a3b8", letterSpacing: "0.05em" }}>
          Zusammenfassung Ihrer Angaben
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between gap-3">
            <span style={{ color: "#64748b", flexShrink: 0 }}>Name</span>
            <span className="font-medium text-right" style={{ color: "#1a1f3a" }}>
              {data.firstName} {data.lastName}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span style={{ color: "#64748b", flexShrink: 0 }}>E-Mail</span>
            <span className="font-medium text-right" style={{ color: "#1a1f3a" }}>
              {data.email || "–"}
            </span>
          </div>
          {selectedInsurerNames.length > 0 && (
            <div className="flex justify-between items-start gap-3">
              <span style={{ color: "#64748b", flexShrink: 0 }}>Versicherer</span>
              <span className="font-medium text-right" style={{ color: "#1a1f3a" }}>
                {insurerList}
              </span>
            </div>
          )}
          {data.contractName && (
            <div className="flex justify-between items-start gap-3">
              <span style={{ color: "#64748b", flexShrink: 0 }}>Produkt</span>
              <span className="font-medium text-right" style={{ color: "#1a1f3a" }}>
                {data.contractName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Legal mandate box */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid #e2e8f0", background: "white" }}
      >
        {/* Header */}
        <div className="px-4 py-3" style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <div className="flex items-center gap-2">
            <FileText size={14} style={{ color: "#4a6da8" }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1a1f3a" }}>
              Betreuungsauftrag
            </span>
          </div>
        </div>

        {/* Legal text */}
        <div className="px-4 py-3">
          <p className="text-xs leading-relaxed mb-3" style={{ color: "#334155" }}>
            Hiermit beauftrage ich die <strong>LOYAGO GmbH</strong>, Europa-Allee 165,
            60486 Frankfurt am Main (nachfolgend „LOYAGO"), die Betreuung meiner
            bestehenden Versicherungsverträge bei <strong>{insurerList}</strong> zu übernehmen.
          </p>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "#334155" }}>
            Ich ermächtige LOYAGO, in meinem Namen bei den genannten
            Versicherungsgesellschaften als betreuender Vermittler eingetragen
            zu werden sowie Vertragsunterlagen, Beitragsübersichten und sonstige
            vertragsrelevante Informationen anzufordern und entgegenzunehmen.
          </p>

          {/* Expandable section */}
          <motion.div
            initial={false}
            animate={{ height: legalExpanded ? "auto" : 0 }}
            style={{ overflow: "hidden" }}
          >
            <p className="text-xs leading-relaxed mb-3" style={{ color: "#334155" }}>
              Dieser Auftrag stellt keinen Maklerauftrag im Sinne des § 659 BGB
              dar. LOYAGO handelt als gebundener Vermittler bzw. Mehrfachagent und
              ist nicht verpflichtet, einen marktweiten Vergleich durchzuführen.
              Eine Verpflichtung zur Kündigung oder zum Wechsel bestehender Verträge
              wird hiermit ausdrücklich <em>nicht</em> erteilt.
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "#334155" }}>
              Durch die Erteilung dieses Betreuungsauftrags entstehen mir keine
              zusätzlichen Kosten. Die Vergütung von LOYAGO erfolgt ausschließlich
              durch die jeweilige Versicherungsgesellschaft in Form einer Courtage
              oder Bestandsprovision, die im Beitrag bereits eingerechnet ist und
              sich durch diesen Auftrag nicht erhöht.
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "#334155" }}>
              Ich bin jederzeit berechtigt, diesen Betreuungsauftrag ohne Angabe
              von Gründen zu widerrufen. Der Widerruf ist formlos möglich, z. B.
              per E-Mail an <strong>info@loyago.de</strong> oder telefonisch
              unter <strong>069 247 471 400</strong>. Im Fall des Widerrufs wird
              LOYAGO bei der betreffenden Versicherungsgesellschaft als
              Betreuer abgemeldet.
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#334155" }}>
              Die Verarbeitung meiner personenbezogenen Daten erfolgt gemäß
              Art. 6 Abs. 1 lit. b DSGVO zur Vertragserfüllung sowie auf
              Grundlage meiner nachfolgenden Einwilligung. Ich nehme zur
              Kenntnis, dass meine Daten ausschließlich zum Zweck der
              Vertragsbetreuung und -verwaltung verarbeitet werden und nicht
              ohne meine ausdrückliche Zustimmung an Dritte weitergegeben werden.
              Näheres entnehmen Sie bitte unserer{" "}
              <span style={{ color: "#3b82f6" }}>Datenschutzerklärung</span>.
            </p>
          </motion.div>

          {/* Toggle */}
          <button
            onClick={() => setLegalExpanded(v => !v)}
            className="flex items-center gap-1 mt-2"
            style={{ color: "#4a6da8" }}
          >
            <span className="text-xs font-semibold">
              {legalExpanded ? "Weniger anzeigen" : "Vollständigen Text lesen"}
            </span>
            <motion.div animate={{ rotate: legalExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} />
            </motion.div>
          </button>
        </div>
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
          Ich habe den vorstehenden Betreuungsauftrag gelesen und erteile hiermit
          ausdrücklich meine Zustimmung. Ich bestätige, Inhaber der genannten
          Versicherungsverträge zu sein und volljährig zu sein. Mir ist bekannt,
          dass ich diesen Auftrag jederzeit widerrufen kann.
        </p>
      </motion.button>

      {/* Small print */}
      <div
        className="rounded-xl p-3 flex items-start gap-2"
        style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
      >
        <ShieldCheck size={13} style={{ color: "#94a3b8", flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: "#94a3b8", lineHeight: 1.55 }}>
          LOYAGO GmbH · Europa-Allee 165 · 60486 Frankfurt am Main ·
          Tätig als Versicherungsvertreter (Mehrfachagent) gem. § 34d Abs. 1 GewO ·
          Registrierungsnummer: D-O2E6-73ICR-16 ·
          Registrierungsbehörde: IHK Frankfurt am Main, Börsenplatz 4, 60313 Frankfurt ·
          Vermittlerregister: www.vermittlerregister.info ·
          Aufsichtsbehörde: Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin) ·
          Pflichtangaben gem. § 11 VersVermV
        </p>
      </div>

      {/* Submit error */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 rounded-2xl px-4 py-3 text-xs"
            style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{submitError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onSubmit}
        disabled={!data.consentGiven || submitting}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold"
        style={{
          background: data.consentGiven && !submitting ? "#1a1f3a" : "#e2e8f0",
          color: data.consentGiven && !submitting ? "white" : "#94a3b8",
          transition: "background 0.2s",
        }}
      >
        {submitting ? (
          <><Loader2 size={16} className="animate-spin" /> Wird übermittelt …</>
        ) : (
          <><FileText size={16} /> Betreuungsauftrag verbindlich erteilen</>
        )}
      </motion.button>
    </motion.div>
  );
}
