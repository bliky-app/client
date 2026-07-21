import { MOCK_WORKSPACES, MOCK_APPOINTMENTS, MOCK_USER, STAFF_SCHEDULE_HOURS, syncMockUserWithSession } from "./mockData"
import type { Workspace, TimetableColumn, Appointment, TimetableViewType } from "@/types/models"
import { getTzDateString } from "../formatters"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const workspaceApi = {
  getWorkspace: async (id: string): Promise<Workspace | null> => {
    await delay(300)
    syncMockUserWithSession()
    return MOCK_WORKSPACES.find(w => w.id === id) ?? null
  },

  getTimetableColumns: async (workspaceId: string, startDate: Date): Promise<TimetableColumn[]> => {
    await delay(300)
    syncMockUserWithSession()
    const cols: TimetableColumn[] = []
    const tz = "+03:00" // Use valid ISO 8601 offset

    const ws = MOCK_WORKSPACES.find(w => w.id === workspaceId)
    const staff = ws?.staff?.find(s => s.user?.id === MOCK_USER.id)

    for (let i = 0; i < 3; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const wsTz = ws?.timezone || "Europe/Moscow"
      const dateString = getTzDateString(d, wsTz)
      const dayOfWeek = d.getDay()
      const todayString = getTzDateString(new Date(), wsTz)
      const isToday = dateString === todayString
      
      const workspaceSchedule = ws?.schedule[dayOfWeek] ?? []
      const daySchedule = (staff ? STAFF_SCHEDULE_HOURS[staff.id]?.[dayOfWeek] : workspaceSchedule) ?? []

      const slots = daySchedule.map(s => ({
        startDateTime: `${dateString}T${s.start}:00${tz}`,
        endDateTime: `${dateString}T${s.end}:00${tz}`
      }))

      cols.push({
        id: `ws-${workspaceId}-day-${dateString}`,
        label: new Intl.DateTimeFormat("ru-RU", { weekday: "long", timeZone: wsTz }).format(d),
        subLabel: new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", timeZone: wsTz }).format(d),
        dateString: dateString,
        isToday,
        schedule: slots,
      })
    }
    return cols
  },

  getTeamDayColumns: async (workspaceId: string, date: Date): Promise<TimetableColumn[]> => {
    await delay(300)
    syncMockUserWithSession()
    const ws = MOCK_WORKSPACES.find(w => w.id === workspaceId)
    if (!ws || !ws.staff) return []

    const dayOfWeek = date.getDay()
    const wsTz = ws.timezone || "Europe/Moscow"
    const dateString = getTzDateString(date, wsTz)
    const todayString = getTzDateString(new Date(), wsTz)
    const isToday = dateString === todayString
    const tz = "+03:00" // Use valid ISO 8601 offset

    return ws.staff.map(member => {
      const schedule = STAFF_SCHEDULE_HOURS[member.id] ?? {}
      const daySchedule = schedule[dayOfWeek] ?? []
      
      const slots = daySchedule.map(s => ({
        startDateTime: `${dateString}T${s.start}:00${tz}`,
        endDateTime: `${dateString}T${s.end}:00${tz}`
      }))

      return {
        id: member.id,
        label: member.shortName || member.user?.shortName || "?",
        subLabel: member.mainCategory.name,
        dateString: dateString,
        isToday,
        schedule: slots,
        staff: member,
      }
    })
  },

  getTimetableEvents: async (workspaceId: string, viewType: TimetableViewType): Promise<Appointment[]> => {
    await delay(400)
    let events = MOCK_APPOINTMENTS.filter(e => e.workspace.id === workspaceId)

    if (viewType === "personal") {
      events = events.filter(e => e.staff.user?.id === MOCK_USER.id)
    }
    
    return events
  },
}
