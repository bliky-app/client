import { useRef, useMemo } from "react"
import { Camera } from "lucide-react"
import type { CreateWorkspaceFormData } from "../CreateWorkspacePage"
import Avatar from "@/components/Avatar"

interface Step2DetailsProps {
  data: CreateWorkspaceFormData
  onChange: (patch: Partial<CreateWorkspaceFormData>) => void
}

const ACCENT_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#f43f5e", // rose
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#0ea5e9", // sky
  "#3b82f6", // blue
  "#64748b", // slate
]

const CATEGORIES_INDIVIDUAL = [
  "Колорист",
  "Стилист по волосам",
  "Массажист",
  "Мастер маникюра",
  "Косметолог",
  "Бровист",
  "Мастер по ресницам",
  "Барбер",
  "Другое",
]

const CATEGORIES_SHARED = [
  "Салон красоты",
  "Барбершоп",
  "Ногтевая студия",
  "Спа",
  "Клиника эстетической медицины",
  "Студия красоты",
  "Коворкинг",
  "Другое",
]

export default function Step2Details({ data, onChange }: Step2DetailsProps) {
  const fileRef = useRef<HTMLInputElement>(null)

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

  const toggleCategory = (cat: string) => {
    const isSelected = selectedCategories.includes(cat)
    let newList = []
    
    if (isSelected) {
      newList = selectedCategories.filter(c => c !== cat)
    } else {
      newList = [...selectedCategories, cat]
    }

    if (newList.length === 0) {
      onChange({ category: "", additionalCategories: [] })
    } else {
      onChange({ category: newList[0], additionalCategories: newList.slice(1) })
    }
  }

  const hasOther = selectedCategories.includes("Другое")

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Avatar + name row */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => fileRef.current?.click()}
          className="relative w-20 h-20 rounded-full shrink-0 overflow-hidden group border-2 border-dashed border-panel-border hover:border-panel-text-muted transition-colors"
        >
          <Avatar
            type="workspace"
            name={data.name || "?"}
            avatarUrl={data.avatarUrl}
            color={data.color}
            className="w-full h-full rounded-full text-2xl font-bold"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <div className="flex-1 flex flex-col gap-1 relative">
          <label className="text-xs font-semibold text-panel-text-subtle uppercase tracking-wider">
            Название
          </label>
          <input
            type="text"
            value={data.name}
            onChange={e => onChange({ name: e.target.value })}
            placeholder="Моё пространство"
            maxLength={32}
            className="w-full bg-panel-surface border border-panel-border rounded-2xl px-4 py-3 text-base text-panel-text placeholder:text-panel-text-subtle outline-none focus:border-panel-text-muted transition-colors"
          />
          <span className={`absolute right-4 bottom-3 text-xs font-medium ${data.name.length < 4 ? 'text-red-500' : 'text-panel-text-subtle'}`}>
            {data.name.length}/32
          </span>
        </div>
      </div>

      {/* Color accent */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-panel-text-subtle uppercase tracking-wider">
          Фирменный цвет
        </label>
        <div className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map(color => (
            <button
              key={color}
              onClick={() => onChange({ color })}
              className={`w-9 h-9 rounded-full transition-all duration-150 active:scale-90 ${
                data.color === color
                  ? "ring-2 ring-offset-2 ring-panel-text scale-110"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          {/* Custom color */}
          <label className="w-9 h-9 rounded-full border-2 border-dashed border-panel-border cursor-pointer flex items-center justify-center hover:border-panel-text-muted transition-colors overflow-hidden relative">
            <span className="text-xs text-panel-text-subtle select-none">+</span>
            <input
              type="color"
              value={data.color}
              onChange={e => onChange({ color: e.target.value })}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-panel-text-subtle uppercase tracking-wider">
          Категория
        </label>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map(cat => {
            const isSelected = selectedCategories.includes(cat)
            const isMain = isSelected && selectedCategories[0] === cat

            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-150 active:scale-[0.97] flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-panel-text text-panel-base"
                    : "bg-panel-surface border border-panel-border text-panel-text-muted-dark hover:border-panel-text-muted hover:text-panel-text"
                }`}
              >
                {cat}
                {isMain && selectedCategories.length > 1 && (
                  <span className="opacity-70 text-[10px] uppercase tracking-wider ml-1 -mr-1">(Основная)</span>
                )}
              </button>
            )
          })}
        </div>

        {hasOther && (
          <div className="mt-2 animate-in slide-in-from-top-2 fade-in duration-200">
            <input
              type="text"
              value={data.customCategory}
              onChange={e => onChange({ customCategory: e.target.value })}
              placeholder="Укажите вашу категорию..."
              className="w-full bg-panel-surface border border-panel-border rounded-2xl px-4 py-3 text-sm text-panel-text placeholder:text-panel-text-subtle outline-none focus:border-panel-text-muted transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  )
}
