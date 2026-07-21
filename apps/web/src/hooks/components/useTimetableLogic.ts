import { useState, useMemo, useEffect, useRef } from "react"
import { useAuth } from "@/lib/AuthProvider"
import { useToast } from "@/lib/ToastProvider"
import type { Appointment, TimetableColumn, TimetableViewType } from "@/types/models"
import type { TimetableViewMode } from "@/components/Timetable"
import { formatTime, getTzDateString } from "@/lib/formatters"

export const PPM = 1.5 // pixels per minute
export const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
export const MONTHS_RU = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]

export function t2m(t: string) {
  if (!t) return 0
  const [h, m] = t.split(":").map(Number)
  return (h || 0) * 60 + (m || 0)
}

export function t2px(t: string, startHour: number) {
  return (t2m(t) - startHour * 60) * PPM
}

export function heatBg(count: number) {
  if (count === 0) return ""
  if (count === 1) return "bg-panel-text/10"
  if (count <= 3) return "bg-panel-text/20"
  if (count <= 6) return "bg-panel-text/35"
  return "bg-panel-text/55"
}

export function pad(n: number) {
  return String(n).padStart(2, "0")
}

export function useTimetableLogic(
  currentDate: Date,
  events: Appointment[],
  columns: TimetableColumn[],
  viewType: TimetableViewType,
  viewMode: TimetableViewMode,
  timezone: string,
  workspaceTimezone: string
) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const isFormal = user?.isFormal ?? true

  const yearMonth = `${currentDate.getFullYear()}-${currentDate.getMonth()}`
  const [prevYearMonth, setPrevYearMonth] = useState(yearMonth)
  const [calMonth, setCalMonth] = useState(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  const [showCal, setShowCal] = useState(false)
  const [now, setNow] = useState(new Date())

  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pointerStart = useRef({ x: 0, y: 0 })
  const isLongPressTriggered = useRef(false)

  const [longPressPopover, setLongPressPopover] = useState<{
    show: boolean
    x: number
    y: number
    dateString: string
    staffId?: string
    initialHour: number
    initialMinute: number
  } | null>(null)

  if (prevYearMonth !== yearMonth) {
    setPrevYearMonth(yearMonth)
    setCalMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  }

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const byDate = useMemo(() => {
    const m: Record<string, number> = {}
    events.forEach((e) => {
      const d = e.startDateTime.split("T")[0]
      m[d] = (m[d] || 0) + 1
    })
    return m
  }, [events])

  const byDateStaff = useMemo(() => {
    const m: Record<string, number> = {}
    events.forEach((e) => {
      const d = e.startDateTime.split("T")[0]
      const k = `${d}_${e.staff?.id || "me"}`
      m[k] = (m[k] || 0) + 1
    })
    return m
  }, [events])

  const allTimes = columns.flatMap((c) =>
    c.schedule.flatMap((s) => [
      t2m(formatTime(s.startDateTime, workspaceTimezone)),
      t2m(formatTime(s.endDateTime, workspaceTimezone)),
    ])
  )
  const minM = allTimes.length > 0 ? Math.min(...allTimes) : 8 * 60
  const maxM = allTimes.length > 0 ? Math.max(...allTimes) : 22 * 60
  const gStart = Math.max(0, (minM - 30) / 60)
  const gEnd = Math.min(24, (maxM + 30) / 60)
  const startHour = Math.ceil(gStart)
  const endHour = Math.floor(gEnd)
  const hours = Array.from({ length: Math.max(0, endHour - startHour + 1) }, (_, i) => startHour + i)
  const gH = (gEnd - gStart) * 60 * PPM
  const nowM = now.getHours() * 60 + now.getMinutes()
  const headerHeightClass = viewType === "team" ? "h-20" : "h-12"

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

  const isRange = startD.getTime() !== endD.getTime()
  const startDateStr = formatMD(startD)
  const endDateStr = isRange ? formatMD(endD) : ""

  const calY = calMonth.getFullYear()
  const calM = calMonth.getMonth()
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
    columns.forEach((c) => {
      if (c.staff) map.set(c.id, c.staff)
    })
    return [...map.values()]
  }, [columns, viewType])

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

  const handlePointerDown = (
    e: React.PointerEvent,
    colDateString: string,
    colId: string
  ) => {
    isLongPressTriggered.current = false
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    pointerStart.current = { x: e.clientX, y: e.clientY }

    longPressRef.current = setTimeout(() => {
      isLongPressTriggered.current = true
      const minutes = Math.floor(y / PPM) + gStart * 60
      const snappedMinutes = Math.round(minutes / 15) * 15
      const h = Math.floor(snappedMinutes / 60)
      const m = snappedMinutes % 60

      setLongPressPopover({
        show: true,
        x: e.clientX,
        y: e.clientY,
        dateString: colDateString,
        staffId: colId !== colDateString ? colId : undefined,
        initialHour: h,
        initialMinute: m,
      })
    }, 400)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (longPressRef.current) {
      const dx = Math.abs(e.clientX - pointerStart.current.x)
      const dy = Math.abs(e.clientY - pointerStart.current.y)
      if (dx > 10 || dy > 10) {
        clearTimeout(longPressRef.current)
        longPressRef.current = null
      }
    }
  }

  const handlePointerCancelOrUp = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current)
      longPressRef.current = null
    }
  }

  const handleClick = () => {
    if (isLongPressTriggered.current) return
    const msg = isFormal
      ? "Нажмите и удерживайте свободное время, чтобы создать запись"
      : "Нажми и удерживай свободное время, чтобы создать запись"
    showToast(msg, "info")
  }

  return {
    isFormal,
    calMonth, setCalMonth,
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
  }
}
