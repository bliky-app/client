import Step1Type from "./steps/Step1Type"
import Step2Details from "./steps/Step2Details"
import Step4Schedule from "./steps/Step4Schedule"
import Button from "@/components/ui/Button"
import ModalSheetLayout from "@/layouts/ModalSheetLayout"
import { useCreateWorkspace, STEP_LABELS } from "@/hooks/useCreateWorkspace"
export type { CreateWorkspaceFormData } from "@/hooks/useCreateWorkspace"

export default function CreateWorkspacePage() {
  const {
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
  } = useCreateWorkspace()

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
