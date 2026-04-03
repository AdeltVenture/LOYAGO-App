export interface InsurerOption {
  id: string;
  name: string;
  logo: string; // emoji stand-in
  categories: string[];
}

export const popularInsurers: InsurerOption[] = [
  { id: "allianz", name: "Allianz", logo: "🔵", categories: ["KFZ", "Haftpflicht", "Hausrat", "Leben"] },
  { id: "axa", name: "AXA", logo: "🟢", categories: ["KFZ", "Haftpflicht", "Hausrat", "Gesundheit"] },
  { id: "huk", name: "HUK-COBURG", logo: "🔴", categories: ["KFZ", "Haftpflicht", "Hausrat"] },
  { id: "rv", name: "R+V", logo: "🟠", categories: ["KFZ", "Haftpflicht", "Leben", "Hausrat"] },
  { id: "ergo", name: "ERGO", logo: "🟣", categories: ["KFZ", "Haftpflicht", "Hausrat", "Reise"] },
  { id: "debeka", name: "Debeka", logo: "🔷", categories: ["Gesundheit", "Leben", "Haftpflicht"] },
  { id: "generali", name: "Generali", logo: "🦁", categories: ["KFZ", "Haftpflicht", "Hausrat", "Leben"] },
  { id: "zurich", name: "Zurich", logo: "🔶", categories: ["KFZ", "Haftpflicht", "Hausrat"] },
  { id: "signal", name: "Signal Iduna", logo: "⚡", categories: ["Gesundheit", "Leben", "Haftpflicht"] },
  { id: "gothaer", name: "Gothaer", logo: "🏛️", categories: ["KFZ", "Haftpflicht", "Hausrat", "Reise"] },
  { id: "alte-lp", name: "Alte Leipziger", logo: "📘", categories: ["Leben", "BU", "Hausrat"] },
  { id: "adac", name: "ADAC", logo: "🚗", categories: ["KFZ", "Reise", "Pannenhilfe"] },
];

export interface OnboardingData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  selectedInsurers: string[];
  consentGiven: boolean;
}

export const emptyOnboardingData: OnboardingData = {
  firstName: "Marco",
  lastName: "Adelt",
  birthDate: "",
  email: "marco.adelt@gmx.de",
  phone: "",
  street: "Europa-Allee 165",
  city: "Frankfurt am Main",
  zip: "60486",
  selectedInsurers: [],
  consentGiven: false,
};
