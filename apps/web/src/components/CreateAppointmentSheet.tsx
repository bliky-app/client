import { useState, useEffect, useRef } from "react"
import { X, Search, ChevronDown, Check, UserPlus, Plus } from "lucide-react"
import type { Workspace } from "@/types/models"

const ACCENT_COLORS = [
  "#6366f1", "#8b5cf6", "#d946ef", "#ec4899",
  "#f43f5e", "#ef4444", "#f97316", "#eab308",
  "#84cc16", "#22c55e", "#10b981", "#14b8a6",
  "#06b6d4", "#0ea5e9", "#3b82f6", "#64748b",
]

const MOCK_SERVICES = [
  { 
    id: "srv-1", 
    name: "Стрижка женская", 
    price: 1500,
    stages: [{ id: "st-1", name: "Стрижка и укладка", durationMinutes: 60 }] 
  },
  { 
    id: "srv-2", 
    name: "Сложное окрашивание", 
    price: 4000,
    stages: [
      { id: "st-1", name: "Осветление", durationMinutes: 60 },
      { id: "st-2", name: "Тонирование", durationMinutes: 45 },
      { id: "st-3", name: "Укладка", durationMinutes: 15 }
    ]
  },
  { 
    id: "srv-3", 
    name: "Маникюр с покрытием", 
    price: 2000,
    stages: [{ id: "st-1", name: "Маникюр", durationMinutes: 90 }] 
  },
]

const MOCK_MASTERS = [
  { id: "me", name: "Я (Александр)", subtitle: "Топ-мастер" },
  { id: "other", name: "Елена", subtitle: "Мастер" },
]

export type ServiceStage = {
  id: string
  name: string
  durationMinutes: number
}

export type AppointmentDraft = {
  workspaceId?: string
  masterId?: string
  clientId?: string
  clientName?: string
  clientPhone?: string
  serviceId?: string
  customService?: {
    name: string
  }
  stages?: ServiceStage[]
  startDateTime?: string
  price?: number
  color?: string
  notes?: string
}

interface CreateAppointmentSheetProps {
  isOpen: boolean
  onClose: () => void
  initialData?: AppointmentDraft
  workspaces?: Workspace[]
}

