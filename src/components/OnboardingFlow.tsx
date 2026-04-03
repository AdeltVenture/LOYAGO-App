import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import Step1Welcome from "./onboarding/Step1Welcome";
import StepPhotoUpload from "./onboarding/StepPhotoUpload";
import Step2PersonalData from "./onboarding/Step2PersonalData";
import Step4Consent from "./onboarding/Step4Consent";
import Step5Success from "./onboarding/Step5Success";
import { type OnboardingData, emptyOnboardingData } from "../data/onboarding";

interface OnboardingFlowProps {
  onClose: () => void;
  onFinish: () => void;
  onChat: () => void;
  onCall: () => void;
}

// Step mapping:
// 1 = Welcome/Benefits
// 2 = Photo Upload
// 3 = Personal Data
// 4 = Consent
// 5 = Success

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

  const progressPercent = step >= 2 && step <= 4 ? ((step - 1) / 3) * 100 : 0;

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
              {step === 1 && "Ihr Premium-Service"}
              {step === 2 && "Versicherungsschein hochladen"}
              {step === 3 && "Ihre Angaben"}
              {step === 4 && "Bestätigung"}
            </p>
            {step >= 2 && step <= 4 && (
              <div className="mt-1 rounded-full overflow-hidden" style={{ height: 3, background: "#e2e8f0" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #cbdafb, #1a1f3a)" }}
                  animate={{ width: `${progressPercent}%` }}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div key={step}>
            {step === 1 && <Step1Welcome onNext={next} />}
            {step === 2 && <StepPhotoUpload onNext={next} />}
            {step === 3 && (
              <Step2PersonalData data={data} onChange={updateData} onNext={next} />
            )}
            {step === 4 && (
              <Step4Consent data={data} onChange={updateData} onSubmit={async () => {
                // Store Betreuungswunsch in Supabase
                const { data: { session } } = await supabase.auth.getSession();
                await supabase.from("care_requests").insert({
                  user_id: session?.user?.id ?? null,
                  first_name: data.firstName,
                  last_name: data.lastName,
                  email: data.email,
                  phone: data.phone || null,
                  street: data.street,
                  zip: data.zip,
                  city: data.city,
                  insurers: data.selectedInsurers,
                  consent_given: data.consentGiven,
                });
                next();
              }} />
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
