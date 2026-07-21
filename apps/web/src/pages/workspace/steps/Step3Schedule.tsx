import type { CreateWorkspaceFormData } from "@/hooks/workspace/useCreateWorkspace"
import Toggle from "@workspace/ui/components/Toggle"
import { useStep3Schedule, DAYS } from "@/hooks/workspace/useStep3Schedule"

interface Step3ScheduleProps {
  data: CreateWorkspaceFormData
  onChange: (patch: Partial<CreateWorkspaceFormData>) => void
}

export default function Step3Schedule({ data, onChange }: Step3ScheduleProps) {
  const {
    schedule,
    isEnabled,
    toggleDay,
    updateTime,
    enabledCount,
  } = useStep3Schedule(data, onChange)

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-panel-text-muted-dark">
          Рабочие дни
        </p>
        <p className="text-sm text-panel-text-subtle font-medium">
          Выбрано: {enabledCount}
        </p>
      </div>

      <div className="flex flex-col bg-panel-surface border border-panel-border rounded-3xl overflow-hidden shadow-sm">
        {DAYS.map(({ key, short }, idx) => {
          const enabled = isEnabled(key)
          const slot = schedule[key]?.[0]
          const isWeekend = key === 0 || key === 6
          const isLast = idx === DAYS.length - 1

          return (
            <div
              key={key}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                !isLast ? "border-b border-panel-border-subtle" : ""
              } ${!enabled ? "opacity-50" : ""}`}
            >
              {/* Toggle */}
              <Toggle
                checked={enabled}
                onChange={() => toggleDay(key)}
                theme="panel"
              />

              {/* Day — short name */}
              <span className={`text-base flex-1 min-w-0 font-semibold ${
                enabled ? (isWeekend ? "text-red-500" : "text-panel-text") : "text-panel-text-muted"
              }`}>
                {short}
              </span>

              {/* Time inputs or "Выходной" */}
              {enabled && slot ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="time"
                    value={slot.start}
                    onChange={e => updateTime(key, "start", e.target.value)}
                    className="bg-panel-base border border-panel-border-subtle rounded-xl px-2 py-1 text-sm font-medium text-panel-text outline-none focus:border-panel-text transition-all w-22"
                  />
                  <span className="text-panel-text-subtle text-sm">—</span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={e => updateTime(key, "end", e.target.value)}
                    className="bg-panel-base border border-panel-border-subtle rounded-xl px-2 py-1 text-sm font-medium text-panel-text outline-none focus:border-panel-text transition-all w-22"
                  />
                </div>
              ) : (
                <span className="text-sm text-panel-text-subtle shrink-0">Выходной</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
