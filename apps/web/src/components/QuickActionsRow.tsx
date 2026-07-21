import { useState } from "react"
import { ChevronRight, Plus, UserRound, Clock, Sparkles, Layers } from "lucide-react"

export type QuickActionContext = "hub" | "workspace_schedule"

export interface QuickActionDraft {
  masterId?: string
  workspaceId?: string
  serviceId?: string
  startDateTime?: string
}

interface QuickActionsRowProps {
  context: QuickActionContext
  onOpenForm: (draft: QuickActionDraft) => void
}

export default function QuickActionsRow({ context, onOpenForm }: QuickActionsRowProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // We need local state for the selects so they don't immediately fire on change,
  // or maybe they DO immediately fire on change. The user says: 
  // "после выбора конкретной сущность открывается форма создания записи с выбранным вариантом."
  // This means changing the select triggers the action.

  return (
    <div className="flex flex-col bg-panel-surface border border-panel-border rounded-[32px] shadow-sm overflow-hidden shrink-0">
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-panel-surface-hover transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold text-panel-text">Быстрая запись</h2>
        <button className="p-2 -mr-2 text-panel-text-muted hover:text-panel-text transition-colors rounded-full">
          <div className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </button>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-6 pt-2 w-full scroll-pl-6 scrollbar-none">
            
            {/* Обычная запись */}
            <div
              onClick={() => onOpenForm({})}
              className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 active:scale-[0.97] transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle cursor-pointer group hover:border-panel-text-muted"
            >
              <div className="flex justify-between items-start w-full gap-2">
                <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
                  Новая запись
                </h3>
                <Plus className="h-5 w-5 text-panel-text-subtle shrink-0 translate-y-0.5 group-hover:text-panel-text transition-colors" />
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <div className="h-9 w-9 rounded-xl bg-panel-base border border-panel-border-subtle flex items-center justify-center shrink-0">
                  <Plus className="h-4 w-4 text-panel-text-muted" />
                </div>
                <div className="flex flex-col min-w-0 pb-0.5">
                  <span className="text-xs text-panel-text-muted-dark font-medium line-clamp-2 mt-0.5 leading-tight">
                    Просто создать
                  </span>
                </div>
              </div>
            </div>

            {/* В пространство (только Hub) */}
            {context === "hub" && (
              <div className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle relative group">
                <div className="flex justify-between items-start w-full gap-2 pointer-events-none">
                  <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
                    В пространство
                  </h3>
                  <ChevronRight className="h-5 w-5 text-panel-text-subtle shrink-0 translate-y-0.5" />
                </div>
                <div className="flex items-center gap-3 mt-auto relative z-10">
                  <div className="h-9 w-9 rounded-xl bg-panel-base border border-panel-border-subtle flex items-center justify-center shrink-0">
                    <Layers className="h-4 w-4 text-panel-text-muted" />
                  </div>
                  <div className="flex flex-col min-w-0 pb-0.5 w-full">
                    <select
                      onChange={(e) => {
                        if (e.target.value) onOpenForm({ workspaceId: e.target.value })
                        e.target.value = "" // reset select
                      }}
                      className="w-full text-xs text-panel-text-muted-dark font-medium mt-0.5 leading-tight bg-transparent outline-none cursor-pointer appearance-none truncate"
                    >
                      <option value="" disabled selected>Выбрать...</option>
                      <option value="ws-1">Моё пространство</option>
                      <option value="ws-2">Барбершоп</option>
                    </select>
                  </div>
                </div>
                {/* Invisible absolute overlay to trigger full card click? No, we have a select inside. */}
              </div>
            )}

            {/* К мастеру (только Workspace Schedule) */}
            {context === "workspace_schedule" && (
              <div className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle relative group">
                <div className="flex justify-between items-start w-full gap-2 pointer-events-none">
                  <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
                    К мастеру
                  </h3>
                  <ChevronRight className="h-5 w-5 text-panel-text-subtle shrink-0 translate-y-0.5" />
                </div>
                <div className="flex items-center gap-3 mt-auto relative z-10">
                  <div className="h-9 w-9 rounded-xl bg-panel-base border border-panel-border-subtle flex items-center justify-center shrink-0">
                    <UserRound className="h-4 w-4 text-panel-text-muted" />
                  </div>
                  <div className="flex flex-col min-w-0 pb-0.5 w-full">
                    <select
                      onChange={(e) => {
                        if (e.target.value) onOpenForm({ masterId: e.target.value })
                        e.target.value = ""
                      }}
                      className="w-full text-xs text-panel-text-muted-dark font-medium mt-0.5 leading-tight bg-transparent outline-none cursor-pointer appearance-none truncate"
                    >
                      <option value="" disabled selected>Выбрать...</option>
                      <option value="me">Я (Александр)</option>
                      <option value="other">Елена</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* На услугу */}
            <div className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle relative group">
              <div className="flex justify-between items-start w-full gap-2 pointer-events-none">
                <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
                  На услугу
                </h3>
                <ChevronRight className="h-5 w-5 text-panel-text-subtle shrink-0 translate-y-0.5" />
              </div>
              <div className="flex items-center gap-3 mt-auto relative z-10">
                <div className="h-9 w-9 rounded-xl bg-panel-base border border-panel-border-subtle flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-panel-text-muted" />
                </div>
                <div className="flex flex-col min-w-0 pb-0.5 w-full">
                  <select
                    onChange={(e) => {
                      if (e.target.value) onOpenForm({ serviceId: e.target.value })
                      e.target.value = ""
                    }}
                    className="w-full text-xs text-panel-text-muted-dark font-medium mt-0.5 leading-tight bg-transparent outline-none cursor-pointer appearance-none truncate"
                  >
                    <option value="" disabled selected>Выбрать...</option>
                    <option value="Стрижка">Стрижка</option>
                    <option value="Окрашивание">Окрашивание</option>
                    <option value="custom">Свободная услуга</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ко времени */}
            <div className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle relative group">
              <div className="flex justify-between items-start w-full gap-2 pointer-events-none">
                <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
                  Ко времени
                </h3>
                <ChevronRight className="h-5 w-5 text-panel-text-subtle shrink-0 translate-y-0.5" />
              </div>
              <div className="flex items-center gap-3 mt-auto relative z-10">
                <div className="h-9 w-9 rounded-xl bg-panel-base border border-panel-border-subtle flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-panel-text-muted" />
                </div>
                <div className="flex flex-col min-w-0 pb-0.5 w-full">
                  <input
                    type="datetime-local"
                    onChange={(e) => {
                      if (e.target.value) onOpenForm({ startDateTime: e.target.value })
                    }}
                    className="w-full text-xs text-panel-text-muted-dark font-medium mt-0.5 leading-tight bg-transparent outline-none cursor-pointer appearance-none truncate"
                  />
                </div>
              </div>
            </div>

            <div className="w-px shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
