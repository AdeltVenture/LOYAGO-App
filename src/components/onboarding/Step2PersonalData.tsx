import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import { type OnboardingData } from "../../data/onboarding";

interface Step2PersonalDataProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
  autoComplete?: string;
}

function Field({ label, value, onChange, placeholder, type = "text", icon, autoComplete }: FieldProps) {
  return (
    <div>
      <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>
        {label}
      </label>
      <div
        className="flex items-center gap-2.5 px-3 rounded-xl"
        style={{
          background: "white",
          border: "1.5px solid #e2e8f0",
          height: 46,
        }}
      >
        <span style={{ color: "#94a3b8", flexShrink: 0 }}>{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: "#1a1f3a" }}
        />
      </div>
    </div>
  );
}

export default function Step2PersonalData({ data, onChange, onNext }: Step2PersonalDataProps) {
  const isValid =
    data.firstName.trim() &&
    data.lastName.trim() &&
    data.email.trim() &&
    data.birthDate.trim();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4"
    >
      <div className="mb-2">
        <h3 className="text-lg font-bold" style={{ color: "#1a1f3a" }}>
          Ihre Angaben
        </h3>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Damit wir Ihren Betreuungswunsch korrekt einrichten können.
        </p>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Vorname"
          value={data.firstName}
          onChange={(v) => onChange({ firstName: v })}
          placeholder="Max"
          icon={<User size={15} />}
          autoComplete="given-name"
        />
        <Field
          label="Nachname"
          value={data.lastName}
          onChange={(v) => onChange({ lastName: v })}
          placeholder="Mustermann"
          icon={<User size={15} />}
          autoComplete="family-name"
        />
      </div>

      <Field
        label="Geburtsdatum"
        value={data.birthDate}
        onChange={(v) => onChange({ birthDate: v })}
        placeholder="TT.MM.JJJJ"
        type="date"
        icon={<span style={{ fontSize: 14 }}>📅</span>}
        autoComplete="bday"
      />

      <Field
        label="E-Mail"
        value={data.email}
        onChange={(v) => onChange({ email: v })}
        placeholder="max@beispiel.de"
        type="email"
        icon={<Mail size={15} />}
        autoComplete="email"
      />

      <Field
        label="Telefon (optional)"
        value={data.phone}
        onChange={(v) => onChange({ phone: v })}
        placeholder="+49 170 1234567"
        type="tel"
        icon={<Phone size={15} />}
        autoComplete="tel"
      />

      {/* Address section */}
      <div
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: "#f8faff", border: "1px solid #e8f0fd" }}
      >
        <div className="flex items-center gap-2">
          <MapPin size={14} style={{ color: "#3b82f6" }} />
          <span className="text-xs font-semibold" style={{ color: "#475569" }}>
            Adresse (optional)
          </span>
        </div>
        <Field
          label="Straße & Hausnummer"
          value={data.street}
          onChange={(v) => onChange({ street: v })}
          placeholder="Musterstraße 42"
          icon={<MapPin size={15} />}
          autoComplete="street-address"
        />
        <div className="grid grid-cols-3 gap-2">
          <Field
            label="PLZ"
            value={data.zip}
            onChange={(v) => onChange({ zip: v })}
            placeholder="80331"
            icon={<span style={{ fontSize: 12 }}>📍</span>}
            autoComplete="postal-code"
          />
          <div className="col-span-2">
            <Field
              label="Stadt"
              value={data.city}
              onChange={(v) => onChange({ city: v })}
              placeholder="München"
              icon={<span style={{ fontSize: 12 }}>🏙️</span>}
              autoComplete="address-level2"
            />
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        disabled={!isValid}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold mt-2"
        style={{
          background: isValid ? "#1a1f3a" : "#e2e8f0",
          color: isValid ? "white" : "#94a3b8",
          border: "none",
          transition: "background 0.2s",
        }}
      >
        Weiter
        <ChevronRight size={18} />
      </motion.button>
    </motion.div>
  );
}
