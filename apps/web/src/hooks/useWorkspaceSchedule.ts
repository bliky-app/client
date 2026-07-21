import { useState } from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { workspaceApi } from "@/lib/api/workspaceApi"
import { usePermissions } from "@/lib/permissions"
import type { Workspace, Appointment } from "@/types/models"
import type { TimetableViewMode } from "@/components/Timetable"
import type { AppointmentDraft } from "@/components/CreateAppointmentSheet"

export function useWorkspaceSchedule(workspace: Workspace, forcedViewType?: "personal" | "team") {
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null)
  const [viewMode, setViewMode] = useState<TimetableViewMode>("week")

  // Appointment Sheet State
  const [isAppointmentSheetOpen, setIsAppointmentSheetOpen] = useState(false)
  const [appointmentDraft, setAppointmentDraft] = useState<AppointmentDraft | undefined>(undefined)

  const { can } = usePermissions(workspace.id)
  const canViewGlobalSchedule = workspace.type === "individual" ? false : can("view_global_schedule")
  const viewType = forcedViewType || (canViewGlobalSchedule ? "team" : "personal")
  const stepDays = viewMode === "month" ? 30 : viewMode === "week" ? 7 : 1

  const { data: columns = [], isLoading: columnsLoading } = useQuery({
    queryKey: ["workspaceColumns", workspace.id, calendarDate.toISOString(), viewType, viewMode],
    queryFn: () =>
      viewType === "team"
        ? workspaceApi.getTeamDayColumns(workspace.id, calendarDate)
        : workspaceApi.getTimetableColumns(workspace.id, calendarDate),
    placeholderData: keepPreviousData,
  })

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["workspaceEvents", workspace.id, calendarDate.toISOString(), viewType],
    queryFn: () => workspaceApi.getTimetableEvents(workspace.id, viewType),
    placeholderData: keepPreviousData,
  })

  const isLoading = columnsLoading || eventsLoading

  const handlePrevDate = () => {
    const nextDate = new Date(calendarDate)
    nextDate.setDate(nextDate.getDate() - stepDays)
    setCalendarDate(nextDate)
  }

  const handleNextDate = () => {
    const nextDate = new Date(calendarDate)
    nextDate.setDate(nextDate.getDate() + stepDays)
    setCalendarDate(nextDate)
  }

  const handleSlotClick = (dateString: string, time: string, staffId?: string) => {
    setAppointmentDraft({
      workspaceId: workspace.id,
      masterId: staffId,
      startDateTime: `${dateString}T${time}`,
    })
    setIsAppointmentSheetOpen(true)
  }

  const handleOpenForm = (draft: AppointmentDraft) => {
    setAppointmentDraft({ ...draft, workspaceId: workspace.id })
    setIsAppointmentSheetOpen(true)
  }

  return {
    calendarDate,
    setCalendarDate,
    selectedEvent,
    setSelectedEvent,
    viewMode,
    setViewMode,
    isAppointmentSheetOpen,
    setIsAppointmentSheetOpen,
    appointmentDraft,
    canViewGlobalSchedule,
    viewType,
    columns,
    events,
    isLoading,
    handlePrevDate,
    handleNextDate,
    handleSlotClick,
    handleOpenForm,
  }
}
