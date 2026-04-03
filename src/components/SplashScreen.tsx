import { motion } from "framer-motion";
import CloudBackground from "./CloudBackground";

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <CloudBackground />

      <div className="relative z-10 flex flex-col items-center">
        {/* Wordmark */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="font-black tracking-tight"
          style={{ fontSize: "46px", color: "#1a1f3a", letterSpacing: "-2px", lineHeight: 1 }}
        >
          LOYAGO
        </motion.span>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-3 text-center"
          style={{ fontSize: "15px", color: "#3d4a6a", fontWeight: 500, lineHeight: 1.5 }}
        >
          Gut betreut.{"\u00A0"}Bei allen Versicherungen.
        </motion.p>
      </div>

      {/* Loading bar — bottom of screen */}
      <motion.div
        className="absolute bottom-14 left-0 right-0 px-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.4 }}
      >
        <div className="rounded-full overflow-hidden" style={{ height: 3, background: "rgba(26,31,58,0.12)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "rgba(26,31,58,0.35)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.8, delay: 1.0, ease: "linear" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
