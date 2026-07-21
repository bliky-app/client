import type { ServiceStage } from "@/types/models"
import { formatTime, formatDuration, addMinutes } from "@/lib/formatters"

interface AppointmentStageTimelineProps {
  stages: ServiceStage[]
  startDateTime: string
  totalDurationMinutes: number
  workspaceTimezone?: string
}

export function AppointmentStageTimeline({
  stages,
  startDateTime,
  totalDurationMinutes,
  workspaceTimezone = "Europe/Moscow",
}: AppointmentStageTimelineProps) {
  if (!stages || stages.length === 0) return null

  const completionTimeISO = startDateTime ? addMinutes(startDateTime, totalDurationMinutes) : null
  const completionTimeStr = completionTimeISO ? formatTime(completionTimeISO, workspaceTimezone) : null

  return (
    <div className="flex flex-col gap-1 pt-1">
      {stages.map((stage, idx) => {
        let stageStartTimeStr: string | null = null
        const allPrecedingHaveDuration = stages.slice(0, idx).every(s => s.durationMinutes !== undefined)

        if (allPrecedingHaveDuration && startDateTime) {
          const accumulatedMinutes = stages
            .slice(0, idx)
            .reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
          const stageStartTimeISO = addMinutes(startDateTime, accumulatedMinutes)
          stageStartTimeStr = formatTime(stageStartTimeISO, workspaceTimezone)
        }

        const isActive = stage.isActive ?? true

        return (
          <div key={stage.id || idx} className="flex gap-4 min-h-10">
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full mt-1.5 z-10 ${
                  isActive
                    ? "bg-panel-text"
                    : "border-2 border-panel-text-muted/70 bg-panel-surface"
                }`}
              />
              <div
                className={`flex-1 -mt-1.5 mb-1 ${
                  isActive
                    ? "w-0.5 bg-panel-border-subtle"
                    : "w-0 border-l-2 border-dashed border-panel-border-subtle"
                }`}
              />
            </div>

            <div className="flex flex-col pb-3">
              <span
                className={`text-sm font-semibold leading-tight ${
                  isActive ? "text-panel-text" : "text-panel-text-muted"
                }`}
              >
                {stage.name}
              </span>
              <span className="text-xs text-panel-text-subtle mt-0.5 flex items-center gap-1.5">
                {stageStartTimeStr && <span className="font-medium text-panel-text-muted">≈ {stageStartTimeStr}</span>}
                {stageStartTimeStr && stage.durationMinutes !== undefined && <span>•</span>}
                {stage.durationMinutes !== undefined && <span>{formatDuration(stage.durationMinutes)}</span>}
              </span>
            </div>
          </div>
        )
      })}

      {/* Completion Stage item with empty circle indicator */}
      <div className="flex gap-4 min-h-8">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full mt-1.5 z-10 border-2 border-panel-text-muted/60 bg-panel-surface" />
        </div>

        <div className="flex flex-col pb-1">
          <span className="text-sm font-medium leading-tight text-panel-text-muted">
            Завершение
          </span>
          {completionTimeStr && (
            <span className="text-xs text-panel-text-subtle mt-0.5 font-medium">
              ≈ {completionTimeStr}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppointmentStageTimeline
