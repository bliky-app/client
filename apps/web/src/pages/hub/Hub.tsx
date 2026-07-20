import { useState } from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import HubOverview from "./HubOverview"
import HubHeader from "./HubHeader"
import WorkspaceList from "./WorkspaceList"
import Timetable, { type TimetableViewMode } from "@/components/Timetable"
import EventPopup from "@/components/EventPopup"
import { hubApi } from "@/lib/api/hubApi"
import { MOCK_USER } from "@/lib/api/mockData"
import type { User, Appointment } from "@/types/models"

export default function Hub() {
  useQuery<User>({ queryKey: ["user"], queryFn: async () => MOCK_USER })

  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces"],
    queryFn: hubApi.getWorkspaces,
  })

  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["hubOverview"],
    queryFn: hubApi.getOverview,
  })

  const [calendarDate, setCalendarDate] = useState(new Date())
  const [isWorkspacesExpanded, setIsWorkspacesExpanded] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null)
  const [viewMode, setViewMode] = useState<TimetableViewMode>("3days")

  const step = viewMode === "month" ? 30 : viewMode === "week" ? 7 : 3

  // These are fetched independently — NOT included in the top-level loading
  // guard so that navigating the calendar doesn't remount the whole page and
  // kill Timetable's modal state.
  const { data: columns = [] } = useQuery({
    queryKey: ["hubTimetableColumns", calendarDate.toISOString(), viewMode],
    queryFn: () => hubApi.getTimetableColumns(calendarDate, step),
    placeholderData: keepPreviousData,
  })

  const { data: events = [] } = useQuery({
    queryKey: ["hubTimetableEvents", calendarDate.toISOString()],
    queryFn: () => hubApi.getTimetableEvents(calendarDate),
    placeholderData: keepPreviousData,
  })

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
      {/*
        CSS-Grid overlay: two layers share the same grid cell.

        LAYER 1 (z-0): sticky Header + Overview block, with an invisible
        Overview clone as spacer. The spacer height = overview height, which
        determines exactly when the sticky block un-sticks (when the white
        panel has risen to cover the full overview and is touching the header).

        LAYER 2 (z-20): invisible clones of Header + Overview push the white
        panel to start at the bottom of the overview. The panel slides over
        the overview while Layer 1 sticks, then both scroll away together once
        the sticky un-sticks.
      */}
      <div className="grid grid-cols-1 items-start w-full">

        {/* LAYER 1 */}
        <div className="col-start-1 row-start-1 w-full flex flex-col self-start">
          <div className="sticky top-0 z-10 w-full flex flex-col bg-hub-base">
            <div className="px-6 pt-8 pb-4 w-full">
              <HubHeader user={overview.user} date={clientDate} />
            </div>
            <div className="px-6 pt-4 pb-10 w-full">
              <HubOverview data={overview} />
            </div>
          </div>
          {/* Spacer = overview clone (sets sticky container height) */}
          <div className="px-6 pt-4 pb-10 w-full invisible pointer-events-none" aria-hidden="true">
            <HubOverview data={overview} />
          </div>
        </div>

        {/* LAYER 2 */}
        <div className="col-start-1 row-start-1 w-full flex flex-col z-20 pointer-events-none">
          {/* Pushers: match the sticky block height exactly */}
          <div className="w-full flex flex-col invisible" aria-hidden="true">
            <div className="px-6 pt-8 pb-4 w-full">
              <HubHeader user={overview.user} date={clientDate} />
            </div>
            <div className="px-6 pt-4 pb-10 w-full">
              <HubOverview data={overview} />
            </div>
          </div>

          {/* 4px buffer — absorbed by the panel's upward shadow (8px) */}
          <div className="h-1 w-full shrink-0" aria-hidden="true" />

          {/* White panel */}
          <div className="pointer-events-auto flex flex-col bg-panel-base rounded-t-[32px] pt-4 pb-12 min-h-[100svh] px-4 sm:px-6 gap-6 shadow-[0_-8px_32px_rgba(0,0,0,0.18)]">

            <div className="w-12 h-1.5 bg-panel-border-subtle rounded-full mx-auto shrink-0 mb-2" />

            {/* Workspaces */}
            <div className="flex flex-col bg-panel-surface border border-panel-border rounded-[32px] shadow-sm overflow-hidden shrink-0">
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-panel-surface-hover transition-colors"
                onClick={() => setIsWorkspacesExpanded(!isWorkspacesExpanded)}
              >
                <h2 className="text-lg font-semibold text-panel-text">Пространства</h2>
                <button className="p-2 -mr-2 text-panel-text-muted hover:text-panel-text transition-colors rounded-full">
                  <div className={`transition-transform duration-300 ${isWorkspacesExpanded ? "rotate-180" : ""}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </button>
              </div>
              <div className={`grid transition-all duration-300 ease-in-out ${isWorkspacesExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <WorkspaceList workspaces={workspaces} />
                </div>
              </div>
            </div>

            {/* Timetable */}
            <div className="flex flex-col flex-1 bg-panel-surface border border-panel-border rounded-[32px] shadow-sm overflow-hidden min-h-0 shrink-0">
              <Timetable
                timezone={MOCK_USER.timezone || "Europe/Moscow"}
                viewType="personal"
                viewMode={viewMode}
                currentDate={calendarDate}
                columns={columns}
                events={events}
                onEventClick={setSelectedEvent}
                onViewModeChange={setViewMode}
                onDateSelect={(date) => setCalendarDate(date)}
                onPrev={() => { const d = new Date(calendarDate); d.setDate(d.getDate() - step); setCalendarDate(d) }}
                onNext={() => { const d = new Date(calendarDate); d.setDate(d.getDate() + step); setCalendarDate(d) }}
              />
            </div>

          </div>
        </div>

      </div>

      <EventPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}
