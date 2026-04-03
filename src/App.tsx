import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, User, HelpCircle, Building2, Lock, Leaf, FileText, ShieldCheck } from "lucide-react";
import AdminPage from "./components/AdminPage";
import { supabase } from "./lib/supabase";
import { useAuth } from "./hooks/useAuth";
import { useContracts } from "./hooks/useContracts";
import { useProfile } from "./hooks/useProfile";

const menuItemStyle = { background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" } as const;

import HeroSection from "./components/HeroSection";
import WalletView from "./components/WalletView";
import ContractDetail from "./components/ContractDetail";
import ExpertChat from "./components/ExpertChat";
import OnboardingFlow from "./components/OnboardingFlow";
import BottomNav, { type Tab } from "./components/BottomNav";
import FloatingActions from "./components/FloatingActions";
import CallModal from "./components/CallModal";
import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import LegalPage, { type LegalType } from "./components/LegalPage";
import FaqPage from "./components/FaqPage";
import ProfilePage from "./components/ProfilePage";
import { type Contract } from "./data/contracts";
import { contracts as fallbackContracts } from "./data/contracts";

type Screen = "main" | "detail" | "chat" | "onboarding";

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [screen, setScreen] = useState<Screen>("main");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [legalPage, setLegalPage] = useState<LegalType | null>(null);
  const [showFaq, setShowFaq] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const { session, loading: authLoading } = useAuth();
  const isLoggedIn = !!session;
  const { contracts, loading: contractsLoading } = useContracts();
  const { profile } = useProfile();
  const activeContracts = contractsLoading ? fallbackContracts : contracts;

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(t);
  }, []);

  function handleSelectContract(contract: Contract) {
    setSelectedContract(contract);
    setScreen("detail");
  }

  function handleTabChange(newTab: Tab) {
    if (newTab === "expert") {
      setScreen("chat");
    } else {
      setTab(newTab);
      setScreen("main");
    }
  }

  function handleBack() {
    setScreen("main");
    setSelectedContract(null);
  }

  function handleOpenOnboarding() {
    setScreen("onboarding");
  }

  function handleFinishOnboarding() {
    setScreen("main");
    setTab("wallet");
  }

  const tabContent: Record<Exclude<Tab, "expert">, React.ReactNode> = {
    home: (
      <div>
        <HeroSection contracts={activeContracts} firstName={profile?.firstName} onCall={() => setCallModalOpen(true)} onSelectContract={handleSelectContract} />
        <div className="px-4 pb-32">
          <WalletView contracts={activeContracts} onSelectContract={handleSelectContract} onAddContract={handleOpenOnboarding} />
        </div>
      </div>
    ),
    wallet: (
      <div className="px-4 pt-4 pb-32">
        <div className="mb-5">
          <h2 className="text-xl font-bold" style={{ color: "#1a1f3a" }}>
            Meine Verträge
          </h2>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
            Alle Versicherungen im Überblick
          </p>
        </div>
        <WalletView contracts={activeContracts} onSelectContract={handleSelectContract} onAddContract={handleOpenOnboarding} />
      </div>
    ),
    more: (
      <div className="px-4 pt-4 pb-32">
        <div className="mb-5">
          <h2 className="text-xl font-bold" style={{ color: "#1a1f3a" }}>Mehr</h2>
        </div>

        {/* General items */}
        <div className="flex flex-col gap-3 mb-6">
          {([
            { label: "Profil & Einstellungen", Icon: User,        action: () => setShowProfile(true) },
            { label: "Hilfe & FAQ",            Icon: HelpCircle,  action: () => setShowFaq(true) },
            ...(profile?.role === "admin"
              ? [{ label: "Admin – Anfragen", Icon: ShieldCheck, action: () => setShowAdmin(true) }]
              : []),
          ] as const).map((item) => (
            <motion.button
              key={item.label}
              onClick={"action" in item ? item.action : undefined}
              whileHover={{ y: -1, boxShadow: "0 4px 12px rgba(26,31,58,0.09)" }}
              className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-left"
              style={menuItemStyle}
            >
              <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ width: 36, height: 36, background: "#eaeff8" }}>
                <item.Icon size={17} color="#4a6da8" />
              </div>
              <span className="flex-1 text-sm font-medium" style={{ color: "#1a1f3a" }}>{item.label}</span>
              <span style={{ color: "#cbd5e1", fontSize: 18 }}>›</span>
            </motion.button>
          ))}
        </div>

        {/* Legal section */}
        <p className="text-xs font-semibold mb-3 px-1" style={{ color: "#94a3b8", letterSpacing: "0.06em" }}>
          RECHTLICHES
        </p>
        <div className="flex flex-col gap-3">
          {([
            { label: "Impressum",       Icon: Building2,  type: "impressum"       },
            { label: "Datenschutz",     Icon: Lock,       type: "datenschutz"     },
            { label: "Transparenz",     Icon: Leaf,       type: "transparenz"     },
            { label: "Erstinformation", Icon: FileText,   type: "erstinformation" },
          ] as const).map((item) => (
            <motion.button
              key={item.label}
              onClick={() => setLegalPage(item.type)}
              whileHover={{ y: -1, boxShadow: "0 4px 12px rgba(26,31,58,0.09)" }}
              className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-left"
              style={menuItemStyle}
            >
              <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ width: 36, height: 36, background: "#eaeff8" }}>
                <item.Icon size={17} color="#4a6da8" />
              </div>
              <span className="flex-1 text-sm font-medium" style={{ color: "#1a1f3a" }}>{item.label}</span>
              <span style={{ color: "#cbd5e1", fontSize: 18 }}>›</span>
            </motion.button>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      <AnimatePresence>
        {!showSplash && !authLoading && !isLoggedIn && (
          <LoginScreen key="login" onLogin={() => {}} />
        )}
      </AnimatePresence>

    {isLoggedIn && profile?.role === "admin" && (
      <div className="relative mx-auto" style={{ maxWidth: "430px", minHeight: "100svh", background: "#f4f8fe" }}>
        <AdminPage onBack={async () => { await supabase.auth.signOut(); }} backLabel="Abmelden" />
      </div>
    )}

    {isLoggedIn && profile?.role !== "admin" && <div
      className="relative mx-auto"
      style={{ maxWidth: "430px", minHeight: "100svh", background: "#f4f8fe" }}
    >
      {/* Top bar — non-sticky, only on non-home tabs */}
      {screen === "main" && tab !== "home" && (
        <div className="flex items-center justify-between px-4 pt-12 pb-3">
          <span
            className="font-black tracking-tight"
            style={{ fontSize: "22px", color: "#1a1f3a", letterSpacing: "-0.5px" }}
          >
            LOYAGO
          </span>
          <button
            onClick={() => setCallModalOpen(true)}
            className="flex items-center gap-2 rounded-xl px-3"
            style={{ height: 36, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <Phone size={15} color="#1a1f3a" strokeWidth={2.2} />
            <span className="text-xs font-semibold" style={{ color: "#1a1f3a" }}>Anrufen</span>
          </button>
        </div>
      )}

      {/* Main content */}
      <AnimatePresence mode="wait">
        {screen === "main" && (
          <motion.div
            key={`tab-${tab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tabContent[tab as keyof typeof tabContent]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contract detail overlay */}
      <AnimatePresence>
        {screen === "detail" && selectedContract && (
          <ContractDetail
            contract={selectedContract}
            onBack={handleBack}
            onAskExpert={() => setScreen("chat")}
            onCall={() => setCallModalOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Chat overlay */}
      <AnimatePresence>
        {screen === "chat" && (
          <ExpertChat onBack={handleBack} onCall={() => setCallModalOpen(true)} />
        )}
      </AnimatePresence>

      {/* Onboarding overlay */}
      <AnimatePresence>
        {screen === "onboarding" && (
          <OnboardingFlow
            onClose={handleBack}
            onFinish={handleFinishOnboarding}
            onChat={() => { setScreen("chat"); }}
            onCall={() => { setScreen("main"); setCallModalOpen(true); }}
          />
        )}
      </AnimatePresence>

      {/* Bottom nav */}
      {screen === "main" && (
        <BottomNav active={tab} onChange={handleTabChange} />
      )}

      {/* Floating action button */}
      {screen === "main" && (
        <FloatingActions
          onChat={() => setScreen("chat")}
          onCall={() => setCallModalOpen(true)}
        />
      )}

      <CallModal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />

      {/* Legal pages */}
      <AnimatePresence>
        {legalPage && (
          <LegalPage key={legalPage} type={legalPage} onBack={() => setLegalPage(null)} />
        )}
      </AnimatePresence>

      {/* FAQ */}
      <AnimatePresence>
        {showFaq && <FaqPage key="faq" onBack={() => setShowFaq(false)} />}
      </AnimatePresence>

      {/* Profile */}
      <AnimatePresence>
        {showProfile && (
        <ProfilePage
          key="profile"
          onBack={() => setShowProfile(false)}
          onLogout={async () => {
            await supabase.auth.signOut();
            setShowProfile(false);
            setTab("home");
            setScreen("main");
          }}
        />
      )}
      </AnimatePresence>

      {/* Admin */}
      <AnimatePresence>
        {showAdmin && (
          <AdminPage key="admin" onBack={() => setShowAdmin(false)} />
        )}
      </AnimatePresence>
    </div>}
    </>
  );
}
