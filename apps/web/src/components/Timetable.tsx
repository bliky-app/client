import { useState, useMemo, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { getTzDateString } from "@/lib/formatters"
import type { Appointment, TimetableColumn, TimetableViewType } from "@/types/models"
import Avatar from "@/components/Avatar"
import { formatTime } from "@/lib/formatters"

export type TimetableViewMode = "1day" | "week" | "month"

interface TimetableProps {
  viewType: TimetableViewType
  currentDate: Date
  events: Appointment[]
  columns: TimetableColumn[]
  onPrev?: () => void
  onNext?: () => void
  onEventClick?: (event: Appointment) => void
  onDateSelect?: (date: Date) => void
  onViewModeChange?: (mode: TimetableViewMode) => void
  timezone: string
  viewMode?: TimetableViewMode
  hideWorkspaceTags?: boolean
  workspaceTimezone?: string
  headerTitle?: string
  currentUserId?: string
}

const PPM = 1.5 // pixels per minute
const WEEKDAYS = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"]
const MONTHS_RU = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]

function t2m(t: string) {
  if (!t) return 0
  const [h, m] = t.split(":").map(Number)
  return (h || 0) * 60 + (m || 0)
}

function t2px(t: string, startHour: number) {
  return (t2m(t) - startHour * 60) * PPM
}

