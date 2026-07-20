import { X, Clock, User, Wallet, Calendar as CalendarIcon, Phone } from "lucide-react"
import Avatar from "@/components/Avatar"
import type { Appointment } from "@/types/models"
import { formatCurrency, addMinutes, formatDuration, formatTime } from "@/lib/formatters"

interface EventPopupProps {
  event: Appointment | null
  onClose: () => void
  workspaceTimezone?: string
}

export default function EventPopup({ event, onClose, workspaceTimezone = "Europe/Moscow" }: EventPopupProps) {
  if (!event) return null

  const totalDuration = event.stages.reduce((acc, stage) => acc + stage.durationMinutes, 0)

  const startTimeStr = formatTime(event.startDateTime, workspaceTimezone)
  const endTimeStr = formatTime(addMinutes(event.startDateTime, totalDuration), workspaceTimezone)

  const eventDate = new Date(event.startDateTime)
  const formattedDate = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: workspaceTimezone
  }).format(eventDate)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-panel-surface rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {event.color && <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: event.color }} />}
              <h2 className="text-xl font-bold text-panel-text leading-tight">
                {event.serviceName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mt-1.5 -mr-2 text-panel-text-subtle hover:text-panel-text-muted hover:bg-panel-surface-hover rounded-full transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-2 text-panel-text-muted-dark font-medium -mt-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span className="capitalize">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{startTimeStr} — {endTimeStr}</span>
              <span className="text-panel-text-subtle">•</span>
              <span>{formatDuration(totalDuration)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 bg-panel-base rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-panel-border-subtle flex items-center justify-center shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${event.isConfirmed ? "bg-green-500" : "bg-yellow-400"}`} />
              </div>
              <span className={`font-medium truncate ${event.isConfirmed ? "text-green-600" : "text-yellow-600"}`}>
                {event.isConfirmed ? "Запись подтверждена" : "Ожидает подтверждения"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-panel-border-subtle flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-panel-text-muted-dark" />
              </div>
              <span className="font-medium text-panel-text truncate">{event.client.name}</span>
            </div>

            {event.client.phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-panel-border-subtle flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-panel-text-muted-dark" />
                </div>
                <a
                  href={`tel:${event.client.phone}`}
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline truncate transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {event.client.phone}
                </a>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-panel-border-subtle flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-panel-text-muted-dark" />
              </div>
              <span className="font-semibold text-panel-text">{formatCurrency(event.price)}</span>
            </div>

            {event.workspace.name && (
              <div className="flex items-center gap-3">
                <Avatar type="workspace" name={event.workspace.name} avatarUrl={event.workspace.avatarUrl} color={event.workspace.color} className="w-8 h-8 rounded-full text-[10px] shrink-0" />
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="font-medium text-panel-text truncate">{event.workspace.name}</span>
                  {event.workspace.address && (
                    <span className="text-xs text-panel-text-muted-dark mt-0.5 truncate">{event.workspace.address}</span>
                  )}
                </div>
              </div>
            )}

            {event.staff && (
              <div className="flex items-center gap-3">
                <Avatar type="user" name={event.staff.shortName || event.staff.user?.shortName || "?"} avatarUrl={event.staff.user?.avatarUrl} color={event.staff.color || event.staff.user?.color} className="w-8 h-8 rounded-full text-[10px] shrink-0" />
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="font-medium text-panel-text truncate">{event.staff.shortName || event.staff.user?.shortName}</span>
                  <span className="text-xs text-panel-text-muted-dark">{event.staff.mainCategory.name}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            {event.stages.map((stage, idx) => {
              const accumulatedMinutes = event.stages
                .slice(0, idx)
                .reduce((acc, s) => acc + s.durationMinutes, 0)

              const stageStartTimeISO = addMinutes(event.startDateTime, accumulatedMinutes)
              const stageStartTimeStr = formatTime(stageStartTimeISO, workspaceTimezone)

              return (
                <div key={stage.id} className="flex gap-4 min-h-12">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1.5 z-10 ${stage.isActive ? 'bg-panel-text' : 'bg-panel-border'}`} />
                    {idx !== event.stages.length - 1 && (
                      <div className={`w-0.5 flex-1 -mt-1.5 mb-1 ${stage.isActive ? 'bg-panel-border-subtle' : 'border-l-2 border-dashed border-panel-border bg-transparent'}`} />
                    )}
                  </div>

                  <div className="flex flex-col pb-5">
                    <span className={`text-base font-medium leading-tight ${stage.isActive ? 'text-panel-text' : 'text-panel-text-muted-dark'}`}>
                      {stage.name}
                    </span>
                    <span className="text-sm text-panel-text-subtle mt-1 flex items-center gap-1.5">
                      <span className="font-medium text-panel-text-muted-dark">≈ {stageStartTimeStr}</span>
                      <span className="text-[10px] text-panel-border">•</span>
                      <span>{formatDuration(stage.durationMinutes)}</span>
                      {!stage.isActive && <span>(Ожидание)</span>}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
