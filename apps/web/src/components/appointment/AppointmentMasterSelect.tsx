import Avatar from "@/components/Avatar"
import { SearchableSelect } from "@/components/CreateAppointmentSheet"
import type { AppointmentDraft } from "@/components/CreateAppointmentSheet"
import type { SearchableSelectOption } from "@/hooks/components/useAppointmentSheetLogic"

interface AppointmentMasterSelectProps {
  draft: AppointmentDraft
  setDraft: (draft: AppointmentDraft) => void
  isFormal: boolean
  isActive: boolean
  setIsActive: (val: boolean) => void
  options: SearchableSelectOption[]
  selectedMasterDisplayName: string
  selectedMasterDisplaySubtitle: string
  selectedMasterUser: any
}

export default function AppointmentMasterSelect({
  draft, setDraft,
  isFormal,
  isActive, setIsActive,
  options,
  selectedMasterDisplayName,
  selectedMasterDisplaySubtitle,
  selectedMasterUser
}: AppointmentMasterSelectProps) {
  if (isActive) {
    return (
      <SearchableSelect
        value={draft.masterId}
        onChange={val => {
          setDraft({ ...draft, masterId: val })
          setIsActive(false)
        }}
        options={options}
        placeholder={isFormal ? "Выберите мастера..." : "Выбери мастера..."}
      />
    )
  }

  return (
    <div className="p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Avatar
          data={selectedMasterUser}
          className="w-12 h-12 rounded-full text-sm shrink-0"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-base font-semibold text-panel-text truncate">{selectedMasterDisplayName}</span>
          {selectedMasterDisplaySubtitle && (
            <span className="text-xs text-panel-text-subtle truncate">{selectedMasterDisplaySubtitle}</span>
          )}
        </div>
      </div>
      <button
        onClick={() => {
          setDraft({ ...draft, masterId: undefined })
          setIsActive(true)
        }}
        className="px-4 py-2 bg-panel-base border border-panel-border-subtle hover:border-panel-text-muted rounded-xl text-sm font-medium text-panel-text transition-colors shrink-0"
      >
        Изменить
      </button>
    </div>
  )
}
