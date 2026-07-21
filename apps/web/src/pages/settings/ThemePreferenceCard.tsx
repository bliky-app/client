import { Sun, Moon, Monitor } from "lucide-react"

interface ThemePreferenceCardProps {
  theme: "light" | "dark" | "system"
  onThemeChange: (theme: "light" | "dark" | "system") => void
}

export default function ThemePreferenceCard({ theme, onThemeChange }: ThemePreferenceCardProps) {
  return (
    <div className="mb-6 bg-panel-surface border border-panel-border rounded-[32px] p-6 shadow-sm flex flex-col">
      <div className="flex bg-panel-base p-1 rounded-2xl border border-panel-border-subtle">
        <button
          type="button"
          onClick={() => onThemeChange("light")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
            theme === "light"
              ? "bg-panel-surface text-panel-text shadow-xs border border-panel-border-subtle font-semibold"
              : "text-panel-text-muted hover:text-panel-text"
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>Светлая</span>
        </button>

        <button
          type="button"
          onClick={() => onThemeChange("dark")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
            theme === "dark"
              ? "bg-panel-surface text-panel-text shadow-xs border border-panel-border-subtle font-semibold"
              : "text-panel-text-muted hover:text-panel-text"
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>Тёмная</span>
        </button>

        <button
          type="button"
          onClick={() => onThemeChange("system")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
            theme === "system"
              ? "bg-panel-surface text-panel-text shadow-xs border border-panel-border-subtle font-semibold"
              : "text-panel-text-muted hover:text-panel-text"
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>Авто</span>
        </button>
      </div>
    </div>
  )
}
