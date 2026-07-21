import { useState, type InputHTMLAttributes, type ReactNode } from "react"
import { Eye, EyeOff } from "lucide-react"

export type InputTheme = "hub" | "panel"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  rightElement?: ReactNode
  theme?: InputTheme
  inputClassName?: string
  containerClassName?: string
}

const THEME_CLASSES: Record<InputTheme, { wrapper: string; input: string; label: string; hint: string; icon: string }> = {
  hub: {
    wrapper: "",
    input: "bg-hub-surface border border-hub-border text-hub-text placeholder:text-hub-text-subtle focus:border-hub-border-light focus:ring-2 focus:ring-hub-border-light/30",
    label: "text-hub-text-muted",
    hint: "text-hub-text-subtle",
    icon: "text-hub-text-subtle hover:text-hub-text",
  },
  panel: {
    wrapper: "",
    input: "bg-panel-surface border border-panel-border text-panel-text placeholder:text-panel-text-subtle focus:border-panel-text-muted focus:ring-2 focus:ring-panel-text/20",
    label: "text-panel-text-muted",
    hint: "text-panel-text-subtle",
    icon: "text-panel-text-subtle hover:text-panel-text",
  },
}

export default function Input({
  label,
  error,
  hint,
  icon,
  rightElement,
  theme = "panel",
  type = "text",
  className = "",
  containerClassName = "",
  inputClassName = "",
  ...rest
}: InputProps) {
  const t = THEME_CLASSES[theme]
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === "password"
  const computedType = isPassword ? (showPassword ? "text" : "password") : type

  return (
    <div className={`flex flex-col gap-2 ${t.wrapper} ${className} ${containerClassName}`}>
      {label && (
        <label className={`text-sm font-medium ${t.label}`}>{label}</label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <div className={`absolute left-4 pointer-events-none ${t.icon}`}>
            {icon}
          </div>
        )}
        <input
          type={computedType}
          className={[
            "w-full rounded-2xl px-4 py-3.5 text-sm outline-none transition-all",
            icon ? "pl-11" : "",
            isPassword || rightElement ? "pr-11" : "",
            error ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : t.input,
            inputClassName,
          ].join(" ")}
          {...rest}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-4 p-1 rounded-lg transition-colors ${t.icon}`}
            tabIndex={-1}
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        ) : (
          rightElement && (
            <div className="absolute right-4">
              {rightElement}
            </div>
          )
        )}
      </div>
      {error && <p className="text-red-400 text-xs font-medium pl-1">{error}</p>}
      {hint && !error && <p className={`text-xs pl-1 ${t.hint}`}>{hint}</p>}
    </div>
  )
}
