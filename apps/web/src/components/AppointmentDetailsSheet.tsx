import { useState, useEffect } from "react"
import { X, Calendar as CalendarIcon, Phone, Wallet, Trash2, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import Avatar from "@/components/Avatar"
import Button from "@/components/ui/Button"
import ColorPicker from "@/components/ui/ColorPicker"
import type { Appointment } from "@/types/models"
import { formatCurrency, addMinutes, formatDuration, formatTime, formatAppointmentDate } from "@/lib/formatters"
import { usePermissions } from "@/lib/permissions"
import { useAuth } from "@/lib/AuthProvider"

interface AppointmentDetailsSheetProps {
  event: Appointment | null
  onClose: () => void
  onUpdate?: (updated: Appointment) => void
  onDelete?: (id: string) => void
  workspaceTimezone?: string
}

export default function AppointmentDetailsSheet({
  event,
  onClose,
  onUpdate,
  onDelete,
  workspaceTimezone = "Europe/Moscow",
}: AppointmentDetailsSheetProps) {
  const { user } = useAuth()
  const isFormal = user?.isFormal ?? true

  // Permission Checks
  const workspaceId = event?.workspace?.id
  const { can } = usePermissions(workspaceId)

  const isAssignedStaff = Boolean(
    user &&
    event?.staff?.user?.id === user.id
  )

  const hasManagePermission = can("manage_schedule")
  const canEdit = hasManagePermission || isAssignedStaff

  // Form State (Always open in edit mode)
  const [startDateTime, setStartDateTime] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [color, setColor] = useState("#ec4899")
  const [notes, setNotes] = useState("")
  const [isConfirmed, setIsConfirmed] = useState(true)

  useEffect(() => {
    if (event) {
      setStartDateTime(event.startDateTime || "")
      setPrice(event.price || 0)
      setColor(event.color || "#ec4899")
      setNotes(event.notes || "")
      setIsConfirmed(event.isConfirmed ?? true)
    }
  }, [event])

  if (!event) return null

  const totalDuration = event.totalDurationMinutes || 60
  const currentStartISO = startDateTime || event.startDateTime

  const startTimeStr = formatTime(currentStartISO, workspaceTimezone)
  const endTimeStr = formatTime(addMinutes(currentStartISO, totalDuration), workspaceTimezone)
  const formattedDate = formatAppointmentDate(currentStartISO, workspaceTimezone)

  // Check if any field has actually been modified
  const hasChanges =
    currentStartISO !== event.startDateTime ||
    price !== event.price ||
    color !== (event.color || "#ec4899") ||
    notes.trim() !== (event.notes || "").trim()

  const handleSave = () => {
    if (!hasChanges || !onUpdate) {
      onClose()
      return
    }

    const updated: Appointment = {
      ...event,
      startDateTime: currentStartISO,
      price,
      color,
      notes,
      isConfirmed,
    }

    onUpdate(updated)
    onClose()
  }

  const handleToggleConfirm = () => {
    if (!canEdit) return
    const newStatus = !isConfirmed
    setIsConfirmed(newStatus)
    if (onUpdate) {
      onUpdate({
        ...event,
        startDateTime: currentStartISO,
        price,
        color,
        notes,
        isConfirmed: newStatus,
      })
    }
  }

  const handleDelete = () => {
    if (!canEdit) return
    if (onDelete) {
      onDelete(event.id)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Dark backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Bottom Slide-up Sheet */}
      <div className="relative w-full h-[calc(100svh-64px)] bg-panel-base rounded-t-[32px] shadow-[0_-8px_32px_rgba(0,0,0,0.18)] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-4 shrink-0 border-b border-panel-border-subtle bg-panel-base">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-panel-text leading-tight truncate">
              Детали записи
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-panel-text-muted hover:text-panel-text hover:bg-panel-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full pb-32">

            {/* 1. Date & Time Picker Card */}
            <label className="relative flex items-center justify-between p-4 bg-panel-surface border border-panel-border rounded-2xl shadow-sm cursor-pointer group">
              {canEdit && (
                <input
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
              )}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-panel-border flex items-center justify-center shrink-0 text-panel-text">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-semibold text-panel-text capitalize truncate">
                    {formattedDate}
                  </span>
                  <span className="text-sm text-panel-text-muted truncate">
                    {startTimeStr} — {endTimeStr} • {formatDuration(totalDuration)}
                  </span>
                </div>
              </div>

              {canEdit && (
                <div className="px-4 py-2 bg-panel-base border border-panel-border-subtle group-hover:border-panel-text-muted rounded-xl text-sm font-medium text-panel-text transition-colors shrink-0">
                  Изменить
                </div>
              )}
            </label>

            {/* 2. Client Info Card */}
            <div className="p-4 bg-panel-surface border border-panel-border rounded-2xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-panel-text text-panel-base flex items-center justify-center font-bold text-base shrink-0">
                  {event.client.name[0]?.toUpperCase() || "К"}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-semibold text-panel-text truncate">{event.client.name}</span>
                  {event.client.phone ? (
                    <a
                      href={`tel:${event.client.phone}`}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{event.client.phone}</span>
                    </a>
                  ) : (
                    <span className="text-sm text-panel-text-muted">Телефон не указан</span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Service Details & Price Input Card */}
            <div className="bg-panel-surface border border-panel-border rounded-2xl shadow-sm overflow-hidden p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-panel-border-subtle pb-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-panel-border flex items-center justify-center font-medium text-lg shrink-0 text-panel-text">
                    {event.serviceName?.[0]?.toUpperCase() || "У"}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-base font-semibold text-panel-text truncate">
                      {event.serviceName}
                    </span>
                    <span className="text-sm text-panel-text-muted truncate">
                      {formatDuration(totalDuration)}
                    </span>
                  </div>
                </div>

                {canEdit ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-28 bg-panel-base border border-panel-border rounded-xl px-3 py-1.5 text-sm font-bold text-panel-text outline-none focus:border-panel-text"
                    />
                    <span className="text-sm font-medium text-panel-text-muted">₽</span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-panel-text shrink-0">
                    {formatCurrency(price)}
                  </span>
                )}
              </div>

              {/* Stage timeline */}
              {event.stages && event.stages.length > 0 && (
                <div className="flex flex-col gap-1 pt-1">
                  {event.stages.map((stage, idx) => {
                    let stageStartTimeStr: string | null = null
                    const allPrecedingHaveDuration = event.stages.slice(0, idx).every(s => s.durationMinutes !== undefined)

                    if (allPrecedingHaveDuration) {
                      const accumulatedMinutes = event.stages
                        .slice(0, idx)
                        .reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
                      const stageStartTimeISO = addMinutes(currentStartISO, accumulatedMinutes)
                      stageStartTimeStr = formatTime(stageStartTimeISO, workspaceTimezone)
                    }

                    return (
                      <div key={stage.id} className="flex gap-4 min-h-10">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full mt-1.5 z-10 ${stage.isActive ? 'bg-panel-text' : 'bg-panel-border'}`} />
                          <div className={`w-0.5 flex-1 -mt-1.5 mb-1 ${stage.isActive ? 'bg-panel-border-subtle' : 'border-l-2 border-dashed border-panel-border bg-transparent'}`} />
                        </div>

                        <div className="flex flex-col pb-3">
                          <span className={`text-sm font-semibold leading-tight ${stage.isActive ? 'text-panel-text' : 'text-panel-text-muted'}`}>
                            {stage.name}
                          </span>
                          <span className="text-xs text-panel-text-subtle mt-0.5 flex items-center gap-1.5">
                            {stageStartTimeStr && <span className="font-medium text-panel-text-muted">≈ {stageStartTimeStr}</span>}
                            {stageStartTimeStr && stage.durationMinutes !== undefined && <span>•</span>}
                            {stage.durationMinutes !== undefined && <span>{formatDuration(stage.durationMinutes)}</span>}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 4. Status Card */}
            <div className="p-4 bg-panel-surface border border-panel-border rounded-2xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-panel-base border border-panel-border-subtle flex items-center justify-center shrink-0">
                  {isConfirmed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-panel-text-muted">Статус записи</span>
                  <span className={`text-base font-bold ${isConfirmed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                    {isConfirmed ? "Подтверждена" : "Ожидает подтверждения"}
                  </span>
                </div>
              </div>

              {canEdit && (
                <button
                  type="button"
                  onClick={handleToggleConfirm}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 border ${
                    isConfirmed
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                  }`}
                >
                  {isConfirmed ? "Снять подтверждение" : "Подтвердить запись"}
                </button>
              )}
            </div>

            {/* 5. Workspace & Master Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Master */}
              {event.staff && (
                <div className="p-4 bg-panel-surface border border-panel-border rounded-2xl shadow-sm flex items-center gap-3">
                  <Avatar data={event.staff} className="w-12 h-12 rounded-full text-sm shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-panel-text-muted">Мастер</span>
                    <span className="text-base font-semibold text-panel-text truncate">
                      {event.staff.shortName || event.staff.user?.shortName || event.staff.fullName}
                    </span>
                    <span className="text-xs text-panel-text-subtle truncate">
                      {event.staff.mainCategory.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Workspace */}
              {event.workspace && (
                <div className="p-4 bg-panel-surface border border-panel-border rounded-2xl shadow-sm flex items-center gap-3">
                  <Avatar data={event.workspace} className="w-12 h-12 rounded-2xl text-sm shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-panel-text-muted">Пространство</span>
                    <span className="text-base font-semibold text-panel-text truncate">
                      {event.workspace.name}
                    </span>
                    {event.workspace.address && (
                      <span className="text-xs text-panel-text-subtle truncate">
                        {event.workspace.address}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 6. Refined Color & Notes Unified Card */}
            <div className="p-5 bg-panel-surface border border-panel-border rounded-2xl shadow-sm flex flex-col gap-4">
              {canEdit ? (
                <>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-panel-text-muted">Цвет метки</span>
                    <ColorPicker
                      value={color}
                      onChange={setColor}
                      size="sm"
                    />
                  </div>

                  <div className="h-px w-full bg-panel-border-subtle" />

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-panel-text-muted">Заметка</span>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Добавить заметку..."
                      rows={3}
                      className="w-full bg-panel-base border border-panel-border-subtle rounded-xl p-3 text-sm text-panel-text placeholder:text-panel-text-subtle outline-none focus:border-panel-text transition-colors resize-none"
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-panel-text-muted">Заметка</span>
                    {color && (
                      <div className="w-3.5 h-3.5 rounded-full shrink-0 border border-panel-border-subtle shadow-xs" style={{ backgroundColor: color }} />
                    )}
                  </div>
                  <p className="text-sm font-medium text-panel-text whitespace-pre-wrap leading-relaxed">
                    {notes || "Заметка отсутствует"}
                  </p>
                </div>
              )}
            </div>

            {/* Read-Only Notice if user cannot edit */}
            {!canEdit && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {isFormal ? "У вас нет прав для изменения этой записи." : "У тебя нет прав для изменения этой записи."}
                </span>
              </div>
            )}

          </div>
        </div>

        {/* Footer (Sticky Save & Delete buttons) */}
        {canEdit && (
          <div className="px-6 py-4 shrink-0 border-t border-panel-border-subtle bg-panel-base">
            <div className="max-w-2xl mx-auto w-full flex items-center gap-3">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 p-3.5 px-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-semibold transition-colors shrink-0"
                title="Удалить запись"
              >
                <Trash2 className="w-4 h-4" />
                <span>Удалить</span>
              </button>

              <Button
                variant="primary"
                theme="panel"
                className="flex-1"
                disabled={!hasChanges}
                onClick={handleSave}
              >
                Сохранить
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
