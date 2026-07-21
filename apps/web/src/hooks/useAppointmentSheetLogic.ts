/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/AuthProvider"
import type { Workspace } from "@/types/models"
import type { AppointmentDraft } from "@/components/CreateAppointmentSheet"

export interface SearchableSelectOption {
  id: string
  name: string
  subtitle?: string
  avatarUrl?: string
  color?: string
}

export const MOCK_SERVICES = [
  {
    id: "srv-1",
    name: "Стрижка женская",
    price: 1500,
    stages: [{ id: "st-1", name: "Стрижка и укладка", durationMinutes: 60 }],
  },
  {
    id: "srv-2",
    name: "Сложное окрашивание",
    price: 4000,
    stages: [
      { id: "st-1", name: "Осветление", durationMinutes: 60 },
      { id: "st-2", name: "Тонирование", durationMinutes: 45 },
      { id: "st-3", name: "Укладка", durationMinutes: 15 },
    ],
  },
  {
    id: "srv-3",
    name: "Маникюр с покрытием",
    price: 2000,
    stages: [{ id: "st-1", name: "Маникюр", durationMinutes: 90 }],
  },
]

export const MOCK_MASTERS = [
  { id: "me", name: "Я (Александр)", subtitle: "Топ-мастер", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
  { id: "other", name: "Елена", subtitle: "Мастер", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" },
]

export function useAppointmentSheetLogic(
  isOpen: boolean,
  initialData?: AppointmentDraft,
  workspaces?: Workspace[]
) {
  const { user } = useAuth()
  const isFormal = user?.isFormal ?? true
  const currentUserMasterId = user?.id || "me"

  const [draft, setDraft] = useState<AppointmentDraft>(initialData || {})

  const [isWorkspaceSearchActive, setIsWorkspaceSearchActive] = useState(!initialData?.workspaceId)
  const [isClientSearchActive, setIsClientSearchActive] = useState(!initialData?.clientId)
  const [isMasterSearchActive, setIsMasterSearchActive] = useState(false)
  const [isServiceSearchActive, setIsServiceSearchActive] = useState(!initialData?.serviceId)

  const [clientSearch, setClientSearch] = useState("")
  const [newClientName, setNewClientName] = useState("")
  const [newClientPhone, setNewClientPhone] = useState("")
  const [phoneError, setPhoneError] = useState("")

  useEffect(() => {
    if (isOpen) {
      const data = { ...(initialData || {}) }
      if (!data.masterId) {
        data.masterId = currentUserMasterId
      }
      if (data.serviceId && !data.stages && data.serviceId !== "custom") {
        const srv = MOCK_SERVICES.find(s => s.id === data.serviceId)
        if (srv) {
          data.stages = srv.stages
          data.price = srv.price
        }
      }
      if (!data.color) {
        data.color = "#ec4899"
      }
      setDraft(data)
      setIsWorkspaceSearchActive(!data.workspaceId)
      setIsClientSearchActive(!data.clientId)
      setIsMasterSearchActive(!data.masterId)
      setIsServiceSearchActive(!data.serviceId)
    }
  }, [isOpen, initialData, currentUserMasterId])

  const selectedWorkspace = workspaces?.find(w => w.id === draft.workspaceId) || workspaces?.[0]

  const selectedMasterAsMember = selectedWorkspace?.staff?.find(s => s.id === draft.masterId)
  const selectedMasterAsOption = selectedMasterAsMember
    ? null
    : MOCK_MASTERS.find(m => m.id === draft.masterId) || {
        id: currentUserMasterId,
        name: user?.shortName || user?.fullName || "Я (Александр)",
        subtitle: "Топ-мастер",
        avatarUrl: user?.avatarUrl,
      }

  const selectedMasterDisplayName = selectedMasterAsMember
    ? selectedMasterAsMember.shortName ||
      selectedMasterAsMember.user?.shortName ||
      selectedMasterAsMember.user?.fullName ||
      selectedMasterAsMember.fullName ||
      "—"
    : selectedMasterAsOption?.name || "—"

  const selectedMasterDisplaySubtitle = selectedMasterAsMember
    ? selectedMasterAsMember.mainCategory.name
    : selectedMasterAsOption?.subtitle || ""

  const selectedMasterUser = selectedMasterAsMember
    ? selectedMasterAsMember.user ?? selectedMasterAsMember
    : selectedMasterAsOption

  const selectedService = MOCK_SERVICES.find(s => s.id === draft.serviceId)

  const handleStageDurationChange = (stageId: string, deltaMinutes: number) => {
    if (!draft.stages) return
    const updated = draft.stages.map(s => {
      if (s.id === stageId) {
        const newDur = Math.max(0, s.durationMinutes + deltaMinutes)
        return { ...s, durationMinutes: newDur }
      }
      return s
    })
    setDraft({ ...draft, stages: updated })
  }

  const handleStageDurationInput = (stageId: string, hours: number, minutes: number) => {
    if (!draft.stages) return
    const newDur = Math.max(0, hours * 60 + minutes)
    const updated = draft.stages.map(s => (s.id === stageId ? { ...s, durationMinutes: newDur } : s))
    setDraft({ ...draft, stages: updated })
  }

  const validatePhone = (val: string) => {
    const digits = val.replace(/\D/g, "")
    return digits.length >= 10
  }

  const totalDuration = draft.stages ? draft.stages.reduce((acc, s) => acc + s.durationMinutes, 0) : 0

  const currentUserMasterOption: SearchableSelectOption = {
    id: currentUserMasterId,
    name: user?.shortName || user?.fullName || "Я (Александр)",
    subtitle: "Топ-мастер",
    avatarUrl: user?.avatarUrl,
    color: user?.color,
  }

  return {
    isFormal,
    draft, setDraft,
    isWorkspaceSearchActive, setIsWorkspaceSearchActive,
    isClientSearchActive, setIsClientSearchActive,
    isMasterSearchActive, setIsMasterSearchActive,
    isServiceSearchActive, setIsServiceSearchActive,
    clientSearch, setClientSearch,
    newClientName, setNewClientName,
    newClientPhone, setNewClientPhone,
    phoneError, setPhoneError,
    selectedWorkspace,
    selectedMasterDisplayName,
    selectedMasterDisplaySubtitle,
    selectedMasterUser,
    selectedService,
    handleStageDurationChange,
    handleStageDurationInput,
    validatePhone,
    totalDuration,
    currentUserMasterOption,
  }
}
