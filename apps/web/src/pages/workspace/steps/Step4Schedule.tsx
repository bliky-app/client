import type { CreateWorkspaceFormData } from "../CreateWorkspacePage"
import type { WorkspaceSchedule } from "@/types/models"

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
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">
          Рабочие дни
        </p>
        <p className="text-sm text-panel-text-subtle font-medium">
          Выбрано: {enabledCount}
        </p>
      </div>

      <div className="flex flex-col bg-panel-surface border border-panel-border rounded-3xl overflow-hidden shadow-sm">
        {DAYS.map(({ key, label, short }, idx) => {
          const enabled = isEnabled(key)
          const slot = schedule[key]?.[0]
          const isWeekend = key === 0 || key === 6
          const isLast = idx === DAYS.length - 1

          return (
            <div
              key={key}
              className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                !isLast ? "border-b border-panel-border-subtle" : ""
              } ${!enabled ? "bg-panel-base/30" : ""}`}
            >
              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => toggleDay(key)}
                className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-panel-text-muted ${
                  enabled ? "bg-panel-text" : "bg-panel-border"
                }`}
              >
                <div className={`absolute top-[2px] w-5 h-5 rounded-full bg-panel-base shadow-sm transition-transform duration-200 ${
                  enabled ? "translate-x-5" : "translate-x-[2px]"
                }`} />
              </button>

              {/* Day label */}
              <div className="w-28 shrink-0">
                <span className={`text-base font-medium ${
                  enabled
                    ? (isWeekend ? "text-red-500" : "text-panel-text")
                    : "text-panel-text-muted"
                }`}>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{short}</span>
                </span>
              </div>

              {/* Time inputs or Off label */}
              <div className="flex items-center gap-2 ml-auto">
                {enabled && slot ? (
                  <>
                    <div className="relative group">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={e => updateTime(key, "start", e.target.value)}
                        className="bg-panel-base hover:bg-panel-surface-hover border border-panel-border-subtle hover:border-panel-text-muted rounded-lg px-2 py-1.5 text-sm font-medium text-panel-text outline-none focus:border-panel-text focus:ring-1 focus:ring-panel-text transition-all cursor-pointer w-[115px]"
                      />
                    </div>
                    <span className="text-panel-text-subtle text-sm font-medium">—</span>
                    <div className="relative group">
                      <input
                        type="time"
                        value={slot.end}
                        onChange={e => updateTime(key, "end", e.target.value)}
                        className="bg-panel-base hover:bg-panel-surface-hover border border-panel-border-subtle hover:border-panel-text-muted rounded-lg px-2 py-1.5 text-sm font-medium text-panel-text outline-none focus:border-panel-text focus:ring-1 focus:ring-panel-text transition-all cursor-pointer w-[115px]"
                      />
                    </div>
                  </>
                ) : (
                  <span className="text-sm font-medium text-panel-text-subtle pr-4">Выходной</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
