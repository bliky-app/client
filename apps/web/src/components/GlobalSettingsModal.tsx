import { X, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/lib/ThemeProvider"

interface GlobalSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GlobalSettingsModal({ isOpen, onClose }: GlobalSettingsModalProps) {
  const { theme, setTheme } = useTheme()

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-panel-surface rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-panel-text">Настройки</h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-panel-text-subtle hover:text-panel-text-muted hover:bg-panel-surface-hover rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-panel-text-muted mb-3 uppercase tracking-wider">
                Внешний вид
              </h3>
              <div className="grid grid-cols-3 gap-2 p-1 bg-panel-base rounded-2xl border border-panel-border-subtle">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all ${
                    theme === "light"
                      ? "bg-panel-surface text-panel-text shadow-sm border border-panel-border"
                      : "text-panel-text-subtle hover:text-panel-text hover:bg-panel-surface-hover"
                  }`}
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-xs font-medium">Светлая</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all ${
                    theme === "dark"
                      ? "bg-panel-surface text-panel-text shadow-sm border border-panel-border"
                      : "text-panel-text-subtle hover:text-panel-text hover:bg-panel-surface-hover"
                  }`}
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-xs font-medium">Тёмная</span>
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all ${
                    theme === "system"
                      ? "bg-panel-surface text-panel-text shadow-sm border border-panel-border"
                      : "text-panel-text-subtle hover:text-panel-text hover:bg-panel-surface-hover"
                  }`}
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-xs font-medium">Системная</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