function heatBg(count: number) {
  if (count === 0) return ""
  if (count === 1) return "bg-panel-text/10"
  if (count <= 3) return "bg-panel-text/20"
  if (count <= 6) return "bg-panel-text/35"
  return "bg-panel-text/55"
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export default function Timetable({
  viewType, currentDate, events, columns,
  onPrev, onNext, onEventClick, onDateSelect, onViewModeChange,
  timezone,
  viewMode = "week", hideWorkspaceTags = false,
  workspaceTimezone = "Europe/Moscow", headerTitle: propHeaderTitle,
  currentUserId,
}: TimetableProps) {

  const [showCal, setShowCal] = useState(false)
  const [calMonth, setCalMonth] = useState(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    setCalMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  }, [currentDate.getFullYear(), currentDate.getMonth()])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const byDate = useMemo(() => {
    const m: Record<string, number> = {}
    events.forEach(e => { const d = e.startDateTime.split("T")[0]; m[d] = (m[d] || 0) + 1 })
    return m
  }, [events])

  const byDateStaff = useMemo(() => {
    const m: Record<string, number> = {}
    events.forEach(e => {
      const d = e.startDateTime.split("T")[0]
      const k = `${d}_${e.staff?.id || "me"}`
      m[k] = (m[k] || 0) + 1
    })
    return m
  }, [events])

  const allTimes = columns.flatMap(c => c.schedule.flatMap(s => [
    t2m(formatTime(s.startDateTime, workspaceTimezone)),
    t2m(formatTime(s.endDateTime, workspaceTimezone)),
  ]))
  const gStart = allTimes.length > 0 ? Math.floor(Math.min(...allTimes) / 60) : 8
  const gEnd   = allTimes.length > 0 ? Math.ceil(Math.max(...allTimes) / 60)  : 22
  const hours = Array.from({ length: gEnd - gStart }, (_, i) => gStart + i)
  const gH = (gEnd - gStart) * 60 * PPM
  const nowM = now.getHours() * 60 + now.getMinutes()
  const headerHeightClass = viewType === "team" ? "h-20" : "h-12"

  // Title logic: DD.MM or DD.MM — DD.MM
  const formatMD = (d: Date) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}`
  let startD = currentDate
  let endD = currentDate

  if (viewMode === "month") {
    if (viewType === "personal") {
      startD = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      endD = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    } else {
      endD = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 29)
    }
  } else if (viewMode === "week") {
    endD = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 6)
  }

  const defaultTitle = startD.getTime() === endD.getTime() 
    ? formatMD(startD) 
    : `${formatMD(startD)} — ${formatMD(endD)}`
  const headerTitle = propHeaderTitle || defaultTitle

  // Mini calendar days
  const calY = calMonth.getFullYear(), calM = calMonth.getMonth()
  const daysInM = new Date(calY, calM + 1, 0).getDate()
  const firstWd = (new Date(calY, calM, 1).getDay() + 6) % 7
  const calDays: (Date | null)[] = [
    ...Array(firstWd).fill(null),
    ...Array.from({ length: daysInM }, (_, i) => new Date(calY, calM, i + 1, 12, 0, 0)),
  ]
  while (calDays.length % 7 !== 0) calDays.push(null)

  const todayStr = getTzDateString(new Date(), timezone)
  const curStr = getTzDateString(currentDate, timezone)

  const uniqueStaff = useMemo(() => {
    if (viewType !== "team") return []
    const map = new Map<string, NonNullable<TimetableColumn["staff"]>>()
    columns.forEach(c => { if (c.staff) map.set(c.id, c.staff) })
    return [...map.values()]
  }, [columns, viewType])

  // Generate 30 days for team month view
  const teamMonthDates = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + i, 12, 0, 0)
      return {
        date: d,
        str: getTzDateString(d, timezone),
        label: new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", timeZone: timezone }).format(d),
      }
    })
  }, [currentDate, timezone])

  const VIEW_LABELS: Record<TimetableViewMode, string> = { "1day": "1 день", week: "Неделя", month: "Месяц" }
  const allowedModes = viewType === "personal" ? ["week", "month"] : ["1day", "month"]

  return (
    <div className="flex flex-col bg-panel-surface overflow-hidden flex-1 w-full shrink-0 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-panel-border-subtle bg-panel-surface z-20 flex-wrap">
        <h2 className="text-base font-semibold text-panel-text whitespace-nowrap pl-1">{headerTitle}</h2>

        <div className="flex items-center gap-2">
          {/* View mode */}
          <div className="flex items-center bg-panel-base rounded-xl border border-panel-border-subtle p-0.5 shrink-0">
            {(allowedModes as TimetableViewMode[]).map(m => (
              <button key={m} onClick={() => { onViewModeChange?.(m); setShowCal(false) }}
                className={`text-xs px-2.5 py-1.5 rounded-[10px] font-medium transition-colors ${viewMode === m ? "bg-panel-surface text-panel-text shadow-sm" : "text-panel-text-muted hover:text-panel-text"}`}>
                {VIEW_LABELS[m]}
              </button>
            ))}
          </div>

          {/* Calendar toggle + nav */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button onClick={() => setShowCal(v => !v)}
              className={`p-2 rounded-full transition-colors ${showCal ? "bg-panel-border-subtle text-panel-text" : "hover:bg-panel-surface-hover text-panel-text-muted"}`}>
              <Calendar className="h-4 w-4" />
            </button>
            <button onClick={onPrev} className="p-2 hover:bg-panel-surface-hover rounded-full transition-colors active:scale-95">
              <ChevronLeft className="h-5 w-5 text-panel-text-muted" />
            </button>
            <button onClick={onNext} className="p-2 hover:bg-panel-surface-hover rounded-full transition-colors active:scale-95">
              <ChevronRight className="h-5 w-5 text-panel-text-muted" />
            </button>
          </div>
        </div>
      </div>

      {/* Mini calendar takes full space if open */}
      {showCal ? (
        <div className="flex-1 overflow-auto bg-panel-base p-6">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCalMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                className="p-1 hover:bg-panel-surface rounded-lg transition-colors">
                <ChevronLeft className="h-5 w-5 text-panel-text-muted" />
              </button>
              <span className="text-base font-semibold text-panel-text">{MONTHS_RU[calM].toLowerCase()} {calY}</span>
              <button onClick={() => setCalMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                className="p-1 hover:bg-panel-surface rounded-lg transition-colors">
                <ChevronRight className="h-5 w-5 text-panel-text-muted" />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map(d => <div key={d} className="text-center text-xs font-medium text-panel-text-subtle py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calDays.map((day, i) => {
                if (!day) return <div key={i} className="aspect-square" />
                const ds = getTzDateString(day, timezone)
                return (
                  <button key={ds}
                    onClick={() => { onDateSelect?.(day); setShowCal(false) }}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl transition-colors ${ds === curStr ? "ring-2 ring-panel-text ring-inset bg-panel-surface" : "bg-panel-base"} hover:bg-panel-surface text-sm`}>
                    <span className={`z-10 flex items-center justify-center ${ds === todayStr ? "bg-panel-text text-panel-base rounded-full w-6 h-6 font-bold" : "text-panel-text"}`}>
                      {new Intl.DateTimeFormat("ru-RU", { day: "numeric", timeZone: timezone }).format(day)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        // Body (month or grid)
        viewMode === "month" ? (
          <div className="flex-1 overflow-auto">
            {viewType === "team" && uniqueStaff.length > 0 ? (
              // Team: rows=dates, cols=staff
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-panel-surface">
                  <tr>
                    <th className="w-24 px-4 py-3 text-left text-xs font-semibold text-panel-text-muted border-b border-panel-border-subtle bg-panel-surface">Дата</th>
                    {uniqueStaff.map(s => (
                      <th key={s.id} className="px-2 py-2 border-b border-panel-border-subtle text-center min-w-16 bg-panel-surface">
                        <div className="flex flex-row items-center justify-center gap-1.5">
                          <Avatar type="user" name={s.shortName || s.user?.shortName || "?"} avatarUrl={s.user?.avatarUrl} color={s.color || s.user?.color} className="w-6 h-6 rounded-full text-[9px] shrink-0" />
                          <span className={`text-[10px] truncate max-w-20 ${currentUserId && s.user?.id === currentUserId ? "bg-panel-text text-panel-base px-1.5 py-0.5 rounded-full font-semibold" : "text-panel-text-muted font-medium"}`}>
                            {s.shortName || s.user?.shortName}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teamMonthDates.map(({ date, str, label }) => (
                    <tr key={str} className="border-b border-panel-border-subtle/50 hover:bg-panel-base/50 transition-colors cursor-pointer"
                      onClick={() => { onDateSelect?.(date); onViewModeChange?.("1day") }}>
                      <td className="px-4 py-2 text-xs font-medium text-panel-text-muted whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full -ml-2 ${str === todayStr ? "bg-panel-text text-panel-base font-semibold" : ""}`}>
                          {label}
                        </span>
                      </td>
                      {uniqueStaff.map(s => {
                        const count = byDateStaff[`${str}_${s.id}`] || 0
                        return (
                          <td key={s.id} className="px-2 py-1.5 text-center align-middle">
                            {count > 0 ? (
                              <div className={`mx-auto w-full aspect-square max-w-12 rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-colors ${heatBg(count)} text-panel-text`}>
                                {count}
                              </div>
                            ) : (
                              <div className="mx-auto w-full aspect-square max-w-12 rounded-xl bg-panel-surface border border-panel-border-subtle" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Personal: full month calendar grid with counts
              <div className="p-4 max-w-2xl mx-auto">
                {(() => {
                  const y = currentDate.getFullYear(), m = currentDate.getMonth()
                  const dim = new Date(y, m + 1, 0).getDate()
                  const fw = (new Date(y, m, 1).getDay() + 6) % 7
                  const days: (Date | null)[] = [...Array(fw).fill(null), ...Array.from({ length: dim }, (_, i) => new Date(y, m, i + 1, 12, 0, 0))]
                  while (days.length % 7 !== 0) days.push(null)
                  return (
                    <>
                      <div className="text-center text-sm font-semibold text-panel-text mb-4">
                        {new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric", timeZone: timezone }).format(currentDate).toLowerCase()}
                      </div>
                      <div className="grid grid-cols-7 mb-2">
                        {WEEKDAYS.map(d => <div key={d} className="text-center text-xs font-medium text-panel-text-subtle py-1">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {days.map((day, i) => {
                          if (!day) return <div key={i} className="aspect-[4/5]" />
                          const ds = getTzDateString(day, timezone)
                          const count = byDate[ds] || 0
                          const isToday = ds === todayStr
                          return (
                            <button key={ds}
                              onClick={() => { onDateSelect?.(day); onViewModeChange?.("week") }}
                              className={`relative aspect-[4/5] rounded-xl flex flex-col items-center justify-start pt-2 transition-all hover:opacity-80 ${heatBg(count)}`}>
                              <span className={`text-sm font-semibold z-10 flex items-center justify-center ${isToday ? "bg-panel-text text-panel-base rounded-full w-7 h-7" : count > 0 ? "text-panel-text" : "text-panel-text-subtle"}`}>
                                {new Intl.DateTimeFormat("ru-RU", { day: "numeric", timeZone: timezone }).format(day)}
                              </span>
                              {count > 0 && (
                                <span className="absolute bottom-2 text-[10px] font-bold text-panel-text/90">{count}</span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        ) : (
          // Normal timetable
          <div className="flex-1 overflow-y-auto overflow-x-auto relative scrollbar-thin">
            <div className="flex min-w-full w-max">
              <div className="w-16 shrink-0 border-r border-panel-border-subtle bg-panel-surface sticky left-0 z-20">
                <div className={`border-b border-panel-border-subtle bg-panel-surface sticky top-0 z-30 ${headerHeightClass}`} />
                <div className="relative" style={{ height: gH }}>
                  {hours.map(h => (
                    <div key={h} className="absolute w-full flex justify-center -mt-2.5" style={{ top: (h - gStart) * 60 * PPM }}>
                      <span className="text-xs font-medium text-panel-text-subtle">{pad(h)}:00</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-1 min-w-150">
                {columns.map((col, colIdx) => {
                  const colEvents = events.filter(e => {
                    if (e.startDateTime.split("T")[0] !== col.dateString) return false
                    return viewType === "personal" ? true : e.staff?.id === col.id
                  })
                  return (
                    <div key={col.id} className="flex-1 border-r border-panel-border-subtle relative min-w-50">
                      <div
                        className={`${headerHeightClass} border-b border-panel-border-subtle sticky top-0 z-10 flex flex-row items-center justify-center gap-2.5 cursor-pointer hover:bg-panel-surface-hover transition-colors bg-panel-surface px-2`}
                        onClick={() => { 
                          if (!col.dateString) return; 
                          const [y,m,d] = col.dateString.split("-").map(Number); 
                          onDateSelect?.(new Date(y, m-1, d, 12, 0, 0)) 
                        }}
                      >
                        {viewType === "team" && col.staff && (
                          <Avatar type="user" name={col.staff.shortName || col.staff.user?.shortName || "?"} avatarUrl={col.staff.user?.avatarUrl} color={col.staff.color || col.staff.user?.color} className="w-9 h-9 rounded-full text-xs shrink-0" />
                        )}
                        <div className="flex flex-col items-start justify-center min-w-0">
                          <span className={`text-sm truncate max-w-full ${col.isToday && viewType !== "team" ? "font-bold text-panel-text" : (viewType === "team" && currentUserId && col.staff?.user?.id === currentUserId) ? "bg-panel-text text-panel-base px-2 py-0.5 rounded-full font-semibold" : "font-semibold text-panel-text-muted"}`}>
                            {col.label}
                          </span>
                          {col.subLabel && (
                            <span className={`truncate max-w-full ${(col.isToday && viewType !== "team") ? "mt-0.5 bg-panel-text text-panel-base px-2 py-0.5 rounded-full font-medium text-xs" : "text-[11px] font-medium text-panel-text-subtle"}`}>
                              {col.subLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="relative" style={{ height: gH }}>
                        <div className="absolute inset-0 bg-timetable-busy" />
                        {col.schedule.map((slot, i) => {
                          const top = t2px(formatTime(slot.startDateTime, workspaceTimezone), gStart)
                          const height = t2px(formatTime(slot.endDateTime, workspaceTimezone), gStart) - top
                          return <div key={i} className="absolute w-full bg-timetable-slot" style={{ top, height }} />
                        })}
                        <div className="absolute inset-0 pointer-events-none flex flex-col">
                          {hours.map(h => <div key={h} className="w-full border-t border-panel-border-subtle" style={{ height: 60 * PPM }} />)}
                        </div>
                        {colEvents.map(event => {
                          const top = t2px(formatTime(event.startDateTime, workspaceTimezone), gStart)
                          const height = event.stages.reduce((a, s) => a + s.durationMinutes, 0) * PPM
                          const eventColor = event.color || (viewType === "personal" 
                            ? event.workspace.color 
                            : (event.staff?.color || event.staff?.user?.color))

                          return (
                            <div key={event.id} onClick={() => onEventClick?.(event)}
                              className="absolute left-1.5 right-1.5 flex rounded-xl shadow-sm transition-transform hover:scale-[1.01] cursor-pointer overflow-hidden bg-panel-surface border border-panel-border"
                              style={{ top, height }}>
                              <div className="w-1 shrink-0 flex flex-col h-full bg-panel-base/50">
                                {event.stages.map(s => (
                                  <div key={s.id} 
                                    style={{ 
                                      height: s.durationMinutes * PPM,
                                      ...(s.isActive ? { backgroundColor: eventColor } : { borderColor: eventColor })
                                    }}
                                    className={`w-full box-border ${s.isActive ? (eventColor ? "" : "bg-panel-text") : `border-l-4 border-dashed bg-transparent ${eventColor ? "" : "border-panel-border"}`}`} />
                                ))}
                              </div>
                              <div className="flex flex-col flex-1 min-w-0 px-2 py-1.5 pointer-events-none relative">
                                <span className="text-[12px] font-semibold leading-[1.2] text-panel-text line-clamp-2">{event.serviceName}</span>
                                <span className="text-[11px] text-panel-text-muted-dark mt-0.5 truncate pr-8">{event.client.name}</span>
                                {viewType === "personal" && !hideWorkspaceTags && (
                                  <span className="absolute bottom-1 right-1.5 text-[9px] font-medium text-panel-text-subtle/80 uppercase tracking-wide bg-panel-surface/80 backdrop-blur-sm px-1 py-0.5 rounded truncate max-w-[60%] border border-panel-border-subtle/50">
                                    {event.workspace.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                        {col.isToday && nowM >= gStart * 60 && nowM <= gEnd * 60 && (
                          <div className="absolute left-0 right-0 z-20 pointer-events-none flex items-center opacity-60"
                            style={{ top: (nowM - gStart * 60) * PPM, transform: "translateY(-50%)" }}>
                            {columns.findIndex(c => c.dateString === col.dateString) === colIdx && (
                              <div className="w-2 h-2 rounded-full bg-timetable-divider -ml-1 shrink-0" />
                            )}
                            <div className="flex-1 h-px bg-timetable-divider/50" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}
