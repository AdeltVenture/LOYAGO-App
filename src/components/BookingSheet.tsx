import { motion } from "framer-motion";
import { X, Calendar, Clock, Video } from "lucide-react";
import { useState } from "react";

const slots = [
  { day: "Mo, 07. Apr.", time: "10:00 Uhr", type: "Video-Call" },
  { day: "Di, 08. Apr.", time: "14:30 Uhr", type: "Video-Call" },
  { day: "Mi, 09. Apr.", time: "09:00 Uhr", type: "Telefon" },
];

interface BookingSheetProps {
  contractName: string;
  onClose: () => void;
}

export default function BookingSheet({ contractName, onClose }: BookingSheetProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(26,31,58,0.45)", backdropFilter: "blur(4px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{ maxWidth: 430, marginInline: "auto", background: "white" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="rounded-full" style={{ width: 36, height: 4, background: "#e2e8f0" }} />
        </div>

        <div className="px-5 pb-10 pt-2">
          <div className="flex items-start justify-between mb-1">
            <h2 className="font-bold text-lg" style={{ color: "#1a1f3a" }}>
              Expertentermin buchen
            </h2>
            <button onClick={onClose} className="p-1" style={{ color: "#94a3b8" }}>
              <X size={20} />
            </button>
          </div>
          <p className="text-sm mb-5" style={{ color: "#64748b" }}>
            Thema: <span className="font-medium" style={{ color: "#1a1f3a" }}>{contractName}</span>
          </p>

          {!confirmed ? (
            <>
              {/* Slots */}
              <div className="flex flex-col gap-3 mb-5">
                {slots.map((slot, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(i)}
                    className="flex items-center gap-4 w-full rounded-2xl px-4 py-3.5 text-left transition-all"
                    style={{
                      background: selected === i ? "#1a1f3a" : "#f4f8fe",
                      border: selected === i ? "none" : "1.5px solid #e8eef8",
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{ width: 40, height: 40, background: selected === i ? "rgba(255,255,255,0.12)" : "#eaeff8" }}
                    >
                      {slot.type === "Video-Call"
                        ? <Video size={18} color={selected === i ? "white" : "#4a6da8"} />
                        : <Clock size={18} color={selected === i ? "white" : "#4a6da8"} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color: selected === i ? "white" : "#1a1f3a" }}>
                        {slot.day}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: selected === i ? "rgba(255,255,255,0.7)" : "#64748b" }}>
                        {slot.time} · {slot.type}
                      </p>
                    </div>
                    <div
                      className="rounded-full flex-shrink-0"
                      style={{
                        width: 20, height: 20,
                        border: selected === i ? "none" : "2px solid #cbd5e1",
                        background: selected === i ? "#f59e0b" : "transparent",
                      }}
                    />
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={selected === null}
                onClick={() => setConfirmed(true)}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2"
                style={{
                  background: selected !== null ? "#1a1f3a" : "#e8eef8",
                  color: selected !== null ? "white" : "#94a3b8",
                  transition: "all 0.2s",
                }}
              >
                <Calendar size={18} />
                Termin bestätigen
              </motion.button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                className="flex items-center justify-center rounded-full mb-4"
                style={{ width: 64, height: 64, background: "#dcfce7" }}
              >
                <span style={{ fontSize: 30 }}>✓</span>
              </motion.div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#1a1f3a" }}>Termin reserviert</h3>
              <p className="text-sm" style={{ color: "#64748b", lineHeight: 1.6 }}>
                {selected !== null && `${slots[selected].day} · ${slots[selected].time}`}
                <br />
                Sie erhalten eine Bestätigung per E-Mail.
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="mt-6 w-full py-3.5 rounded-2xl font-semibold text-sm"
                style={{ background: "#f4f8fe", color: "#1a1f3a" }}
              >
                Schließen
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
