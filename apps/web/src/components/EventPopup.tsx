import AppointmentDetailsSheet from "./AppointmentDetailsSheet"
import type { Appointment } from "@/types/models"

interface EventPopupProps {
  event: Appointment | null
  onClose: () => void
  onUpdate?: (updated: Appointment) => void
  onDelete?: (id: string) => void
  workspaceTimezone?: string
}

export default function EventPopup({
  event,
  onClose,
  onUpdate,
  onDelete,
  workspaceTimezone = "Europe/Moscow",
}: EventPopupProps) {
  return (
    <AppointmentDetailsSheet
      event={event}
      onClose={onClose}
      onUpdate={onUpdate}
      onDelete={onDelete}
      workspaceTimezone={workspaceTimezone}
    />
  )
}
