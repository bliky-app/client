import type { WorkspaceType } from "@/types/models"
import { useStep1Type } from "@/hooks/workspace/useStep1Type"

interface Step1TypeProps {
  value: WorkspaceType | null
  onChange: (type: WorkspaceType) => void
}

export default function Step1Type({ value, onChange }: Step1TypeProps) {
  const { TYPE_OPTIONS } = useStep1Type()

  return (
    <div className="flex flex-col gap-4 py-2">
      {TYPE_OPTIONS.map(option => {
        const Icon = option.icon
        const isSelected = value === option.type

        return (
          <button
            key={option.type}
            onClick={() => onChange(option.type)}
            className={`w-full text-left rounded-3xl p-6 border-2 transition-all duration-200 active:scale-[0.99] ${
              isSelected
                ? "border-panel-text bg-panel-surface shadow-md"
                : "border-panel-border bg-panel-surface hover:border-panel-border hover:bg-panel-surface-hover"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl shrink-0 transition-colors ${
                isSelected ? "bg-panel-text" : "bg-panel-border-subtle"
              }`}>
                <Icon className={`w-6 h-6 ${isSelected ? "text-panel-base" : "text-panel-text-muted"}`} />
              </div>

              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-bold text-panel-text">{option.label}</span>
                  <span className="text-xs font-semibold text-panel-text-subtle bg-panel-border-subtle px-2 py-0.5 rounded-full">
                    {option.tagline}
                  </span>
                </div>
                <p className="text-sm text-panel-text-muted leading-relaxed">{option.description}</p>

                <ul className="mt-3 flex flex-col gap-1.5">
                  {option.bullets.map(bullet => (
                    <li key={bullet} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? "bg-panel-text" : "bg-panel-border"}`} />
                      <span className={isSelected ? "text-panel-text-muted-dark" : "text-panel-text-subtle"}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
