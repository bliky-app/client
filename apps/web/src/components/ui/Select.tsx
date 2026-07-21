import { useState, useRef } from "react"
import { createPortal } from "react-dom"
import { ChevronDown } from "lucide-react"

export interface SelectOption {
  value: string
  label: string
  subtitle?: string
  color?: string
  avatarUrl?: string
}

export type SelectTheme = "hub" | "panel"

interface SelectProps {
  options: SelectOption[]
  value?: string
  placeholder?: string
  onChange: (value: string) => void
  hideIcon?: boolean
  theme?: SelectTheme
  /** If true, renders as a small inline trigger (used in QuickActionsRow cards) */
  compact?: boolean
  className?: string
}

const THEME = {
  hub: {
    trigger: "bg-hub-surface border-hub-border text-hub-text-muted hover:border-hub-border-light hover:text-hub-text",
    dropdown: "bg-hub-surface border-hub-border",
    item: "hover:bg-hub-surface-hover",
    itemText: "text-hub-text",
    itemSub: "text-hub-text-muted",
    empty: "text-hub-text-muted",
  },
  panel: {
    trigger: "bg-panel-base border-panel-border-subtle text-panel-text-muted hover:border-panel-text-muted hover:text-panel-text",
    dropdown: "bg-panel-surface border-panel-border",
    item: "hover:bg-panel-surface-hover",
    itemText: "text-panel-text",
    itemSub: "text-panel-text-muted",
    empty: "text-panel-text-muted",
  },
}

export default function Select({
  options,
  value,
  placeholder = "Выбрать",
  onChange,
  hideIcon = false,
  theme = "panel",
  compact = false,
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const t = THEME[theme]
  const selected = options.find(o => o.value === value)

  const open = () => {
    if (ref.current) setRect(ref.current.getBoundingClientRect())
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  const triggerLabel = selected?.label ?? placeholder

  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={open}
        className={[
          "w-full text-left border rounded-xl transition-colors flex items-center justify-between gap-2",
          compact ? "px-3 py-2 text-xs font-medium" : "px-4 py-3 text-sm font-medium",
          t.trigger,
          className,
        ].join(" ")}
      >
        <span className="truncate">{triggerLabel}</span>
        <ChevronDown className="w-4 h-4 shrink-0 opacity-60" />
      </button>

      {isOpen && rect && createPortal(
        <>
          <div
            className="fixed inset-0 z-50 pointer-events-auto"
            onClick={(e) => { e.stopPropagation(); close() }}
          />
          <div
            style={{
              top: rect.bottom + 8,
              left: rect.left,
              width: Math.max(180, rect.width),
            }}
            className={[
              "fixed z-50 border rounded-2xl shadow-xl overflow-hidden",
              "animate-in fade-in zoom-in-95 duration-100",
              t.dropdown,
            ].join(" ")}
            onClick={e => e.stopPropagation()}
          >
            <div className="max-h-72 overflow-y-auto py-1">
              {options.length === 0 ? (
                <div className={`px-4 py-3 text-xs ${t.empty}`}>Нет вариантов</div>
              ) : options.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`w-full text-left px-4 py-2.5 transition-colors flex items-center gap-3 ${t.item}`}
                  onClick={() => { close(); onChange(opt.value) }}
                >
                  {!hideIcon && (
                    opt.avatarUrl ? (
                      <img
                        src={opt.avatarUrl}
                        alt={opt.label}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-panel-border-subtle"
                      />
                    ) : opt.color ? (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 text-white"
                        style={{ backgroundColor: opt.color }}
                      >
                        {opt.label?.[0]?.toUpperCase()}
                      </div>
                    ) : null
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-medium truncate ${t.itemText}`}>{opt.label}</span>
                    {opt.subtitle && (
                      <span className={`text-xs truncate ${t.itemSub}`}>{opt.subtitle}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}
