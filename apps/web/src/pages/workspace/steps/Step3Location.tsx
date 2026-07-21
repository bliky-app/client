import { useState, useMemo } from "react"
import { MapPin, Globe } from "lucide-react"
import type { CreateWorkspaceFormData } from "../CreateWorkspacePage"
import Input from "@/components/ui/Input"
import Select, { type SelectOption } from "@/components/ui/Select"
import { usePermissions } from "@/lib/permissions"

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

const TZ_OPTIONS: SelectOption[] = TIMEZONES.map(tz => ({
  value: tz.value,
  label: tz.label,
  subtitle: tz.offset,
}))

export default function Step3Location({ data, onChange }: Step3LocationProps) {
  const { user } = usePermissions()
  const isFormal = user?.isFormal ?? true

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Address */}
      <Input
        theme="panel"
        label="Адрес"
        type="text"
        value={data.address}
        onChange={e => onChange({ address: e.target.value })}
        placeholder="ул. Примерная, д. 1"
        icon={<MapPin className="w-4 h-4" />}
        hint={isFormal ? "Необязательно, но поможет клиентам быстрее вас найти" : "Необязательно, но поможет клиентам быстрее тебя найти"}
      />

      {/* Timezone */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-panel-text-muted">
          Часовой пояс
        </label>
        <Select
          theme="panel"
          searchable
          hideIcon
          value={data.timezone}
          options={TZ_OPTIONS}
          placeholder="Выбрать часовой пояс"
          onChange={(val) => onChange({ timezone: val })}
        />
        <p className="text-xs pl-1 text-panel-text-subtle flex items-center gap-1.5">
          <Globe className="w-3 h-3 shrink-0" />
          Влияет на отображение расписания и уведомления клиентам
        </p>
      </div>
    </div>
  )
}
