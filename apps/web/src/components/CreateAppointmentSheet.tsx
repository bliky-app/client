import { useState, useEffect } from "react"
import { X, UserRound } from "lucide-react"

const ACCENT_COLORS = [
  "#6366f1", "#8b5cf6", "#d946ef", "#ec4899",
  "#f43f5e", "#ef4444", "#f97316", "#eab308",
  "#84cc16", "#22c55e", "#10b981", "#14b8a6",
  "#06b6d4", "#0ea5e9", "#3b82f6", "#64748b",
]

export type AppointmentDraft = {
  masterId?: string
  clientId?: string
  clientName?: string
  serviceId?: string
  customService?: {
    name: string
    totalDurationMinutes: number
  }
  startDateTime?: string
  price?: number
  color?: string
  notes?: string
}

interface CreateAppointmentSheetProps {
  isOpen: boolean
  onClose: () => void
  initialData?: AppointmentDraft
}

export default function CreateAppointmentSheet({ isOpen, onClose, initialData }: CreateAppointmentSheetProps) {
  const [draft, setDraft] = useState<AppointmentDraft>({})
  const [clientSearch, setClientSearch] = useState("")

  useEffect(() => {
    if (isOpen) {
      setDraft(initialData || {})
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="relative w-full h-[95vh] bg-panel-base rounded-t-[32px] shadow-2xl pointer-events-auto flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 bg-panel-border rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 shrink-0 border-b border-panel-border-subtle">
          <h2 className="text-lg font-semibold text-panel-text">Новая запись</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-panel-text-muted hover:text-panel-text transition-colors rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Client Selection */}
          <div className="w-full md:w-1/3 min-w-[300px] border-b md:border-b-0 md:border-r border-panel-border-subtle bg-panel-surface flex flex-col h-[40%] md:h-full shrink-0">
            <div className="p-4 flex flex-col h-full gap-4">
              <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider shrink-0">
                Клиент
              </h3>
              
              <div className="relative shrink-0">
                <input 
                  type="text" 
                  placeholder="Имя или телефон..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full bg-panel-base border border-panel-border rounded-xl px-4 py-2.5 text-sm text-panel-text placeholder:text-panel-text-subtle outline-none focus:border-panel-text transition-colors"
                />
                {clientSearch && (
                  <button 
                    onClick={() => setClientSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-panel-text-muted hover:text-panel-text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Client List / Create New */}
              <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-2">
                {!clientSearch ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 opacity-50">
                    <UserRound className="w-10 h-10 text-panel-text-muted mb-3" />
                    <p className="text-sm text-panel-text-subtle">Начните вводить имя или номер телефона</p>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setDraft({ ...draft, clientId: "new", clientName: clientSearch })
                        setClientSearch("")
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-panel-base transition-colors border border-transparent hover:border-panel-border-subtle group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-hub-text/10 text-hub-text flex items-center justify-center font-medium">
                          +
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-panel-text">Создать "{clientSearch}"</span>
                          <span className="text-xs text-panel-text-muted">Новый клиент</span>
                        </div>
                      </div>
                    </button>
                    
                    {/* Mock results */}
                    {[1, 2, 3].map(i => (
                      <button 
                        key={i}
                        onClick={() => {
                          setDraft({ ...draft, clientId: `client-${i}`, clientName: `Клиент ${i}` })
                          setClientSearch("")
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors border text-left ${
                          draft.clientId === `client-${i}` 
                            ? "bg-panel-base border-panel-border" 
                            : "border-transparent hover:bg-panel-base hover:border-panel-border-subtle"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-panel-border-subtle flex items-center justify-center font-medium text-panel-text">
                          К{i}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-panel-text">Клиент {i}</span>
                          <span className="text-xs text-panel-text-muted">+7 (999) 000-00-0{i}</span>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Details */}
          <div className="flex-1 flex flex-col h-[60%] md:h-full overflow-y-auto bg-panel-base relative">
            
            {/* If no client selected, show a small overlay or just let them pick anyway. 
                Usually it's better to allow picking details without a client. */}
            <div className="p-4 md:p-6 flex flex-col gap-8 max-w-2xl mx-auto w-full pb-32">
              
              {/* Selected Client Card */}
              {draft.clientId && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Выбранный клиент</h3>
                  <div className="flex items-center justify-between p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-hub-text/10 text-hub-text flex items-center justify-center font-medium text-lg">
                        {draft.clientName?.[0]?.toUpperCase() || "К"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-panel-text">{draft.clientName}</span>
                        <span className="text-sm text-panel-text-muted">{draft.clientId === "new" ? "Новый клиент" : "Постоянный клиент"}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setDraft({ ...draft, clientId: undefined, clientName: undefined })}
                      className="px-3 py-1.5 bg-panel-base border border-panel-border-subtle hover:border-panel-text-muted rounded-xl text-sm font-medium text-panel-text transition-colors"
                    >
                      Изменить
                    </button>
                  </div>
                </div>
              )}

              {/* Master & Time */}
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

              {/* Service Selection */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Услуга</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {["Стрижка", "Окрашивание", "Маникюр"].map(s => (
                    <button
                      key={s}
                      onClick={() => setDraft({ ...draft, serviceId: s, customService: undefined })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        draft.serviceId === s 
                          ? "bg-panel-text border-panel-text text-panel-base shadow-md" 
                          : "bg-panel-surface border-panel-border hover:border-panel-text-muted text-panel-text"
                      }`}
                    >
                      <span className="text-sm font-medium block">{s}</span>
                      <span className={`text-xs ${draft.serviceId === s ? "text-panel-base/80" : "text-panel-text-muted"}`}>1 ч 30 мин • от 2000 ₽</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setDraft({ ...draft, serviceId: "custom", customService: { name: "", totalDurationMinutes: 60 } })}
                    className={`p-3 rounded-xl border border-dashed text-left transition-all ${
                      draft.serviceId === "custom" 
                        ? "bg-panel-text border-panel-text text-panel-base shadow-md" 
                        : "bg-panel-base border-panel-border-subtle hover:border-panel-text-muted text-panel-text"
                    }`}
                  >
                    <span className="text-sm font-medium block">Свободная услуга</span>
                    <span className={`text-xs ${draft.serviceId === "custom" ? "text-panel-base/80" : "text-panel-text-muted"}`}>Ввести вручную</span>
                  </button>
                </div>

                {draft.serviceId === "custom" && draft.customService && (
                  <div className="mt-2 p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl flex flex-col gap-4 animate-in slide-in-from-top-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-panel-text-muted">Название услуги</label>
                      <input 
                        type="text" 
                        value={draft.customService.name}
                        onChange={e => setDraft({ ...draft, customService: { ...draft.customService!, name: e.target.value }})}
                        placeholder="Например: Сложное окрашивание..."
                        className="w-full bg-panel-base border border-panel-border rounded-lg px-3 py-2 text-sm text-panel-text outline-none focus:border-panel-text transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Duration Editor (Schematic) */}
              {(draft.serviceId) && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Длительность</h3>
                  <div className="p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-panel-text">Общее время</span>
                      <div className="flex items-center gap-3">
                        <button className="w-8 h-8 rounded-full bg-panel-base border border-panel-border flex items-center justify-center hover:border-panel-text-muted transition-colors active:scale-95 text-panel-text font-medium">-</button>
                        <div className="flex items-center gap-1">
                          <input type="number" defaultValue="1" className="w-10 text-center bg-transparent border-b border-panel-border-subtle focus:border-panel-text outline-none text-sm font-semibold text-panel-text" />
                          <span className="text-xs text-panel-text-muted">ч</span>
                          <input type="number" defaultValue="30" className="w-10 text-center bg-transparent border-b border-panel-border-subtle focus:border-panel-text outline-none text-sm font-semibold text-panel-text" />
                          <span className="text-xs text-panel-text-muted">м</span>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-panel-base border border-panel-border flex items-center justify-center hover:border-panel-text-muted transition-colors active:scale-95 text-panel-text font-medium">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price & Color */}
              <div className="flex flex-col sm:flex-row gap-6">
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
                <div className="flex-1 flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Цвет записи</h3>
                  <div className="flex flex-wrap gap-2 p-1">
                    {ACCENT_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setDraft({ ...draft, color })}
                        className={`w-9 h-9 rounded-full transition-all duration-150 active:scale-90 ${
                          draft.color === color
                            ? "ring-2 ring-offset-1 ring-panel-text scale-105"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}

                    {/* Render custom color if selected */}
                    {draft.color && !ACCENT_COLORS.includes(draft.color) && (
                      <button
                        className="w-9 h-9 rounded-full transition-all duration-150 active:scale-90 ring-2 ring-offset-1 ring-panel-text scale-105 relative flex items-center justify-center"
                        style={{ backgroundColor: draft.color }}
                      >
                        <span className="absolute inset-0 rounded-full border border-black/10 mix-blend-overlay"></span>
                        <div className="w-2 h-2 rounded-full bg-white/80 shadow-sm mix-blend-overlay"></div>
                      </button>
                    )}

                    {/* Custom color picker (+) */}
                    <label className="w-9 h-9 rounded-full border-2 border-dashed border-panel-border cursor-pointer flex items-center justify-center hover:border-panel-text-muted transition-colors overflow-hidden relative active:scale-95">
                      <span className="text-xs text-panel-text-subtle select-none">+</span>
                      <input
                        type="color"
                        value={draft.color || "#000000"}
                        onChange={e => setDraft({ ...draft, color: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>
                  </div>
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

            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-panel-base/80 backdrop-blur-md border-t border-panel-border-subtle flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-panel-border-subtle text-panel-text font-medium text-sm hover:bg-panel-surface transition-colors"
              >
                Отмена
              </button>
              <button 
                className="px-6 py-2.5 rounded-xl bg-panel-text text-panel-base font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={!draft.clientId || !draft.masterId || !draft.serviceId}
              >
                Создать запись
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
