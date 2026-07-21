import { useRef, useMemo, useState } from "react"
import type { KeyboardEvent } from "react"
import type { CreateWorkspaceFormData } from "@/hooks/workspace/useCreateWorkspace"
import type { Workspace } from "@/types/models"
import type { SelectOption } from "@/components/ui/Select"

export const CATEGORIES_INDIVIDUAL = [
  "Колорист", "Стилист по волосам", "Массажист",
  "Мастер маникюра", "Косметолог", "Бровист",
  "Мастер по ресницам", "Барбер",
]

export const CATEGORIES_SHARED = [
  "Салон красоты", "Барбершоп", "Ногтевая студия",
  "Спа", "Клиника эстетической медицины", "Студия красоты",
]

export const TIMEZONES: { value: string; label: string; offset: string }[] = [
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

export const TZ_OPTIONS: SelectOption[] = TIMEZONES.map((tz) => ({
  value: tz.value,
  label: tz.label,
  subtitle: tz.offset,
}))

export function useStep2Details(
  data: CreateWorkspaceFormData,
  onChange: (patch: Partial<CreateWorkspaceFormData>) => void
) {
  const fileRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState("")

  const availableCategories = data.type === "individual" ? CATEGORIES_INDIVIDUAL : CATEGORIES_SHARED

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange({ avatarUrl: url })
  }

  const selectedCategories = useMemo(() => {
    const list = []
    if (data.category) list.push(data.category)
    if (data.additionalCategories) list.push(...data.additionalCategories)
    return list
  }, [data.category, data.additionalCategories])

  const updateCategories = (newList: string[]) => {
    if (newList.length === 0) {
      onChange({ category: "", additionalCategories: [] })
    } else {
      onChange({ category: newList[0], additionalCategories: newList.slice(1) })
    }
  }

  const addCategory = (cat: string) => {
    const trimmed = cat.trim()
    if (!trimmed || selectedCategories.includes(trimmed)) return
    updateCategories([...selectedCategories, trimmed])
    setInputValue("")
  }

  const removeCategory = (cat: string) => {
    updateCategories(selectedCategories.filter((c) => c !== cat))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addCategory(inputValue)
    } else if (e.key === "Backspace" && !inputValue && selectedCategories.length > 0) {
      removeCategory(selectedCategories[selectedCategories.length - 1])
    }
  }

  const suggestedCategories = availableCategories.filter(
    (c) => !selectedCategories.includes(c)
  )

  const draftWorkspace: Workspace = {
    id: "temp",
    name: data.name || "Пространство",
    type: data.type || "individual",
    category: data.category,
    color: data.color,
    avatarUrl: data.avatarUrl,
    timezone: data.timezone,
    address: data.address,
    schedule: data.schedule,
    staff: [],
  }

  return {
    fileRef,
    inputRef,
    inputValue,
    setInputValue,
    handleFileChange,
    selectedCategories,
    addCategory,
    removeCategory,
    handleKeyDown,
    suggestedCategories,
    draftWorkspace,
  }
}
