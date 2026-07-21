import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Step1Type from "./steps/Step1Type"
import Step2Details from "./steps/Step2Details"
import Step4Schedule from "./steps/Step4Schedule"
import Button from "@/components/ui/Button"
import ModalSheetLayout from "@/layouts/ModalSheetLayout"
import { useAuth } from "@/lib/AuthProvider"
import type { WorkspaceType, WorkspaceSchedule } from "@/types/models"
import { getDefaultTimezone } from "@/lib/formatters"

export interface CreateWorkspaceFormData {
  // Step 1
  type: WorkspaceType | null
  // Step 2
  name: string
  category: string
  additionalCategories: string[]
  customCategory: string
  color: string
  avatarUrl?: string
  address: string
  timezone: string
  // Step 3
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

const STEP_LABELS = [
  "Тип пространства",
  "Детали пространства",
  "График работы",
]

export default function CreateWorkspacePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isFormal = user?.isFormal ?? true
  const [step, setStep] = useState(0)
  const [data, setData] = useState<CreateWorkspaceFormData>(INITIAL_DATA)

  const totalSteps = STEP_LABELS.length
  const isFirst = step === 0
  const isLast = step === totalSteps - 1

  const updateData = (patch: Partial<CreateWorkspaceFormData>) => {
    setData(prev => ({ ...prev, ...patch }))
  }

  const handleNext = () => {
    if (isLast) {
      navigate("/")
    } else {
      setStep(s => s + 1)
    }
  }

  const handleBack = () => {
    if (isFirst) {
      navigate("/")
    } else {
      setStep(s => s - 1)
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

  const renderStep = () => {
    switch (step) {
      case 0: return <Step1Type value={data.type} onChange={type => updateData({ type })} />
      case 1: return <Step2Details data={data} onChange={updateData} />
      case 2: return <Step4Schedule data={data} onChange={updateData} />
      default: return null
    }
  }

  return (
    <ModalSheetLayout
      title={STEP_LABELS[step]}
      subtitle={`Шаг ${step + 1} из ${totalSteps}`}
      showBack={!isFirst}
      onBack={handleBack}
      progressBar={
        <div className="px-6 pt-4 pb-2 shrink-0">
          <div className="h-1 bg-panel-border-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-panel-text rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      }
      footer={
        <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-panel-base border-t border-panel-border-subtle shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-20 shrink-0 mt-auto">
          <Button
            variant="primary"
            theme="panel"
            fullWidth
            disabled={!canProceed()}
            onClick={handleNext}
          >
            {isLast
              ? (isFormal ? "Создайте пространство" : "Создай пространство")
              : (isFormal ? "Продолжить" : "Далее")}
          </Button>
        </div>
      }
    >
      {renderStep()}
    </ModalSheetLayout>
  )
}
