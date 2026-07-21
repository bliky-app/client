import type { ReactNode } from "react"

interface CollapsibleProps {
  isOpen: boolean
  children: ReactNode
}

/**
 * Animated accordion using CSS grid-rows trick.
 * Wraps children in a zero-height container that expands smoothly.
 */
export default function Collapsible({ isOpen, children }: CollapsibleProps) {
  return (
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}
