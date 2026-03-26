import {
  Shield,
  Home,
  Car,
  TrendingUp,
  Heart,
  Plane,
  Umbrella,
  Zap,
  Package,
  FileText,
  type LucideProps,
} from "lucide-react";

const iconMap: Record<string, React.FC<LucideProps>> = {
  shield: Shield,
  home: Home,
  car: Car,
  "trending-up": TrendingUp,
  heart: Heart,
  plane: Plane,
  umbrella: Umbrella,
  zap: Zap,
  package: Package,
  file: FileText,
};

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: number;
}

export default function CategoryIcon({ icon, color, size = 20 }: CategoryIconProps) {
  const Icon = iconMap[icon] ?? Shield;

  return (
    <div
      className="flex items-center justify-center rounded-xl flex-shrink-0"
      style={{
        width: size + 16,
        height: size + 16,
        background: `${color}18`,
      }}
    >
      <Icon size={size} strokeWidth={1.8} style={{ color }} />
    </div>
  );
}
