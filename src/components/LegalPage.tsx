import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export type LegalType = "impressum" | "datenschutz" | "transparenz" | "erstinformation";

const titles: Record<LegalType, string> = {
  impressum:       "Impressum",
  datenschutz:     "Datenschutz",
  transparenz:     "Transparenz",
  erstinformation: "Erstinformation",
};

// ─── Content sections ────────────────────────────────────────────────────────

function Impressum() {
  return (
    <div className="flex flex-col gap-5">
      <Section title="LOYAGO GmbH">
        <p>Europa-Allee 165, 60486 Frankfurt am Main</p>
        <p>E-Mail: support@loyago.de</p>
        <p>Telefon: 069 247 471 400</p>
        <p>Web: www.loyago.de</p>
      </Section>

      <Section title="Vertretungsberechtigte Geschäftsführung">
        <p>Dr. Marco Adelt und Daniel Glaremin</p>
      </Section>

      <Section title="Handelsregister">
        <p>Eingetragen im Handelsregister beim Amtsgericht Frankfurt am Main unter der Nummer HRB 136169.</p>
      </Section>

      <Section title="Berufsbezeichnung und Aufsichtsbehörde">
        <p>LOYAGO GmbH ist tätig als Versicherungsvertreter (Mehrfachagent) mit einer Erlaubnis nach § 34d Abs. 1 Gewerbeordnung. Registriert unter der Nummer: D-O2E6-73ICR-16.</p>
        <Spacer />
        <p className="font-medium">Zuständige Erlaubnis- und Aufsichtsbehörde:</p>
        <p>Industrie- und Handelskammer Frankfurt am Main</p>
        <p>Börsenplatz 4, 60313 Frankfurt am Main</p>
        <p>Web: www.frankfurt-main.ihk24.de</p>
        <p>Vermittlerregister: www.vermittlerregister.info</p>
      </Section>

      <Section title="Berufshaftpflichtversicherung">
        <p>Name und Sitz des Versicherers: Ergo Versicherung AG, 40198 Düsseldorf</p>
        <p>Geltungsraum: Deutschland</p>
      </Section>

      <Section title="Inhaltlich Verantwortlicher nach § 55 Abs. 2 RStV">
        <p>LOYAGO GmbH, Europa-Allee 165, 60486 Frankfurt am Main</p>
      </Section>

      <Section title="Schlichtungsstellen">
        <p className="font-medium">Versicherungsombudsmann e.V.</p>
        <p>Postfach 08 06 32, 10006 Berlin</p>
        <p>www.versicherungsombudsmann.de</p>
        <Spacer />
        <p className="font-medium">Ombudsmann Private Kranken- und Pflegeversicherung</p>
        <p>Kronenstraße 13, 10117 Berlin</p>
        <p>www.pkv-ombudsmann.de</p>
      </Section>
    </div>
  );
}

function Datenschutz() {
  return (
    <div className="flex flex-col gap-5">
      <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.7 }}>
        Im Folgenden informieren wir über die Verarbeitung personenbezogener Daten bei der Nutzung unserer Website www.loyago.de sowie unserer Profile in Sozialen Medien.
      </p>

      <Section title="1. Kontaktdaten">
        <p>Verantwortlicher gem. Art. 4 Abs. 7 DSGVO:</p>
        <p className="font-medium mt-1">LOYAGO GmbH</p>
        <p>Europa-Allee 165, Frankfurt am Main</p>
        <p>support@loyago.de · kundenservice@loyago.de · datenschutz@loyago.de</p>
        <p>Gesetzliche Vertreter: Dr. Marco Adelt und Daniel Glaremin</p>
        <Spacer />
        <p className="font-medium">Datenschutzbeauftragter:</p>
        <p>heyData GmbH, Schützenstraße 5, 10117 Berlin</p>
        <p>datenschutz@heydata.eu · www.heydata.eu</p>
      </Section>

      <Section title="2. Umfang der Verarbeitung">
        <p>Rechtsgrundlagen der Datenverarbeitung:</p>
        <ul className="mt-2 flex flex-col gap-1.5">
          <Li>Art. 6 Abs. 1 lit. a DSGVO – bei Einwilligung</Li>
          <Li>Art. 6 Abs. 1 lit. b DSGVO – zur Vertragserfüllung</Li>
          <Li>Art. 6 Abs. 1 lit. c DSGVO – bei gesetzlicher Verpflichtung</Li>
          <Li>Art. 6 Abs. 1 lit. f DSGVO – bei berechtigtem Interesse</Li>
        </ul>
      </Section>

      <Section title="3. Speicherdauer">
        <p>Daten werden gelöscht, sobald sie für ihren Zweck nicht mehr benötigt werden und keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
      </Section>

      <Section title="4. Rechte der Betroffenen">
        <ul className="flex flex-col gap-1.5">
          <Li>Auskunft, Berichtigung, Löschung</Li>
          <Li>Einschränkung der Verarbeitung</Li>
          <Li>Widerspruch und Datenübertragbarkeit</Li>
          <Li>Widerruf einer Einwilligung jederzeit</Li>
          <Li>Beschwerde bei einer Datenschutz-Aufsichtsbehörde</Li>
        </ul>
      </Section>

      <Section title="5. Webhosting">
        <p>Unsere Website hostet Framer B.V., Niederlande. Wir nutzen außerdem Amazon CloudFront (AWS) als CDN. Rechtsgrundlage für Drittlandsübermittlungen: Standardvertragsklauseln bzw. EU-Angemessenheitsbeschluss.</p>
      </Section>

      <Section title="6. Newsletter">
        <p>Newsletterversand erfolgt über Zoho Corporation GmbH, Düsseldorf. Abmeldung jederzeit über den Link im Newsletter oder per E-Mail.</p>
      </Section>

      <Section title="7. Social Media">
        <p>Wir unterhalten ein Profil auf LinkedIn (LinkedIn Ireland Unlimited Company, Dublin). Deren Datenschutzerklärung gilt für die dortige Datenverarbeitung.</p>
      </Section>

      <Section title="8. Fragen & Änderungen">
        <p>Für Fragen wenden Sie sich an datenschutz@loyago.de. Wir behalten uns vor, diese Erklärung mit Wirkung für die Zukunft zu ändern.</p>
      </Section>
    </div>
  );
}

