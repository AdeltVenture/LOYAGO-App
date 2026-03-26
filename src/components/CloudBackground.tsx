import { motion } from "framer-motion";

interface CloudProps {
  x: number;
  y: number;
  scale: number;
  delay: number;
  opacity: number;
  speed: "slow" | "normal" | "fast";
}

function Cloud({ x, y, scale, delay, opacity, speed }: CloudProps) {
  const durations = { slow: 9, normal: 6, fast: 4 };
  const duration = durations[speed];

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, opacity }}
      animate={{
        y: [0, -16, -8, 0],
        x: [0, 8, -5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={180 * scale}
        height={90 * scale}
        viewBox="0 0 180 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="90" cy="65" rx="78" ry="22" fill="white" fillOpacity="0.9" />
        <ellipse cx="60" cy="55" rx="42" ry="30" fill="white" fillOpacity="0.9" />
        <ellipse cx="110" cy="50" rx="38" ry="28" fill="white" fillOpacity="0.9" />
        <ellipse cx="85" cy="42" rx="30" ry="26" fill="white" fillOpacity="0.95" />
      </svg>
    </motion.div>
  );
}

function SmallCloud({ x, y, scale, delay, opacity, speed }: CloudProps) {
  const durations = { slow: 8, normal: 5, fast: 3.5 };
  const duration = durations[speed];

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, opacity }}
      animate={{
        y: [0, -10, -4, 0],
        x: [0, 5, -3, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={100 * scale}
        height={50 * scale}
        viewBox="0 0 100 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="50" cy="36" rx="42" ry="12" fill="white" fillOpacity="0.85" />
        <ellipse cx="35" cy="28" rx="22" ry="18" fill="white" fillOpacity="0.85" />
        <ellipse cx="62" cy="25" rx="20" ry="17" fill="white" fillOpacity="0.85" />
        <ellipse cx="48" cy="20" rx="18" ry="16" fill="white" fillOpacity="0.9" />
      </svg>
    </motion.div>
  );
}

export default function CloudBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient sky background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #cbdafb 0%, #b8cdfa 30%, #d4e4fc 60%, #e8f0fd 100%)",
        }}
      />

      {/* Sun glow */}
      <div
        className="absolute"
        style={{
          top: "-80px",
          right: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(203,218,251,0.2) 60%, transparent 80%)",
        }}
      />

      {/* Large clouds */}
      <Cloud x={-5} y={10} scale={1.4} delay={0} opacity={0.7} speed="slow" />
      <Cloud x={55} y={5} scale={1.2} delay={2} opacity={0.65} speed="normal" />
      <Cloud x={75} y={20} scale={0.9} delay={1} opacity={0.55} speed="fast" />

      {/* Medium clouds */}
      <SmallCloud x={15} y={40} scale={1.1} delay={3} opacity={0.5} speed="normal" />
      <SmallCloud x={40} y={55} scale={0.8} delay={1.5} opacity={0.4} speed="slow" />
      <SmallCloud x={80} y={45} scale={1.0} delay={0.5} opacity={0.5} speed="fast" />

      {/* Small accent clouds */}
      <SmallCloud x={25} y={65} scale={0.6} delay={2.5} opacity={0.35} speed="fast" />
      <SmallCloud x={60} y={70} scale={0.5} delay={4} opacity={0.3} speed="normal" />
      <SmallCloud x={88} y={60} scale={0.7} delay={1} opacity={0.4} speed="slow" />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, #f4f8fe)",
        }}
      />
    </div>
  );
}
