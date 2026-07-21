import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { X, ArrowLeft } from "lucide-react"
import Step1Type from "./steps/Step1Type"
import Step2Details from "./steps/Step2Details"
import Step3Location from "./steps/Step3Location"
import Step4Schedule from "./steps/Step4Schedule"
import type { WorkspaceType, WorkspaceSchedule } from "@/types/models"

export interface CreateWorkspaceFormData {
  // Step 1
  type: WorkspaceType | null
  // Step 2
  name: string
  category: string
  color: string
  avatarUrl?: string
  // Step 3
  address: string
  timezone: string
  // Step 4
  schedule: WorkspaceSchedule
}

const INITIAL_DATA: CreateWorkspaceFormData = {
  type: null,
  name: "",
  category: "",
  color: "#6366f1",
  address: "",
  timezone: "Europe/Moscow",
  schedule: {
    1: [{ start: "09:00", end: "19:00" }],
    2: [{ start: "09:00", end: "19:00" }],
    3: [{ start: "09:00", end: "19:00" }],
    4: [{ start: "09:00", end: "19:00" }],
    5: [{ start: "09:00", end: "19:00" }],
  },
}

const STEP_LABELS = [
  "Тип",
  "Детали",
  "Адрес",
  "График",
]

export default function CreateWorkspacePage() {
  const navigate = useNavigate()
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
      // TODO: submit to API
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
    if (step === 1) return data.name.trim().length > 0 && data.category.trim().length > 0
    return true
  }

  const renderStep = () => {
    switch (step) {
      case 0: return <Step1Type value={data.type} onChange={type => updateData({ type })} />
      case 1: return <Step2Details data={data} onChange={updateData} />
      case 2: return <Step3Location data={data} onChange={updateData} />
      case 3: return <Step4Schedule data={data} onChange={updateData} />
      default: return null
    }
  }

  return (
    <div className="flex flex-col flex-1 bg-hub-base h-svh overflow-hidden">
      {/* White wizard panel */}
      <div className="flex flex-col flex-1 bg-panel-base rounded-t-[32px] mt-16 shadow-[0_-8px_32px_rgba(0,0,0,0.18)] overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 shrink-0">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full text-panel-text-muted hover:text-panel-text hover:bg-panel-surface-hover transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <p className="text-xs font-semibold text-panel-text-subtle uppercase tracking-widest mb-1">
              Шаг {step + 1} из {totalSteps}
            </p>
            <h1 className="text-xl font-bold text-panel-text leading-tight">
              {step === 0 && "Тип пространства"}
              {step === 1 && "Детали"}
              {step === 2 && "Адрес и часовой пояс"}
              {step === 3 && "График работы"}
            </h1>
          </div>

          <button
            onClick={() => navigate("/")}
            className="p-2 -mr-2 rounded-full text-panel-text-muted hover:text-panel-text hover:bg-panel-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-4 shrink-0">
          <div className="h-1 bg-panel-border-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-panel-text rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {renderStep()}
        </div>

        {/* Footer navigation */}
        <div className="px-6 py-5 shrink-0 border-t border-panel-border-subtle">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-panel-text text-panel-base hover:opacity-90 active:scale-[0.98]"
          >
            {isLast ? "Создать пространство" : "Далее"}
          </button>
        </div>
      </div>
    </div>
  )
}
