import { motion } from "framer-motion";
import CloudBackground from "./CloudBackground";

const LETTERS = ["L", "O", "Y", "A", "G", "O"];

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: "easeInOut" }}
    >
      <CloudBackground />

      <div className="relative z-10 flex flex-col items-center">

        {/* Soft glow behind the wordmark */}
        <motion.div
          className="absolute"
          style={{
            width: 320,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(203,218,251,0.8) 0%, transparent 70%)",
            filter: "blur(24px)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Letter-by-letter wordmark */}
        <div className="flex items-end" style={{ gap: 1 }}>
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.5,
                delay: 0.15 + i * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-black"
              style={{
                fontSize: "54px",
                color: "#1a1f3a",
                letterSpacing: "-1px",
                lineHeight: 1,
                display: "inline-block",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Progress line — sits flush below the wordmark */}
        <motion.div
          className="mt-3 rounded-full overflow-hidden"
          style={{ width: 220, height: 2, background: "rgba(26,31,58,0.10)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, rgba(26,31,58,0.0) 0%, #1a1f3a 40%, rgba(74,109,168,0.8) 100%)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.7, delay: 0.9, ease: "linear" }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="mt-4 text-center"
          style={{ fontSize: "15px", color: "#3d4a6a", fontWeight: 500, lineHeight: 1.5 }}
        >
          Gut betreut.{"\u00A0"}Bei allen Versicherungen.
        </motion.p>

      </div>
    </motion.div>
  );
}
