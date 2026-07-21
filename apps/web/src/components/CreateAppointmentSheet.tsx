import { useState, useEffect } from "react"
import { X, UserRound } from "lucide-react"

export type AppointmentDraft = {
  masterId?: string
  clientId?: string
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
          <div className="w-full md:w-1/3 min-w-[300px] border-b md:border-b-0 md:border-r border-panel-border-subtle bg-panel-surface flex flex-col h-1/2 md:h-full">
            <div className="p-4 flex flex-col h-full gap-4">
              <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">
                Клиент
              </h3>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-panel-base border border-panel-border-subtle flex items-center justify-center text-panel-text-muted mb-4 shadow-sm">
                  <UserRound className="w-8 h-8" />
                </div>
                <p className="text-panel-text font-medium mb-1">Кого записываем?</p>
                <p className="text-sm text-panel-text-subtle mb-6">
                  Найдите клиента в базе или создайте нового
                </p>
                
                {/* Search input mock */}
                <input 
                  type="text" 
                  placeholder="Имя или телефон..."
                  className="w-full bg-panel-base border border-panel-border rounded-2xl px-4 py-3 text-sm text-panel-text placeholder:text-panel-text-subtle outline-none focus:border-panel-text transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Details */}
          <div className="flex-1 flex flex-col h-1/2 md:h-full overflow-y-auto bg-panel-base">
            <div className="p-4 md:p-6 flex flex-col gap-8 max-w-2xl mx-auto w-full">
              
              {/* Mock content for now */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-panel-text-muted-dark uppercase tracking-wider">Детали записи</h3>
                <div className="w-full h-32 rounded-3xl bg-panel-surface border border-panel-border-subtle flex items-center justify-center">
                  <span className="text-sm font-medium text-panel-text-muted">
                    Здесь будут детали... 
                    {draft.masterId && `(Мастер: ${draft.masterId})`}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
