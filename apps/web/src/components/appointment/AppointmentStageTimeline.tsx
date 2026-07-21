import type { ServiceStage } from "@/types/models"
import { formatTime, formatDuration, addMinutes } from "@/lib/formatters"

interface AppointmentStageTimelineProps {
  stages: ServiceStage[]
  startDateTime: string
  totalDurationMinutes: number
  workspaceTimezone?: string
  isEditable?: boolean
  onStageDurationChange?: (stageId: string, deltaMinutes: number) => void
  onStageDurationInput?: (stageId: string, hours: number, minutes: number) => void
}

export function AppointmentStageTimeline({
  stages,
  startDateTime,
  totalDurationMinutes,
  workspaceTimezone = "Europe/Moscow",
  isEditable = false,
  onStageDurationChange,
  onStageDurationInput,
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
        const h = Math.floor((stage.durationMinutes || 0) / 60)
        const m = (stage.durationMinutes || 0) % 60

        return (
          <div key={stage.id || idx} className="flex gap-4 min-h-11 items-start">
            <div className="flex flex-col items-center self-stretch">
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

            <div className="flex items-center justify-between flex-1 pb-3 gap-3 min-w-0">
              <div className="flex flex-col min-w-0 flex-1">
                <span
                  className={`text-sm font-semibold leading-tight truncate ${
                    isActive ? "text-panel-text" : "text-panel-text-muted"
                  }`}
                >
                  {stage.name}
                </span>
                <span className="text-xs text-panel-text-subtle mt-0.5 flex items-center gap-1.5">
                  {stageStartTimeStr && <span className="font-medium text-panel-text-muted">≈ {stageStartTimeStr}</span>}
                  {!isEditable && stage.durationMinutes !== undefined && (
                    <>
                      {stageStartTimeStr && <span>•</span>}
                      <span>{formatDuration(stage.durationMinutes)}</span>
                    </>
                  )}
                </span>
              </div>

              {isEditable && onStageDurationChange && onStageDurationInput && (
                <div className="flex items-center gap-1 shrink-0 bg-panel-base border border-panel-border-subtle rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => onStageDurationChange(stage.id, -15)}
                    className="w-6 h-6 rounded-lg bg-panel-surface border border-panel-border-subtle flex items-center justify-center hover:border-panel-text-muted transition-colors active:scale-95 text-panel-text font-bold text-xs"
                  >
                    -
                  </button>

                  <div className="flex items-center justify-center gap-0.5 px-1">
                    <input
                      type="number"
                      value={h || ""}
                      placeholder="0"
                      onChange={(e) =>
                        onStageDurationInput(
                          stage.id,
                          parseInt(e.target.value) || 0,
                          m
                        )
                      }
                      className="w-5 text-center bg-transparent focus:border-b focus:border-panel-text outline-none text-xs font-semibold text-panel-text p-0"
                    />
                    <span className="text-[10px] font-medium text-panel-text-muted">ч</span>
                    <input
                      type="number"
                      value={m || ""}
                      placeholder="00"
                      onChange={(e) =>
                        onStageDurationInput(
                          stage.id,
                          h,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-6 text-center bg-transparent focus:border-b focus:border-panel-text outline-none text-xs font-semibold text-panel-text p-0"
                    />
                    <span className="text-[10px] font-medium text-panel-text-muted">м</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStageDurationChange(stage.id, 15)}
                    className="w-6 h-6 rounded-lg bg-panel-surface border border-panel-border-subtle flex items-center justify-center hover:border-panel-text-muted transition-colors active:scale-95 text-panel-text font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Completion Stage item with empty circle indicator */}
      <div className="flex gap-4 min-h-8 items-start">
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
