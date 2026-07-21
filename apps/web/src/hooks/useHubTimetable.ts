import { useState } from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { hubApi } from "@/lib/api/hubApi"
import type { TimetableViewMode } from "@/components/Timetable"

const VIEW_MODE_STEP_DAYS: Record<TimetableViewMode, number> = {
  week: 7,
  "1day": 3,
  month: 30,
}

/**
 * Управляет состоянием и загрузкой данных для Timetable на Hub-странице.
 * Инкапсулирует навигацию по датам, переключение режима вида и запросы колонок/событий.
 */
export function useHubTimetable(userTimezone: string) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<TimetableViewMode>("week")

  const stepDays = VIEW_MODE_STEP_DAYS[viewMode]

  const { data: columns = [] } = useQuery({
    queryKey: ["hubTimetableColumns", currentDate.toISOString(), viewMode],
    queryFn: () => hubApi.getTimetableColumns(currentDate, stepDays),
    placeholderData: keepPreviousData,
  })

  const { data: events = [] } = useQuery({
    queryKey: ["hubTimetableEvents", currentDate.toISOString()],
    queryFn: () => hubApi.getTimetableEvents(currentDate),
    placeholderData: keepPreviousData,
  })

  const goToPreviousPeriod = () => {
    setCurrentDate(previousDate => {
      const newDate = new Date(previousDate)
      newDate.setDate(newDate.getDate() - stepDays)
      return newDate
    })
  }

  const goToNextPeriod = () => {
    setCurrentDate(previousDate => {
      const newDate = new Date(previousDate)
      newDate.setDate(newDate.getDate() + stepDays)
      return newDate
    })
  }

  return {
    currentDate,
    viewMode,
    columns,
    events,
    userTimezone,
    onDateSelect: setCurrentDate,
    onViewModeChange: setViewMode,
    onPrev: goToPreviousPeriod,
    onNext: goToNextPeriod,
  }
}
