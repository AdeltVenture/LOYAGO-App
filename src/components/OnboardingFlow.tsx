import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import StepIndicator from "./onboarding/StepIndicator";
import Step1Welcome from "./onboarding/Step1Welcome";
import Step2PersonalData from "./onboarding/Step2PersonalData";
import Step3Insurers from "./onboarding/Step3Insurers";
import Step4Consent from "./onboarding/Step4Consent";
import Step5Success from "./onboarding/Step5Success";
import { type OnboardingData, emptyOnboardingData } from "../data/onboarding";

interface OnboardingFlowProps {
  onClose: () => void;
  onFinish: () => void;
  onChat: () => void;
  onCall: () => void;
}

const STEP_LABELS = ["Start", "Angaben", "Versicherer", "Bestätigung", "Fertig"];

export default function OnboardingFlow({
  onClose,
  onFinish,
  onChat,
  onCall,
}: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(emptyOnboardingData);

  function updateData(partial: Partial<OnboardingData>) {
    setData((d) => ({ ...d, ...partial }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, 5));
  }

  function back() {
    if (step <= 1) {
      onClose();
    } else {
      setStep((s) => s - 1);
    }
  }

  const showIndicator = step >= 2 && step <= 4;

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#f4f8fe", maxWidth: "430px", marginInline: "auto" }}
    >
      {/* Header */}
      {step < 5 && (
        <div
          className="flex items-center gap-3 px-4 pt-12 pb-4"
          style={{ background: "rgba(244,248,254,0.95)", backdropFilter: "blur(12px)" }}
        >
          <button
            onClick={back}
            className="flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <ArrowLeft size={17} style={{ color: "#1a1f3a" }} />
          </button>

          <div className="flex-1">
            <p className="text-xs font-medium" style={{ color: "#94a3b8" }}>
              Betreuungswunsch einrichten
            </p>
            {step > 1 && step < 5 && (
              <div className="mt-1 rounded-full overflow-hidden" style={{ height: 3, background: "#e2e8f0" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #cbdafb, #1a1f3a)" }}
                  animate={{ width: `${((step - 1) / 3) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <X size={17} style={{ color: "#64748b" }} />
          </button>
        </div>
      )}

      {/* Step indicator */}
      {showIndicator && (
        <div className="px-4 pt-4">
          <StepIndicator current={step} total={4} labels={STEP_LABELS.slice(1)} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div key={step}>
            {step === 1 && <Step1Welcome onNext={next} />}
            {step === 2 && (
              <Step2PersonalData data={data} onChange={updateData} onNext={next} />
            )}
            {step === 3 && (
              <Step3Insurers data={data} onChange={updateData} onNext={next} />
            )}
            {step === 4 && (
              <Step4Consent data={data} onChange={updateData} onSubmit={next} />
            )}
            {step === 5 && (
              <Step5Success
                firstName={data.firstName}
                onFinish={onFinish}
                onChat={onChat}
                onCall={onCall}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
