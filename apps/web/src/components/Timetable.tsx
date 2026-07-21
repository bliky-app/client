import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { getTzDateString, formatTime } from "@/lib/formatters"
import type { Appointment, TimetableColumn, TimetableViewType } from "@/types/models"
import Avatar from "@/components/Avatar"
import { PreciseTimePicker } from "./PreciseTimePicker"
import {
  useTimetableLogic,
  PPM,
  WEEKDAYS,
  MONTHS_RU,
  t2px,
  heatBg,
  pad
} from "@/hooks/components/useTimetableLogic"

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
  onSlotClick?: (dateString: string, time: string, staffId?: string) => void
  onViewModeChange?: (mode: TimetableViewMode) => void
  timezone: string
  viewMode?: TimetableViewMode
  hideWorkspaceTags?: boolean
  workspaceTimezone?: string
  headerTitle?: string
  currentUserId?: string
}

export default function Timetable({
  viewType, currentDate, events, columns,
  onPrev, onNext, onEventClick, onDateSelect, onSlotClick, onViewModeChange,
  timezone,
  viewMode = "week", hideWorkspaceTags = false,
  workspaceTimezone = "Europe/Moscow", headerTitle: propHeaderTitle,
  currentUserId,
}: TimetableProps) {

  const {
    setCalMonth,
    showCal, setShowCal,
    nowM,
    longPressPopover, setLongPressPopover,
    byDate,
    byDateStaff,
    gStart, gEnd, gH, hours,
    headerHeightClass,
    isRange, startDateStr, endDateStr,
    calY, calM, calDays,
    todayStr, curStr,
    uniqueStaff,
    teamMonthDates,
    handlePointerDown,
    handlePointerMove,
    handlePointerCancelOrUp,
    handleClick,
  } = useTimetableLogic(
    currentDate,
    events,
    columns,
    viewType,
    viewMode,
    timezone,
    workspaceTimezone
  )

  const VIEW_LABELS: Record<TimetableViewMode, string> = { "1day": "1 день", week: "Неделя", month: "Месяц" }
  const allowedModes = viewType === "personal" ? ["week", "month"] : ["1day", "month"]

  return (
    <div className="flex flex-col bg-panel-surface w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-panel-border-subtle bg-panel-surface z-20 flex-nowrap overflow-hidden">
        <h2 className="text-base font-semibold text-panel-text whitespace-nowrap pl-1 shrink min-w-0">
          {propHeaderTitle ? (
            propHeaderTitle
          ) : isRange ? (
            <>
              <span>{startDateStr}</span>
              <span className="hidden min-[380px]:inline">&nbsp;— {endDateStr}</span>
            </>
          ) : (
            startDateStr
          )}
        </h2>

        <div className="flex items-center gap-2">
          {/* View mode */}
          <div className="flex items-center bg-panel-base rounded-xl border border-panel-border-subtle p-1 shrink-0">
            {(allowedModes as TimetableViewMode[]).map(m => (
              <button key={m} onClick={() => { onViewModeChange?.(m); setShowCal(false) }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${viewMode === m ? "bg-panel-surface text-panel-text shadow-sm border border-panel-border-subtle" : "text-panel-text-muted hover:text-panel-text"}`}>
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
          <div className="overflow-x-auto pb-4">
            {viewType === "team" && uniqueStaff.length > 0 ? (
              // Team: rows=dates, cols=staff
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-panel-surface">
                  <tr>
                    <th className="w-24 px-4 py-3 text-left text-xs font-semibold text-panel-text-muted border-b border-panel-border-subtle bg-panel-surface">Дата</th>
                    {uniqueStaff.map(s => (
                      <th key={s.id} className="px-2 py-2 border-b border-panel-border-subtle text-center min-w-16 bg-panel-surface">
                        <div className="flex flex-row items-center justify-center gap-1.5">
                          <Avatar data={s} className="w-6 h-6 rounded-full text-[9px] shrink-0" />
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
                        {new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric", timeZone: timezone }).format(currentDate).replace(/\s*г\./, '').toLowerCase()}
                      </div>
                      <div className="grid grid-cols-7 mb-2">
                        {WEEKDAYS.map(d => <div key={d} className="text-center text-xs font-medium text-panel-text-subtle py-1">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {days.map((day, i) => {
                          if (!day) return <div key={i} className="aspect-4/5" />
                          const ds = getTzDateString(day, timezone)
                          const count = byDate[ds] || 0
                          const isToday = ds === todayStr
                          return (
                            <button key={ds}
                              onClick={() => { onDateSelect?.(day); onViewModeChange?.("week") }}
                              className={`relative aspect-4/5 rounded-xl flex flex-col items-center justify-start pt-2 transition-all hover:opacity-80 ${heatBg(count)}`}>
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
          <div className="overflow-x-auto relative scrollbar-thin pb-4">
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
                          <Avatar data={col.staff} className="w-9 h-9 rounded-full text-xs shrink-0" />
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

                      <div
                        className="relative cursor-pointer select-none"
                        style={{ height: gH }}
                        onContextMenu={(e) => e.preventDefault()}
                        onPointerDown={(e) => col.dateString && handlePointerDown(e, col.dateString, col.id)}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerCancelOrUp}
                        onPointerCancel={handlePointerCancelOrUp}
                        onClick={() => col.dateString && handleClick()}
                      >
                        <div className="absolute inset-0 bg-timetable-busy pointer-events-none" />
                        {col.schedule.map((slot, i) => {
                          const top = t2px(formatTime(slot.startDateTime, workspaceTimezone), gStart)
                          const height = t2px(formatTime(slot.endDateTime, workspaceTimezone), gStart) - top
                          return <div key={i} className="absolute w-full bg-timetable-slot" style={{ top, height }} />
                        })}
                        <div className="absolute inset-0 pointer-events-none">
                          {hours.map(h => <div key={h} className="absolute w-full border-t border-panel-border-subtle" style={{ top: (h - gStart) * 60 * PPM }} />)}
                        </div>
                        {colEvents.map(event => {
                          const top = t2px(formatTime(event.startDateTime, workspaceTimezone), gStart)
                          const height = event.totalDurationMinutes * PPM
                          const eventColor = event.color || (viewType === "personal"
                            ? event.workspace.color
                            : (event.staff?.color || event.staff?.user?.color))

                          const knownDuration = event.stages.reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
                          const unknownCount = event.stages.filter(s => s.durationMinutes === undefined).length
                          const remainingDuration = Math.max(0, event.totalDurationMinutes - knownDuration)
                          const durationPerUnknown = unknownCount > 0 ? remainingDuration / unknownCount : 0

                          return (
                            <div key={event.id} onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                              className={`absolute left-1.5 right-1.5 flex rounded-xl shadow-sm transition-transform hover:scale-[1.01] cursor-pointer overflow-hidden bg-panel-surface border border-panel-border ${!event.isConfirmed ? "opacity-60" : ""}`}
                              style={{ top, height }}>
                              {!event.isConfirmed && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-400 shadow-sm z-10" />
                              )}
                              <div className="w-1 shrink-0 flex flex-col h-full bg-panel-base/50">
                                {event.stages.map(s => {
                                  const duration = s.durationMinutes !== undefined ? s.durationMinutes : durationPerUnknown
                                  return (
                                    <div key={s.id}
                                      style={{
                                        height: `${(duration / Math.max(1, event.totalDurationMinutes)) * 100}%`,
                                        ...(s.isActive ? { backgroundColor: eventColor } : { borderColor: eventColor })
                                      }}
                                      className={`w-full box-border ${s.isActive ? (eventColor ? "" : "bg-panel-text") : `border-l-4 border-dashed bg-transparent ${eventColor ? "" : "border-panel-border"}`}`} />
                                  )
                                })}
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

      {longPressPopover?.show && typeof document !== "undefined" && createPortal(
        <PreciseTimePicker
          x={longPressPopover.x}
          y={longPressPopover.y}
          initialHour={longPressPopover.initialHour}
          initialMinute={longPressPopover.initialMinute}
          dateString={longPressPopover.dateString}
          onCancel={() => setLongPressPopover(null)}
          onConfirm={(h, m) => {
            const timeStr = `${pad(h)}:${pad(m)}`
            onSlotClick?.(longPressPopover.dateString, timeStr, longPressPopover.staffId)
            setLongPressPopover(null)
          }}
        />,
        document.body
      )}
    </div>
  )
}
