import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { X, ArrowLeft, Sparkles } from "lucide-react"
import Step1Type from "./steps/Step1Type"
import Step2Details from "./steps/Step2Details"
import Step4Schedule from "./steps/Step4Schedule"
import Button from "@/components/ui/Button"
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
  "Тип",
  "Детали",
  "График",
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
    <div className="flex flex-col flex-1 bg-hub-base h-svh overflow-hidden">
      {/* Background Hub Status Bar */}
      <div className="h-16 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <span className="text-xs font-bold text-hub-text tracking-wide uppercase">Bliky Hub</span>
        </div>

        {/* Modal Handle */}
        <div className="w-10 h-1 bg-hub-border rounded-full opacity-60" />

        {user && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-hub-surface/60 border border-hub-border/50 text-hub-text-muted text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-32">{user.fullName || user.shortName}</span>
          </div>
        )}
      </div>

      {/* White wizard panel */}
      <div className="flex flex-col flex-1 bg-panel-base rounded-t-[32px] shadow-[0_-8px_32px_rgba(0,0,0,0.18)] overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 shrink-0 border-b border-panel-border-subtle">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full text-panel-text-muted hover:text-panel-text hover:bg-panel-surface-hover transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-panel-text-subtle uppercase tracking-wider mb-0.5">
              Шаг {step + 1} из {totalSteps}
            </p>
            <h1 className="text-xl font-bold text-panel-text leading-tight truncate">
              {step === 0 && "Тип пространства"}
              {step === 1 && "Детали пространства"}
              {step === 2 && "График работы"}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="p-2 -mr-2 rounded-full text-panel-text-muted hover:text-panel-text hover:bg-panel-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4 pb-2 shrink-0">
          <div className="h-1 bg-panel-border-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-panel-text rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content scroll body */}
        <div className="flex-1 overflow-y-auto px-6 relative flex flex-col">
          {renderStep()}

          {/* Sticky Navigation Footer (Padded & solid bg-panel-base) */}
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
        </div>
      </div>
    </div>
  )
}
