import { useState } from "react"
import type { AppointmentDraft } from "@/components/CreateAppointmentSheet"
import type { QuickActionDraft } from "@/components/QuickActionsRow"

/**
 * Управляет состоянием шторки создания новой записи.
 * Объединяет два источника открытия: быстрые действия (QuickActionsRow)
 * и клик по слоту в Timetable.
 */
export function useAppointmentSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState<AppointmentDraft | undefined>(undefined)

  const openWithDraft = (newDraft: AppointmentDraft) => {
    setDraft(newDraft)
    setIsOpen(true)
  }

  const handleQuickActionOpen = (quickActionDraft: QuickActionDraft) => {
    openWithDraft(quickActionDraft)
  }

  const handleSlotClick = (dateString: string, timeString: string, staffId?: string) => {
    openWithDraft({
      masterId: staffId,
      startDateTime: `${dateString}T${timeString}`,
    })
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    draft,
    handleQuickActionOpen,
    handleSlotClick,
    handleClose,
  }
}
