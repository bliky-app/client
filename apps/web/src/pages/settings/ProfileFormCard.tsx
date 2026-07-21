import Input from "@/components/ui/Input"
import Select, { type SelectOption } from "@/components/ui/Select"

const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: "Europe/Kaliningrad",  label: "Калининград",   subtitle: "UTC+2" },
  { value: "Europe/Moscow",       label: "Москва",        subtitle: "UTC+3" },
  { value: "Europe/Samara",       label: "Самара",        subtitle: "UTC+4" },
  { value: "Asia/Yekaterinburg",  label: "Екатеринбург",  subtitle: "UTC+5" },
  { value: "Asia/Omsk",           label: "Омск",          subtitle: "UTC+6" },
  { value: "Asia/Krasnoyarsk",    label: "Красноярск",    subtitle: "UTC+7" },
  { value: "Asia/Irkutsk",        label: "Иркутск",       subtitle: "UTC+8" },
  { value: "Asia/Yakutsk",        label: "Якутск",        subtitle: "UTC+9" },
  { value: "Asia/Vladivostok",    label: "Владивосток",   subtitle: "UTC+10" },
  { value: "Asia/Magadan",        label: "Магадан",       subtitle: "UTC+11" },
  { value: "Asia/Kamchatka",      label: "Камчатка",      subtitle: "UTC+12" },
  { value: "Europe/Minsk",        label: "Минск",         subtitle: "UTC+3" },
  { value: "Asia/Almaty",         label: "Алматы",        subtitle: "UTC+5" },
  { value: "Asia/Tashkent",       label: "Ташкент",       subtitle: "UTC+5" },
  { value: "Europe/London",       label: "Лондон",        subtitle: "UTC+0/+1" },
  { value: "Europe/Paris",        label: "Париж",         subtitle: "UTC+1/+2" },
  { value: "America/New_York",    label: "Нью-Йорк",      subtitle: "UTC-5/-4" },
  { value: "America/Los_Angeles", label: "Лос-Анджелес",  subtitle: "UTC-8/-7" },
  { value: "Asia/Dubai",          label: "Дубай",         subtitle: "UTC+4" },
  { value: "Asia/Istanbul",       label: "Стамбул",       subtitle: "UTC+3" },
]

interface ProfileFormCardProps {
  firstName: string
  lastName: string
  phone: string
  isFormal: boolean
  gender: "female" | "male"
  timezone: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onGenderChange: (value: "female" | "male") => void
  onFormalChange: (value: boolean) => void
  onTimezoneChange: (value: string) => void
  onClearError: () => void
}

export default function ProfileFormCard({
  firstName,
  lastName,
  phone,
  isFormal,
  gender,
  timezone,
  onFirstNameChange,
  onLastNameChange,
  onGenderChange,
  onFormalChange,
  onTimezoneChange,
  onClearError,
}: ProfileFormCardProps) {
  return (
    <div className="mb-6 bg-panel-surface border border-panel-border rounded-[32px] p-6 shadow-sm flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          label="Имя"
          theme="panel"
          type="text"
          placeholder="Имя"
          value={firstName}
          onChange={(event) => {
            onFirstNameChange(event.target.value)
            onClearError()
          }}
          inputClassName="py-3 text-base font-medium"
          containerClassName="flex-1"
        />
        <Input
          label="Фамилия"
          theme="panel"
          type="text"
          placeholder="Фамилия"
          value={lastName}
          onChange={(event) => {
            onLastNameChange(event.target.value)
            onClearError()
          }}
          inputClassName="py-3 text-base font-medium"
          containerClassName="flex-1"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-panel-text-muted">Номер телефона</label>
        <input
          type="text"
          value={phone}
          disabled
          className="w-full px-3.5 py-3 rounded-2xl bg-panel-base/50 border border-panel-border-subtle text-base font-medium text-panel-text-muted cursor-not-allowed"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-panel-text-muted">
          {isFormal ? "Ваш пол" : "Твой пол"}
        </label>
        <div className="flex bg-panel-base p-1 rounded-2xl border border-panel-border-subtle">
          <button
            type="button"
            onClick={() => onGenderChange("female")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
              gender === "female"
                ? "bg-panel-surface text-panel-text shadow-xs border border-panel-border-subtle font-semibold"
                : "text-panel-text-muted hover:text-panel-text"
            }`}
          >
            Женский
          </button>
          <button
            type="button"
            onClick={() => onGenderChange("male")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
              gender === "male"
                ? "bg-panel-surface text-panel-text shadow-xs border border-panel-border-subtle font-semibold"
                : "text-panel-text-muted hover:text-panel-text"
            }`}
          >
            Мужской
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-panel-text-muted">
          {isFormal ? "Как к вам обращаться?" : "Как к тебе обращаться?"}
        </label>
        <div className="flex bg-panel-base p-1 rounded-2xl border border-panel-border-subtle">
          <button
            type="button"
            onClick={() => onFormalChange(true)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
              isFormal
                ? "bg-panel-surface text-panel-text shadow-xs border border-panel-border-subtle font-semibold"
                : "text-panel-text-muted hover:text-panel-text"
            }`}
          >
            На Вы
          </button>
          <button
            type="button"
            onClick={() => onFormalChange(false)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
              !isFormal
                ? "bg-panel-surface text-panel-text shadow-xs border border-panel-border-subtle font-semibold"
                : "text-panel-text-muted hover:text-panel-text"
            }`}
          >
            На Ты
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-panel-text-muted">Часовой пояс</label>
        <Select
          theme="panel"
          searchable
          hideIcon
          value={timezone}
          options={TIMEZONE_OPTIONS}
          placeholder="Выбрать часовой пояс"
          onChange={onTimezoneChange}
        />
      </div>
    </div>
  )
}
