import { CheckCircle2, Clock } from "lucide-react"
import IconBox from "@/components/ui/IconBox"

interface AppointmentStatusCardProps {
  isConfirmed: boolean
  canEdit?: boolean
  onToggleConfirm?: () => void
}

export function AppointmentStatusCard({
  isConfirmed,
  canEdit = false,
  onToggleConfirm,
}: AppointmentStatusCardProps) {
  return (
    <div className="p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm flex items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <IconBox size="lg" shape="squircle" className="bg-panel-base">
          {isConfirmed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Clock className="w-5 h-5 text-amber-500" />
          )}
        </IconBox>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium text-panel-text-muted">Статус</span>
          <span
            className={`text-sm font-semibold truncate ${
              isConfirmed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {isConfirmed ? "Подтверждена" : "Не подтверждена"}
          </span>
        </div>
      </div>

      {canEdit && onToggleConfirm && (
        <button
          type="button"
          role="switch"
          aria-checked={isConfirmed}
          onClick={onToggleConfirm}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isConfirmed ? "bg-emerald-500" : "bg-panel-border"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              isConfirmed ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      )}
    </div>
  )
}

export default AppointmentStatusCard