function SearchableSelect({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  searchPlaceholder = "Поиск...",
  disabled = false,
  showCustomOption = false,
  customOptionLabel = "Другое",
}: {
  value: string | undefined
  onChange: (val: string) => void
  options: { id: string, name: string, subtitle?: string }[]
  placeholder: string
  searchPlaceholder?: string
  disabled?: boolean
  showCustomOption?: boolean
  customOptionLabel?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filtered = options.filter(o => o.name.toLowerCase().includes(search.toLowerCase()))
  const selected = options.find(o => o.id === value) || (value === "custom" ? { id: "custom", name: customOptionLabel } : undefined)

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-panel-surface border border-panel-border rounded-xl px-4 py-3 flex items-center justify-between hover:border-panel-text-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:border-panel-text"
      >
        <span className={`text-sm ${selected ? "text-panel-text font-medium" : "text-panel-text-subtle"}`}>
          {selected ? selected.name : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-panel-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-panel-base border border-panel-border-subtle rounded-xl shadow-lg z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 max-h-64">
          <div className="p-2 border-b border-panel-border-subtle shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-panel-text-subtle" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-panel-surface rounded-lg pl-9 pr-3 py-2 text-sm text-panel-text outline-none focus:border-panel-text border border-transparent transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-1">
            {showCustomOption && (
              <button
                onClick={() => { onChange("custom"); setIsOpen(false); setSearch("") }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-panel-surface transition-colors text-left group mb-1 ${value === "custom" ? "bg-panel-surface" : ""}`}
              >
                <div className="w-10 h-10 rounded-full bg-panel-text text-panel-base flex items-center justify-center font-medium group-hover:scale-105 transition-transform shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium text-panel-text">{customOptionLabel}</span>
                  <span className="text-xs text-panel-text-muted">Ввести вручную</span>
                </div>
                {value === "custom" && <Check className="w-4 h-4 text-panel-text shrink-0" />}
              </button>
            )}

            {filtered.length === 0 ? (
              <div className="p-4 text-center text-sm text-panel-text-subtle">Ничего не найдено</div>
            ) : (
              <>
                {filtered.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { onChange(opt.id); setIsOpen(false); setSearch("") }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-panel-surface transition-colors text-left ${value === opt.id ? "bg-panel-surface" : ""}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-panel-text">{opt.name}</span>
                      {opt.subtitle && <span className="text-xs text-panel-text-muted">{opt.subtitle}</span>}
                    </div>
                    {value === opt.id && <Check className="w-4 h-4 text-panel-text" />}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CreateAppointmentSheet({ isOpen, onClose, initialData, workspaces }: CreateAppointmentSheetProps) {
  const [draft, setDraft] = useState<AppointmentDraft>({})
  
  const [isClientSearchActive, setIsClientSearchActive] = useState(true)
  const [clientSearch, setClientSearch] = useState("")
  const [newClientName, setNewClientName] = useState("")
  const [newClientPhone, setNewClientPhone] = useState("")
  const [phoneError, setPhoneError] = useState("")

  useEffect(() => {
    if (isOpen) {
      setDraft(initialData || {})
      setIsClientSearchActive(!initialData?.clientId)
    } else {
      setClientSearch("")
      setNewClientName("")
      setNewClientPhone("")
      setPhoneError("")
      setIsClientSearchActive(true)
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) {
      setPhoneError("Введите корректный номер телефона")
      return false
    }
    setPhoneError("")
    return true
  }

  const handleStageDurationChange = (stageId: string, deltaMinutes: number) => {
    setDraft(prev => {
      const newStages = prev.stages?.map(st => {
        if (st.id === stageId) {
          return { ...st, durationMinutes: Math.max(0, st.durationMinutes + deltaMinutes) }
        }
        return st
      })
      return { ...prev, stages: newStages }
    })
  }

  const handleStageDurationInput = (stageId: string, hours: number, minutes: number) => {
    setDraft(prev => {
      const newStages = prev.stages?.map(st => {
        if (st.id === stageId) {
          return { ...st, durationMinutes: Math.max(0, hours * 60 + minutes) }
        }
        return st
      })
      return { ...prev, stages: newStages }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full h-[calc(100svh-64px)] bg-panel-base rounded-t-[32px] shadow-[0_-8px_32px_rgba(0,0,0,0.18)] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
        
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 shrink-0 border-b border-panel-border-subtle bg-panel-base">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-panel-text leading-tight">
              Новая запись
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-panel-text-muted hover:text-panel-text hover:bg-panel-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex flex-col gap-10 max-w-2xl mx-auto w-full pb-32">
            
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Пространство</h3>
              <SearchableSelect
                value={draft.workspaceId}
                onChange={val => setDraft({ ...draft, workspaceId: val, masterId: undefined, serviceId: undefined, stages: undefined, price: undefined })}
                options={workspaces?.map(w => ({ id: w.id, name: w.name })) || []}
                placeholder="Выберите пространство..."
              />
            </div>

            {draft.workspaceId && (
              <>
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Клиент</h3>
                  
                  {isClientSearchActive ? (
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-panel-text-subtle" />
                        <input 
                          type="text" 
                          placeholder="Имя или телефон..."
                          value={clientSearch}
                          onChange={(e) => {
                            setClientSearch(e.target.value)
                            setNewClientName(e.target.value.replace(/[\d+()-]/g, "").trim())
                            const phoneMatch = e.target.value.match(/[\d+()-]+/)
                            if (phoneMatch) setNewClientPhone(phoneMatch[0])
                          }}
                          className="w-full bg-panel-surface border border-panel-border rounded-xl pl-11 pr-4 py-3 text-sm text-panel-text placeholder:text-panel-text-subtle outline-none focus:border-panel-text transition-colors"
                        />
                        {clientSearch && (
                          <button 
                            onClick={() => { setClientSearch(""); setNewClientName(""); setNewClientPhone(""); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-panel-text-muted hover:text-panel-text"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      {clientSearch && draft.clientId !== "new_pending" && (
                        <div className="flex flex-col gap-2 bg-panel-surface border border-panel-border-subtle rounded-xl p-2 mt-2 shadow-sm animate-in fade-in slide-in-from-top-2">
                          <button 
                            onClick={() => {
                              setDraft({ ...draft, clientId: "new_pending" })
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-panel-base transition-colors border border-transparent hover:border-panel-border-subtle text-left group"
                          >
                            <div className="w-10 h-10 rounded-full bg-panel-text text-panel-base flex items-center justify-center font-medium group-hover:scale-105 transition-transform">
                              <UserPlus className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-panel-text">Создать нового клиента</span>
                              <span className="text-xs text-panel-text-muted">Заполнить имя и телефон</span>
                            </div>
                          </button>
                          
                          <button 
                            onClick={() => {
                              setDraft({ ...draft, clientId: "client-1", clientName: "Алина Смирнова", clientPhone: "+7 (999) 123-45-67" })
                              setIsClientSearchActive(false)
                              setClientSearch("")
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-panel-base transition-colors border border-transparent hover:border-panel-border-subtle text-left"
                          >
                            <div className="w-10 h-10 rounded-full bg-panel-border-subtle flex items-center justify-center font-medium text-panel-text">
                              А
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-panel-text">Алина Смирнова</span>
                              <span className="text-xs text-panel-text-muted">+7 (999) 123-45-67</span>
                            </div>
                          </button>
                        </div>
                      )}

                      {draft.clientId === "new_pending" && (
                        <div className="flex flex-col gap-4 p-5 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 mt-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-panel-text">Новый клиент</h4>
                            <button 
                              onClick={() => setDraft({ ...draft, clientId: undefined })}
                              className="text-xs font-medium text-panel-text-muted hover:text-panel-text transition-colors"
                            >
                              Отмена
                            </button>
                          </div>
                          <div className="flex flex-col gap-3">
                            <input 
                              type="text" 
                              placeholder="Имя"
                              value={newClientName}
                              onChange={e => setNewClientName(e.target.value)}
                              className="w-full bg-panel-base border border-panel-border rounded-xl px-4 py-3 text-sm text-panel-text outline-none focus:border-panel-text transition-colors"
                            />
                            <div className="flex flex-col gap-1">
                              <input 
                                type="tel" 
                                placeholder="Телефон (например, +7 999 000 00 00)"
                                value={newClientPhone}
                                onChange={e => {
                                  setNewClientPhone(e.target.value)
                                  setPhoneError("")
                                }}
                                className={`w-full bg-panel-base border rounded-xl px-4 py-3 text-sm text-panel-text outline-none transition-colors ${phoneError ? 'border-red-500/50 focus:border-red-500' : 'border-panel-border focus:border-panel-text'}`}
                              />
                              {phoneError && <span className="text-xs text-red-500 pl-1">{phoneError}</span>}
                            </div>
                            <button 
                              onClick={() => {
                                if (newClientName && validatePhone(newClientPhone)) {
                                  setDraft({ ...draft, clientId: "new", clientName: newClientName, clientPhone: newClientPhone })
                                  setIsClientSearchActive(false)
                                  setClientSearch("")
                                }
                              }}
                              disabled={!newClientName || !newClientPhone}
                              className="mt-2 w-full py-3 rounded-xl bg-panel-text text-panel-base font-semibold text-sm transition-opacity disabled:opacity-50"
                            >
                              Сохранить клиента
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-hub-text/10 text-hub-text flex items-center justify-center font-medium text-lg shrink-0">
                          {draft.clientName?.[0]?.toUpperCase() || "К"}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-base font-semibold text-panel-text truncate">{draft.clientName}</span>
                          <span className="text-sm text-panel-text-muted truncate">{draft.clientPhone || "Телефон не указан"}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsClientSearchActive(true)}
                        className="px-4 py-2 bg-panel-base border border-panel-border-subtle hover:border-panel-text-muted rounded-xl text-sm font-medium text-panel-text transition-colors shrink-0"
                      >
                        Изменить
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Мастер</h3>
                    <SearchableSelect
                      value={draft.masterId}
                      onChange={val => setDraft({ ...draft, masterId: val })}
                      options={MOCK_MASTERS}
                      placeholder="Выберите мастера..."
                      searchPlaceholder="Поиск мастера..."
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Начало</h3>
                    <input 
                      type="datetime-local"
                      value={draft.startDateTime || ""}
                      onChange={e => setDraft({ ...draft, startDateTime: e.target.value })}
                      className="w-full bg-panel-surface border border-panel-border rounded-xl px-4 py-3 text-sm text-panel-text outline-none focus:border-panel-text transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Услуга</h3>
                  
                  <SearchableSelect
                    value={draft.serviceId}
                    onChange={val => {
                      if (val === "custom") {
                        setDraft({ 
                          ...draft, 
                          serviceId: "custom", 
                          customService: { name: "" },
                          price: undefined,
                          stages: [{ id: "custom-stage-1", name: "Общее время", durationMinutes: 60 }]
                        })
                      } else {
                        const srv = MOCK_SERVICES.find(s => s.id === val)
                        if (srv) {
                          setDraft({ 
                            ...draft, 
                            serviceId: srv.id, 
                            customService: undefined,
                            price: srv.price,
                            stages: srv.stages
                          })
                        }
                      }
                    }}
                    options={MOCK_SERVICES.map(s => ({
                      id: s.id,
                      name: s.name,
                      subtitle: `${s.stages.reduce((acc, st) => acc + st.durationMinutes, 0)} мин • ${s.price} ₽`
                    }))}
                    placeholder="Выберите услугу..."
                    searchPlaceholder="Поиск услуги..."
                    showCustomOption={true}
                    customOptionLabel="Свободная услуга"
                  />

                  {draft.serviceId === "custom" && draft.customService && (
                    <div className="mt-2 p-5 bg-panel-surface border border-panel-border-subtle rounded-2xl flex flex-col gap-5 animate-in slide-in-from-top-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-panel-text-muted uppercase tracking-wider">Название услуги</label>
                        <input 
                          type="text" 
                          value={draft.customService.name}
                          onChange={e => setDraft({ ...draft, customService: { ...draft.customService!, name: e.target.value }})}
                          placeholder="Например: Сложное окрашивание..."
                          className="w-full bg-panel-base border border-panel-border rounded-xl px-4 py-3 text-sm text-panel-text outline-none focus:border-panel-text transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {draft.serviceId && draft.stages && (
                  <div className="flex flex-col gap-6 pt-2 border-t border-panel-border-subtle mt-4">
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Длительность этапов</h3>
                          <span className="text-xs font-semibold px-2 py-1 bg-panel-surface border border-panel-border rounded-lg text-panel-text">
                            Итог: {Math.floor((draft.stages?.reduce((acc, st) => acc + st.durationMinutes, 0) || 0) / 60)}ч {(draft.stages?.reduce((acc, st) => acc + st.durationMinutes, 0) || 0) % 60}м
                          </span>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {draft.stages.map((stage) => {
                            const h = Math.floor(stage.durationMinutes / 60)
                            const m = stage.durationMinutes % 60
                            return (
                              <div key={stage.id} className="p-3 bg-panel-surface border border-panel-border-subtle rounded-xl flex items-center justify-between gap-4">
                                <span className="text-sm font-medium text-panel-text flex-1 truncate" title={stage.name}>{stage.name}</span>
                                
                                <div className="flex items-center gap-2 shrink-0">
                                  <button 
                                    onClick={() => handleStageDurationChange(stage.id, -15)}
                                    className="w-7 h-7 rounded-full bg-panel-base border border-panel-border flex items-center justify-center hover:border-panel-text-muted transition-colors active:scale-95 text-panel-text font-medium"
                                  >
                                    -
                                  </button>
                                  <div className="flex items-center justify-center gap-1 w-20">
                                    <input 
                                      type="number" 
                                      value={h} 
                                      onChange={(e) => handleStageDurationInput(stage.id, parseInt(e.target.value) || 0, m)}
                                      className="w-6 text-center bg-transparent border-b border-panel-border-subtle focus:border-panel-text outline-none text-sm font-semibold text-panel-text p-0" 
                                    />
                                    <span className="text-xs text-panel-text-muted">ч</span>
                                    <input 
                                      type="number" 
                                      value={m} 
                                      onChange={(e) => handleStageDurationInput(stage.id, h, parseInt(e.target.value) || 0)}
                                      className="w-6 text-center bg-transparent border-b border-panel-border-subtle focus:border-panel-text outline-none text-sm font-semibold text-panel-text p-0" 
                                    />
                                    <span className="text-xs text-panel-text-muted">м</span>
                                  </div>
                                  <button 
                                    onClick={() => handleStageDurationChange(stage.id, 15)}
                                    className="w-7 h-7 rounded-full bg-panel-base border border-panel-border flex items-center justify-center hover:border-panel-text-muted transition-colors active:scale-95 text-panel-text font-medium"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Стоимость (₽)</h3>
                        <input 
                          type="number"
                          value={draft.price || ""}
                          onChange={e => setDraft({ ...draft, price: Number(e.target.value) })}
                          placeholder="0"
                          className="w-full bg-panel-surface border border-panel-border rounded-xl px-4 py-3 text-sm font-medium text-panel-text outline-none focus:border-panel-text transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Цвет записи</h3>
                  <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setDraft({ ...draft, color })}
                        className={`w-10 h-10 rounded-full transition-all duration-150 active:scale-90 ${
                          draft.color === color
                            ? "ring-2 ring-offset-2 ring-panel-text scale-110 shadow-md"
                            : "hover:scale-110 shadow-sm border border-black/5"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}

                    <label className="w-10 h-10 rounded-full border border-dashed border-panel-border cursor-pointer flex items-center justify-center hover:border-panel-text-muted transition-colors overflow-hidden relative active:scale-95 shadow-sm bg-panel-surface">
                      <span className="text-sm font-medium text-panel-text-subtle select-none">+</span>
                      <input
                        type="color"
                        value={draft.color || "#000000"}
                        onChange={e => setDraft({ ...draft, color: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Примечания</h3>
                  <textarea 
                    value={draft.notes || ""}
                    onChange={e => setDraft({ ...draft, notes: e.target.value })}
                    placeholder="Дополнительная информация для мастера..."
                    rows={3}
                    className="w-full bg-panel-surface border border-panel-border rounded-xl px-4 py-3 text-sm text-panel-text placeholder:text-panel-text-subtle outline-none focus:border-panel-text transition-colors resize-none"
                  />
                </div>
              </>
            )}
            
          </div>
        </div>

        <div className="px-6 py-5 shrink-0 border-t border-panel-border-subtle bg-panel-base">
          <div className="max-w-2xl mx-auto w-full">
            <button 
              onClick={() => {
                onClose()
              }}
              disabled={!draft.workspaceId || !draft.clientId || !draft.masterId || !draft.serviceId}
              className="w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-panel-text text-panel-base hover:opacity-90 active:scale-[0.98]"
            >
              Создать запись
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
