import { useState } from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Timetable from "@/components/Timetable"
import EventPopup from "@/components/EventPopup"
import { workspaceApi } from "@/lib/api/workspaceApi"
import type { Workspace, Appointment } from "@/types/models"
import { usePermissions } from "@/lib/permissions"

interface WorkspaceScheduleProps {
  workspace: Workspace
}

export default function WorkspaceSchedule({ workspace }: WorkspaceScheduleProps) {
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null)

  const { can } = usePermissions(workspace.id)
  
  // If individual workspace, there's no team schedule, only personal
  const canViewGlobalSchedule = workspace.type === "individual" ? false : can("view_global_schedule")
  const viewType = canViewGlobalSchedule ? "team" : "personal"

  const { data: columns = [], isLoading: columnsLoading } = useQuery({
    queryKey: ["workspaceColumns", workspace.id, calendarDate.toISOString(), viewType],
    queryFn: () => viewType === "team" 
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

  return (
    <div className="flex flex-col flex-1 pb-12">
      <div className="flex flex-col flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center flex-1 min-h-50">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <Timetable
              viewType={viewType}
              currentDate={calendarDate}
              columns={columns}
              events={events}
              hideWorkspaceTags={true}
              workspaceTimezone={workspace.timezone}
              onPrev={() => {
                const d = new Date(calendarDate)
                d.setDate(d.getDate() - (viewType === "team" ? 1 : 3))
                setCalendarDate(d)
              }}
              onNext={() => {
                const d = new Date(calendarDate)
                d.setDate(d.getDate() + (viewType === "team" ? 1 : 3))
                setCalendarDate(d)
              }}
              onEventClick={setSelectedEvent}
            />
          </div>
        )}
      </div>

      <EventPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} workspaceTimezone={workspace.timezone} />
    </div>
  )
}
