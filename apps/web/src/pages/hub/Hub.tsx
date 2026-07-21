import { useState } from "react"
import { Loader2 } from "lucide-react"
import HubOverview from "./HubOverview"
import HubHeader from "./HubHeader"
import WorkspaceList from "./WorkspaceList"
import QuickActionsRow from "@/components/QuickActionsRow"
import Timetable from "@/components/Timetable"
import EventPopup from "@/components/EventPopup"
import SectionCard from "@workspace/ui/components/SectionCard"
import CreateAppointmentSheet from "@/components/CreateAppointmentSheet"
import { useHubOverview } from "@/hooks/hub/useHubOverview"
import { useHubTimetable } from "@/hooks/hub/useHubTimetable"
import { useAppointmentSheet } from "@/hooks/components/useAppointmentSheet"
import type { Appointment } from "@/types/models"

export default function Hub() {
  const { overview, isOverviewLoading, workspaces } = useHubOverview()
  const timetable = useHubTimetable(overview?.user.timezone || "Europe/Moscow")
  const appointmentSheet = useAppointmentSheet()

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  if (isOverviewLoading || !overview) {
    return (
      <div className="flex-1 flex items-center justify-center bg-hub-base">
        <Loader2 className="w-8 h-8 text-hub-text-muted animate-spin" />
      </div>
    )
  }

  const clientDate = overview.requestAt ? new Date(overview.requestAt) : new Date()

  return (
    <div className="flex flex-col flex-1 bg-hub-base w-full overflow-y-auto">
      <div className="grid grid-cols-1 items-start w-full">
        <div className="col-start-1 row-start-1 w-full flex flex-col self-start">
          <div className="sticky top-0 z-10 w-full flex flex-col bg-hub-base">
            <div className="px-6 pt-8 pb-4 w-full">
              <HubHeader user={overview.user} date={clientDate} />
            </div>
            <div className="px-6 pt-4 pb-10 w-full">
              <HubOverview data={overview} />
            </div>
          </div>
          <div className="px-6 pt-4 pb-10 w-full invisible pointer-events-none" aria-hidden="true">
            <HubOverview data={overview} />
          </div>
        </div>
        <div className="col-start-1 row-start-1 w-full flex flex-col z-20 pointer-events-none min-h-full">
          <div className="w-full flex flex-col invisible" aria-hidden="true">
            <div className="px-6 pt-8 pb-4 w-full">
              <HubHeader user={overview.user} date={clientDate} />
            </div>
            <div className="px-6 pt-4 pb-10 w-full">
              <HubOverview data={overview} />
            </div>
          </div>
          <div className="h-1 w-full shrink-0" aria-hidden="true" />
          <div className="pointer-events-auto flex-1 flex flex-col bg-panel-base rounded-t-[32px] pt-4 pb-4 px-4 sm:px-6 gap-6 shadow-[0_-8px_32px_rgba(0,0,0,0.18)]">

            <div className="w-12 h-1.5 bg-panel-border rounded-full mx-auto shrink-0 -mb-2" />

            <SectionCard title="Пространства">
              <WorkspaceList workspaces={workspaces} />
            </SectionCard>

            <QuickActionsRow
              context="hub"
              workspaces={workspaces}
              onOpenForm={appointmentSheet.handleQuickActionOpen}
            />

            <div className="flex flex-col bg-panel-surface border border-panel-border rounded-[32px] shadow-sm overflow-hidden mb-6">
              <Timetable
                timezone={timetable.userTimezone}
                viewType="personal"
                viewMode={timetable.viewMode}
                currentDate={timetable.currentDate}
                columns={timetable.columns}
                events={timetable.events}
                onEventClick={setSelectedAppointment}
                onViewModeChange={timetable.onViewModeChange}
                onDateSelect={timetable.onDateSelect}
                onSlotClick={appointmentSheet.handleSlotClick}
                onPrev={timetable.onPrev}
                onNext={timetable.onNext}
              />
            </div>

          </div>
        </div>

      </div>

      <EventPopup event={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
      <CreateAppointmentSheet
        isOpen={appointmentSheet.isOpen}
        onClose={appointmentSheet.handleClose}
        initialData={appointmentSheet.draft}
        workspaces={workspaces}
      />
    </div>
  )
}
