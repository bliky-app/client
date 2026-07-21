import { useRef, useMemo, useState } from "react"
import type { KeyboardEvent } from "react"
import { Camera, X, Star } from "lucide-react"
import type { CreateWorkspaceFormData } from "../CreateWorkspacePage"
import Avatar from "@/components/Avatar"

interface Step2DetailsProps {
  data: CreateWorkspaceFormData
  onChange: (patch: Partial<CreateWorkspaceFormData>) => void
}

const ACCENT_COLORS = [
  "#6366f1", "#8b5cf6", "#d946ef", "#ec4899",
  "#f43f5e", "#ef4444", "#f97316", "#eab308",
  "#84cc16", "#22c55e", "#10b981", "#14b8a6",
  "#06b6d4", "#0ea5e9", "#3b82f6", "#64748b",
]

const CATEGORIES_INDIVIDUAL = [
  "Колорист", "Стилист по волосам", "Массажист",
  "Мастер маникюра", "Косметолог", "Бровист",
  "Мастер по ресницам", "Барбер",
]

const CATEGORIES_SHARED = [
  "Салон красоты", "Барбершоп", "Ногтевая студия",
  "Спа", "Клиника эстетической медицины", "Студия красоты",
]

export default function Step2Details({ data, onChange }: Step2DetailsProps) {
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
    updateCategories(selectedCategories.filter(c => c !== cat))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addCategory(inputValue)
    } else if (e.key === "Backspace" && !inputValue && selectedCategories.length > 0) {
      removeCategory(selectedCategories[selectedCategories.length - 1])
    }
  }

  // Filter out already selected categories for the suggestions list
  const suggestedCategories = availableCategories.filter(c => !selectedCategories.includes(c))

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

      {/* Categories Tag Input */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-panel-text-subtle uppercase tracking-wider">
          Направления и услуги
        </label>
        
        {/* Input container */}
        <div 
          className="w-full bg-panel-surface border border-panel-border rounded-2xl p-2 min-h-[52px] flex flex-wrap items-center gap-2 focus-within:border-panel-text-muted transition-colors cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {selectedCategories.map((cat, idx) => {
            const isMain = idx === 0
            return (
              <div 
                key={cat} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium animate-in zoom-in-95 duration-150 ${
                  isMain 
                    ? "bg-panel-text text-panel-base" 
                    : "bg-panel-border-subtle text-panel-text-muted-dark"
                }`}
              >
                {isMain && <Star className="w-3.5 h-3.5" fill="currentColor" />}
                <span>{cat}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    removeCategory(cat)
                  }}
                  className={`p-0.5 rounded-full hover:bg-black/10 transition-colors ${isMain ? "text-panel-base/80" : "text-panel-text-muted"}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
          
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputValue) addCategory(inputValue)
            }}
            placeholder={selectedCategories.length === 0 ? "Например: Массаж, СПА..." : ""}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-panel-text placeholder:text-panel-text-subtle py-1 px-2"
          />
        </div>

        {/* Suggestions */}
        {suggestedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {suggestedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => addCategory(cat)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-panel-surface border border-panel-border text-panel-text-muted-dark hover:border-panel-text-muted hover:text-panel-text transition-colors"
              >
                + {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
