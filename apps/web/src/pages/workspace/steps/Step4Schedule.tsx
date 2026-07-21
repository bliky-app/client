import type { CreateWorkspaceFormData } from "../CreateWorkspacePage"
import type { WorkspaceSchedule } from "@/types/models"
import Toggle from "@/components/ui/Toggle"

interface Step4ScheduleProps {
  data: CreateWorkspaceFormData
  onChange: (patch: Partial<CreateWorkspaceFormData>) => void
}

const DAYS: { key: number; label: string; short: string }[] = [
  { key: 1, label: "Понедельник", short: "Пн" },
  { key: 2, label: "Вторник",     short: "Вт" },
  { key: 3, label: "Среда",       short: "Ср" },
  { key: 4, label: "Четверг",     short: "Чт" },
  { key: 5, label: "Пятница",     short: "Пт" },
  { key: 6, label: "Суббота",     short: "Сб" },
  { key: 0, label: "Воскресенье", short: "Вс" },
]

export default function Step4Schedule({ data, onChange }: Step4ScheduleProps) {
  const schedule = data.schedule

  const isEnabled = (day: number) => !!schedule[day]?.length

  const toggleDay = (day: number) => {
    const updated: WorkspaceSchedule = { ...schedule }
    if (isEnabled(day)) {
      delete updated[day]
    } else {
      updated[day] = [{ start: "09:00", end: "19:00" }]
    }
    onChange({ schedule: updated })
  }

  const updateTime = (day: number, field: "start" | "end", value: string) => {
    const updated: WorkspaceSchedule = { ...schedule }
    const currentSlot = updated[day][0]
    
    let newStart = field === "start" ? value : currentSlot.start
    let newEnd = field === "end" ? value : currentSlot.end

    const addHour = (t: string) => {
      const [h, m] = t.split(':').map(Number)
      return `${Math.min(23, h + 1).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
    }
    const subHour = (t: string) => {
      const [h, m] = t.split(':').map(Number)
      return `${Math.max(0, h - 1).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
    }

    // Validation: start cannot be >= end
    if (newStart >= newEnd) {
      if (field === "start") {
        newEnd = addHour(newStart)
        if (newStart >= newEnd) newStart = subHour(newEnd) // clamp if 23:xx
      } else {
        newStart = subHour(newEnd)
        if (newStart >= newEnd) newEnd = addHour(newStart) // clamp if 00:xx
      }
    }

    updated[day] = [{ start: newStart, end: newEnd }]
    onChange({ schedule: updated })
  }

  const enabledCount = DAYS.filter(d => isEnabled(d.key)).length

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">
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
