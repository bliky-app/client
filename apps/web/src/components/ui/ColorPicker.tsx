import { Plus } from "lucide-react"

const DEFAULT_PRESET_COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#a855f7", // Violet
  "#ec4899", // Pink
  "#f43f5e", // Rose Red
  "#ef4444", // Crimson
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#10b981", // Emerald Green
  "#06b6d4", // Cyan
  "#3b82f6", // Royal Blue
  "#64748b", // Slate
  "#a1a1aa", // Silver
]

interface ColorPickerProps {
  value?: string
  onChange: (color: string) => void
  label?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function ColorPicker({
  value = DEFAULT_PRESET_COLORS[0],
  onChange,
  label,
  className = "",
  size = "md",
}: ColorPickerProps) {
  // Normalize color format to lowercase for comparison
  const normalizedValue = (value || "").toLowerCase()
  const isCustomColor =
    normalizedValue &&
    !DEFAULT_PRESET_COLORS.some((c) => c.toLowerCase() === normalizedValue)

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const currentSize = sizeClasses[size]
  const currentIconSize = iconSizes[size]

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {label && (
        <span className="text-xs font-semibold text-panel-text-subtle uppercase tracking-wider pl-0.5">
          {label}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Preset colors */}
        {DEFAULT_PRESET_COLORS.map((color) => {
          const isSelected = normalizedValue === color.toLowerCase()
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`${currentSize} rounded-full flex items-center justify-center transition-all duration-150 active:scale-90 ${
                isSelected
                  ? "scale-110 shadow-md"
                  : "hover:scale-105 shadow-sm opacity-90 hover:opacity-100"
              }`}
              style={{
                backgroundColor: color,
                boxShadow: isSelected
                  ? `0 0 0 3px color-mix(in srgb, ${color} 55%, black 45%)`
                  : undefined,
              }}
              title={color}
            />
          )
        })}

        {/* Dynamic Custom Color (appears if current value is custom) */}
        {isCustomColor && (
          <button
            type="button"
            className={`${currentSize} rounded-full flex items-center justify-center transition-all scale-110 shadow-md animate-in zoom-in-50 duration-200`}
            style={{
              backgroundColor: value,
              boxShadow: `0 0 0 3px color-mix(in srgb, ${value} 55%, black 45%)`,
            }}
            title={`Свой цвет: ${value}`}
          />
        )}

        {/* Custom Color Picker Button */}
        <label
          className={`${currentSize} rounded-full border border-dashed border-panel-border cursor-pointer flex items-center justify-center hover:border-panel-text-muted transition-all active:scale-95 shadow-sm bg-panel-base relative overflow-hidden group`}
          title="Выбрать свой цвет"
        >
          <Plus className={`${currentIconSize} text-panel-text-subtle group-hover:text-panel-text transition-colors`} />
          <input
            type="color"
            value={value.startsWith("#") ? value : "#6366f1"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>
    </div>
  )
}
