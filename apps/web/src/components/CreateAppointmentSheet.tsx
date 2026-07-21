import { useState, useEffect, useRef } from "react"
import { X, Search, ChevronDown, Check, Plus } from "lucide-react"
import type { Workspace } from "@/types/models"
import Button from "@workspace/ui/components/AppButton"
import Avatar from "@/components/Avatar"

import AppointmentDateCard from "@/components/appointment/AppointmentDateCard"
import AppointmentNotesCard from "@/components/appointment/AppointmentNotesCard"
import AppointmentClientSelect from "@/components/appointment/AppointmentClientSelect"
import AppointmentMasterSelect from "@/components/appointment/AppointmentMasterSelect"
import AppointmentServiceSelect from "@/components/appointment/AppointmentServiceSelect"

import { useAppointmentSheetLogic, MOCK_SERVICES, MOCK_CLIENTS } from "@/hooks/components/useAppointmentSheetLogic"
import type { SearchableSelectOption } from "@/hooks/components/useAppointmentSheetLogic"

export type ServiceStage = {
  id: string
  name: string
  durationMinutes: number
  isActive?: boolean
}

export type AppointmentDraft = {
  workspaceId?: string
  masterId?: string
  clientId?: string
  clientName?: string
  clientPhone?: string
  clientColor?: string
  clientAvatarUrl?: string
  serviceId?: string
  customService?: {
    name: string
  }
  stages?: ServiceStage[]
  startDateTime?: string
  price?: number
  color?: string
  notes?: string
}

