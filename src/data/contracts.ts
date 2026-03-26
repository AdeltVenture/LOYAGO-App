export type ContractStatus = "optimal" | "gut" | "mangelhaft";

/** Brand colors + abbreviation for each insurer (used as logo badge fallback) */
export const insurerBrands: Record<string, { color: string; textColor: string; abbr: string; logoUrl?: string }> = {
  "Allianz":                    { color: "#003781", textColor: "white", abbr: "AL",   logoUrl: "/LOYAGO-App/logos/allianz.svg" },
  "Alte Leipziger":             { color: "#C8002A", textColor: "white", abbr: "ALT",  logoUrl: "/LOYAGO-App/logos/alte-leipziger.svg" },
  "AXA":                        { color: "#00008F", textColor: "white", abbr: "AXA" },
  "R+V":                        { color: "#E30613", textColor: "white", abbr: "R+V",  logoUrl: "/LOYAGO-App/logos/ruv.svg" },
  "Hannoversche Leben":         { color: "#005A9A", textColor: "white", abbr: "HL",   logoUrl: "/LOYAGO-App/logos/hannoversche.svg" },
  "ADAC":                       { color: "#F9BC00", textColor: "#1a1f3a", abbr: "ADAC", logoUrl: "/LOYAGO-App/logos/adac.svg" },
  "Deutsche Rentenversicherung":{ color: "#003882", textColor: "white", abbr: "DRV",  logoUrl: "/LOYAGO-App/logos/drv.svg" },
  "HUK-COBURG":                 { color: "#004A97", textColor: "white", abbr: "HUK" },
  "ERGO":                       { color: "#E4002B", textColor: "white", abbr: "ERGO" },
  "Generali":                   { color: "#CC0000", textColor: "white", abbr: "GEN" },
};

export interface Contract {
  id: string;
  name: string;
  insurer: string;
  category: string;
  categoryIcon: string;
  monthlyPremium: number;
  annualPremium: number;
  status: ContractStatus;
  policyNumber: string;
  startDate: string;
  renewalDate: string;
  coverage: string;
  deductible: string;
  notes?: string;
  color: string;
}

export const contracts: Contract[] = [
  {
    id: "1",
    name: "Privathaftpflichtversicherung",
    insurer: "Allianz",
    category: "Haftpflicht",
    categoryIcon: "shield",
    monthlyPremium: 5.83,
    annualPremium: 70,
    status: "optimal",
    policyNumber: "ALZ-2024-001847",
    startDate: "01.01.2022",
    renewalDate: "01.01.2025",
    coverage: "50.000.000 €",
    deductible: "0 €",
    notes: "Weltweiter Schutz, inkl. Mietsachschäden",
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "Hausratversicherung",
    insurer: "Alte Leipziger",
    category: "Hausrat",
    categoryIcon: "home",
    monthlyPremium: 6.67,
    annualPremium: 80,
    status: "mangelhaft",
    policyNumber: "AL-HR-2021-44891",
    startDate: "15.03.2021",
    renewalDate: "15.03.2025",
    coverage: "45.000 €",
    deductible: "150 €",
    notes: "Unterversichert – Wohnfläche wurde nicht aktualisiert",
    color: "#f59e0b",
  },
  {
    id: "3",
    name: "KFZ-Versicherung",
    insurer: "R+V",
    category: "KFZ",
    categoryIcon: "car",
    monthlyPremium: 70.25,
    annualPremium: 843,
    status: "optimal",
    policyNumber: "RV-KFZ-2023-77214",
    startDate: "01.07.2023",
    renewalDate: "01.07.2025",
    coverage: "Vollkasko",
    deductible: "300 €",
    notes: "Inkl. Schutzbrief Europa",
    color: "#8b5cf6",
  },
  {
    id: "4",
    name: "Gesetzliche Rente",
    insurer: "Deutsche Rentenversicherung",
    category: "Rente",
    categoryIcon: "trending-up",
    monthlyPremium: 0,
    annualPremium: 0,
    status: "gut",
    policyNumber: "DRV-RE-44 123456 A 001",
    startDate: "01.09.2010",
    renewalDate: "–",
    coverage: "Altersvorsorge",
    deductible: "–",
    notes: "Rentenanspruch prüfen – private Vorsorge empfohlen",
    color: "#10b981",
  },
  {
    id: "5",
    name: "Berufsunfähigkeitsversicherung",
    insurer: "Hannoversche Leben",
    category: "Leben",
    categoryIcon: "heart",
    monthlyPremium: 68.00,
    annualPremium: 816,
    status: "optimal",
    policyNumber: "HL-BU-2020-38821",
    startDate: "01.04.2020",
    renewalDate: "01.04.2040",
    coverage: "2.500 € mtl. BU-Rente",
    deductible: "–",
    notes: "Abstrakte Verweisung ausgeschlossen",
    color: "#ec4899",
  },
  {
    id: "6",
    name: "Reisekrankenversicherung",
    insurer: "ADAC",
    category: "Reise",
    categoryIcon: "plane",
    monthlyPremium: 4.50,
    annualPremium: 54,
    status: "gut",
    policyNumber: "ADAC-RK-2024-99123",
    startDate: "01.01.2024",
    renewalDate: "01.01.2026",
    coverage: "Weltweit unbegrenzt",
    deductible: "0 €",
    notes: "Familienschutz – Deckung für Auslandssemester prüfen",
    color: "#06b6d4",
  },
];

export const statusLabels: Record<ContractStatus, string> = {
  optimal: "OPTIMAL",
  gut: "GUT",
  mangelhaft: "MANGELHAFT",
};

export const statusColors: Record<ContractStatus, { bg: string; text: string; dot: string }> = {
  optimal: { bg: "#dcfce7", text: "#16a34a", dot: "#22c55e" },
  gut: { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  mangelhaft: { bg: "#fee2e2", text: "#dc2626", dot: "#ef4444" },
};
