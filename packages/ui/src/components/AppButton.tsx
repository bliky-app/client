import { Loader2 } from "lucide-react"
import type { ReactNode, ButtonHTMLAttributes } from "react"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
export type ButtonSize = "sm" | "md" | "lg"
export type ButtonTheme = "hub" | "panel"

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  theme?: ButtonTheme
  loading?: boolean
  fullWidth?: boolean
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-xs rounded-xl",
  md: "px-4 py-3 text-sm rounded-2xl",
  lg: "px-5 py-3.5 text-sm rounded-2xl",
}

function getVariantClasses(variant: ButtonVariant, theme: ButtonTheme): string {
  if (variant === "primary") {
    return theme === "hub"
      ? "bg-hub-text text-hub-base hover:opacity-90 disabled:opacity-60"
      : "bg-panel-text text-panel-base hover:opacity-90 disabled:opacity-40"
  }
  if (variant === "secondary") {
    return theme === "hub"
      ? "bg-hub-surface border border-hub-border text-hub-text hover:bg-hub-surface-hover disabled:opacity-60"
      : "bg-panel-surface border border-panel-border-subtle text-panel-text hover:bg-panel-surface-hover disabled:opacity-40"
  }
  if (variant === "ghost") {
    return theme === "hub"
      ? "text-hub-text-muted hover:text-hub-text hover:bg-hub-surface-hover disabled:opacity-60"
      : "text-panel-text-muted hover:text-panel-text hover:bg-panel-surface-hover disabled:opacity-40"
  }
  if (variant === "danger") {
    return "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 hover:border-red-500/40 disabled:opacity-60"
  }
  return ""
}

export default function AppButton({
  children,
  variant = "primary",
  size = "lg",
  theme = "panel",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  const variantClasses = getVariantClasses(variant, theme)
  const sizeClasses = SIZE_CLASSES[size]

  return (
    <button
      disabled={disabled || loading}
      className={[
        "font-semibold transition-all active:scale-[0.98] disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        variantClasses,
        sizeClasses,
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  )
}
