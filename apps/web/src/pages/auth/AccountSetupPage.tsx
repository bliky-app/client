import { useState, useRef } from "react"
import { Navigate } from "react-router-dom"
import { Camera, Trash2, Loader2, Sun, Moon, LogOut } from "lucide-react"
import { useAuth } from "@/lib/AuthProvider"
import { useTheme } from "@/lib/ThemeProvider"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Avatar from "@/components/Avatar"
import ColorPicker from "@/components/ui/ColorPicker"
import Select, { type SelectOption } from "@/components/ui/Select"
import { getDefaultTimezone } from "@/lib/formatters"
import type { User } from "@/types/auth.models"

const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: "Europe/Kaliningrad", label: "Калининград", subtitle: "UTC+2" },
  { value: "Europe/Moscow", label: "Москва", subtitle: "UTC+3" },
  { value: "Europe/Samara", label: "Самара", subtitle: "UTC+4" },
  { value: "Asia/Yekaterinburg", label: "Екатеринбург", subtitle: "UTC+5" },
  { value: "Asia/Omsk", label: "Омск", subtitle: "UTC+6" },
  { value: "Asia/Krasnoyarsk", label: "Красноярск", subtitle: "UTC+7" },
  { value: "Asia/Irkutsk", label: "Иркутск", subtitle: "UTC+8" },
  { value: "Asia/Yakutsk", label: "Якутск", subtitle: "UTC+9" },
  { value: "Asia/Vladivostok", label: "Владивосток", subtitle: "UTC+10" },
  { value: "Asia/Magadan", label: "Магадан", subtitle: "UTC+11" },
  { value: "Asia/Kamchatka", label: "Камчатка", subtitle: "UTC+12" },
  { value: "Europe/Minsk", label: "Минск", subtitle: "UTC+3" },
  { value: "Asia/Almaty", label: "Алматы", subtitle: "UTC+5" },
  { value: "Asia/Tashkent", label: "Ташкент", subtitle: "UTC+5" },
  { value: "Europe/London", label: "Лондон", subtitle: "UTC+0/+1" },
  { value: "Europe/Paris", label: "Париж", subtitle: "UTC+1/+2" },
  { value: "America/New_York", label: "Нью-Йорк", subtitle: "UTC-5/-4" },
  { value: "America/Los_Angeles", label: "Лос-Анджелес", subtitle: "UTC-8/-7" },
  { value: "Asia/Dubai", label: "Дубай", subtitle: "UTC+4" },
  { value: "Asia/Istanbul", label: "Стамбул", subtitle: "UTC+3" },
]

