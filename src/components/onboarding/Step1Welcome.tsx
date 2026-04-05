import { motion } from "framer-motion";
import { ChevronRight, Users, BookOpen, HeartHandshake, BadgeCheck, ShieldCheck } from "lucide-react";

interface Step1WelcomeProps {
  onNext: () => void;
}

const benefits = [
  {
    icon: Users,
    title: "Persönliche Betreuung durch erfahrene Experten",
    desc: "Ob telefonisch oder per Mail: unser Team ist für Sie da, wann und wo es Ihnen passt.",
  },
  {
    icon: BookOpen,
    title: "Breites Fachwissen aus 25 Jahren Praxis",
    desc: "Unsere Berater kennen mehr als 100 Versicherungsgesellschaften und unterstützen Sie fachkundig.",
  },
  {
    icon: HeartHandshake,
    title: "Rundum-Service, unkompliziert und freundlich",
    desc: "Von Vertragsfragen über Schadenmeldungen bis hin zu einer fundierten Zweitmeinung.",
  },
  {
    icon: BadgeCheck,
    title: "Komplett kostenfrei für Sie",
    desc: "Dieser Service ist für Sie ohne zusätzliche Kosten. Kein Kleingedrucktes.",
  },
];

export default function Step1Welcome({ onNext }: Step1WelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col pt-2"
    >
      {/* Context header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.03 }}
        className="mb-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ width: 28, height: 28, background: "linear-gradient(135deg, #cbdafb, #a8c0f8)" }}>
            <ShieldCheck size={14} style={{ color: "#1a1f3a" }} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4a6da8", letterSpacing: "0.08em" }}>
            Betreuungswunsch
          </span>
        </div>
        <h2 className="text-xl font-bold leading-snug mb-1.5" style={{ color: "#1a1f3a" }}>
          Weiteren Vertrag hinzufügen
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
          Sie möchten einen weiteren bereits bestehenden Versicherungsvertrag durch LOYAGO betreuen lassen. Was das für Sie bedeutet:
        </p>
      </motion.div>

      {/* Reassurance banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-3xl p-5 mb-5"
        style={{ background: "linear-gradient(135deg, #1a1f3a 0%, #2d3a6b 100%)" }}
      >
        <p className="font-bold text-base mb-2 leading-snug" style={{ color: "white" }}>
          An Ihrem bestehenden Versicherungsvertrag ändert sich nichts.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
          Sie können sich weiterhin jederzeit direkt an Ihren Versicherer wenden. Durch den Betreuungswunsch erhalten Sie <strong style={{ color: "white" }}>zusätzlich</strong> kostenlosen Zugang zu unseren Premium-Services.
        </p>
      </motion.div>

      {/* Benefits heading */}
      <p className="text-xs font-bold mb-3 px-1 uppercase tracking-widest" style={{ color: "#94a3b8", letterSpacing: "0.08em" }}>
        Was Sie zusätzlich erhalten
      </p>

      {/* Benefits list */}
      <div className="flex flex-col gap-3 mb-7">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.07 }}
              className="flex items-start gap-3 p-4 rounded-2xl"
              style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0 mt-0.5"
                style={{ width: 36, height: 36, background: "#eaeff8" }}
              >
                <Icon size={17} style={{ color: "#4a6da8" }} />
              </div>
              <div>
                <p className="text-sm font-semibold leading-snug" style={{ color: "#1a1f3a" }}>
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
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold"
        style={{ background: "#1a1f3a", color: "white" }}
      >
        Betreuungswunsch einrichten
        <ChevronRight size={17} />
      </motion.button>

      <p className="text-center text-xs mt-3" style={{ color: "#94a3b8" }}>
        Kostenlos · Unverbindlich · Jederzeit kündbar
      </p>
    </motion.div>
  );
}
