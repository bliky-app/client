import { Sun, Moon, Monitor, ExternalLink } from "lucide-react"
import { createPortal } from "react-dom"
import { useTheme } from "@/lib/ThemeProvider"
import UserProfileCard from "@/components/UserProfileCard"
import { TelegramIcon } from "@/components/icons/BrandIcons"

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
      <div
        className="fixed inset-0 z-50 pointer-events-auto bg-transparent"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      />

      {/* Popover Card */}
      <div
        className="fixed z-50 w-72 bg-hub-surface border border-hub-border rounded-2xl shadow-xl p-3 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-200"
        style={
          triggerRect
            ? {
                top: triggerRect.bottom + 8,
                left: Math.max(16, Math.min(triggerRect.right - 288, window.innerWidth - 304)),
              }
            : undefined
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Profile Block */}
        <UserProfileCard onClose={onClose} />

        {/* Real Telegram Channel Link */}
        <div className="flex flex-col py-0.5">
          <a
            href="https://t.me/bliky_app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 hover:bg-hub-surface-hover transition-colors text-left gap-3 w-full rounded-xl group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-hub-surface-hover flex items-center justify-center shrink-0 border border-hub-border-light/50">
                <TelegramIcon className="w-5 h-5 text-hub-text-muted group-hover:text-hub-text transition-colors" />
              </div>
              <span className="text-sm font-medium text-hub-text truncate">Telegram-канал</span>
            </div>
            <ExternalLink className="w-4 h-4 text-hub-text-subtle group-hover:text-hub-text-muted transition-colors shrink-0" />
          </a>
        </div>

        <div className="h-px bg-hub-border mx-3 my-0.5" />

        {/* Theme Selector */}
        <div className="flex bg-hub-base p-1 rounded-xl border border-hub-border">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-medium transition-all ${
              theme === "light"
                ? "bg-hub-surface text-hub-text shadow-sm border border-hub-border font-semibold"
                : "text-hub-text-muted hover:text-hub-text"
            }`}
            title="Светлая тема"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Светлая</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-medium transition-all ${
              theme === "dark"
                ? "bg-hub-surface text-hub-text shadow-sm border border-hub-border font-semibold"
                : "text-hub-text-muted hover:text-hub-text"
            }`}
            title="Тёмная тема"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Тёмная</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-medium transition-all ${
              theme === "system"
                ? "bg-hub-surface text-hub-text shadow-sm border border-hub-border font-semibold"
                : "text-hub-text-muted hover:text-hub-text"
            }`}
            title="Системная тема"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Авто</span>
          </button>
        </div>

        {/* Subtle Footer */}
        <div className="text-center pt-0.5 pb-0.5">
          <span className="text-[10px] font-medium text-hub-text-muted/50 tracking-wider">
            bliky v1.0
          </span>
        </div>
      </div>
    </>
  )

  return triggerRect ? createPortal(content, document.body) : content
}
