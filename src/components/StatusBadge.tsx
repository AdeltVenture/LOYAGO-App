import { type ContractStatus, statusColors, statusLabels } from "../data/contracts";

interface StatusBadgeProps {
  status: ContractStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const colors = statusColors[status];
  const label = statusLabels[status];

  return (
    <span
      className="inline-flex items-center gap-1 font-semibold tracking-wide rounded-full"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize: size === "sm" ? "10px" : "11px",
        padding: size === "sm" ? "2px 8px" : "3px 10px",
      }}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{
          width: size === "sm" ? 5 : 6,
          height: size === "sm" ? 5 : 6,
          backgroundColor: colors.dot,
        }}
      />
      {label}
    </span>
  );
}
