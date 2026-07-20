import { MOCK_HUB_OVERVIEW, MOCK_WORKSPACES, MOCK_APPOINTMENTS, MOCK_USER } from "./mockData"
import type { HubOverviewData, Workspace, TimetableColumn, Appointment } from "@/types/models"
import { getTzDateString } from "../formatters"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

import { STAFF_SCHEDULE_HOURS } from "./mockData"

function mergeIntervals(intervals: { start: string, end: string }[]): { start: string, end: string }[] {
  if (intervals.length === 0) return []
  const parse = (t: string) => { const [h, m] = t.split(':').map(Number); return (h || 0) * 60 + (m || 0) }
  const format = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
  
  const parsed = intervals.map(i => ({ s: parse(i.start), e: parse(i.end) })).sort((a, b) => a.s - b.s)
  const merged = [parsed[0]]
  
  for (let i = 1; i < parsed.length; i++) {
    const last = merged[merged.length - 1]
    const curr = parsed[i]
    if (curr.s <= last.e) {
      last.e = Math.max(last.e, curr.e)
    } else {
      merged.push(curr)
    }
  }
  
  return merged.map(i => ({ start: format(i.s), end: format(i.e) }))
}

export const hubApi = {
  getOverview: async (): Promise<HubOverviewData> => {
    await delay(500)
    return MOCK_HUB_OVERVIEW
  },

  getWorkspaces: async (): Promise<Workspace[]> => {
    await delay(300)
    return MOCK_WORKSPACES
  },

  getTimetableColumns: async (startDate: Date, days = 3): Promise<TimetableColumn[]> => {
    await delay(400)

    const cols: TimetableColumn[] = []
    const defaultTz = "+03:00"

    for (let i = 0; i < days; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const userTz = MOCK_USER.timezone || "Europe/Moscow"
      const dateString = getTzDateString(d, userTz)
      const dayOfWeek = d.getDay()
      const todayString = getTzDateString(new Date(), userTz)
      const isToday = dateString === todayString
      
      const allUserShifts = MOCK_WORKSPACES.flatMap(ws => {
        const staff = ws.staff?.find(s => s.user?.id === MOCK_USER.id)
        if (!staff) return []
        return STAFF_SCHEDULE_HOURS[staff.id]?.[dayOfWeek] ?? []
      })
      
      const daySchedule = mergeIntervals(allUserShifts)
      const slots = daySchedule.map(s => ({
        startDateTime: `${dateString}T${s.start}:00${defaultTz}`,
        endDateTime: `${dateString}T${s.end}:00${defaultTz}`,
      }))

      cols.push({
        id: `hub-day-${dateString}`,
        label: new Intl.DateTimeFormat("ru-RU", { weekday: "long", timeZone: userTz }).format(d),
        subLabel: new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", timeZone: userTz }).format(d),
        dateString: dateString,
        isToday,
        schedule: slots,
      })
    }

    return cols
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTimetableEvents: async (_startDate?: Date): Promise<Appointment[]> => {
    await delay(600)
    return MOCK_APPOINTMENTS.filter(e => e.staff.user?.id === MOCK_USER.id)
  }
}
