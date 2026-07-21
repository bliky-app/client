import { useState, useEffect } from "react"
import type { Appointment, ServiceStage } from "@/types/models"
import { usePermissions } from "@/lib/permissions"
import { useAuth } from "@/lib/AuthProvider"

export function useAppointmentDetailsSheet(
  event: Appointment | null,
  onClose: () => void,
  onUpdate?: (updated: Appointment) => void,
  onDelete?: (id: string) => void
) {
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
  const [stages, setStages] = useState<ServiceStage[]>([])

  useEffect(() => {
    if (event) {
      setStartDateTime(event.startDateTime || "")
      setPrice(event.price || 0)
      setColor(event.color || "#ec4899")
      setNotes(event.notes || "")
      setIsConfirmed(event.isConfirmed ?? true)
      setStages(event.stages ? JSON.parse(JSON.stringify(event.stages)) : [])
    }
  }, [event])

  const currentStartISO = startDateTime || (event?.startDateTime ?? "")

  const totalDuration = stages && stages.length > 0
    ? stages.reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
    : (event?.totalDurationMinutes || 60)

  const handleStageDurationChange = (stageId: string, delta: number) => {
    setStages((prev) =>
      prev.map((s) => {
        if (s.id === stageId) {
          const newDur = Math.max(0, (s.durationMinutes || 0) + delta)
          return { ...s, durationMinutes: newDur }
        }
        return s
      })
    )
  }

  const handleStageDurationInput = (stageId: string, h: number, m: number) => {
    const newDur = Math.max(0, h * 60 + m)
    setStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, durationMinutes: newDur } : s))
    )
  }

  const hasStageChanges = JSON.stringify(stages) !== JSON.stringify(event?.stages || [])

  // Check if any field has actually been modified
  const hasChanges =
    event && (
      currentStartISO !== event.startDateTime ||
      price !== event.price ||
      color !== (event.color || "#ec4899") ||
      notes.trim() !== (event.notes || "").trim() ||
      hasStageChanges
    )

  const handleSave = () => {
    if (!hasChanges || !onUpdate || !event) {
      onClose()
      return
    }

    const updated: Appointment = {
      ...event,
      startDateTime: currentStartISO,
      price,
      color,
      notes,
      stages,
      totalDurationMinutes: totalDuration,
      isConfirmed,
    }

    onUpdate(updated)
    onClose()
  }

  const handleToggleConfirm = () => {
    if (!canEdit || !event) return
    const newStatus = !isConfirmed
    setIsConfirmed(newStatus)
    if (onUpdate) {
      onUpdate({
        ...event,
        startDateTime: currentStartISO,
        price,
        color,
        notes,
        stages,
        totalDurationMinutes: totalDuration,
        isConfirmed: newStatus,
      })
    }
  }

  const handleDelete = () => {
    if (!canEdit || !event) return
    if (onDelete) {
      onDelete(event.id)
    }
    onClose()
  }

  return {
    isFormal,
    canEdit,
    startDateTime,
    setStartDateTime,
    price,
    setPrice,
    color,
    setColor,
    notes,
    setNotes,
    isConfirmed,
    stages,
    currentStartISO,
    totalDuration,
    handleStageDurationChange,
    handleStageDurationInput,
    hasChanges,
    handleSave,
    handleToggleConfirm,
    handleDelete,
  }
}
