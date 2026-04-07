import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, X } from "lucide-react";

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
                Jetzt chatten
              </span>
              <button
                onClick={() => { onChat(); setExpanded(false); }}
                className="flex items-center justify-center rounded-full shadow-lg"
                style={{ width: 48, height: 48, background: "#1a1f3a" }}
              >
                <MessageCircle size={20} style={{ color: "white" }} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB — the "O" from LOYAGO */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-center rounded-full relative"
        style={{
          width: 58,
          height: 58,
          background: expanded ? "#1a1f3a" : "linear-gradient(135deg, #cbdafb 0%, #7ba3f5 100%)",
          boxShadow: "0 4px 20px rgba(26,31,58,0.25), 0 1px 4px rgba(26,31,58,0.15)",
          transition: "background 0.3s",
        }}
      >
        {/* Pulse ring removed — FAB stays clean */}

        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.22 }}
            >
              <X size={22} style={{ color: "white" }} />
            </motion.div>
          ) : (
            <motion.div
              key="logo-o"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.22 }}
              style={{
                fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 900,
                fontSize: 28,
                color: "#1a1f3a",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                userSelect: "none",
              }}
            >
              O
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
