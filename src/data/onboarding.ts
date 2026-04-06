export interface InsurerOption {
  id: string;
  name: string;
  logo: string; // emoji stand-in
  categories: string[];
}

export const popularInsurers: InsurerOption[] = [
  { id: "allianz",       name: "Allianz",            logo: "🔵", categories: ["KFZ", "Haftpflicht", "Hausrat", "Leben", "Gesundheit"] },
  { id: "axa",           name: "AXA",                logo: "🟢", categories: ["KFZ", "Haftpflicht", "Hausrat", "Gesundheit", "Rechtsschutz"] },
  { id: "huk",           name: "HUK-COBURG",         logo: "🔴", categories: ["KFZ", "Haftpflicht", "Hausrat", "Rechtsschutz"] },
  { id: "rv",            name: "R+V",                logo: "🟠", categories: ["KFZ", "Haftpflicht", "Hausrat", "Leben", "Rechtsschutz"] },
  { id: "ergo",          name: "ERGO",               logo: "🟣", categories: ["KFZ", "Haftpflicht", "Hausrat", "Reise", "Rechtsschutz"] },
  { id: "debeka",        name: "Debeka",             logo: "🔷", categories: ["Gesundheit", "Leben", "Haftpflicht", "Hausrat"] },
  { id: "generali",     name: "Generali",            logo: "🦁", categories: ["KFZ", "Haftpflicht", "Hausrat", "Leben"] },
  { id: "zurich",        name: "Zurich",             logo: "🔶", categories: ["KFZ", "Haftpflicht", "Hausrat", "Unfall"] },
  { id: "signal",        name: "Signal Iduna",       logo: "⚡", categories: ["Gesundheit", "Leben", "Haftpflicht", "Unfall"] },
  { id: "gothaer",       name: "Gothaer",            logo: "🏛️", categories: ["KFZ", "Haftpflicht", "Hausrat", "Reise", "Rechtsschutz"] },
  { id: "alte-lp",       name: "Alte Leipziger",     logo: "📘", categories: ["Leben", "BU", "Hausrat", "Unfall"] },
  { id: "adac",          name: "ADAC",               logo: "🚗", categories: ["KFZ", "Reise"] },
  { id: "provinzial",    name: "Provinzial",         logo: "🏠", categories: ["KFZ", "Haftpflicht", "Hausrat", "Leben", "Rechtsschutz"] },
  { id: "lvm",           name: "LVM",                logo: "🌿", categories: ["KFZ", "Haftpflicht", "Hausrat", "Rechtsschutz"] },
  { id: "vhv",           name: "VHV",                logo: "🔑", categories: ["KFZ", "Haftpflicht", "Wohngebäude"] },
  { id: "wuerttemb",     name: "Württembergische",   logo: "⭐", categories: ["KFZ", "Haftpflicht", "Hausrat", "Leben"] },
  { id: "nuernberger",   name: "Nürnberger",         logo: "🏰", categories: ["Leben", "BU", "Unfall", "Rechtsschutz"] },
  { id: "bayerische",    name: "Bayerische",         logo: "🏔️", categories: ["Leben", "BU", "KFZ", "Gesundheit"] },
  { id: "roland",        name: "Roland Rechtsschutz",logo: "⚖️", categories: ["Rechtsschutz"] },
  { id: "arag",          name: "ARAG",               logo: "🔏", categories: ["Rechtsschutz", "Reise", "Unfall"] },
  { id: "devk",          name: "DEVK",               logo: "🚂", categories: ["KFZ", "Haftpflicht", "Hausrat", "Reise"] },
  { id: "concordia",     name: "Concordia",          logo: "🕊️", categories: ["KFZ", "Haftpflicht", "Hausrat", "Rechtsschutz"] },
  { id: "barmenia",      name: "Barmenia",           logo: "🌱", categories: ["Gesundheit", "Leben", "Unfall"] },
  { id: "dkv",           name: "DKV",                logo: "💊", categories: ["Gesundheit", "Pflegezusatz"] },
  { id: "hallesche",     name: "Hallesche",          logo: "💙", categories: ["Gesundheit", "Pflege"] },
  { id: "continentale",  name: "Continentale",       logo: "🌐", categories: ["Gesundheit", "Leben", "BU"] },
  { id: "inter",         name: "INTER",              logo: "🔗", categories: ["Gesundheit", "Leben", "Haftpflicht"] },
  { id: "hdi",           name: "HDI",                logo: "🛡️", categories: ["KFZ", "Haftpflicht", "Leben", "BU"] },
  { id: "swiss-life",    name: "Swiss Life",         logo: "🇨🇭", categories: ["Leben", "BU", "Rente"] },
  { id: "canada-life",   name: "Canada Life",        logo: "🍁", categories: ["Leben", "BU", "Rente"] },
  { id: "huk24",         name: "HUK24",              logo: "🔴", categories: ["KFZ", "Haftpflicht", "Hausrat"] },
  { id: "ammerlaender",  name: "Ammerländer",        logo: "🏡", categories: ["Wohngebäude", "Hausrat", "Haftpflicht"] },
  { id: "haftpflichtkasse", name: "Haftpflichtkasse",logo: "🛡️", categories: ["Haftpflicht", "Rechtsschutz"] },
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
  contractName: string;
  consentGiven: boolean;
}

export const emptyOnboardingData: OnboardingData = {
  firstName: "",
  lastName: "",
  birthDate: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  zip: "",
  selectedInsurers: [],
  contractName: "",
  consentGiven: false,
};
