import { useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import Collapsible from "./Collapsible"

interface SectionCardProps {
  title: string
  defaultOpen?: boolean
  children: ReactNode
  /** Дополнительный элемент справа от заголовка (например, счётчик) */
  action?: ReactNode
  className?: string
}

/**
 * Стандартный виджет панели: карточка с коллапсируемым заголовком.
 * Используется для списка пространств, быстрых действий и подобных секций.
 */
export default function SectionCard({
  title,
  defaultOpen = true,
  children,
  action,
  className = "",
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`flex flex-col bg-panel-surface border border-panel-border rounded-[32px] shadow-sm overflow-hidden shrink-0 ${className}`}>
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-panel-surface-hover transition-colors"
        onClick={() => setIsOpen(previousOpen => !previousOpen)}
      >
        <h2 className="text-lg font-semibold text-panel-text">{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          <button className="p-2 -mr-2 text-panel-text-muted hover:text-panel-text transition-colors rounded-full">
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      <Collapsible isOpen={isOpen}>{children}</Collapsible>
    </div>
  )
}
