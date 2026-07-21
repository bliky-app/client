interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  /** Цветовая тема активного состояния */
  theme?: "hub" | "panel"
}

/**
 * Простой boolean переключатель.
 * Активен: bg-*-text с белой точкой справа.
 * Неактивен: bg-*-border с точкой слева.
 */
export default function Toggle({ checked, onChange, disabled = false, theme = "panel" }: ToggleProps) {
  const activeTrack = theme === "hub" ? "bg-hub-text" : "bg-panel-text"
  const inactiveTrack = theme === "hub" ? "bg-hub-border" : "bg-panel-border"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        "relative w-11 h-7 rounded-full shrink-0 transition-all duration-200",
        checked ? activeTrack : inactiveTrack,
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <div
        className={[
          "absolute top-0.5 bottom-0.5 aspect-square rounded-full transition-all duration-200",
          checked
            ? (theme === "hub" ? "right-0.5 left-auto bg-hub-base" : "right-0.5 left-auto bg-panel-base")
            : (theme === "hub" ? "left-0.5 right-auto bg-hub-base" : "left-0.5 right-auto bg-panel-base"),
        ].join(" ")}
      />
    </button>
  )
}
