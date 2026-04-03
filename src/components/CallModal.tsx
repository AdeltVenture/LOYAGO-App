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
            style={{ background: "white", maxWidth: "430px", marginInline: "auto" }}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "#e2e8f0" }} />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  width: 58,
                  height: 58,
                  background: "linear-gradient(140deg, #1a1f3a 0%, #2d3a6b 100%)",
                }}
              >
                <Phone size={24} color="white" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight" style={{ color: "#1a1f3a" }}>
                  Persönliche Beratung
                </h3>
                <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
                  Direkt mit einem Fachexperten sprechen
                </p>
              </div>
            </div>

            {/* Availability */}
            <div
              className="flex items-start gap-3 rounded-2xl p-4 mb-5"
              style={{ background: "#f4f8fe" }}
            >
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
                style={{ width: 30, height: 30, background: "#eaeff8" }}
              >
                <Clock size={15} color="#4a6da8" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1a1f3a" }}>
                  Mo–Fr 08:00–20:00 Uhr
                </p>
                <p className="text-sm" style={{ color: "#64748b" }}>
                  Sa 09:00–17:00 Uhr
                </p>
              </div>
            </div>

            {/* Call button */}
            <a
              href="tel:+4969247471400"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-base font-bold mb-5"
              style={{ background: "#1a1f3a", color: "white", textDecoration: "none" }}
              onClick={onClose}
            >
              <Phone size={18} />
              069 247 471 400
            </a>

            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-medium"
              style={{ background: "#f4f8fe", color: "#64748b" }}
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