function Transparenz() {
  return (
    <div className="flex flex-col gap-5">
      <Section title="1. Nachhaltigkeitsrisiken in der Beratung">
        <p>Die LOYAGO GmbH bezieht bei der Auswahl und Vermittlung von Versicherungsanlageprodukten auf Wunsch Nachhaltigkeitsaspekte (ESG) mit ein. Nachhaltigkeitsrisiken werden berücksichtigt, wenn das Produkt entsprechende Informationen bereitstellt und Sie dies wünschen. Sprechen Sie uns gerne darauf an.</p>
      </Section>

      <Section title="2. Nachteilige Nachhaltigkeitsauswirkungen (Art. 4 TVO)">
        <p>Als Versicherungsvermittler sind wir gesetzlich nicht verpflichtet, Principal Adverse Impacts (PAI) systematisch zu erfassen. Da von Produktanbietern derzeit häufig keine ausreichenden standardisierten Informationen vorliegen, berücksichtigen wir PAI aktuell nicht aktiv. Wir überprüfen unsere Position, sobald verlässliche branchenweite Daten verfügbar sind.</p>
      </Section>

      <Section title="3. Vergütungspolitik (Art. 5 TVO)">
        <p>Unsere Vergütungspolitik enthält keine Anreize, Nachhaltigkeitsrisiken zu vernachlässigen. Die Vermittlung erfolgt unabhängig davon, ob ein Produkt nachhaltige Merkmale aufweist. Wenn Nachhaltigkeit für Sie eine zentrale Rolle spielt, fließt das in unsere Empfehlung mit ein.</p>
      </Section>
    </div>
  );
}

function Erstinformation() {
  return (
    <div className="flex flex-col gap-5">
      <p style={{ color: "#475569", fontSize: 12, lineHeight: 1.6 }}>
        Erstinformation gemäß § 15 Versicherungsvermittlerverordnung (VersVermV)
      </p>

      <Section title="LOYAGO GmbH">
        <p>Europa-Allee 165, 60486 Frankfurt am Main</p>
        <p>support@loyago.de · 069 247 471 400</p>
        <p>www.loyago.de</p>
        <p className="mt-1">Geschäftsführer: Dr. Marco Adelt und Daniel Glaremin</p>
      </Section>

      <Section title="Wer wir sind">
        <p>LOYAGO GmbH ist als Versicherungsvertreter (Mehrfachagent) mit Erlaubnis nach § 34d Abs. 1 GewO tätig. Als Mehrfachagentur vertreten wir mehrere namhafte Versicherungsunternehmen und bieten Ihnen dadurch eine vielfältige Produktauswahl.</p>
      </Section>

      <Section title="Registrierung">
        <p>Registrierungsnummer: D-O2E6-73ICR-16</p>
        <Spacer />
        <p className="font-medium">Zuständige Behörde:</p>
        <p>IHK Frankfurt am Main, Börsenplatz 4, 60313 Frankfurt</p>
        <p>www.frankfurt-main.ihk24.de</p>
        <p>Vermittlerregister: www.vermittlerregister.info</p>
      </Section>

      <Section title="Vergütung und Transparenz">
        <p>Wir erhalten eine Provision von den Versicherungsunternehmen, mit denen wir zusammenarbeiten. Diese ist bereits in den Versicherungsbeiträgen enthalten – für Sie entstehen keine zusätzlichen Kosten.</p>
      </Section>

      <Section title="Beteiligungen">
        <p>LOYAGO GmbH hält keine Beteiligungen an Versicherungsunternehmen. Umgekehrt hält auch kein Versicherer eine Beteiligung an unserem Unternehmen.</p>
      </Section>

      <Section title="Schlichtungsstellen">
        <p className="font-medium">Versicherungsombudsmann e.V.</p>
        <p>Postfach 08 06 32, 10006 Berlin</p>
        <p>www.versicherungsombudsmann.de</p>
        <Spacer />
        <p className="font-medium">Ombudsmann Private Kranken- und Pflegeversicherung</p>
        <p>Kronenstraße 13, 10117 Berlin</p>
        <p>www.pkv-ombudsmann.de</p>
      </Section>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <p className="font-semibold mb-2" style={{ fontSize: 13, color: "#1a1f3a" }}>{title}</p>
      <div className="flex flex-col gap-0.5" style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 list-none">
      <span style={{ color: "#94a3b8", marginTop: 2, flexShrink: 0 }}>·</span>
      <span>{children}</span>
    </li>
  );
}

function Spacer() {
  return <div style={{ height: 6 }} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

const contentMap: Record<LegalType, React.ReactNode> = {
  impressum:       <Impressum />,
  datenschutz:     <Datenschutz />,
  transparenz:     <Transparenz />,
  erstinformation: <Erstinformation />,
};

interface LegalPageProps {
  type: LegalType;
  onBack: () => void;
}

export default function LegalPage({ type, onBack }: LegalPageProps) {
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
        <h1 className="font-bold text-lg" style={{ color: "#1a1f3a" }}>
          {titles[type]}
        </h1>
      </div>

      {/* Content */}
      <div className="px-4 py-5 pb-16">
        {contentMap[type]}
      </div>
    </motion.div>
  );
}
