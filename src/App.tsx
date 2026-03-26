import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Plus } from "lucide-react";

import HeroSection from "./components/HeroSection";
import WalletView from "./components/WalletView";
import ContractDetail from "./components/ContractDetail";
import ExpertChat from "./components/ExpertChat";
import OnboardingFlow from "./components/OnboardingFlow";
import BottomNav, { type Tab } from "./components/BottomNav";
import FloatingActions from "./components/FloatingActions";
import CallModal from "./components/CallModal";
import { type Contract } from "./data/contracts";

type Screen = "main" | "detail" | "chat" | "onboarding";

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [screen, setScreen] = useState<Screen>("main");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);

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
        <HeroSection />
        {/* Betreuungswunsch CTA banner */}
        <div className="px-4 pt-5 pb-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenOnboarding}
            className="w-full flex items-center gap-3 p-4 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #cbdafb 0%, #b8cdfa 100%)",
              border: "none",
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width: 42, height: 42, background: "rgba(255,255,255,0.6)" }}
            >
              <span style={{ fontSize: 20 }}>🛡️</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold" style={{ color: "#1a1f3a" }}>
                Betreuungswunsch für weiteren Vertrag
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#3d4a6a" }}>
                Kostenlos & unverbindlich · Dauert 3 Minuten
              </p>
            </div>
            <Plus size={18} style={{ color: "#1a1f3a", flexShrink: 0 }} />
          </motion.button>
        </div>
        <div className="px-4 pb-2">
          <h3 className="text-sm font-bold mb-1" style={{ color: "#1a1f3a" }}>
            Meine Verträge
          </h3>
          <p className="text-xs" style={{ color: "#94a3b8" }}>
            Schnellübersicht
          </p>
        </div>
        <div className="px-4 pb-32">
          <WalletView onSelectContract={handleSelectContract} onAddContract={handleOpenOnboarding} />
        </div>
      </div>
    ),
    wallet: (
      <div className="px-4 pt-12 pb-32">
        <div className="mb-5">
          <h2 className="text-xl font-bold" style={{ color: "#1a1f3a" }}>
            Meine Verträge
          </h2>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
            Alle Versicherungen im Überblick
          </p>
        </div>
        <WalletView onSelectContract={handleSelectContract} onAddContract={handleOpenOnboarding} />
      </div>
    ),
    more: (
      <div className="px-4 pt-12 pb-32">
        <div className="mb-5">
          <h2 className="text-xl font-bold" style={{ color: "#1a1f3a" }}>
            Mehr
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { label: "Profil & Einstellungen", icon: "👤" },
            { label: "Benachrichtigungen", icon: "🔔" },
            { label: "Datenschutz", icon: "🔒" },
            { label: "Hilfe & FAQ", icon: "❓" },
            { label: "Über LOYAGO", icon: "ℹ️" },
          ].map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-left"
              style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1 text-sm font-medium" style={{ color: "#1a1f3a" }}>
                {item.label}
              </span>
              <span style={{ color: "#cbd5e1" }}>›</span>
            </button>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div
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
            className="relative flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <Bell size={17} style={{ color: "#1a1f3a" }} />
            <span
              className="absolute rounded-full"
              style={{ width: 8, height: 8, background: "#ef4444", top: 8, right: 9, border: "1.5px solid white" }}
            />
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
    </div>
  );
}
