import { Plus, Calendar as CalendarIcon } from "lucide-react"
import type { Workspace } from "@/types/models"
import Select from "@/components/ui/Select"
import SectionCard from "@/components/ui/SectionCard"

export type QuickActionContext = "hub" | "workspace_schedule"

export interface QuickActionDraft {
  masterId?: string
  workspaceId?: string
  serviceId?: string
  startDateTime?: string
}

interface QuickActionsRowProps {
  context: QuickActionContext
  workspaces?: Workspace[]
  masters?: { id: string, name: string, subtitle?: string, color?: string, avatarUrl?: string }[]
  services?: { id: string, name: string, subtitle?: string }[]
  showMasterCard?: boolean
  onOpenForm: (draft: QuickActionDraft) => void
}

function DatePickerCard({ onOpenForm }: { onOpenForm: (draft: QuickActionDraft) => void }) {
  return (
    <div className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle relative group">
      <div className="flex justify-between items-start w-full gap-2 pointer-events-none">
        <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
          Ко времени
        </h3>
      </div>
      <div className="mt-auto relative z-10 w-full">
        <div className="relative">
          <button className="w-full text-left bg-panel-base border border-panel-border-subtle rounded-xl px-3 py-2 text-xs font-medium text-panel-text-muted group-hover:text-panel-text group-hover:border-panel-text-muted transition-colors flex items-center justify-between pointer-events-none">
            <span>Выбрать</span>
            <CalendarIcon className="w-4 h-4 shrink-0" />
          </button>
          <input
            type="datetime-local"
            onChange={(e) => { if (e.target.value) onOpenForm({ startDateTime: e.target.value }) }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer block"
          />
        </div>
      </div>
    </div>
  )
}

export default function QuickActionsRow({
  context,
  workspaces = [],
  masters = [],
  services = [],
  showMasterCard = true,
  onOpenForm,
}: QuickActionsRowProps) {
  return (
    <SectionCard title="Быстрая запись">
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-6 pt-2 w-full scroll-pl-6 scrollbar-none">

        {/* Новая запись */}
        <div
          onClick={() => onOpenForm({})}
          className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 active:scale-[0.97] transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle cursor-pointer group hover:border-panel-text-muted"
        >
          <div className="flex justify-between items-start w-full gap-2 pointer-events-none">
            <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
              Новая запись
            </h3>
          </div>
          <div className="mt-auto relative z-10 w-full">
            <button className="w-full text-left bg-panel-base border border-panel-border-subtle rounded-xl px-3 py-2 text-xs font-medium text-panel-text-muted group-hover:text-panel-text group-hover:border-panel-text-muted transition-colors flex items-center justify-between pointer-events-none">
              <span>Создать</span>
              <Plus className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>

        {/* В пространство (только Hub) */}
        {context === "hub" && (
          <div className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle relative group">
            <div className="flex justify-between items-start w-full gap-2 pointer-events-none">
              <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
                В пространство
              </h3>
            </div>
            <div className="mt-auto relative z-10 w-full">
              <Select
                compact
                placeholder="Выбрать"
                options={workspaces.map(w => ({ value: w.id, label: w.name, subtitle: w.address, color: w.color, avatarUrl: w.avatarUrl }))}
                onChange={(val) => onOpenForm({ workspaceId: val })}
              />
            </div>
          </div>
        )}

        {/* К мастеру */}
        {context === "workspace_schedule" && showMasterCard && (
          <div className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle relative group">
            <div className="flex justify-between items-start w-full gap-2 pointer-events-none">
              <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
                К мастеру
              </h3>
            </div>
            <div className="mt-auto relative z-10 w-full">
              <Select
                compact
                placeholder="Выбрать"
                options={masters.map(m => ({ value: m.id, label: m.name, subtitle: m.subtitle, color: m.color, avatarUrl: m.avatarUrl }))}
                onChange={(val) => onOpenForm({ masterId: val })}
              />
            </div>
          </div>
        )}

        {/* На услугу */}
        {context === "workspace_schedule" && (
          <div className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle relative group">
            <div className="flex justify-between items-start w-full gap-2 pointer-events-none">
              <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
                На услугу
              </h3>
            </div>
            <div className="mt-auto relative z-10 w-full">
              <Select
                compact
                hideIcon
                placeholder="Выбрать"
                options={services.map(s => ({ value: s.id, label: s.name, subtitle: s.subtitle }))}
                onChange={(val) => onOpenForm({ serviceId: val })}
              />
            </div>
          </div>
        )}

        {/* Ко времени */}
        <DatePickerCard onOpenForm={onOpenForm} />

        <div className="w-px shrink-0" />
      </div>
    </SectionCard>
  )
}
