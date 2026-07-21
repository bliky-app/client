import { useState, useEffect, useRef } from "react"
import { X, Search, ChevronDown, Check, Plus } from "lucide-react"
import type { Workspace } from "@/types/models"
import Avatar from "@/components/Avatar"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import PhoneInput from "@/components/ui/PhoneInput"
import IconBox from "@/components/ui/IconBox"
import { formatDuration } from "@/lib/formatters"

import AppointmentDateCard from "@/components/appointment/AppointmentDateCard"
import AppointmentClientCard from "@/components/appointment/AppointmentClientCard"
import AppointmentNotesCard from "@/components/appointment/AppointmentNotesCard"
import AppointmentStageTimeline from "@/components/appointment/AppointmentStageTimeline"

import { useAppointmentSheetLogic, MOCK_SERVICES } from "@/hooks/useAppointmentSheetLogic"
import type { SearchableSelectOption } from "@/hooks/useAppointmentSheetLogic"

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

function SearchableSelect({
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
  onChange: (val: string) => void
  options: SearchableSelectOption[]
  placeholder: string
  searchPlaceholder?: string
  disabled?: boolean
  showCustomOption?: boolean
  customOptionLabel?: string
  autoOpen?: boolean
  searchValue?: string
  onSearchChange?: (val: string) => void
  hideIcon?: boolean
}) {
  const [isOpen, setIsOpen] = useState(autoOpen)
  const [internalSearch, setInternalSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  const search = searchValue ?? internalSearch
  const setSearch = onSearchChange ?? setInternalSearch

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filtered = options.filter(o => o.name.toLowerCase().includes(search.toLowerCase()))
  const selected = options.find(o => o.id === value) || (value === "custom" ? { id: "custom", name: customOptionLabel } : undefined)

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
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
                onChange={e => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-panel-surface rounded-lg pl-9 pr-3 py-2 text-sm text-panel-text outline-none focus:border-panel-text border border-transparent transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-1">
            {showCustomOption && (
              <button
                onClick={() => { onChange("custom"); setIsOpen(false); setSearch("") }}
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
                {filtered.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { onChange(opt.id); setIsOpen(false); setSearch("") }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-panel-surface transition-colors text-left ${value === opt.id ? "bg-panel-surface" : ""}`}
                  >
                    <div className="flex items-center gap-3 pr-3 flex-1 min-w-0">
                      {!hideIcon && (
                        opt.avatarUrl ? (
                          <img src={opt.avatarUrl} alt={opt.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-panel-border-subtle" />
                        ) : (
                          (opt.subtitle || opt.color) ? (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs shrink-0 text-white"
                              style={{ backgroundColor: opt.color || 'var(--panel-text)' }}
                            >
                              {opt.name?.[0]?.toUpperCase()}
                            </div>
                          ) : null
                        )
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-panel-text">{opt.name}</span>
                        {opt.subtitle && <span className="text-xs text-panel-text-muted">{opt.subtitle}</span>}
                      </div>
                    </div>
                    {value === opt.id && <Check className="w-4 h-4 text-panel-text" />}
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

        {/* Header */}
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

        {/* Scroll Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full pb-32">

            {/* 1. Date & Time Card */}
            <AppointmentDateCard
              startDateTime={draft.startDateTime}
              isEditable={true}
              onChange={(val) => setDraft({ ...draft, startDateTime: val })}
              placeholder={isFormal ? "Выберите время..." : "Выбери время..."}
            />

            {/* 2. Workspace Select Card */}
            {isWorkspaceSearchActive ? (
              <SearchableSelect
                value={draft.workspaceId}
                onChange={val => {
                  setDraft({ ...draft, workspaceId: val, masterId: undefined, serviceId: undefined, stages: undefined, price: undefined })
                  setIsWorkspaceSearchActive(false)
                }}
                options={workspaces?.map(w => ({ id: w.id, name: w.name, subtitle: w.address, color: w.color, avatarUrl: w.avatarUrl })) || []}
                placeholder={isFormal ? "Выберите пространство..." : "Выбери пространство..."}
              />
            ) : (
              <div className="flex items-center justify-between p-4 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {selectedWorkspace?.avatarUrl ? (
                    <img src={selectedWorkspace.avatarUrl} alt={selectedWorkspace.name} className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-panel-border-subtle" />
                  ) : (
                    <IconBox size="lg" shape="squircle" className="bg-panel-base text-panel-text">
                      {selectedWorkspace?.name?.[0]?.toUpperCase() || "П"}
                    </IconBox>
                  )}
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

            {/* 3. Client & Master Section (active when workspace selected) */}
            {draft.workspaceId && (
              <>
                {/* Client Selection */}
                {isClientSearchActive ? (
                  draft.clientId === "new_pending" ? (
                    <div className="flex flex-col gap-4 p-5 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 mt-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-panel-text">Новый клиент</h4>
                        <button
                          onClick={() => setDraft({ ...draft, clientId: undefined })}
                          className="p-1.5 -mr-1.5 rounded-lg text-panel-text-muted hover:text-panel-text hover:bg-panel-base transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Input
                          theme="panel"
                          type="text"
                          placeholder="Имя"
                          value={newClientName}
                          onChange={e => setNewClientName(e.target.value)}
                        />
                        <PhoneInput
                          theme="panel"
                          placeholder="Телефон"
                          value={newClientPhone}
                          error={phoneError || undefined}
                          onChange={(val) => {
                            setNewClientPhone(val)
                            setPhoneError("")
                          }}
                        />
                        <Button
                          variant="primary"
                          theme="panel"
                          fullWidth
                          onClick={() => {
                            if (newClientName && validatePhone(newClientPhone)) {
                              setDraft({ ...draft, clientId: "new", clientName: newClientName, clientPhone: newClientPhone })
                              setIsClientSearchActive(false)
                            } else {
                              setPhoneError("Некорректный номер")
                            }
                          }}
                        >
                          Сохранить клиента
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <SearchableSelect
                      value={draft.clientId}
                      onChange={val => {
                        if (val === "custom") {
                          setDraft({ ...draft, clientId: "new_pending" })
                        } else {
                          setDraft({ ...draft, clientId: "client-1", clientName: "Алина Смирнова", clientPhone: "+7 (999) 123-45-67" })
                          setIsClientSearchActive(false)
                        }
                      }}
                      options={[{ id: "client-1", name: "Алина Смирнова", subtitle: "+7 (999) 123-45-67", color: "#ec4899" }]}
                      placeholder={isFormal ? "Выберите клиента..." : "Выбери клиента..."}
                      showCustomOption={true}
                      customOptionLabel="Создать нового клиента"
                      searchValue={clientSearch}
                      onSearchChange={(val: string) => {
                        setClientSearch(val)
                        setNewClientName(val.replace(/[\d+()-]/g, "").trim())
                        const phoneMatch = val.match(/[\d+()-]+/)
                        if (phoneMatch) setNewClientPhone(phoneMatch[0])
                      }}
                    />
                  )
                ) : (
                  <AppointmentClientCard
                    name={draft.clientName || "Клиент"}
                    phone={draft.clientPhone}
                    onEdit={() => {
                      setDraft({ ...draft, clientId: undefined, clientName: undefined, clientPhone: undefined })
                      setIsClientSearchActive(true)
                    }}
                  />
                )}

                {/* Master & Workspace Grid layout matching Details */}
                {isMasterSearchActive ? (
                  <SearchableSelect
                    value={draft.masterId}
                    onChange={val => { setDraft({ ...draft, masterId: val }); setIsMasterSearchActive(false) }}
                    options={
                      selectedWorkspace?.staff?.map(s => ({
                        id: s.id,
                        name: s.user?.shortName || s.user?.fullName || "Мастер",
                        subtitle: s.mainCategory?.name,
                        avatarUrl: s.user?.avatarUrl,
                        color: s.user?.color
                      })) || [currentUserMasterOption]
                    }
                    placeholder={isFormal ? "Выберите мастера..." : "Выбери мастера..."}
                  />
                ) : (
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
                        setIsMasterSearchActive(true)
                      }}
                      className="px-4 py-2 bg-panel-base border border-panel-border-subtle hover:border-panel-text-muted rounded-xl text-sm font-medium text-panel-text transition-colors shrink-0"
                    >
                      Изменить
                    </button>
                  </div>
                )}

                {/* Service Card Section */}
                {isServiceSearchActive ? (
                  <SearchableSelect
                    value={draft.serviceId}
                    onChange={val => {
                      if (val === "custom") {
                        setDraft({ ...draft, serviceId: "custom", customService: { name: "" }, price: undefined, stages: [{ id: "custom-stage-1", name: "Основной этап", durationMinutes: 60 }] })
                      } else {
                        const srv = MOCK_SERVICES.find(s => s.id === val)
                        if (srv) setDraft({ ...draft, serviceId: srv.id, customService: undefined, price: srv.price, stages: srv.stages })
                      }
                      setIsServiceSearchActive(false)
                    }}
                    options={MOCK_SERVICES.map(s => ({ id: s.id, name: s.name, subtitle: `${s.stages.reduce((acc, st) => acc + st.durationMinutes, 0)} мин • ${s.price} ₽` }))}
                    placeholder={isFormal ? "Выберите услугу..." : "Выбери услугу..."}
                    showCustomOption={true}
                    hideIcon={true}
                  />
                ) : (
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
                              onChange={e => setDraft({ ...draft, customService: { name: e.target.value } })}
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
                          setIsServiceSearchActive(true)
                        }}
                        className="px-4 py-2 bg-panel-base border border-panel-border-subtle hover:border-panel-text-muted rounded-xl text-sm font-medium text-panel-text transition-colors shrink-0"
                      >
                        Изменить
                      </button>
                    </div>

                    {/* Interactive Stage Timeline with Completion Stage */}
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

                    {/* Dedicated Prominent Price Input Section */}
                    <div className="pt-3 border-t border-panel-border-subtle flex items-center justify-between">
                      <span className="text-xs font-semibold text-panel-text-muted">Стоимость услуги</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          value={draft.price || ""}
                          onChange={e => setDraft({ ...draft, price: Number(e.target.value) })}
                          placeholder="0"
                          className="w-32 bg-panel-base border border-panel-border-subtle rounded-xl px-3 py-2 text-base font-bold text-panel-text text-right outline-none focus:border-panel-text transition-colors"
                        />
                        <span className="text-base font-bold text-panel-text">₽</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes & Color Card */}
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

        {/* Footer */}
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
