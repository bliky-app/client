import { CheckCircle2, Clock } from "lucide-react"
import IconBox from "@/components/ui/IconBox"
import Badge from "@/components/ui/Badge"

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
          <span className="text-xs font-medium text-panel-text-muted">Статус записи</span>
          <span className={`text-base font-bold truncate ${isConfirmed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {isConfirmed ? "Подтверждена" : "Ожидает"}
          </span>
        </div>
      </div>

      {canEdit && onToggleConfirm && (
        <Badge
          variant={isConfirmed ? "warning" : "success"}
          onClick={onToggleConfirm}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl shrink-0"
        >
          {isConfirmed ? "Снять" : "Подтвердить"}
        </Badge>
      )}
    </div>
  )
}
export default AppointmentStatusCard
