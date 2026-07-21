import { Camera, X, Star, Trash2, MapPin } from "lucide-react"
import type { CreateWorkspaceFormData } from "../CreateWorkspacePage"
import Avatar from "@/components/Avatar"
import Input from "@/components/ui/Input"
import ColorPicker from "@/components/ui/ColorPicker"
import SearchableSelect from "@/components/ui/SearchableSelect"
import { useStep2Details, TZ_OPTIONS } from "@/hooks/workspace/useStep2Details"

interface Step2DetailsProps {
  data: CreateWorkspaceFormData
  onChange: (patch: Partial<CreateWorkspaceFormData>) => void
}

export default function Step2Details({ data, onChange }: Step2DetailsProps) {
  const {
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
  } = useStep2Details(data, onChange)

  return (
    <div className="flex flex-col pt-2 pb-6">
      <div className="mb-6 bg-panel-surface border border-panel-border rounded-[32px] p-6 shadow-sm flex flex-row items-center gap-6">
        <div className="relative group shrink-0">
          <Avatar
            data={draftWorkspace}
            className="w-24 h-24 rounded-full text-2xl shadow-md border-2 border-panel-border transition-transform group-hover:scale-105"
          />
          {data.avatarUrl ? (
            <button
              type="button"
              onClick={() => {
                onChange({ avatarUrl: "" })
                if (fileRef.current) fileRef.current.value = ""
              }}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all active:scale-95"
              title="Удалить фото"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-panel-text text-panel-base shadow-lg hover:opacity-90 transition-all active:scale-95"
              title="Загрузить фото"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="h-12 w-px bg-panel-border-subtle shrink-0" />

        <div className="flex-1 min-w-0 flex justify-start">
          <ColorPicker
            value={data.color}
            onChange={(color) => onChange({ color })}
          />
        </div>
      </div>
      <div className="bg-panel-surface border border-panel-border rounded-[32px] p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col gap-1 relative">
          <Input
            label="Название"
            theme="panel"
            type="text"
            value={data.name}
            onChange={e => onChange({ name: e.target.value })}
            placeholder="Моё пространство"
            maxLength={32}
            inputClassName="py-3 text-base font-medium pr-16"
          />
          <span className={`absolute right-4 bottom-3 text-xs font-medium pointer-events-none ${
            data.name.length < 4 ? "text-red-500" : "text-panel-text-subtle"
          }`}>
            {data.name.length}/32
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold text-panel-text-muted">
            Категории и направления
          </label>
          <div
            className="w-full bg-panel-base border border-panel-border-subtle rounded-2xl p-2.5 min-h-13 flex flex-wrap items-center gap-2 focus-within:border-panel-text-muted transition-colors cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            {selectedCategories.map((cat, idx) => {
              const isMain = idx === 0
              return (
                <div
                  key={cat}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium animate-in zoom-in-95 duration-150 ${
                    isMain
                      ? "bg-panel-text text-panel-base shadow-xs"
                      : "bg-panel-surface border border-panel-border-subtle text-panel-text"
                  }`}
                >
                  {isMain && <Star className="w-3.5 h-3.5" fill="currentColor" />}
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeCategory(cat)
                    }}
                    className={`p-0.5 rounded-full hover:bg-black/10 transition-colors ${
                      isMain ? "text-panel-base/80" : "text-panel-text-muted"
                    }`}
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
              className="flex-1 min-w-30 bg-transparent outline-none text-sm text-panel-text placeholder:text-panel-text-subtle py-1 px-2"
            />
          </div>
          {suggestedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {suggestedCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => addCategory(cat)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-panel-base border border-panel-border-subtle text-panel-text-muted hover:border-panel-text-muted hover:text-panel-text transition-colors"
                >
                  + {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        <Input
          theme="panel"
          label="Адрес"
          type="text"
          value={data.address}
          onChange={e => onChange({ address: e.target.value })}
          placeholder="ул. Примерная, д. 1"
          icon={<MapPin className="w-4 h-4" />}
          inputClassName="py-3 text-base font-medium"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-panel-text-muted">
            Часовой пояс
          </label>
          <SearchableSelect
            theme="panel"
            hideIcon
            value={data.timezone}
            options={TZ_OPTIONS}
            placeholder="Выбрать часовой пояс"
            onChange={(val) => onChange({ timezone: val })}
          />
        </div>
      </div>
    </div>
  )
}
