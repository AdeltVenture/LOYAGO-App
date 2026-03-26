import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Info } from "lucide-react";
import { contracts } from "../data/contracts";
import { statusColors, statusLabels } from "../data/contracts";
import CategoryIcon from "./CategoryIcon";

const recommendations = [
  {
    id: "1",
    title: "Hausrat aktualisieren",
    desc: "Ihre Hausratversicherung deckt nur 45.000 €. Für Ihre Wohnfläche empfehlen wir mindestens 70.000 €.",
    severity: "critical" as const,
    savings: null,
  },
  {
    id: "2",
    title: "KFZ-Vergleich empfohlen",
    desc: "Ihr Vertrag läuft im Juli aus. Ein Vergleich könnte bis zu 20% Ersparnis bringen.",
    severity: "warning" as const,
    savings: "Bis zu 168 € / Jahr",
  },
  {
    id: "3",
    title: "Private Altersvorsorge",
    desc: "Ihre gesetzliche Rente allein reicht oft nicht aus. Ein Sparplan würde Ihre Lücke schließen.",
    severity: "info" as const,
    savings: null,
  },
];

const severityConfig = {
  critical: { icon: AlertTriangle, bg: "#fee2e2", text: "#dc2626", border: "#fecaca" },
  warning: { icon: AlertTriangle, bg: "#fef9ec", text: "#d97706", border: "#fde68a" },
  info: { icon: Info, bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
};

export default function AnalysisView() {
  const byStatus = contracts.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalAnnual = contracts.reduce((s, c) => s + c.annualPremium, 0);

  const categoryTotals = contracts
    .filter((c) => c.annualPremium > 0)
    .sort((a, b) => b.annualPremium - a.annualPremium);

  const maxPremium = Math.max(...categoryTotals.map((c) => c.annualPremium));

  return (
    <div className="flex flex-col gap-5">
      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5"
        style={{
          background: "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)",
          color: "white",
        }}
      >
        <p className="text-xs font-medium opacity-60 mb-1">Gesamt-Versicherungsausgaben</p>
        <p className="text-3xl font-bold mb-3">
          {totalAnnual.toLocaleString("de-DE")} € <span className="text-sm opacity-60 font-normal">/ Jahr</span>
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="opacity-50 text-xs">Verträge gesamt</p>
            <p className="font-semibold">{contracts.length}</p>
          </div>
          <div>
            <p className="opacity-50 text-xs">Ø pro Monat</p>
            <p className="font-semibold">
              {(totalAnnual / 12).toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
            </p>
          </div>
        </div>
      </motion.div>

      {/* Status breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl p-4"
        style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <p className="text-sm font-bold mb-3" style={{ color: "#1a1f3a" }}>
          Vertragsstatus
        </p>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(byStatus).map(([status, count]) => {
            const colors = statusColors[status as keyof typeof statusColors];
            return (
              <div
                key={status}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: colors.bg, color: colors.text }}
              >
                <span
                  className="rounded-full"
                  style={{ width: 6, height: 6, background: colors.dot, display: "inline-block" }}
                />
                {count}× {statusLabels[status as keyof typeof statusColors]}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Premium breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-4"
        style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <p className="text-sm font-bold mb-4" style={{ color: "#1a1f3a" }}>
          Beiträge nach Versicherung
        </p>
        <div className="flex flex-col gap-3">
          {categoryTotals.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <CategoryIcon icon={c.categoryIcon} color={c.color} size={16} />
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium truncate" style={{ color: "#1a1f3a", maxWidth: "55%" }}>
                    {c.category}
                  </span>
                  <span style={{ color: "#64748b" }}>
                    {c.annualPremium.toLocaleString("de-DE")} €
                  </span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 6, background: "#f1f5f9" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.annualPremium / maxPremium) * 100}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: c.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <div>
        <p className="text-sm font-bold mb-3" style={{ color: "#1a1f3a" }}>
          Empfehlungen
        </p>
        <div className="flex flex-col gap-3">
          {recommendations.map((rec, i) => {
            const config = severityConfig[rec.severity];
            const Icon = config.icon;
            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="rounded-2xl p-4"
                style={{
                  background: config.bg,
                  border: `1.5px solid ${config.border}`,
                }}
              >
                <div className="flex items-start gap-2">
                  <Icon size={16} style={{ color: config.text, marginTop: 1, flexShrink: 0 }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: config.text }}>
                      {rec.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: config.text, opacity: 0.85 }}>
                      {rec.desc}
                    </p>
                    {rec.savings && (
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp size={12} style={{ color: "#16a34a" }} />
                        <span className="text-xs font-semibold" style={{ color: "#16a34a" }}>
                          {rec.savings}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