interface CreateAppointmentSheetProps {
  isOpen: boolean
  onClose: () => void
  initialData?: AppointmentDraft
  workspaces?: Workspace[]
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = "Поиск...",
  disabled = false,
  showCustomOption = false,
  customOptionLabel = "Другое",
  autoOpen = false,
  searchValue,
  onSearchChange,
  hideIcon = false
}: {
  value: string | undefined
  onChange: (value: string) => void
  options: SearchableSelectOption[]
  placeholder: string
  searchPlaceholder?: string
  disabled?: boolean
  showCustomOption?: boolean
  customOptionLabel?: string
  autoOpen?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  hideIcon?: boolean
}) {
  const [isOpen, setIsOpen] = useState(autoOpen)
  const [internalSearch, setInternalSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  const search = searchValue ?? internalSearch
  const setSearch = onSearchChange ?? setInternalSearch

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filtered = options.filter(option => option.name.toLowerCase().includes(search.toLowerCase()))
  const selected = options.find(option => option.id === value) || (value === "custom" ? { id: "custom", name: customOptionLabel } : undefined)

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        className="w-full bg-panel-surface border border-panel-border-subtle rounded-xl px-4 py-3.5 flex items-center justify-between hover:border-panel-text-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:border-panel-text shadow-sm"
      >
        <span className={`text-sm ${selected ? "text-panel-text font-medium" : "text-panel-text-subtle"}`}>
          {selected ? selected.name : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-panel-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-panel-base border border-panel-border-subtle rounded-xl shadow-lg z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 max-h-64">
          <div className="p-2 border-b border-panel-border-subtle shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-panel-text-subtle" />
              <input
                autoFocus
                value={search}
                onChange={event => {
                  setSearch(event.target.value)
                }}
                placeholder={searchPlaceholder}
                className="w-full bg-panel-surface rounded-lg pl-9 pr-3 py-2 text-sm text-panel-text outline-none focus:border-panel-text border border-transparent transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-1">
            {showCustomOption && (
              <button
                onClick={() => {
                  onChange("custom")
                  setIsOpen(false)
                  setSearch("")
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-panel-surface transition-colors text-left group mb-1 ${value === "custom" ? "bg-panel-surface" : ""}`}
              >
                <div className="w-10 h-10 rounded-full bg-panel-text text-panel-base flex items-center justify-center font-medium group-hover:scale-105 transition-transform shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium text-panel-text">{customOptionLabel}</span>
                  <span className="text-xs text-panel-text-muted">Ввести вручную</span>
                </div>
                {value === "custom" && <Check className="w-4 h-4 text-panel-text shrink-0" />}
              </button>
            )}

            {filtered.length === 0 ? (
              <div className="p-4 text-center text-sm text-panel-text-subtle">Ничего не найдено</div>
            ) : (
              <>
                {filtered.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onChange(option.id)
                      setIsOpen(false)
                      setSearch("")
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-panel-surface transition-colors text-left ${value === option.id ? "bg-panel-surface" : ""}`}
                  >
                    <div className="flex items-center gap-3 pr-3 flex-1 min-w-0">
                      {!hideIcon && (
                        option.avatarUrl ? (
                          <img src={option.avatarUrl} alt={option.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-panel-border-subtle" />
                        ) : (
                          (option.subtitle || option.color) ? (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs shrink-0 text-white"
                              style={{ backgroundColor: option.color || 'var(--panel-text)' }}
                            >
                              {option.name?.[0]?.toUpperCase()}
                            </div>
                          ) : null
                        )
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-panel-text">{option.name}</span>
                        {option.subtitle && <span className="text-xs text-panel-text-muted">{option.subtitle}</span>}
                      </div>
                    </div>
                    {value === option.id && <Check className="w-4 h-4 text-panel-text" />}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CreateAppointmentSheet({ isOpen, onClose, initialData, workspaces }: CreateAppointmentSheetProps) {
  const {
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
  } = useAppointmentSheetLogic(isOpen, initialData, workspaces)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full h-[calc(100svh-64px)] bg-panel-base rounded-t-[32px] shadow-[0_-8px_32px_rgba(0,0,0,0.18)] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-4 shrink-0 border-b border-panel-border-subtle bg-panel-base">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-panel-text leading-tight truncate">
              Новая запись
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-panel-text-muted hover:text-panel-text hover:bg-panel-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full pb-32">
            <AppointmentDateCard
              startDateTime={draft.startDateTime}
              isEditable={true}
              onChange={(val) => setDraft({ ...draft, startDateTime: val })}
              placeholder={isFormal ? "Выберите время..." : "Выбери время..."}
            />
            {isWorkspaceSearchActive ? (
              <SearchableSelect
                value={draft.workspaceId}
                onChange={val => {
                  const ws = workspaces?.find(w => w.id === val)
                  const onlyMaster = ws?.staff?.length === 1 ? ws.staff[0].id : undefined
                  
                  setDraft({ ...draft, workspaceId: val, masterId: onlyMaster, serviceId: undefined, stages: undefined, price: undefined })
                  setIsWorkspaceSearchActive(false)
                  setIsMasterSearchActive(!onlyMaster)
                  setIsServiceSearchActive(true)
                }}
                options={workspaces?.map(w => ({ id: w.id, name: w.name, subtitle: w.address, color: w.color, avatarUrl: w.avatarUrl })) || []}
                placeholder={isFormal ? "Выберите пространство..." : "Выбери пространство..."}
              />
            ) : (
              <div className="flex items-center justify-between p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar data={selectedWorkspace} className="w-12 h-12 rounded-2xl text-base shrink-0 border border-panel-border-subtle" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-semibold text-panel-text truncate">{selectedWorkspace?.name}</span>
                    {selectedWorkspace?.address && (
                      <span className="text-xs text-panel-text-subtle truncate">{selectedWorkspace.address}</span>
                    )}
                  </div>
                </div>
                {!initialData?.workspaceId && (
                  <button
                    onClick={() => {
                      setDraft({ ...draft, workspaceId: undefined, masterId: undefined, serviceId: undefined, stages: undefined, price: undefined })
                      setIsWorkspaceSearchActive(true)
                    }}
                    className="px-4 py-2 bg-panel-base border border-panel-border-subtle hover:border-panel-text-muted rounded-xl text-sm font-medium text-panel-text transition-colors shrink-0"
                  >
                    Изменить
                  </button>
                )}
              </div>
            )}
            {draft.workspaceId && (
              <>
                <AppointmentClientSelect
                  draft={draft}
                  setDraft={setDraft}
                  isFormal={isFormal}
                  isActive={isClientSearchActive}
                  setIsActive={setIsClientSearchActive}
                  search={clientSearch}
                  setSearch={setClientSearch}
                  newName={newClientName}
                  setNewName={setNewClientName}
                  newPhone={newClientPhone}
                  setNewPhone={setNewClientPhone}
                  phoneError={phoneError}
                  setPhoneError={setPhoneError}
                  validatePhone={validatePhone}
                  options={MOCK_CLIENTS}
                />
                <AppointmentMasterSelect
                  draft={draft}
                  setDraft={setDraft}
                  isFormal={isFormal}
                  isActive={isMasterSearchActive}
                  setIsActive={setIsMasterSearchActive}
                  options={
                    selectedWorkspace?.staff?.map(s => ({
                      id: s.id,
                      name: s.user?.firstName || "Мастер",
                      subtitle: s.mainCategory?.name,
                      avatarUrl: s.user?.avatarUrl,
                      color: s.user?.color
                    })) || [currentUserMasterOption]
                  }
                  selectedMasterDisplayName={selectedMasterDisplayName}
                  selectedMasterDisplaySubtitle={selectedMasterDisplaySubtitle}
                  selectedMasterUser={selectedMasterUser}
                />
                <AppointmentServiceSelect
                  draft={draft}
                  setDraft={setDraft}
                  isFormal={isFormal}
                  isActive={isServiceSearchActive}
                  setIsActive={setIsServiceSearchActive}
                  options={MOCK_SERVICES.map(s => ({ id: s.id, name: s.name, subtitle: `${s.stages.reduce((acc, st) => acc + st.durationMinutes, 0)} мин • ${s.price} ₽` }))}
                  selectedService={selectedService}
                  totalDuration={totalDuration}
                  handleStageDurationChange={handleStageDurationChange}
                  handleStageDurationInput={handleStageDurationInput}
                />
                <AppointmentNotesCard
                  color={draft.color || "#ec4899"}
                  onColorChange={(c) => setDraft({ ...draft, color: c })}
                  notes={draft.notes || ""}
                  onNotesChange={(n) => setDraft({ ...draft, notes: n })}
                />
              </>
            )}

          </div>
        </div>
        <div className="px-6 py-4 shrink-0 border-t border-panel-border-subtle bg-panel-base">
          <div className="max-w-2xl mx-auto w-full">
            <Button
              variant="primary"
              theme="panel"
              fullWidth
              disabled={!draft.workspaceId || !draft.clientId || !draft.masterId || !draft.serviceId}
              onClick={onClose}
            >
              Создать запись
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
