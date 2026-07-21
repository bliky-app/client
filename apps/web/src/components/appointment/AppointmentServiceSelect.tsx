import IconBox from "@workspace/ui/components/IconBox"
import { formatDuration } from "@/lib/formatters"
import { SearchableSelect } from "@/components/CreateAppointmentSheet"
import AppointmentStageTimeline from "@/components/appointment/AppointmentStageTimeline"
import type { AppointmentDraft } from "@/components/CreateAppointmentSheet"
import type { SearchableSelectOption } from "@/hooks/components/useAppointmentSheetLogic"
import { MOCK_SERVICES } from "@/hooks/components/useAppointmentSheetLogic"

interface AppointmentServiceSelectProps {
  draft: AppointmentDraft
  setDraft: (draft: AppointmentDraft) => void
  isFormal: boolean
  isActive: boolean
  setIsActive: (val: boolean) => void
  options: SearchableSelectOption[]
  selectedService: any
  totalDuration: number
  handleStageDurationChange: (stageId: string, delta: number) => void
  handleStageDurationInput: (stageId: string, hours: number, minutes: number) => void
}

export default function AppointmentServiceSelect({
  draft, setDraft,
  isFormal,
  isActive, setIsActive,
  options,
  selectedService,
  totalDuration,
  handleStageDurationChange,
  handleStageDurationInput
}: AppointmentServiceSelectProps) {
  if (isActive) {
    return (
      <SearchableSelect
        value={draft.serviceId}
        onChange={val => {
          if (val === "custom") {
            setDraft({ ...draft, serviceId: "custom", customService: { name: "" }, price: undefined, stages: [{ id: "custom-stage-1", name: "Основной этап", durationMinutes: 60 }] })
          } else {
            const srv = MOCK_SERVICES.find(s => s.id === val)
            if (srv) setDraft({ ...draft, serviceId: srv.id, customService: undefined, price: srv.price, stages: srv.stages })
          }
          setIsActive(false)
        }}
        options={options}
        placeholder={isFormal ? "Выберите услугу..." : "Выбери услугу..."}
        showCustomOption={true}
        hideIcon={true}
      />
    )
  }

  return (
    <div className="bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm overflow-hidden p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <IconBox size="lg" shape="squircle">
            {draft.serviceId === "custom" ? "У" : selectedService?.name?.[0]?.toUpperCase() || "У"}
          </IconBox>
          <div className="flex flex-col min-w-0 flex-1">
            {draft.serviceId === "custom" ? (
              <input
                autoFocus
                type="text"
                value={draft.customService?.name || ""}
                onChange={event => setDraft({ ...draft, customService: { name: event.target.value } })}
                placeholder="Свободная услуга"
                className="bg-transparent text-base font-semibold text-panel-text outline-none placeholder:text-panel-text-muted w-full"
              />
            ) : (
              <span className="text-base font-semibold text-panel-text truncate leading-tight">{selectedService?.name}</span>
            )}
            <span className="text-sm text-panel-text-muted truncate mt-0.5">
              {totalDuration > 0 ? formatDuration(totalDuration) : "Длительность не указана"}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            setDraft({ ...draft, serviceId: undefined, customService: undefined, stages: undefined, price: undefined })
            setIsActive(true)
          }}
          className="px-4 py-2 bg-panel-base border border-panel-border-subtle hover:border-panel-text-muted rounded-xl text-sm font-medium text-panel-text transition-colors shrink-0"
        >
          Изменить
        </button>
      </div>
      {draft.stages && draft.stages.length > 0 && (
        <AppointmentStageTimeline
          stages={draft.stages.map(stage => ({ ...stage, isActive: stage.isActive ?? true }))}
          startDateTime={draft.startDateTime || ""}
          totalDurationMinutes={totalDuration}
          isEditable={true}
          onStageDurationChange={handleStageDurationChange}
          onStageDurationInput={handleStageDurationInput}
        />
      )}
      <div className="pt-3 border-t border-panel-border-subtle flex items-center justify-between">
        <span className="text-xs font-semibold text-panel-text-muted">Стоимость услуги</span>
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="number"
            value={draft.price || ""}
            onChange={event => setDraft({ ...draft, price: Number(event.target.value) })}
            placeholder="0"
            className="w-32 bg-panel-base border border-panel-border-subtle rounded-xl px-3 py-2 text-base font-bold text-panel-text text-right outline-none focus:border-panel-text transition-colors"
          />
          <span className="text-base font-bold text-panel-text">₽</span>
        </div>
      </div>
    </div>
  )
}
