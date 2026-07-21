import { useState, useMemo } from "react"
import { MapPin, Globe, ChevronDown, Search } from "lucide-react"
import type { CreateWorkspaceFormData } from "../CreateWorkspacePage"

interface Step3LocationProps {
  data: CreateWorkspaceFormData
  onChange: (patch: Partial<CreateWorkspaceFormData>) => void
}

// Common IANA timezones with friendly labels
const TIMEZONES: { value: string; label: string; offset: string }[] = [
  { value: "Europe/Kaliningrad",  label: "Калининград",   offset: "UTC+2" },
  { value: "Europe/Moscow",       label: "Москва",        offset: "UTC+3" },
  { value: "Europe/Samara",       label: "Самара",        offset: "UTC+4" },
  { value: "Asia/Yekaterinburg",  label: "Екатеринбург",  offset: "UTC+5" },
  { value: "Asia/Omsk",           label: "Омск",          offset: "UTC+6" },
  { value: "Asia/Krasnoyarsk",    label: "Красноярск",    offset: "UTC+7" },
  { value: "Asia/Irkutsk",        label: "Иркутск",       offset: "UTC+8" },
  { value: "Asia/Yakutsk",        label: "Якутск",        offset: "UTC+9" },
  { value: "Asia/Vladivostok",    label: "Владивосток",   offset: "UTC+10" },
  { value: "Asia/Magadan",        label: "Магадан",       offset: "UTC+11" },
  { value: "Asia/Kamchatka",      label: "Камчатка",      offset: "UTC+12" },
  { value: "Europe/Kiev",         label: "Киев",          offset: "UTC+2/+3" },
  { value: "Europe/Minsk",        label: "Минск",         offset: "UTC+3" },
  { value: "Asia/Almaty",         label: "Алматы",        offset: "UTC+5" },
  { value: "Asia/Tashkent",       label: "Ташкент",       offset: "UTC+5" },
  { value: "Europe/London",       label: "Лондон",        offset: "UTC+0/+1" },
  { value: "Europe/Paris",        label: "Париж",         offset: "UTC+1/+2" },
  { value: "America/New_York",    label: "Нью-Йорк",      offset: "UTC-5/-4" },
  { value: "America/Los_Angeles", label: "Лос-Анджелес",  offset: "UTC-8/-7" },
  { value: "Asia/Dubai",          label: "Дубай",         offset: "UTC+4" },
  { value: "Asia/Istanbul",       label: "Стамбул",       offset: "UTC+3" },
]

export default function Step3Location({ data, onChange }: Step3LocationProps) {
  const [tzOpen, setTzOpen] = useState(false)
  const [tzSearch, setTzSearch] = useState("")

  const selectedTz = TIMEZONES.find(tz => tz.value === data.timezone) || TIMEZONES[1]

  const filtered = useMemo(() => {
    const q = tzSearch.toLowerCase()
    if (!q) return TIMEZONES
    return TIMEZONES.filter(tz =>
      tz.label.toLowerCase().includes(q) ||
      tz.value.toLowerCase().includes(q) ||
      tz.offset.toLowerCase().includes(q)
    )
  }, [tzSearch])

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Address */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-panel-text-subtle uppercase tracking-wider">
          Адрес
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-panel-text-subtle pointer-events-none" />
          <input
            type="text"
            value={data.address}
            onChange={e => onChange({ address: e.target.value })}
            placeholder="ул. Примерная, д. 1"
            className="w-full bg-panel-surface border border-panel-border rounded-2xl pl-11 pr-4 py-3.5 text-base text-panel-text placeholder:text-panel-text-subtle outline-none focus:border-panel-text-muted transition-colors"
          />
        </div>
        <p className="text-xs text-panel-text-subtle pl-1">Необязательно — клиенты смогут найти вас по адресу</p>
      </div>

      {/* Timezone */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-panel-text-subtle uppercase tracking-wider">
          Часовой пояс
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setTzOpen(v => !v)}
            className="w-full flex items-center gap-3 bg-panel-surface border border-panel-border rounded-2xl px-4 py-3.5 text-left hover:border-panel-text-muted transition-colors"
          >
            <Globe className="w-4 h-4 text-panel-text-subtle shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-base text-panel-text">{selectedTz.label}</span>
              <span className="ml-2 text-sm text-panel-text-subtle">{selectedTz.offset}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-panel-text-subtle shrink-0 transition-transform duration-200 ${tzOpen ? "rotate-180" : ""}`} />
          </button>

          {tzOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-panel-surface border border-panel-border rounded-2xl shadow-xl z-30 overflow-hidden">
              <div className="p-3 border-b border-panel-border-subtle">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-panel-text-subtle" />
                  <input
                    autoFocus
                    type="text"
                    value={tzSearch}
                    onChange={e => setTzSearch(e.target.value)}
                    placeholder="Поиск..."
                    className="w-full bg-panel-base border border-panel-border-subtle rounded-xl pl-9 pr-3 py-2 text-sm text-panel-text placeholder:text-panel-text-subtle outline-none focus:border-panel-text-muted transition-colors"
                  />
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto">
                {filtered.map(tz => (
                  <button
                    key={tz.value}
                    type="button"
                    onClick={() => { onChange({ timezone: tz.value }); setTzOpen(false); setTzSearch("") }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-panel-surface-hover transition-colors ${
                      tz.value === data.timezone ? "bg-panel-surface-hover" : ""
                    }`}
                  >
                    <span className="text-sm text-panel-text">{tz.label}</span>
                    <span className="text-xs text-panel-text-subtle">{tz.offset}</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="px-4 py-6 text-sm text-panel-text-subtle text-center">Ничего не найдено</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
