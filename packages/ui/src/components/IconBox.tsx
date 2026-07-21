import type { ReactNode } from "react"

export interface IconBoxProps {
  children: ReactNode
  shape?: "squircle" | "circle"
  size?: "sm" | "md" | "lg"
  theme?: "panel" | "hub"
  className?: string
}

const SIZE_CLASSES = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
}

const SHAPE_CLASSES = {
  squircle: { sm: "rounded-xl", md: "rounded-xl", lg: "rounded-2xl" },
  circle: "rounded-full",
}

export default function IconBox({
  children,
  shape = "squircle",
  size = "lg",
  theme = "panel",
  className = "",
}: IconBoxProps) {
  const sizeClass = SIZE_CLASSES[size]
  const shapeClass = shape === "circle" ? SHAPE_CLASSES.circle : SHAPE_CLASSES.squircle[size]
  const themeClass =
    theme === "hub"
      ? "bg-hub-surface-hover text-hub-text border border-hub-border-light/50"
      : "bg-panel-border text-panel-text border border-panel-border-subtle"

  return (
    <div className={`${sizeClass} ${shapeClass} ${themeClass} flex items-center justify-center shrink-0 font-medium ${className}`}>
      {children}
    </div>
  )
}
