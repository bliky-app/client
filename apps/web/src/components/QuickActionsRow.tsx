import { UserRound, Clock, Sparkles } from "lucide-react"

export type QuickActionType = "master" | "time" | "service"

interface QuickActionsRowProps {
  onAction: (action: QuickActionType) => void
}

export default function QuickActionsRow({ onAction }: QuickActionsRowProps) {
  return (
    <div className="flex flex-col bg-panel-surface border border-panel-border rounded-[32px] shadow-sm p-4 shrink-0">
      <h2 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider px-2 mb-3">
        Быстрая запись
      </h2>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onAction("master")}
          className="flex flex-col items-center justify-center gap-2 p-3 bg-panel-base hover:bg-panel-surface-hover border border-panel-border-subtle hover:border-panel-text-muted rounded-2xl transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-panel-surface border border-panel-border-subtle flex items-center justify-center text-panel-text group-hover:text-hub-text transition-colors shadow-sm">
            <UserRound className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-panel-text group-hover:text-hub-text text-center leading-tight">
            К мастеру
          </span>
        </button>

        <button
          onClick={() => onAction("time")}
          className="flex flex-col items-center justify-center gap-2 p-3 bg-panel-base hover:bg-panel-surface-hover border border-panel-border-subtle hover:border-panel-text-muted rounded-2xl transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-panel-surface border border-panel-border-subtle flex items-center justify-center text-panel-text group-hover:text-hub-text transition-colors shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-panel-text group-hover:text-hub-text text-center leading-tight">
            Ко времени
          </span>
        </button>

        <button
          onClick={() => onAction("service")}
          className="flex flex-col items-center justify-center gap-2 p-3 bg-panel-base hover:bg-panel-surface-hover border border-panel-border-subtle hover:border-panel-text-muted rounded-2xl transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-panel-surface border border-panel-border-subtle flex items-center justify-center text-panel-text group-hover:text-hub-text transition-colors shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-panel-text group-hover:text-hub-text text-center leading-tight">
            На услугу
          </span>
        </button>
      </div>
    </div>
  )
}
