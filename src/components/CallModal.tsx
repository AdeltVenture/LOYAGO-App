import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, Clock } from "lucide-react";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallModal({ isOpen, onClose }: CallModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(26,31,58,0.5)", backdropFilter: "blur(4px)" }}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pt-5 pb-12"
            style={{
              background: "white",
              maxWidth: "430px",
              marginInline: "auto",
            }}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "#e2e8f0" }} />

            {/* Expert info */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="rounded-2xl flex items-center justify-center text-2xl font-bold"
                style={{
                  width: 60,
                  height: 60,
                  background: "linear-gradient(135deg, #cbdafb 0%, #7ba3f5 100%)",
                  color: "#1a1f3a",
                }}
              >
                LB
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: "#1a1f3a" }}>
                  LOYAGO Experten-Hotline
                </h3>
                <p className="text-sm" style={{ color: "#64748b" }}>
                  Persönliche Beratung – kostenlos & unverbindlich
                </p>
              </div>
            </div>

            {/* Availability */}
            <div
              className="flex items-center gap-2 rounded-xl p-3 mb-5"
              style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
            >
              <Clock size={15} style={{ color: "#16a34a", flexShrink: 0 }} />
              <p className="text-sm" style={{ color: "#166534" }}>
                <strong>Jetzt verfügbar</strong> · Mo–Fr 08:00–20:00 Uhr, Sa 09:00–17:00 Uhr
              </p>
            </div>

            {/* Number */}
            <a
              href="tel:+4989123456789"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-base font-bold mb-3"
              style={{
                background: "#1a1f3a",
                color: "white",
                textDecoration: "none",
              }}
              onClick={onClose}
            >
              <Phone size={18} />
              0800 123 456 789
            </a>

            <p className="text-center text-xs mb-4" style={{ color: "#94a3b8" }}>
              Kostenlos aus dem deutschen Festnetz und Mobilfunk
            </p>

            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-medium"
              style={{ background: "#f4f8fe", color: "#64748b", border: "none" }}
            >
              <X size={15} />
              Abbrechen
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
