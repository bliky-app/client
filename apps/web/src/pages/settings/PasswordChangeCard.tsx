import { ShieldCheck } from "lucide-react"
import PasswordInput from "@/components/ui/PasswordInput"
import Button from "@workspace/ui/components/AppButton"

interface PasswordChangeCardProps {
  isFormal: boolean
  showForm: boolean
  onToggleForm: () => void
  error: string
  success: boolean
  currentValue: string
  onCurrentChange: (value: string) => void
  newValue: string
  onNewChange: (value: string) => void
  confirmValue: string
  onConfirmChange: (value: string) => void
  isSubmitting: boolean
  onSubmit: () => void
  onClearError: () => void
}

export default function PasswordChangeCard({
  isFormal,
  showForm,
  onToggleForm,
  error,
  success,
  currentValue,
  onCurrentChange,
  newValue,
  onNewChange,
  confirmValue,
  onConfirmChange,
  isSubmitting,
  onSubmit,
  onClearError,
}: PasswordChangeCardProps) {
  return (
    <div className="mt-6 mb-6 bg-panel-surface border border-panel-border rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <h2 className="text-sm font-semibold text-panel-text truncate">Смена пароля</h2>
          <span className="text-xs text-panel-text-muted truncate">
            {isFormal ? "Для защиты вашего аккаунта" : "Для защиты твоего аккаунта"}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleForm}
          className="px-3.5 py-2 rounded-xl bg-panel-base hover:bg-panel-surface-hover text-panel-text border border-panel-border-subtle text-xs font-semibold transition-colors shrink-0"
        >
          {showForm ? "Отмена" : "Изменить"}
        </button>
      </div>

      {showForm && (
        <div className="flex flex-col gap-4 pt-3 border-t border-panel-border-subtle animate-in fade-in slide-in-from-top-2 duration-200">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Пароль успешно обновлён!</span>
            </div>
          )}

          <PasswordInput
            label="Текущий пароль"
            placeholder="••••••••"
            value={currentValue}
            onChange={(event) => {
              onCurrentChange(event.target.value)
              onClearError()
            }}
          />

          <PasswordInput
            label="Новый пароль"
            placeholder="••••••••"
            value={newValue}
            onChange={(event) => {
              onNewChange(event.target.value)
              onClearError()
            }}
            showRules
          />

          <PasswordInput
            label={isFormal ? "Подтвердите пароль" : "Подтверди пароль"}
            placeholder="••••••••"
            value={confirmValue}
            onChange={(event) => {
              onConfirmChange(event.target.value)
              onClearError()
            }}
          />

          <div className="pt-1 flex justify-end">
            <Button
              variant="secondary"
              theme="panel"
              disabled={isSubmitting || !currentValue || !newValue || !confirmValue}
              onClick={onSubmit}
            >
              {isSubmitting ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
