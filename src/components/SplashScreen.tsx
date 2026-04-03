import { motion } from "framer-motion";
import CloudBackground from "./CloudBackground";

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
    >
      <CloudBackground />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.1 }}
          className="flex items-center justify-center rounded-3xl mb-5"
          style={{
            width: 84,
            height: 84,
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(26,31,58,0.12)",
          }}
        >
          {/* Shield icon as logo mark */}
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
              fill="#1a1f3a"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
            />
            <motion.path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.85, ease: "easeOut" }}
            />
          </svg>
        </motion.div>

        {/* Wordmark */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.55 }}
          className="font-black tracking-tight"
          style={{ fontSize: "38px", color: "#1a1f3a", letterSpacing: "-1.5px", lineHeight: 1 }}
        >
          LOYAGO
        </motion.span>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.85 }}
          className="mt-2 text-sm font-medium tracking-wide"
          style={{ color: "#3d4a6a", letterSpacing: "0.06em" }}
        >
          Ihr Versicherungsmanager
        </motion.p>
      </div>
    </motion.div>
  );
}
