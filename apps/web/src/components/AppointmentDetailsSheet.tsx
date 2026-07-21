import { useState, useEffect } from "react"
import { X, Phone, Trash2, AlertCircle } from "lucide-react"
import Avatar from "@/components/Avatar"
import Button from "@/components/ui/Button"
import ColorPicker from "@/components/ui/ColorPicker"
import IconBox from "@/components/ui/IconBox"
import type { Appointment } from "@/types/models"
import { formatCurrency, addMinutes, formatDuration, formatTime } from "@/lib/formatters"
import { usePermissions } from "@/lib/permissions"
import { useAuth } from "@/lib/AuthProvider"
import AppointmentDateCard from "@/components/appointment/AppointmentDateCard"
import AppointmentClientCard from "@/components/appointment/AppointmentClientCard"
import AppointmentStatusCard from "@/components/appointment/AppointmentStatusCard"
import AppointmentNotesCard from "@/components/appointment/AppointmentNotesCard"

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

            {/* 1. Date & Time Card */}
            <AppointmentDateCard
              startDateTime={currentStartISO}
              totalDurationMinutes={totalDuration}
              workspaceTimezone={workspaceTimezone}
              isEditable={canEdit}
              onChange={setStartDateTime}
            />

            {/* 2. Client Info Card */}
            <AppointmentClientCard
              name={event.client.name}
              phone={event.client.phone}
            />

            {/* 3. Service Details & Price Input Card */}
            <div className="bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm overflow-hidden p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-panel-border-subtle pb-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <IconBox size="lg" shape="squircle">
                    {event.serviceName?.[0]?.toUpperCase() || "У"}
                  </IconBox>
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
                      className="w-28 bg-panel-base border border-panel-border-subtle rounded-xl px-3 py-1.5 text-sm font-bold text-panel-text outline-none focus:border-panel-text"
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
                          <div className={`w-0.5 flex-1 -mt-1.5 mb-1 ${stage.isActive ? 'bg-panel-border-subtle' : 'border-l-2 border-dashed border-panel-border-subtle bg-transparent'}`} />
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
            <AppointmentStatusCard
              isConfirmed={isConfirmed}
              canEdit={canEdit}
              onToggleConfirm={handleToggleConfirm}
            />

            {/* 5. Workspace & Master Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Master */}
              {event.staff && (
                <div className="p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm flex items-center gap-3">
                  <Avatar data={event.staff} className="w-12 h-12 rounded-full text-sm shrink-0" />
                  <div className="flex flex-col min-w-0">
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
                <div className="p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm flex items-center gap-3">
                  <Avatar data={event.workspace} className="w-12 h-12 rounded-2xl text-sm shrink-0" />
                  <div className="flex flex-col min-w-0">
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
            <AppointmentNotesCard
              color={color}
              onColorChange={setColor}
              notes={notes}
              onNotesChange={setNotes}
              isEditable={canEdit}
            />

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
