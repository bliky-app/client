import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import HubOverview from "./HubOverview"
import WorkspaceList from "./WorkspaceList"
import Timetable from "@/components/Timetable"
import { hubApi } from "@/lib/api/hubApi"
import { MOCK_USER } from "@/lib/api/mockData"
import type { User } from "@/types/models"

export default function Hub() {
  const { isLoading: isUserLoading } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => MOCK_USER,
  })

  const { data: workspaces = [], isLoading: isWorkspacesLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: hubApi.getWorkspaces,
  })

  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["hubOverview"],
    queryFn: hubApi.getOverview,
  })

  const [calendarDate, setCalendarDate] = useState(new Date())
  const [isWorkspacesExpanded, setIsWorkspacesExpanded] = useState(true)

  const { data: columns = [], isLoading: isColumnsLoading } = useQuery({
    queryKey: ["hubTimetableColumns", calendarDate.toISOString()],
    queryFn: () => hubApi.getTimetableColumns(calendarDate),
  })

  const { data: events = [], isLoading: isEventsLoading } = useQuery({
    queryKey: ["hubTimetableEvents", calendarDate.toISOString()],
    queryFn: () => hubApi.getTimetableEvents(calendarDate),
  })

  // Basic aggregate loading state check
  if (isUserLoading || isWorkspacesLoading || isColumnsLoading || isEventsLoading) return null

  if (isOverviewLoading || !overview) {
    return (
      <div className="flex flex-col flex-1 bg-hub-base items-center justify-center h-full w-full">
        <Loader2 className="w-8 h-8 animate-spin text-panel-text-muted" />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 bg-hub-base select-none h-full w-full overflow-y-auto animate-in fade-in duration-300">
      <HubOverview data={overview} />

      <div className="flex-1 bg-panel-base rounded-t-[32px] pt-6 pb-12 w-full min-w-0 flex flex-col px-4 sm:px-6 gap-6">
        
        {/* Workspaces Widget */}
        <div className="flex flex-col bg-panel-surface border border-panel-border rounded-[32px] shadow-sm overflow-hidden shrink-0">
          <div 
            className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-panel-surface-hover transition-colors"
            onClick={() => setIsWorkspacesExpanded(!isWorkspacesExpanded)}
          >
            <h2 className="text-lg font-semibold text-panel-text">Пространства</h2>
            <button className="p-2 -mr-2 text-panel-text-muted hover:text-panel-text transition-colors rounded-full">
              <div className={`transition-transform duration-300 ${isWorkspacesExpanded ? "rotate-180" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </button>
          </div>
          <div 
            className={`grid transition-all duration-300 ease-in-out ${isWorkspacesExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
          >
            <div className="overflow-hidden">
              <WorkspaceList workspaces={workspaces} />
            </div>
          </div>
        </div>

        {/* Timetable Widget */}
        <div className="flex flex-col flex-1 bg-panel-surface border border-panel-border rounded-[32px] shadow-sm overflow-hidden min-h-[500px]">
          <Timetable
            viewType="personal"
            currentDate={calendarDate}
            columns={columns}
            events={events}
            onPrev={() => {
              const d = new Date(calendarDate)
              d.setDate(d.getDate() - 3)
              setCalendarDate(d)
            }}
            onNext={() => {
              const d = new Date(calendarDate)
              d.setDate(d.getDate() + 3)
              setCalendarDate(d)
            }}
          />
        </div>

      </div>
    </div>
  )
}
