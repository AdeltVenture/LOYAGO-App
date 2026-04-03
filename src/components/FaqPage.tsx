import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Wer ist die LOYAGO GmbH?",
    a: "Wir sind ein Mehrfachagent mit Zugang zu mehr als 100 Versicherungsgesellschaften in Deutschland. Unsere IHK-zertifizierten Fachexperten beraten und betreuen Sie unkompliziert. Wir sind persönlich und digital für Sie zuverlässig da.",
  },
  {
    q: "Was unterscheidet LOYAGO von einem klassischen Versicherungsvertreter?",
    a: "Ein Versicherungsvertreter ist an eine einzige Gesellschaft gebunden. Als Mehrfachagent haben wir Zugang zu den Produkten vieler Versicherungsgesellschaften. So können wir Ihnen je nach Situation und Bedarf eine passende Lösung anbieten.",
  },
  {
    q: "Wie verdient LOYAGO Geld?",
    a: "Unsere Beratung ist für Sie kostenlos. Wir erhalten eine Vergütung direkt von den Versicherungsgesellschaften. Es entstehen keine zusätzlichen Kosten für Sie.",
  },
  {
    q: "Warum setzt LOYAGO auf eine langfristige Beziehung?",
    a: "Versicherung ist keine einmalige Sache, sondern eine Absicherung fürs Leben. Wir begleiten Sie dauerhaft, halten Ihre Verträge aktuell und sind da, wenn sich etwas in Ihrer Lebenssituation ändert.",
  },
  {
    q: "Kann ich LOYAGO auch für eine Zweitmeinung nutzen?",
    a: "Ja, gerne. Unsere Fachexperten schauen sich Ihre bestehenden Verträge in Ruhe an und sagen Ihnen offen, ob Ihre Absicherung wirklich zu Ihrer Situation passt.",
  },
  {
    q: "Bietet LOYAGO persönliche Beratung?",
    a: "Ja. Digitale Prozesse helfen uns, Dinge schnell und unkompliziert zu erledigen. Aber bei LOYAGO gibt es keine anonyme Betreuung. Unsere Fachexperten sind persönlich für Sie da – per Telefon, Video oder E-Mail.",
  },
  {
    q: "Kann ich bei LOYAGO alle meine Versicherungen betreuen lassen?",
    a: "Ja, selbstverständlich. Wenn Sie möchten, übernehmen wir gerne die Betreuung all Ihrer Versicherungsangelegenheiten – ganz ohne Neuabschluss. Ein kurzer Hinweis von Ihnen genügt, und wir kümmern uns um den Rest. Diesen Service bieten wir bei mehr als 100 Versicherern an, kostenlos für Sie.",
  },
  {
    q: "Sind meine Daten bei LOYAGO sicher?",
    a: "Ja. Unsere Server stehen in Deutschland und der EU. Ihre Daten werden nach höchsten Sicherheitsstandards verarbeitet und gespeichert.",
  },
  {
    q: "Welche Versicherungen bietet LOYAGO an?",
    a: "Wir decken ein breites Spektrum ab: von Haftpflicht und Hausrat über Berufsunfähigkeit und Krankenversicherung bis hin zu Altersvorsorge, Lebens- und Unfallversicherung. Sprechen Sie uns einfach an, wir beraten Sie gerne persönlich.",
  },
  {
    q: "Was passiert nach der Beratung?",
    a: "Sie erhalten einen konkreten Vorschlag, der zu Ihrer Situation passt. Es gibt keinen Abschlusszwang. Sie entscheiden in Ruhe, ob und wie Sie weitermachen möchten.",
  },
  {
    q: "Ist LOYAGO auch im Schadenfall für mich da?",
    a: "Ja. Unser Team unterstützt Sie bei der Schadensmeldung und begleitet Sie durch den gesamten Prozess mit Ihrem Versicherer. Damit nichts untergeht und Sie wissen, wo Sie stehen. Unser Schadenservice ist kostenlos für Sie.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 w-full px-4 py-4 text-left"
      >
        <span className="flex-1 text-sm font-semibold leading-snug" style={{ color: "#1a1f3a" }}>
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={18} color="#94a3b8" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p
              className="px-4 pb-4 text-sm leading-relaxed"
              style={{ color: "#475569" }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-y-auto"
      style={{ background: "#f4f8fe", maxWidth: 430, margin: "0 auto" }}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 34 }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 pb-3 border-b"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 14px)",
          background: "#f4f8fe",
          borderColor: "#e8eef8",
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-xl"
          style={{ width: 36, height: 36, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}
        >
          <ArrowLeft size={18} color="#1a1f3a" />
        </button>
        <h1 className="font-bold text-lg" style={{ color: "#1a1f3a" }}>
          Häufige Fragen
        </h1>
      </div>

      {/* FAQ list */}
      <div className="px-4 py-5 pb-16 flex flex-col gap-3">
        {faqs.map((item) => (
          <FaqItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>
    </motion.div>
  );
}
