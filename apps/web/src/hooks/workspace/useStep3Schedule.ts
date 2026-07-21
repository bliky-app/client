import type { CreateWorkspaceFormData } from "@/hooks/workspace/useCreateWorkspace"
import type { WorkspaceSchedule } from "@/types/models"

export const DAYS: { key: number; label: string; short: string }[] = [
  { key: 1, label: "Понедельник", short: "Пн" },
  { key: 2, label: "Вторник",     short: "Вт" },
  { key: 3, label: "Среда",       short: "Ср" },
  { key: 4, label: "Четверг",     short: "Чт" },
  { key: 5, label: "Пятница",     short: "Пт" },
  { key: 6, label: "Суббота",     short: "Сб" },
  { key: 0, label: "Воскресенье", short: "Вс" },
]

export function useStep3Schedule(
  data: CreateWorkspaceFormData,
  onChange: (patch: Partial<CreateWorkspaceFormData>) => void
) {
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

    if (newStart >= newEnd) {
      if (field === "start") {
        newEnd = addHour(newStart)
        if (newStart >= newEnd) newStart = subHour(newEnd)
      } else {
        newStart = subHour(newEnd)
        if (newStart >= newEnd) newEnd = addHour(newStart)
      }
    }

    updated[day] = [{ start: newStart, end: newEnd }]
    onChange({ schedule: updated })
  }

  const enabledCount = DAYS.filter(d => isEnabled(d.key)).length

  return {
    schedule,
    isEnabled,
    toggleDay,
    updateTime,
    enabledCount,
  }
}
