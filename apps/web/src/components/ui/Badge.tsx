import type { ReactNode } from "react"

export type BadgeVariant = "success" | "warning" | "info" | "neutral" | "danger"

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  icon?: ReactNode
  className?: string
  onClick?: () => void
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
  neutral: "bg-panel-base border-panel-border-subtle text-panel-text-muted",
  danger: "bg-red-500/10 border-red-500/20 text-red-500",
}

export default function Badge({
  children,
  variant = "neutral",
  icon,
  className = "",
  onClick,
}: BadgeProps) {
  const variantClass = VARIANT_CLASSES[variant]

  return (
    <div
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 shrink-0 transition-all ${
        onClick ? "cursor-pointer active:scale-95" : ""
      } ${variantClass} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </div>
  )
}
