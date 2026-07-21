import { Phone } from "lucide-react"

interface AppointmentClientCardProps {
  name: string
  phone?: string
  onEdit?: () => void
  actionLabel?: string
}

export function AppointmentClientCard({
  name,
  phone,
  onEdit,
  actionLabel = "Изменить",
}: AppointmentClientCardProps) {
  return (
    <div className="p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm flex items-center justify-between w-full">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-12 h-12 rounded-full bg-panel-text text-panel-base flex items-center justify-center font-bold text-base shrink-0">
          {name?.[0]?.toUpperCase() || "К"}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-base font-semibold text-panel-text truncate">{name}</span>
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 truncate"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{phone}</span>
            </a>
          ) : (
            <span className="text-sm text-panel-text-muted">Телефон не указан</span>
          )}
        </div>
      </div>

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-2 bg-panel-base border border-panel-border-subtle hover:border-panel-text-muted rounded-xl text-sm font-medium text-panel-text transition-colors shrink-0"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
export default AppointmentClientCard
