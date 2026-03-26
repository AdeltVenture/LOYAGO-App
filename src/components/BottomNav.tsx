import { motion } from "framer-motion";
import { Home, Wallet, BarChart2, MessageCircle, Menu, type LucideProps } from "lucide-react";

export type Tab = "home" | "wallet" | "analysis" | "expert" | "more";

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const items: { tab: Tab; icon: React.FC<LucideProps>; label: string }[] = [
  { tab: "home", icon: Home, label: "Start" },
  { tab: "wallet", icon: Wallet, label: "Verträge" },
  { tab: "analysis", icon: BarChart2, label: "Analyse" },
  { tab: "expert", icon: MessageCircle, label: "Experte" },
  { tab: "more", icon: Menu, label: "Mehr" },
];

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 pb-6 pt-3"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid #f1f5f9",
        maxWidth: "430px",
        marginInline: "auto",
      }}
    >
      {items.map(({ tab, icon: Icon, label }) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className="flex flex-col items-center gap-1 relative px-3 py-1"
            style={{ border: "none", background: "transparent" }}
          >
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full"
                style={{ width: 32, height: 3, background: "#1a1f3a" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />
            )}
            <Icon
              size={22}
              strokeWidth={isActive ? 2.2 : 1.7}
              style={{ color: isActive ? "#1a1f3a" : "#94a3b8" }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: isActive ? "#1a1f3a" : "#94a3b8" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
