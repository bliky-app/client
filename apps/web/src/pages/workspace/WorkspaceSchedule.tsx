import { useState } from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Timetable, { type TimetableViewMode } from "@/components/Timetable"
import EventPopup from "@/components/EventPopup"
import { workspaceApi } from "@/lib/api/workspaceApi"
import { MOCK_USER } from "@/lib/api/mockData"
import type { Workspace, Appointment } from "@/types/models"
import { usePermissions } from "@/lib/permissions"
import QuickActionsRow from "@/components/QuickActionsRow"
import CreateAppointmentSheet, { type AppointmentDraft } from "@/components/CreateAppointmentSheet"

interface WorkspaceScheduleProps {
  workspace: Workspace
  forcedViewType?: "personal" | "team"
}

export default function WorkspaceSchedule({ workspace, forcedViewType }: WorkspaceScheduleProps) {
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null)
  const [viewMode, setViewMode] = useState<TimetableViewMode>("week")

  // Appointment Sheet State
  const [isAppointmentSheetOpen, setIsAppointmentSheetOpen] = useState(false)
  const [appointmentDraft, setAppointmentDraft] = useState<AppointmentDraft | undefined>(undefined)

  const { can } = usePermissions(workspace.id)
  const canViewGlobalSchedule = workspace.type === "individual" ? false : can("view_global_schedule")
  const viewType = forcedViewType || (canViewGlobalSchedule ? "team" : "personal")
  const step = viewMode === "month" ? 30 : viewMode === "week" ? 7 : 1

  const { data: columns = [], isLoading: columnsLoading } = useQuery({
    queryKey: ["workspaceColumns", workspace.id, calendarDate.toISOString(), viewType, viewMode],
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
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center flex-1 min-h-50">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 gap-6 p-4 sm:p-6 pb-0">
            <QuickActionsRow context="workspace_schedule" onOpenForm={(draft) => {
              setAppointmentDraft(draft)
              setIsAppointmentSheetOpen(true)
            }} />
            
            <div className="flex-1 flex flex-col min-h-0 bg-panel-surface border border-panel-border rounded-[32px] shadow-sm overflow-hidden shrink-0 mb-6">
              <Timetable
                timezone={workspace.timezone || "Europe/Moscow"}
                viewType={viewType}
                viewMode={viewMode}
                currentDate={calendarDate}
                columns={columns}
                events={events}
                hideWorkspaceTags={true}
                workspaceTimezone={workspace.timezone}
                onViewModeChange={setViewMode}
                onDateSelect={(date) => setCalendarDate(date)}
                onSlotClick={(dateString, time, staffId) => {
                  setAppointmentDraft({
                    masterId: staffId,
                    startDateTime: `${dateString}T${time}`
                  })
                  setIsAppointmentSheetOpen(true)
                }}
                onPrev={() => { const d = new Date(calendarDate); d.setDate(d.getDate() - step); setCalendarDate(d) }}
                onNext={() => { const d = new Date(calendarDate); d.setDate(d.getDate() + step); setCalendarDate(d) }}
                onEventClick={setSelectedEvent}
                currentUserId={MOCK_USER.id}
              />
            </div>
          </div>
        )}
      </div>

      <EventPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} workspaceTimezone={workspace.timezone} />
      
      <CreateAppointmentSheet 
        isOpen={isAppointmentSheetOpen} 
        onClose={() => setIsAppointmentSheetOpen(false)}
        initialData={appointmentDraft}
      />
    </div>
  )
}
