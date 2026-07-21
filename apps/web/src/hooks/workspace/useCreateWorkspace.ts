import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthProvider"
import type { WorkspaceType, WorkspaceSchedule } from "@/types/models"
import { getDefaultTimezone } from "@/lib/formatters"

export interface CreateWorkspaceFormData {

  type: WorkspaceType | null

  name: string
  category: string
  additionalCategories: string[]
  customCategory: string
  color: string
  avatarUrl?: string
  address: string
  timezone: string

  schedule: WorkspaceSchedule
}

const INITIAL_DATA: CreateWorkspaceFormData = {
  type: null,
  name: "",
  category: "",
  additionalCategories: [],
  customCategory: "",
  color: "#ec4899",
  address: "",
  timezone: getDefaultTimezone(),
  schedule: {
    1: [{ start: "09:00", end: "19:00" }],
    2: [{ start: "09:00", end: "19:00" }],
    3: [{ start: "09:00", end: "19:00" }],
    4: [{ start: "09:00", end: "19:00" }],
    5: [{ start: "09:00", end: "19:00" }],
  },
}

export const STEP_LABELS = [
  "Тип пространства",
  "Детали пространства",
  "График работы",
]

export function useCreateWorkspace() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isFormal = user?.isFormal ?? true
  const [step, setStep] = useState(0)
  const [data, setData] = useState<CreateWorkspaceFormData>(INITIAL_DATA)

  const totalSteps = STEP_LABELS.length
  const isFirst = step === 0
  const isLast = step === totalSteps - 1

  const updateData = (patch: Partial<CreateWorkspaceFormData>) => {
    setData((prev) => ({ ...prev, ...patch }))
  }

  const handleNext = () => {
    if (isLast) {
      navigate("/")
    } else {
      setStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    if (isFirst) {
      navigate("/")
    } else {
      setStep((s) => s - 1)
    }
  }

  const canProceed = () => {
    if (step === 0) return data.type !== null
    if (step === 1) {
      const nameValid = data.name.trim().length >= 4 && data.name.trim().length <= 32
      const categoryValid = data.category.trim().length > 0
      return nameValid && categoryValid
    }
    return true
  }

  return {
    isFormal,
    step,
    data,
    totalSteps,
    isFirst,
    isLast,
    updateData,
    handleNext,
    handleBack,
    canProceed,
  }
}
