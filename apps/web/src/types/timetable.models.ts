import type { Member } from "./workspace.models"

export interface TimetableSlot {
  startDateTime: string
  endDateTime: string
}

export type TimetableViewType = "personal" | "team"

export interface TimetableColumn {
  id: string
  label: string
  subLabel?: string
  /** YYYY-MM-DD — идентификатор дня для personal view */
  dateString?: string
  staff?: Member
  isToday?: boolean
  /** Открытые рабочие часы в формате ISO */
  schedule: TimetableSlot[]
}