export default function AccountSetupPage() {
  const { user, updateProfile, logout, isLoading: isAuthLoading } = useAuth()
  const { theme, setTheme } = useTheme()

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [isFormal, setIsFormal] = useState(user?.isFormal ?? true)
  const [gender, setGender] = useState<"female" | "male">(user?.gender || "female")
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "")
  const [color, setColor] = useState(user?.color || "#ec4899")
  const [timezone, setTimezone] = useState(() => user?.timezone || getDefaultTimezone())

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full bg-hub-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-hub-text-muted" />
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />
  if (user.firstName && user.lastName) return <Navigate to="/" replace />

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      setError("Пожалуйста, укажите имя и фамилию")
      return
    }
    setError("")
    setIsLoading(true)
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        isFormal,
        gender,
        avatarUrl,
        color,
        timezone,
      })
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при сохранении профиля")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-hub-base flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-bold tracking-tight text-hub-text">
            {isFormal ? "Расскажите о себе" : "Расскажи о себе"}
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl bg-hub-surface/40 border border-hub-border/40 hover:bg-hub-surface text-hub-text transition-colors"
              title="Сменить тему"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all active:scale-95"
              title="Выйти из аккаунта"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* Top Banner Card: Avatar Photo Left + ColorPicker Directly Right */}
          <div className="bg-panel-surface border border-panel-border rounded-[32px] p-6 shadow-xl flex flex-row items-center gap-6 animate-in fade-in zoom-in-95 duration-500 delay-150">
            <div className="relative group shrink-0">
              {(() => {
                const draftUser: User = {
                  id: user?.id || "temp",
                  phone: user?.phone || "",
                  firstName,
                  lastName,
                  fullName: `${firstName} ${lastName}`.trim(),
                  shortName: firstName || lastName || "Пользователь",
                  avatarUrl,
                  color,
                  gender,
                  isFormal,
                  timezone,
                  globalRole: user?.globalRole || { id: "master", name: "Master", permissions: [] },
                }
                return (
                  <Avatar
                    data={draftUser}
                    className="w-24 h-24 rounded-full text-2xl shadow-md border-2 border-panel-border transition-transform group-hover:scale-105"
                  />
                )
              })()}
              {avatarUrl ? (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarUrl("")
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all active:scale-95"
                  title="Удалить фото"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-panel-text text-panel-base shadow-lg hover:opacity-90 transition-all active:scale-95"
                  title="Загрузить фото"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="h-12 w-px bg-panel-border-subtle shrink-0" />

            <div className="flex-1 min-w-0 flex justify-start">
              <ColorPicker
                value={color}
                onChange={setColor}
              />
            </div>
          </div>

          {/* Main Info Card */}
          <div className="bg-panel-surface border border-panel-border rounded-[32px] p-6 shadow-xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-500 delay-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                label="Имя"
                theme="panel"
                type="text"
                autoFocus
                placeholder="Иван"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setError("") }}
                inputClassName="py-3 text-base font-medium"
                containerClassName="flex-1"
              />
              <Input
                label="Фамилия"
                theme="panel"
                type="text"
                placeholder="Иванов"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setError("") }}
                inputClassName="py-3 text-base font-medium"
                containerClassName="flex-1"
              />
            </div>

            {/* Gender Segment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-panel-text-muted">
                {isFormal ? "Ваш пол" : "Твой пол"}
              </label>
              <div className="flex bg-panel-base p-1 rounded-2xl border border-panel-border-subtle">
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    gender === "female"
                      ? "bg-panel-surface text-panel-text shadow-sm border border-panel-border-subtle font-semibold"
                      : "text-panel-text-muted hover:text-panel-text"
                  }`}
                >
                  Женский
                </button>
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    gender === "male"
                      ? "bg-panel-surface text-panel-text shadow-sm border border-panel-border-subtle font-semibold"
                      : "text-panel-text-muted hover:text-panel-text"
                  }`}
                >
                  Мужской
                </button>
              </div>
            </div>

            {/* Formality Segment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-panel-text-muted">
                {isFormal ? "Как к вам обращаться?" : "Как к тебе обращаться?"}
              </label>
              <div className="flex bg-panel-base p-1 rounded-2xl border border-panel-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsFormal(true)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    isFormal
                      ? "bg-panel-surface text-panel-text shadow-sm border border-panel-border-subtle font-semibold"
                      : "text-panel-text-muted hover:text-panel-text"
                  }`}
                >
                  На Вы
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormal(false)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    !isFormal
                      ? "bg-panel-surface text-panel-text shadow-sm border border-panel-border-subtle font-semibold"
                      : "text-panel-text-muted hover:text-panel-text"
                  }`}
                >
                  На Ты
                </button>
              </div>
            </div>

            {/* Timezone selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-panel-text-muted">
                Часовой пояс
              </label>
              <Select
                theme="panel"
                searchable
                hideIcon
                value={timezone}
                options={TIMEZONE_OPTIONS}
                placeholder="Выбрать часовой пояс"
                onChange={setTimezone}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              theme="panel"
              loading={isLoading}
              disabled={!firstName.trim() || !lastName.trim()}
              fullWidth
              className="mt-2"
            >
              Начать работу
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
