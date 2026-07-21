import { useState, useRef } from "react"
import { createPortal } from "react-dom"
import { ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react"
import type { Workspace } from "@/types/models"

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

function CustomSelect({ placeholder, options, onChange }: { placeholder: string, options: {value: string, label: string, subtitle?: string, color?: string, avatarUrl?: string}[], onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const open = () => {
    if (ref.current) setRect(ref.current.getBoundingClientRect())
    setIsOpen(true)
  }

  return (
    <>
      <button 
        ref={ref} 
        onClick={open} 
        className="w-full text-left bg-panel-base border border-panel-border-subtle rounded-xl px-3 py-2 text-xs font-medium text-panel-text-muted hover:text-panel-text hover:border-panel-text-muted transition-colors flex items-center justify-between"
      >
        <span className="truncate">{placeholder}</span>
        <ChevronRight className="w-4 h-4 shrink-0 rotate-90" />
      </button>
      {isOpen && rect && createPortal(
        <div className="fixed inset-0 z-50 flex" onClick={() => setIsOpen(false)}>
           <div 
             style={{ top: rect.bottom + 8, left: rect.left, width: Math.max(160, rect.width) }} 
             className="absolute bg-panel-surface border border-panel-border rounded-2xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
             onClick={e => e.stopPropagation()}
           >
             {options.length === 0 ? (
                <div className="px-4 py-3 text-xs text-panel-text-muted">Нет вариантов</div>
             ) : options.map(opt => (
                <button 
                  key={opt.value} 
                  className="w-full text-left px-4 py-2.5 hover:bg-panel-surface-hover transition-colors flex items-center gap-3"
                  onClick={() => { setIsOpen(false); onChange(opt.value) }}
                >
                  {opt.avatarUrl ? (
                    <img src={opt.avatarUrl} alt={opt.label} className="w-8 h-8 rounded-full object-cover shrink-0 border border-panel-border-subtle" />
                  ) : (
                    (opt.subtitle || opt.color) ? (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs shrink-0 text-white"
                        style={{ backgroundColor: opt.color || 'var(--panel-text)' }}
                      >
                        {opt.label?.[0]?.toUpperCase()}
                      </div>
                    ) : null 
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-panel-text truncate">{opt.label}</span>
                    {opt.subtitle && <span className="text-xs text-panel-text-muted truncate">{opt.subtitle}</span>}
                  </div>
                </button>
             ))}
           </div>
        </div>,
        document.body
      )}
    </>
  )
}

function DatePickerButton({ placeholder, onChange }: { placeholder: string, onChange: (val: string) => void }) {
  return (
    <div className="relative w-full">
      <button className="w-full text-left bg-panel-base border border-panel-border-subtle rounded-xl px-3 py-2 text-xs font-medium text-panel-text-muted hover:text-panel-text hover:border-panel-text-muted transition-colors flex items-center justify-between pointer-events-none">
        <span>{placeholder}</span>
        <CalendarIcon className="w-4 h-4 shrink-0" />
      </button>
      <input
        type="datetime-local"
        onChange={(e) => { if (e.target.value) onChange(e.target.value) }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer block"
      />
    </div>
  )
}

export default function QuickActionsRow({ context, workspaces = [], masters = [], services = [], showMasterCard = true, onOpenForm }: QuickActionsRowProps) {
  const [isExpanded, setIsExpanded] = useState(true)

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
                  <CustomSelect 
                    placeholder="Выбрать" 
                    options={workspaces.map(w => ({ value: w.id, label: w.name, subtitle: w.address, color: w.color, avatarUrl: w.avatarUrl }))}
                    onChange={(val) => onOpenForm({ workspaceId: val })}
                  />
                </div>
              </div>
            )}

            {/* К мастеру (только Workspace Schedule и если есть права) */}
            {context === "workspace_schedule" && showMasterCard && (
              <div className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle relative group">
                <div className="flex justify-between items-start w-full gap-2 pointer-events-none">
                  <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
                    К мастеру
                  </h3>
                </div>
                <div className="mt-auto relative z-10 w-full">
                  <CustomSelect 
                    placeholder="Выбрать" 
                    options={masters.map(m => ({ value: m.id, label: m.name, subtitle: m.subtitle, color: m.color, avatarUrl: m.avatarUrl }))}
                    onChange={(val) => onOpenForm({ masterId: val })}
                  />
                </div>
              </div>
            )}

            {/* На услугу (убрали из Хаба) */}
            {context === "workspace_schedule" && (
              <div className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle relative group">
                <div className="flex justify-between items-start w-full gap-2 pointer-events-none">
                  <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
                    На услугу
                  </h3>
                </div>
                <div className="mt-auto relative z-10 w-full">
                  <CustomSelect 
                    placeholder="Выбрать" 
                    options={services.map(s => ({ value: s.id, label: s.name, subtitle: s.subtitle }))}
                    onChange={(val) => onOpenForm({ serviceId: val })}
                  />
                </div>
              </div>
            )}

            {/* Ко времени */}
            <div className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle relative group">
              <div className="flex justify-between items-start w-full gap-2 pointer-events-none">
                <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight">
                  Ко времени
                </h3>
              </div>
              <div className="mt-auto relative z-10 w-full">
                <DatePickerButton placeholder="Выбрать" onChange={(val) => onOpenForm({ startDateTime: val })} />
              </div>
            </div>

            <div className="w-px shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
