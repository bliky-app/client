import { CheckCircle2, Clock } from "lucide-react"

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
    <div className="p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-panel-base border border-panel-border-subtle flex items-center justify-center shrink-0">
          {isConfirmed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Clock className="w-5 h-5 text-amber-500" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-panel-text-muted">Статус записи</span>
          <span className={`text-base font-bold ${isConfirmed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {isConfirmed ? "Подтверждена" : "Ожидает подтверждения"}
          </span>
        </div>
      </div>

      {canEdit && onToggleConfirm && (
        <button
          type="button"
          onClick={onToggleConfirm}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 border ${
            isConfirmed
              ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
          }`}
        >
          {isConfirmed ? "Снять подтверждение" : "Подтвердить запись"}
        </button>
      )}
    </div>
  )
}
export default AppointmentStatusCard
