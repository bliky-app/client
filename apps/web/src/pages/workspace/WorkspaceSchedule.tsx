import { Loader2 } from "lucide-react"
import Timetable from "@/components/Timetable"
import EventPopup from "@/components/EventPopup"
import { MOCK_USER } from "@/lib/api/mockData"
import type { Workspace } from "@/types/models"
import QuickActionsRow from "@/components/QuickActionsRow"
import CreateAppointmentSheet from "@/components/CreateAppointmentSheet"
import { useWorkspaceSchedule } from "@/hooks/workspace/useWorkspaceSchedule"

interface WorkspaceScheduleProps {
  workspace: Workspace
  forcedViewType?: "personal" | "team"
}

export default function WorkspaceSchedule({ workspace, forcedViewType }: WorkspaceScheduleProps) {
  const {
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
  } = useWorkspaceSchedule(workspace, forcedViewType)

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center flex-1 min-h-50">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="flex flex-col gap-6 p-4 sm:p-6 pb-6">
            <QuickActionsRow
              context="workspace_schedule"
              masters={
                workspace.staff?.map((staffMember) => ({
                  id: staffMember.id,
                  name: staffMember.user?.shortName || staffMember.user?.fullName || staffMember.id,
                  subtitle: staffMember.mainCategory?.name,
                  color: staffMember.user?.color,
                  avatarUrl: staffMember.user?.avatarUrl,
                })) || []
              }
              services={[
                { id: "srv-1", name: "Стрижка", subtitle: "60 мин • 1500 ₽" },
                { id: "srv-2", name: "Окрашивание", subtitle: "120 мин • 4000 ₽" },
              ]}
              showMasterCard={workspace.type !== "individual" && canViewGlobalSchedule}
              onOpenForm={handleOpenForm}
            />

            <div className="flex flex-col bg-panel-surface border border-panel-border rounded-[32px] shadow-sm overflow-hidden mb-6">
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
                onSlotClick={handleSlotClick}
                onPrev={handlePrevDate}
                onNext={handleNextDate}
                onEventClick={setSelectedEvent}
                currentUserId={MOCK_USER.id}
              />
            </div>
          </div>
        )}
      </div>

      <EventPopup
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        workspaceTimezone={workspace.timezone}
      />

      <CreateAppointmentSheet
        isOpen={isAppointmentSheetOpen}
        onClose={() => setIsAppointmentSheetOpen(false)}
        initialData={appointmentDraft}
        workspaces={[workspace]}
      />
    </div>
  )
}
