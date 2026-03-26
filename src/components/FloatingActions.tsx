import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, X, ChevronUp } from "lucide-react";

interface FloatingActionsProps {
  onChat: () => void;
  onCall: () => void;
}

export default function FloatingActions({ onChat, onCall }: FloatingActionsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-30 flex flex-col items-end gap-3">
      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 10 }}
              transition={{ delay: 0.05 }}
              className="flex items-center gap-2"
            >
              <span
                className="text-xs font-medium px-3 py-1.5 rounded-full shadow-sm"
                style={{ background: "white", color: "#1a1f3a" }}
              >
                Jetzt anrufen
              </span>
              <button
                onClick={() => { onCall(); setExpanded(false); }}
                className="flex items-center justify-center rounded-full shadow-lg"
                style={{ width: 48, height: 48, background: "#1a1f3a" }}
              >
                <Phone size={20} style={{ color: "white" }} />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 10 }}
              className="flex items-center gap-2"
            >
              <span
                className="text-xs font-medium px-3 py-1.5 rounded-full shadow-sm"
                style={{ background: "white", color: "#1a1f3a" }}
              >
                Experte fragen
              </span>
              <button
                onClick={() => { onChat(); setExpanded(false); }}
                className="flex items-center justify-center rounded-full shadow-lg"
                style={{
                  width: 48,
                  height: 48,
                  background: "linear-gradient(135deg, #cbdafb 0%, #7ba3f5 100%)",
                }}
              >
                <MessageCircle size={20} style={{ color: "#1a1f3a" }} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-center rounded-full shadow-xl relative"
        style={{
          width: 56,
          height: 56,
          background: expanded
            ? "#1a1f3a"
            : "linear-gradient(135deg, #cbdafb 0%, #7ba3f5 100%)",
          transition: "background 0.3s",
        }}
      >
        {/* Pulse ring */}
        {!expanded && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "rgba(203,218,251,0.5)" }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
          {expanded ? (
            <X size={22} style={{ color: "white" }} />
          ) : (
            <ChevronUp size={22} style={{ color: "#1a1f3a" }} />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
