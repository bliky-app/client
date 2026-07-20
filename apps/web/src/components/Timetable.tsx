import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Appointment, TimetableColumn, TimetableViewType } from "@/types/models"
import Avatar from "@/components/Avatar"
import { formatTime } from "@/lib/formatters"

interface TimetableProps {
  viewType: TimetableViewType
  currentDate: Date
  events: Appointment[]
  columns: TimetableColumn[]
  onPrev?: () => void
  onNext?: () => void
  onEventClick?: (event: Appointment) => void
  hideWorkspaceTags?: boolean
  workspaceTimezone?: string
  headerTitle?: string
}

const PIXELS_PER_MINUTE = 1.5

function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(":").map(Number)
  return (h || 0) * 60 + (m || 0)
}

function timeToPixels(timeStr: string, gridStartHour: number) {
  return (timeToMinutes(timeStr) - gridStartHour * 60) * PIXELS_PER_MINUTE
}

export default function Timetable({
  viewType,
  currentDate,
  events,
  columns,
  onPrev,
  onNext,
  onEventClick,
  hideWorkspaceTags = false,
  workspaceTimezone = "Europe/Moscow",
  headerTitle: propHeaderTitle,
}: TimetableProps) {
  
  const allSlotTimes = columns.flatMap(c => c.schedule.flatMap(s => [
    timeToMinutes(formatTime(s.startDateTime, workspaceTimezone)), 
    timeToMinutes(formatTime(s.endDateTime, workspaceTimezone))
  ]))
  
  const gridStartHour = allSlotTimes.length > 0 ? Math.floor(Math.min(...allSlotTimes) / 60) : 8
  const gridEndHour   = allSlotTimes.length > 0 ? Math.ceil(Math.max(...allSlotTimes) / 60)  : 22

  const [now, setNow] = useState(new Date())
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const hours = Array.from({ length: gridEndHour - gridStartHour }, (_, i) => gridStartHour + i)
  const gridHeight = (gridEndHour - gridStartHour) * 60 * PIXELS_PER_MINUTE

  const headerTitle = propHeaderTitle || (viewType === "team"
    ? currentDate.toLocaleString("ru-RU", { day: "numeric", month: "long", weekday: "long" })
    : `Персональное расписание`)

  const headerHeightClass = viewType === "team" ? "h-20" : "h-12"

  return (
    <div className="flex flex-col bg-panel-surface overflow-hidden flex-1 w-full shrink-0 min-h-0">
      <div className="flex items-center justify-between px-6 py-4 border-b border-panel-border-subtle bg-panel-surface z-20">
        <h2 className="text-lg font-semibold text-panel-text first-letter:uppercase">{headerTitle}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            className="p-2 hover:bg-panel-surface-hover rounded-full transition-colors active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 text-panel-text-muted" />
          </button>
          <button
            onClick={onNext}
            className="p-2 hover:bg-panel-surface-hover rounded-full transition-colors active:scale-95"
          >
            <ChevronRight className="h-5 w-5 text-panel-text-muted" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-auto relative scrollbar-thin">
        <div className="flex min-w-full w-max">
          <div className="w-16 shrink-0 border-r border-panel-border-subtle bg-panel-surface sticky left-0 z-20">
          <div className={`border-b border-panel-border-subtle bg-panel-surface sticky top-0 z-30 ${headerHeightClass}`} />
          <div className="relative" style={{ height: gridHeight }}>
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute w-full flex justify-center -mt-2.5"
                style={{ top: (hour - gridStartHour) * 60 * PIXELS_PER_MINUTE }}
              >
                <span className="text-xs font-medium text-panel-text-subtle">
                  {hour.toString().padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 min-w-150">
          {columns.map((col, colIndex) => {
            const colEvents = events.filter((e) => {
              const eventDateStr = e.startDateTime.split("T")[0]
              if (eventDateStr !== col.dateString) return false
              return viewType === "personal" ? true : e.staff.id === col.id
            })

            return (
              <div key={col.id} className="flex-1 border-r border-panel-border-subtle relative min-w-50">
                <div
                  className={`${headerHeightClass} border-b border-panel-border-subtle sticky top-0 z-10 flex flex-col items-center justify-center transition-colors
                    ${col.isToday ? "bg-timetable-today" : "bg-panel-surface"}
                  `}
                >
                  {viewType === "team" && col.staff && (
                    <Avatar
                      type="user"
                      name={col.staff.shortName || col.staff.user?.shortName || "?"}
                      avatarUrl={col.staff.user?.avatarUrl}
                      color={col.staff.color || col.staff.user?.color}
                      className="w-8 h-8 rounded-full text-[10px] mb-1 shrink-0"
                    />
                  )}
                  <span className={`text-sm font-semibold ${col.isToday ? "text-panel-text" : "text-panel-text-muted"}`}>
                    {col.label}
                  </span>
                  {col.subLabel && (
                    <span className={`text-xs ${col.isToday ? "text-panel-text-muted" : "text-panel-text-subtle"}`}>
                      {col.subLabel}
                    </span>
                  )}
                  {col.isToday && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-panel-text" />
                  )}
                </div>

                <div className="relative" style={{ height: gridHeight }}>
                  <div className="absolute inset-0 bg-timetable-busy" />

                  {col.schedule.map((slot, i) => {
                    const startStr = formatTime(slot.startDateTime, workspaceTimezone)
                    const endStr = formatTime(slot.endDateTime, workspaceTimezone)
                    const top = timeToPixels(startStr, gridStartHour)
                    const height = timeToPixels(endStr, gridStartHour) - top
                    return (
                      <div
                        key={i}
                        className="absolute w-full bg-timetable-slot"
                        style={{ top, height }}
                      />
                    )
                  })}

                  <div className="absolute inset-0 pointer-events-none flex flex-col">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="w-full border-t border-panel-border-subtle"
                        style={{ height: 60 * PIXELS_PER_MINUTE }}
                      />
                    ))}
                  </div>

                  {colEvents.map((event) => {
                    const startStr = formatTime(event.startDateTime, workspaceTimezone)
                    const topOffset = timeToPixels(startStr, gridStartHour)
                    const totalHeight = event.stages.reduce((acc, s) => acc + s.durationMinutes, 0) * PIXELS_PER_MINUTE

                    return (
                      <div
                        key={event.id}
                        onClick={() => onEventClick?.(event)}
                        className="absolute left-1.5 right-1.5 flex rounded-xl shadow-sm transition-transform hover:scale-[1.01] cursor-pointer overflow-hidden bg-panel-surface border border-panel-border"
                        style={{ top: topOffset, height: totalHeight }}
                      >
                        <div className="w-1 shrink-0 flex flex-col h-full bg-panel-base/50">
                          {event.stages.map((stage) => (
                            <div
                              key={stage.id}
                              style={{ height: stage.durationMinutes * PIXELS_PER_MINUTE }}
                              className={`w-full box-border ${
                                stage.isActive
                                  ? "bg-panel-text"
                                  : "border-l-4 border-dashed border-panel-border bg-transparent"
                              }`}
                            />
                          ))}
                        </div>

                        <div className="flex flex-col flex-1 min-w-0 px-2 py-1.5 pointer-events-none relative">
                          <span className="text-[12px] font-semibold leading-[1.2] text-panel-text line-clamp-2">
                            {event.serviceName}
                          </span>
                          <span className="text-[11px] text-panel-text-muted-dark mt-0.5 truncate pr-8">
                            {event.client.name}
                          </span>

                          {viewType === "personal" && !hideWorkspaceTags && (
                            <span className="absolute bottom-1 right-1.5 text-[9px] font-medium text-panel-text-subtle/80 uppercase tracking-wide bg-panel-surface/80 backdrop-blur-sm px-1 py-0.5 rounded truncate max-w-[60%] border border-panel-border-subtle/50">
                              {event.workspace.name}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  
                  {col.isToday && nowMinutes >= gridStartHour * 60 && nowMinutes <= gridEndHour * 60 && (
                    <div
                      className="absolute left-0 right-0 z-20 pointer-events-none flex items-center opacity-60"
                      style={{ top: (nowMinutes - gridStartHour * 60) * PIXELS_PER_MINUTE, transform: "translateY(-50%)" }}
                    >
                      {columns.findIndex(c => c.dateString === col.dateString) === colIndex && (
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
    </div>
  )
}
