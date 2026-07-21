import { X } from "lucide-react"
import type { AppointmentDraft } from "@/components/CreateAppointmentSheet"
import Input from "@/components/ui/Input"
import PhoneInput from "@/components/ui/PhoneInput"
import Button from "@workspace/ui/components/AppButton"
import AppointmentClientCard from "@/components/appointment/AppointmentClientCard"

// To use the SearchableSelect from CreateAppointmentSheet, we'll just pass it as a prop or move it.
// I'll export SearchableSelect from CreateAppointmentSheet for now.
import { SearchableSelect } from "@/components/CreateAppointmentSheet"
import type { SearchableSelectOption } from "@/hooks/components/useAppointmentSheetLogic"

interface AppointmentClientSelectProps {
  draft: AppointmentDraft
  setDraft: (draft: AppointmentDraft) => void
  isFormal: boolean
  isActive: boolean
  setIsActive: (val: boolean) => void
  search: string
  setSearch: (val: string) => void
  newName: string
  setNewName: (val: string) => void
  newPhone: string
  setNewPhone: (val: string) => void
  phoneError: string
  setPhoneError: (val: string) => void
  validatePhone: (val: string) => boolean
  options: SearchableSelectOption[]
}

export default function AppointmentClientSelect({
  draft, setDraft,
  isFormal,
  isActive, setIsActive,
  search, setSearch,
  newName, setNewName,
  newPhone, setNewPhone,
  phoneError, setPhoneError,
  validatePhone,
  options
}: AppointmentClientSelectProps) {
  if (!isActive) {
    return (
      <AppointmentClientCard
        name={draft.clientName || "Клиент"}
        phone={draft.clientPhone}
        color={draft.clientColor}
        avatarUrl={draft.clientAvatarUrl}
        onEdit={() => {
          setDraft({ ...draft, clientId: undefined, clientName: undefined, clientPhone: undefined, clientColor: undefined, clientAvatarUrl: undefined })
          setIsActive(true)
        }}
      />
    )
  }

  if (draft.clientId === "new_pending") {
    return (
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
            value={newName}
            onChange={event => setNewName(event.target.value)}
          />
          <PhoneInput
            theme="panel"
            placeholder="Телефон"
            value={newPhone}
            error={phoneError || undefined}
            onChange={(val) => {
              setNewPhone(val)
              setPhoneError("")
            }}
          />
          <Button
            variant="primary"
            theme="panel"
            fullWidth
            onClick={() => {
              if (newName && validatePhone(newPhone)) {
                setDraft({ ...draft, clientId: "new", clientName: newName, clientPhone: newPhone })
                setIsActive(false)
              } else {
                setPhoneError("Некорректный номер")
              }
            }}
          >
            Сохранить клиента
          </Button>
        </div>
      </div>
    )
  }

  return (
    <SearchableSelect
      value={draft.clientId}
      onChange={val => {
        if (val === "custom") {
          setDraft({ ...draft, clientId: "new_pending" })
        } else {
          const selected = options.find(o => o.id === val)
          setDraft({ 
            ...draft, 
            clientId: val, 
            clientName: selected?.name || "Клиент", 
            clientPhone: selected?.subtitle || "",
            clientColor: selected?.color,
            clientAvatarUrl: selected?.avatarUrl
          })
          setIsActive(false)
        }
      }}
      options={options}
      placeholder={isFormal ? "Выберите клиента..." : "Выбери клиента..."}
      showCustomOption={true}
      customOptionLabel="Создать нового клиента"
      searchValue={search}
      onSearchChange={(val: string) => {
        setSearch(val)
        setNewName(val.replace(/[\d+()-]/g, "").trim())
        const phoneMatch = val.match(/[\d+()-]+/)
        if (phoneMatch) setNewPhone(phoneMatch[0])
      }}
    />
  )
}
