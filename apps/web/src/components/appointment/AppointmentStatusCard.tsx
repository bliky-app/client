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
    <div className="p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <IconBox size="lg" shape="squircle" className="bg-panel-base">
          {isConfirmed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Clock className="w-5 h-5 text-amber-500" />
          )}
        </IconBox>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-panel-text-muted">Статус записи</span>
          <span className={`text-base font-bold ${isConfirmed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {isConfirmed ? "Подтверждена" : "Ожидает подтверждения"}
          </span>
        </div>
      </div>

      {canEdit && onToggleConfirm && (
        <Badge
          variant={isConfirmed ? "warning" : "success"}
          onClick={onToggleConfirm}
          className="px-4 py-2 text-xs font-semibold"
        >
          {isConfirmed ? "Снять подтверждение" : "Подтвердить запись"}
        </Badge>
      )}
    </div>
  )
}
export default AppointmentStatusCard
