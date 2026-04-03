import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, LogOut, Smartphone } from "lucide-react";

interface FieldRowProps {
  label: string;
  value: string;
  editable?: boolean;
}

function FieldRow({ label, value, editable = true }: FieldRowProps) {
  return (
    <div
      className={`flex items-center gap-3 py-3.5 ${editable ? "cursor-pointer" : ""}`}
    >
      <div className="flex-1">
        <p className="text-xs mb-0.5" style={{ color: "#94a3b8" }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: "#1a1f3a" }}>{value}</p>
      </div>
      {editable && <ChevronRight size={16} style={{ color: "#cbd5e1", flexShrink: 0 }} />}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold mb-2 px-1" style={{ color: "#94a3b8", letterSpacing: "0.06em" }}>
        {title}
      </p>
      <div
        className="rounded-2xl divide-y px-4"
        style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#f1f5f9" }} />;
}

export default function ProfilePage({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const [notifications, setNotifications] = useState(true);

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
        style={{ paddingTop: "max(env(safe-area-inset-top), 14px)", background: "#f4f8fe", borderColor: "#e8eef8" }}
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-xl"
          style={{ width: 36, height: 36, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}
        >
          <ArrowLeft size={18} color="#1a1f3a" />
        </button>
        <h1 className="font-bold text-lg" style={{ color: "#1a1f3a" }}>Profil & Einstellungen</h1>
      </div>

      <div className="px-4 py-5 pb-16">

        {/* Avatar card */}
        <div className="flex items-center gap-4 rounded-3xl p-5 mb-6"
          style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div
            className="flex items-center justify-center rounded-2xl flex-shrink-0 font-bold text-lg"
            style={{ width: 60, height: 60, background: "linear-gradient(140deg, #1a1f3a, #2d3a6b)", color: "white", letterSpacing: "-0.5px" }}
          >
            MA
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: "#1a1f3a" }}>Dr. Marco Adelt</p>
            <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>marco.adelt@loyago.de</p>
            <p className="text-xs mt-1 font-medium" style={{ color: "#4a6da8" }}>Kunde seit Mai 2024</p>
          </div>
        </div>

        {/* Persönliche Daten */}
        <Section title="PERSÖNLICHE DATEN">
          <FieldRow label="Vorname" value="Marco" />
          <Divider />
          <FieldRow label="Nachname" value="Adelt" />
          <Divider />
          <FieldRow label="Titel" value="Dr." />
          <Divider />
          <FieldRow label="Geburtsdatum" value="19.04.1979" />
        </Section>

        {/* Adresse */}
        <Section title="ADRESSE">
          <FieldRow label="Straße und Hausnummer" value="Europa-Allee 165" />
          <Divider />
          <FieldRow label="PLZ / Ort" value="60486 Frankfurt am Main" />
          <Divider />
          <FieldRow label="Land" value="Deutschland" editable={false} />
        </Section>

        {/* Kontakt */}
        <Section title="KONTAKTDATEN">
          <FieldRow label="E-Mail" value="marco.adelt@loyago.de" />
          <Divider />
          <FieldRow label="Telefon" value="Noch nicht hinterlegt" />
        </Section>

        {/* Einstellungen */}
        <Section title="EINSTELLUNGEN">
          <div className="flex items-center py-3.5">
            <div className="flex-1">
              <p className="text-xs mb-0.5" style={{ color: "#94a3b8" }}>Push-Benachrichtigungen</p>
              <p className="text-sm font-medium" style={{ color: "#1a1f3a" }}>
                {notifications ? "Aktiviert" : "Deaktiviert"}
              </p>
            </div>
            <button
              onClick={() => setNotifications(v => !v)}
              className="relative rounded-full transition-colors flex-shrink-0"
              style={{
                width: 44, height: 26,
                background: notifications ? "#1a1f3a" : "#e2e8f0",
              }}
            >
              <motion.div
                animate={{ x: notifications ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 rounded-full"
                style={{ width: 18, height: 18, background: "white" }}
              />
            </button>
          </div>
          <Divider />
          <FieldRow label="Sprache" value="Deutsch" />
        </Section>

        {/* Account */}
        <Section title="ACCOUNT">
          <div className="flex items-center gap-3 py-3.5">
            <div className="flex-1">
              <p className="text-xs mb-0.5" style={{ color: "#94a3b8" }}>App-Version</p>
              <p className="text-sm font-medium" style={{ color: "#1a1f3a" }}>1.0.0</p>
            </div>
            <Smartphone size={15} style={{ color: "#cbd5e1" }} />
          </div>
          <Divider />
          <button onClick={onLogout} className="flex items-center gap-3 w-full py-3.5">
            <div className="flex-1 text-left">
              <p className="text-xs mb-0.5" style={{ color: "#94a3b8" }}>Sitzung</p>
              <p className="text-sm font-medium" style={{ color: "#ef4444" }}>Abmelden</p>
            </div>
            <LogOut size={16} style={{ color: "#ef4444" }} />
          </button>
        </Section>

      </div>
    </motion.div>
  );
}
