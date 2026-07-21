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
    updated[day] = [{ ...updated[day][0], [field]: value }]
    onChange({ schedule: updated })
  }

  const enabledCount = DAYS.filter(d => isEnabled(d.key)).length

  return (
    <div className="flex flex-col gap-5 py-2">
      <p className="text-sm text-panel-text-subtle">
        Выбрано <span className="font-semibold text-panel-text-muted-dark">{enabledCount}</span> рабочих {enabledCount === 1 ? "день" : enabledCount < 5 ? "дня" : "дней"}
      </p>

      <div className="flex flex-col gap-2">
        {DAYS.map(({ key, label, short }) => {
          const enabled = isEnabled(key)
          const slot = schedule[key]?.[0]
          const isWeekend = key === 0 || key === 6

          return (
            <div
              key={key}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 ${
                enabled
                  ? "bg-panel-surface border-panel-border shadow-sm"
                  : "bg-panel-base border-panel-border-subtle opacity-60"
              }`}
            >
              {/* Toggle */}
              <button
                type="button"
                onClick={() => toggleDay(key)}
                className={`relative w-10 h-6 rounded-full shrink-0 transition-colors duration-200 ${
                  enabled ? "bg-panel-text" : "bg-panel-border"
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-panel-base shadow-sm transition-all duration-200 ${
                  enabled ? "left-4.5 translate-x-0" : "left-0.5"
                }`} />
              </button>

              {/* Day label */}
              <div className="w-24 shrink-0">
                <span className={`text-sm font-semibold ${
                  enabled
                    ? (isWeekend ? "text-red-500" : "text-panel-text")
                    : "text-panel-text-subtle"
                }`}>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{short}</span>
                </span>
              </div>

              {/* Time inputs */}
              {enabled && slot ? (
                <div className="flex items-center gap-2 ml-auto">
                  <input
                    type="time"
                    value={slot.start}
                    onChange={e => updateTime(key, "start", e.target.value)}
                    className="bg-panel-base border border-panel-border-subtle rounded-xl px-3 py-1.5 text-sm text-panel-text outline-none focus:border-panel-text-muted transition-colors"
                  />
                  <span className="text-panel-text-subtle text-sm">—</span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={e => updateTime(key, "end", e.target.value)}
                    className="bg-panel-base border border-panel-border-subtle rounded-xl px-3 py-1.5 text-sm text-panel-text outline-none focus:border-panel-text-muted transition-colors"
                  />
                </div>
              ) : (
                <span className="ml-auto text-sm text-panel-text-subtle">Выходной</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
