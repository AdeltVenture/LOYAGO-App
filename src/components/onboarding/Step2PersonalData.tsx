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
  optional?: boolean;
}

function Field({ label, value, onChange, placeholder, type = "text", icon, autoComplete, optional }: FieldProps) {
  return (
    <div>
      <label className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: "#475569" }}>
        {label}
        {optional && <span className="font-normal" style={{ color: "#94a3b8" }}>(optional)</span>}
      </label>
      <div
        className="flex items-center gap-2.5 px-3 rounded-xl"
        style={{ background: "white", border: "1.5px solid #e2e8f0", height: 46 }}
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
          onFocus={e => (e.target.parentElement!.style.borderColor = "#4a6da8")}
          onBlur={e => (e.target.parentElement!.style.borderColor = "#e2e8f0")}
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
    data.street.trim() &&
    data.zip.trim() &&
    data.city.trim();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 pt-4"
    >
      <div className="mb-1">
        <h3 className="text-lg font-bold" style={{ color: "#1a1f3a" }}>Ihre Angaben</h3>
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
          placeholder="Marco"
          icon={<User size={15} />}
          autoComplete="given-name"
        />
        <Field
          label="Nachname"
          value={data.lastName}
          onChange={(v) => onChange({ lastName: v })}
          placeholder="Adelt"
          icon={<User size={15} />}
          autoComplete="family-name"
        />
      </div>

      <Field
        label="E-Mail"
        value={data.email}
        onChange={(v) => onChange({ email: v })}
        placeholder="marco.adelt@gmx.de"
        type="email"
        icon={<Mail size={15} />}
        autoComplete="email"
      />

      <Field
        label="Telefon"
        value={data.phone}
        onChange={(v) => onChange({ phone: v })}
        placeholder="+49 170 1234567"
        type="tel"
        icon={<Phone size={15} />}
        autoComplete="tel"
        optional
      />

      {/* Address — required */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin size={13} style={{ color: "#4a6da8" }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>
            Adresse
          </span>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl p-4" style={{ background: "#f4f8fe", border: "1px solid #e8eef8" }}>
          <Field
            label="Straße & Hausnummer"
            value={data.street}
            onChange={(v) => onChange({ street: v })}
            placeholder="Europa-Allee 165"
            icon={<MapPin size={15} />}
            autoComplete="street-address"
          />
          <div className="grid grid-cols-3 gap-2">
            <Field
              label="PLZ"
              value={data.zip}
              onChange={(v) => onChange({ zip: v })}
              placeholder="60486"
              icon={<MapPin size={12} />}
              autoComplete="postal-code"
            />
            <div className="col-span-2">
              <Field
                label="Stadt"
                value={data.city}
                onChange={(v) => onChange({ city: v })}
                placeholder="Frankfurt am Main"
                icon={<MapPin size={12} />}
                autoComplete="address-level2"
              />
            </div>
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        disabled={!isValid}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold mt-2"
        style={{
          background: isValid ? "#1a1f3a" : "#e2e8f0",
          color: isValid ? "white" : "#94a3b8",
          transition: "background 0.2s",
        }}
      >
        Weiter
        <ChevronRight size={17} />
      </motion.button>
    </motion.div>
  );
}
