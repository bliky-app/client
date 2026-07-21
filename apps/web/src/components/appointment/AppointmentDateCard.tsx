import { Calendar as CalendarIcon } from "lucide-react"
import { formatAppointmentDate, formatDuration, formatTime, addMinutes } from "@/lib/formatters"
import IconBox from "@workspace/ui/components/IconBox"

interface AppointmentDateCardProps {
  startDateTime?: string
  totalDurationMinutes?: number
  workspaceTimezone?: string
  isEditable?: boolean
  onChange?: (val: string) => void
  actionLabel?: string
  placeholder?: string
}

export function AppointmentDateCard({
  startDateTime,
  totalDurationMinutes = 60,
  workspaceTimezone = "Europe/Moscow",
  isEditable = false,
  onChange,
  actionLabel = "Изменить",
  placeholder = "Выберите время...",
}: AppointmentDateCardProps) {
  const formattedDate = startDateTime ? formatAppointmentDate(startDateTime, workspaceTimezone) : ""
  const startTimeStr = startDateTime ? formatTime(startDateTime, workspaceTimezone) : ""
  const endTimeStr = startDateTime ? formatTime(addMinutes(startDateTime, totalDurationMinutes), workspaceTimezone) : ""

  return (
    <label className="relative flex items-center justify-between p-4 bg-panel-surface border border-panel-border-subtle hover:border-panel-text-muted transition-colors rounded-2xl shadow-sm cursor-pointer group w-full">
      {isEditable && onChange && (
        <input
          type="datetime-local"
          value={startDateTime || ""}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      )}
      <div className="flex items-center gap-3 min-w-0">
        <IconBox size="lg" shape="squircle">
          <CalendarIcon className="w-5 h-5" />
        </IconBox>
        <div className="flex flex-col min-w-0">
          {startDateTime ? (
            <>
              <span className="text-base font-semibold text-panel-text capitalize truncate">
                {formattedDate}
              </span>
              <span className="text-sm text-panel-text-muted truncate">
                {startTimeStr} — {endTimeStr} • {formatDuration(totalDurationMinutes)}
              </span>
            </>
          ) : (
            <span className="text-base font-medium text-panel-text-subtle truncate">
              {placeholder}
            </span>
          )}
        </div>
      </div>

      {isEditable && (
        <div className="px-4 py-2 bg-panel-base border border-panel-border-subtle group-hover:border-panel-text-muted rounded-xl text-sm font-medium text-panel-text transition-colors shrink-0">
          {startDateTime ? actionLabel : "Выбрать"}
        </div>
      )}
    </label>
  )
}
export default AppointmentDateCard
