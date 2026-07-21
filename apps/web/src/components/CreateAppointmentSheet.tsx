import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Workspace } from "@/types/models"

const ACCENT_COLORS = [
  "#6366f1", "#8b5cf6", "#d946ef", "#ec4899",
  "#f43f5e", "#ef4444", "#f97316", "#eab308",
  "#84cc16", "#22c55e", "#10b981", "#14b8a6",
  "#06b6d4", "#0ea5e9", "#3b82f6", "#64748b",
]

const MOCK_SERVICES = [
  { id: "srv-1", name: "Стрижка", durationMinutes: 60, price: 1500 },
  { id: "srv-2", name: "Окрашивание", durationMinutes: 120, price: 4000 },
  { id: "srv-3", name: "Маникюр", durationMinutes: 90, price: 2000 },
]

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
  startDateTime?: string
  durationMinutes?: number
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

export default function CreateAppointmentSheet({ isOpen, onClose, initialData, workspaces }: CreateAppointmentSheetProps) {
  const [draft, setDraft] = useState<AppointmentDraft>({})
  const [clientSearch, setClientSearch] = useState("")
  
  // For new client inline form
  const [newClientName, setNewClientName] = useState("")
  const [newClientPhone, setNewClientPhone] = useState("")

  useEffect(() => {
    if (isOpen) {
      setDraft(initialData || {})
    } else {
      setClientSearch("")
      setNewClientName("")
      setNewClientPhone("")
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  // Helpers for duration
  const handleDurationChange = (deltaMinutes: number) => {
    setDraft(prev => ({
      ...prev,
      durationMinutes: Math.max(15, (prev.durationMinutes || 60) + deltaMinutes)
    }))
  }
  const hours = Math.floor((draft.durationMinutes || 60) / 60)
  const minutes = (draft.durationMinutes || 60) % 60

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Sheet matching CreateWorkspacePage perfectly */}
      <div className="relative w-full h-[calc(100svh-64px)] bg-panel-base rounded-t-[32px] shadow-[0_-8px_32px_rgba(0,0,0,0.18)] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
        
        {/* Header */}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex flex-col gap-10 max-w-2xl mx-auto w-full pb-8">
            
            {/* 0. Workspace Section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Пространство</h3>
              <select 
                value={draft.workspaceId || ""}
                onChange={e => setDraft({ ...draft, workspaceId: e.target.value, masterId: undefined, serviceId: undefined })}
                className="w-full bg-panel-surface border border-panel-border rounded-xl px-4 py-3 text-sm text-panel-text outline-none focus:border-panel-text transition-colors cursor-pointer appearance-none"
              >
                <option value="" disabled>Выберите пространство...</option>
                {workspaces?.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            {/* If workspace is selected, show the rest */}
            {draft.workspaceId && (
              <>
                {/* 1. Client Section */}
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Клиент</h3>
                  
                  {!draft.clientId ? (
                    <div className="flex flex-col gap-2">
                      <div className="relative">
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
                          className="w-full bg-panel-surface border border-panel-border rounded-xl px-4 py-3 text-sm text-panel-text placeholder:text-panel-text-subtle outline-none focus:border-panel-text transition-colors"
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
                      
                      {/* Search Results */}
                      {clientSearch && (
                        <div className="flex flex-col gap-2 bg-panel-surface border border-panel-border-subtle rounded-xl p-2 mt-2 shadow-sm animate-in fade-in slide-in-from-top-2">
                          <button 
                            onClick={() => {
                              setDraft({ ...draft, clientId: "new_pending" })
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-panel-base transition-colors border border-transparent hover:border-panel-border-subtle text-left"
                          >
                            <div className="w-10 h-10 rounded-full bg-hub-text/10 text-hub-text flex items-center justify-center font-medium">
                              +
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-panel-text">Создать нового клиента</span>
                              <span className="text-xs text-panel-text-muted">Заполнить имя и телефон</span>
                            </div>
                          </button>
                          
                          {/* Mock result */}
                          <button 
                            onClick={() => {
                              setDraft({ ...draft, clientId: "client-1", clientName: "Алина Смирнова", clientPhone: "+7 (999) 123-45-67" })
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
                    </div>
                  ) : draft.clientId === "new_pending" ? (
                    <div className="flex flex-col gap-4 p-5 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2">
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
                        <input 
                          type="tel" 
                          placeholder="Телефон (например, +7 999 000 00 00)"
                          value={newClientPhone}
                          onChange={e => setNewClientPhone(e.target.value)}
                          className="w-full bg-panel-base border border-panel-border rounded-xl px-4 py-3 text-sm text-panel-text outline-none focus:border-panel-text transition-colors"
                        />
                        <button 
                          onClick={() => {
                            if (newClientName) {
                              setDraft({ ...draft, clientId: "new", clientName: newClientName, clientPhone: newClientPhone })
                            }
                          }}
                          disabled={!newClientName}
                          className="mt-2 w-full py-3 rounded-xl bg-panel-text text-panel-base font-semibold text-sm transition-opacity disabled:opacity-50"
                        >
                          Сохранить клиента
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-hub-text/10 text-hub-text flex items-center justify-center font-medium text-lg">
                          {draft.clientName?.[0]?.toUpperCase() || "К"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-semibold text-panel-text">{draft.clientName}</span>
                          <span className="text-sm text-panel-text-muted">{draft.clientPhone || "Телефон не указан"}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setDraft({ ...draft, clientId: undefined, clientName: undefined, clientPhone: undefined })}
                        className="px-4 py-2 bg-panel-base border border-panel-border-subtle hover:border-panel-text-muted rounded-xl text-sm font-medium text-panel-text transition-colors"
                      >
                        Изменить
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Master & Time */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Мастер</h3>
                    <select 
                      value={draft.masterId || ""}
                      onChange={e => setDraft({ ...draft, masterId: e.target.value })}
                      className="w-full bg-panel-surface border border-panel-border rounded-xl px-4 py-3 text-sm text-panel-text outline-none focus:border-panel-text transition-colors cursor-pointer appearance-none"
                    >
                      <option value="" disabled>Выберите мастера...</option>
                      <option value="me">Я (Александр)</option>
                      <option value="other">Елена (Мастер)</option>
                    </select>
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

                {/* 3. Service Selection */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Услуга</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {MOCK_SERVICES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setDraft({ 
                          ...draft, 
                          serviceId: s.id, 
                          customService: undefined,
                          price: s.price,
                          durationMinutes: s.durationMinutes
                        })}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          draft.serviceId === s.id 
                            ? "bg-panel-text border-panel-text text-panel-base shadow-md ring-2 ring-panel-text ring-offset-2 ring-offset-panel-base" 
                            : "bg-panel-surface border-panel-border hover:border-panel-text-muted text-panel-text"
                        }`}
                      >
                        <span className="text-sm font-semibold block mb-1">{s.name}</span>
                        <span className={`text-xs ${draft.serviceId === s.id ? "text-panel-base/80" : "text-panel-text-muted"}`}>
                          {Math.floor(s.durationMinutes / 60) > 0 ? `${Math.floor(s.durationMinutes / 60)} ч ` : ""}{s.durationMinutes % 60 > 0 ? `${s.durationMinutes % 60} мин ` : ""}• {s.price} ₽
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => setDraft({ 
                        ...draft, 
                        serviceId: "custom", 
                        customService: { name: "" },
                        price: undefined,
                        durationMinutes: 60
                      })}
                      className={`p-4 rounded-2xl border border-dashed text-left transition-all ${
                        draft.serviceId === "custom" 
                          ? "bg-panel-text border-panel-text text-panel-base shadow-md ring-2 ring-panel-text ring-offset-2 ring-offset-panel-base" 
                          : "bg-panel-base border-panel-border-subtle hover:border-panel-text-muted text-panel-text"
                      }`}
                    >
                      <span className="text-sm font-semibold block mb-1">Свободная услуга</span>
                      <span className={`text-xs ${draft.serviceId === "custom" ? "text-panel-base/80" : "text-panel-text-muted"}`}>Ввести вручную</span>
                    </button>
                  </div>

                  {draft.serviceId === "custom" && draft.customService && (
                    <div className="mt-4 p-5 bg-panel-surface border border-panel-border-subtle rounded-2xl flex flex-col gap-5 animate-in slide-in-from-top-2">
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

                {/* 4. Duration, Price & Color */}
                <div className="flex flex-col sm:flex-row gap-6">
                  
                  {/* Duration Editor */}
                  <div className="flex-1 flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Длительность</h3>
                    <div className="p-3.5 bg-panel-surface border border-panel-border-subtle rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3 w-full justify-between">
                        <button 
                          onClick={() => handleDurationChange(-15)}
                          className="w-8 h-8 rounded-full bg-panel-base border border-panel-border flex items-center justify-center hover:border-panel-text-muted transition-colors active:scale-95 text-panel-text font-medium shrink-0"
                        >
                          -
                        </button>
                        <div className="flex items-center justify-center gap-1">
                          <input 
                            type="number" 
                            value={hours} 
                            onChange={(e) => setDraft(p => ({ ...p, durationMinutes: Math.max(15, (parseInt(e.target.value) || 0) * 60 + minutes) }))}
                            className="w-8 text-center bg-transparent border-b border-panel-border-subtle focus:border-panel-text outline-none text-sm font-semibold text-panel-text" 
                          />
                          <span className="text-xs text-panel-text-muted">ч</span>
                          <input 
                            type="number" 
                            value={minutes} 
                            onChange={(e) => setDraft(p => ({ ...p, durationMinutes: Math.max(15, hours * 60 + (parseInt(e.target.value) || 0)) }))}
                            className="w-8 text-center bg-transparent border-b border-panel-border-subtle focus:border-panel-text outline-none text-sm font-semibold text-panel-text" 
                          />
                          <span className="text-xs text-panel-text-muted">м</span>
                        </div>
                        <button 
                          onClick={() => handleDurationChange(15)}
                          className="w-8 h-8 rounded-full bg-panel-base border border-panel-border flex items-center justify-center hover:border-panel-text-muted transition-colors active:scale-95 text-panel-text font-medium shrink-0"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
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

                {/* Colors */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Цвет записи</h3>
                  <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setDraft({ ...draft, color })}
                        className={`w-10 h-10 rounded-full transition-all duration-150 active:scale-90 ${
                          draft.color === color
                            ? "ring-2 ring-offset-2 ring-panel-text scale-110"
                            : "hover:scale-110 shadow-sm"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}

                    {/* Render custom color if selected */}
                    {draft.color && !ACCENT_COLORS.includes(draft.color) && (
                      <button
                        className="w-10 h-10 rounded-full transition-all duration-150 active:scale-90 ring-2 ring-offset-2 ring-panel-text scale-110 relative flex items-center justify-center"
                        style={{ backgroundColor: draft.color }}
                      >
                        <span className="absolute inset-0 rounded-full border border-black/10 mix-blend-overlay"></span>
                        <div className="w-3 h-3 rounded-full bg-white/80 shadow-sm mix-blend-overlay"></div>
                      </button>
                    )}

                    {/* Custom color picker (+) */}
                    <label className="w-10 h-10 rounded-full border-2 border-dashed border-panel-border cursor-pointer flex items-center justify-center hover:border-panel-text-muted transition-colors overflow-hidden relative active:scale-95 shadow-sm bg-panel-surface">
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

                {/* Notes */}
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

        {/* Footer Navigation (Exactly like CreateWorkspacePage) */}
        <div className="px-6 py-5 shrink-0 border-t border-panel-border-subtle bg-panel-base">
          <div className="max-w-2xl mx-auto w-full">
            <button 
              onClick={() => {
                // TODO: submit
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
