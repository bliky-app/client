import { useRef } from "react"
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
  "#ec4899", // pink
  "#f43f5e", // rose
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#64748b", // slate
]

const CATEGORIES = [
  "Салон красоты",
  "Барбершоп",
  "Ногтевая студия",
  "Массажный кабинет",
  "Косметологический кабинет",
  "Татуировка и пирсинг",
  "Студия бровей и лashes",
  "Спа",
  "Частная практика",
  "Другое",
]

export default function Step2Details({ data, onChange }: Step2DetailsProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange({ avatarUrl: url })
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Avatar + name row */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => fileRef.current?.click()}
          className="relative w-20 h-20 rounded-3xl shrink-0 overflow-hidden group border-2 border-dashed border-panel-border hover:border-panel-text-muted transition-colors"
        >
          <Avatar
            type="workspace"
            name={data.name || "?"}
            avatarUrl={data.avatarUrl}
            color={data.color}
            className="w-full h-full rounded-3xl text-2xl font-bold"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs font-semibold text-panel-text-subtle uppercase tracking-wider">
            Название
          </label>
          <input
            type="text"
            value={data.name}
            onChange={e => onChange({ name: e.target.value })}
            placeholder="Моё пространство"
            maxLength={50}
            className="w-full bg-panel-surface border border-panel-border rounded-2xl px-4 py-3 text-base text-panel-text placeholder:text-panel-text-subtle outline-none focus:border-panel-text-muted transition-colors"
          />
        </div>
      </div>

      {/* Color accent */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-panel-text-subtle uppercase tracking-wider">
          Цвет-акцент
        </label>
        <div className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map(color => (
            <button
              key={color}
              onClick={() => onChange({ color })}
              className={`w-9 h-9 rounded-2xl transition-all duration-150 active:scale-90 ${
                data.color === color
                  ? "ring-2 ring-offset-2 ring-panel-text scale-110"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          {/* Custom color */}
          <label className="w-9 h-9 rounded-2xl border-2 border-dashed border-panel-border cursor-pointer flex items-center justify-center hover:border-panel-text-muted transition-colors overflow-hidden relative">
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
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onChange({ category: cat })}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-150 active:scale-[0.97] ${
                data.category === cat
                  ? "bg-panel-text text-panel-base"
                  : "bg-panel-surface border border-panel-border text-panel-text-muted-dark hover:border-panel-text-muted hover:text-panel-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
