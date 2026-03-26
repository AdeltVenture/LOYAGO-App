import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  current: number;
  total: number;
  labels: string[];
}

export default function StepIndicator({ current, total, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  background: done
                    ? "#22c55e"
                    : active
                    ? "#1a1f3a"
                    : "#e2e8f0",
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center rounded-full text-xs font-bold"
                style={{ width: 28, height: 28 }}
              >
                {done ? (
                  <Check size={14} style={{ color: "white" }} />
                ) : (
                  <span style={{ color: active ? "white" : "#94a3b8", fontSize: "12px" }}>
                    {step}
                  </span>
                )}
              </motion.div>
              <span
                className="text-center mt-1"
                style={{
                  fontSize: "9px",
                  color: active ? "#1a1f3a" : done ? "#22c55e" : "#94a3b8",
                  fontWeight: active ? 600 : 400,
                  width: 52,
                }}
              >
                {labels[i]}
              </span>
            </div>
            {i < total - 1 && (
              <div
                className="mb-4"
                style={{
                  width: 28,
                  height: 2,
                  background: step < current ? "#22c55e" : "#e2e8f0",
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
