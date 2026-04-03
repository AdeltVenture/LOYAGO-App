export type ContractStatus = "optimal" | "gut" | "mangelhaft";

export const insurerBrands: Record<string, { color: string; textColor: string; abbr: string }> = {
  "Ammerländer Versicherung": { color: "#1a4a72", textColor: "white", abbr: "AV"   },
  "Die Haftpflichtkasse":     { color: "#b01c1c", textColor: "white", abbr: "HK"   },
  "ARAG":                     { color: "#003d8f", textColor: "white", abbr: "ARAG" },
  "Nürnberger Versicherung":  { color: "#a80000", textColor: "white", abbr: "NV"   },
  "Allianz":                  { color: "#003781", textColor: "white", abbr: "AL"   },
  "AXA":                      { color: "#00008F", textColor: "white", abbr: "AXA"  },
  "R+V":                      { color: "#E30613", textColor: "white", abbr: "R+V"  },
  "HUK-COBURG":               { color: "#004A97", textColor: "white", abbr: "HUK"  },
  "ERGO":                     { color: "#E4002B", textColor: "white", abbr: "ERGO" },
};

export interface ContractOptimization {
  headline: string;
  saving: string;
  detail: string;
}

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
  optimization?: ContractOptimization;
  documentUrl?: string;
}

export const contracts: Contract[] = [
  {
    id: "1",
    name: "Hausrat Exclusiv 2.0",
    insurer: "Ammerländer Versicherung",
    category: "Hausrat",
    categoryIcon: "home",
    monthlyPremium: 4.13,
    annualPremium: 49.57,
    status: "gut",
    policyNumber: "1014556402",
    startDate: "29.05.2024",
    renewalDate: "29.05.2026",
    coverage: "43.550 €",
    deductible: "–",
    notes: "Versicherungssumme prüfen – ggf. an aktuelle Wohnverhältnisse anpassen",
    color: "#5e559c",
    documentUrl: "https://drive.google.com/file/d/1v7U4ye_JMBqZgxGiRRVfxX6YVU41Enkd/view?usp=sharing",
  },
  {
    id: "2",
    name: "Privathaftpflicht",
    insurer: "Die Haftpflichtkasse",
    category: "Haftpflicht",
    categoryIcon: "shield",
    monthlyPremium: 6.69,
    annualPremium: 80.33,
    status: "optimal",
    policyNumber: "37262920/PK",
    startDate: "06.01.2025",
    renewalDate: "05.01.2027",
    coverage: "Privathaftpflicht",
    deductible: "mit Selbstbeteiligung",
    notes: "SEPA-Lastschrift via Targobank · Gläubiger-ID: DE73HK000000020189",
    color: "#4a6da8",
    documentUrl: "https://drive.google.com/file/d/1WgHR2nL6vupl819Hh9kvlkgyPs3am-Zc/view?usp=sharing",
  },
  {
    id: "3",
    name: "Aktiv-Rechtsschutz Komfort",
    insurer: "ARAG",
    category: "Rechtsschutz",
    categoryIcon: "scale",
    monthlyPremium: 24.40,
    annualPremium: 292.85,
    status: "mangelhaft",
    policyNumber: "11 0052 1440 1146",
    startDate: "30.03.2025",
    renewalDate: "30.03.2027",
    coverage: "Aktiv-Rechtsschutz Komfort",
    deductible: "–",
    notes: "Jährliche Zahlungsweise",
    color: "#4a5294",
    documentUrl: "https://drive.google.com/file/d/1UU9kMd0QcHshZ2RQMYHrs1GjaZcXPDsa/view?usp=sharing",
    optimization: {
      headline: "Bis zu 88 € / Jahr einsparen",
      saving: "ca. 88 €",
      detail: "Gleichwertiger Rechtsschutz mit identischer Deckung ist bei anderen Anbietern günstiger verfügbar. Ein Wechsel lohnt sich – besonders vor dem nächsten Verlängerungstermin.",
    },
  },
  {
    id: "4",
    name: "Berufsunfähigkeitsversicherung",
    insurer: "Nürnberger Versicherung",
    category: "Berufsunfähigkeit",
    categoryIcon: "heart",
    monthlyPremium: 85.63,
    annualPremium: 1027.56,
    status: "optimal",
    policyNumber: "L 190479 317 012",
    startDate: "01.06.2020",
    renewalDate: "01.06.2039",
    coverage: "32.551 € Jahresrente bei BU",
    deductible: "–",
    notes: "Tarif SBU2600C*M · Dynamik 3 % p.a. · max. 48.000 € Jahresrente · Nettobeitrag nach Überschuss: 59,94 €/Monat",
    color: "#8a4a68",
    documentUrl: "https://drive.google.com/file/d/1cF_PxkQa6oAeZzAvamojp7jCK9HOMZGa/view?usp=sharing",
  },
];

export const statusLabels: Record<ContractStatus, string> = {
  optimal: "OPTIMAL",
  gut: "GUT",
  mangelhaft: "MANGELHAFT",
};

export const statusColors: Record<ContractStatus, { bg: string; text: string; dot: string }> = {
  optimal:    { bg: "#dcfce7", text: "#16a34a", dot: "#22c55e" },
  gut:        { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  mangelhaft: { bg: "#fee2e2", text: "#dc2626", dot: "#ef4444" },
};
