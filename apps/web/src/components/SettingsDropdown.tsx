import { User, LogOut, Sun, Moon, Monitor } from "lucide-react"
import { createPortal } from "react-dom"
import { useTheme } from "@/lib/ThemeProvider"

interface SettingsDropdownProps {
  isOpen: boolean
  onClose: () => void
  triggerRect?: DOMRect
}

export default function SettingsDropdown({
  isOpen,
  onClose,
  triggerRect,
}: SettingsDropdownProps) {
  const { theme, setTheme } = useTheme()

  if (!isOpen) return null

  const content = (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[200]" onClick={onClose} />

      {/* Dropdown */}
      <div
        className="fixed z-[201] w-64 bg-hub-surface border border-hub-border rounded-2xl shadow-xl py-2 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        style={triggerRect ? {
          top: triggerRect.bottom + 8,
          // Try to align right edge with the button, or fallback to window bounds
          left: Math.min(triggerRect.right - 256, window.innerWidth - 272),
        } : undefined}
      >
        <button
          onClick={() => {
            onClose()
            // Future: Navigate to account
          }}
          className="flex items-center px-4 py-3 hover:bg-hub-surface-hover transition-colors text-left gap-3 w-full"
        >
          <User className="w-4 h-4 text-hub-text-muted" />
          <span className="text-sm font-medium text-hub-text-subtle group-hover:text-hub-text transition-colors">
            Аккаунт
          </span>
        </button>

        <button
          onClick={() => {
            onClose()
            // Future: Logout logic
          }}
          className="flex items-center px-4 py-3 hover:bg-hub-surface-hover transition-colors text-left gap-3 w-full"
        >
          <LogOut className="w-4 h-4 text-red-500/80" />
          <span className="text-sm font-medium text-red-500/90">
            Выйти
          </span>
        </button>

        <div className="h-px bg-hub-border mx-4 my-1" />

        <div className="px-4 py-3 flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-hub-text-muted uppercase tracking-wider">
            Оформление
          </span>
          <div className="grid grid-cols-3 gap-1 p-1 bg-hub-base rounded-xl border border-hub-border">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center justify-center py-2 rounded-lg transition-all ${
                theme === "light"
                  ? "bg-hub-surface text-hub-text shadow-sm border border-hub-border-light"
                  : "text-hub-text-subtle hover:text-hub-text hover:bg-hub-surface-hover"
              }`}
              title="Светлая"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-center py-2 rounded-lg transition-all ${
                theme === "dark"
                  ? "bg-hub-surface text-hub-text shadow-sm border border-hub-border-light"
                  : "text-hub-text-subtle hover:text-hub-text hover:bg-hub-surface-hover"
              }`}
              title="Тёмная"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex items-center justify-center py-2 rounded-lg transition-all ${
                theme === "system"
                  ? "bg-hub-surface text-hub-text shadow-sm border border-hub-border-light"
                  : "text-hub-text-subtle hover:text-hub-text hover:bg-hub-surface-hover"
              }`}
              title="Системная"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )

  return triggerRect ? createPortal(content, document.body) : content
}
