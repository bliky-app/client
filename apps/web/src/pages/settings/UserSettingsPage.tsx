import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { X, Check, Sun, Moon, Monitor, LogOut, Camera, Trash2, ShieldCheck } from "lucide-react"
import { useAuth } from "@/lib/AuthProvider"
import { useTheme } from "@/lib/ThemeProvider"
import { useToast } from "@/lib/ToastProvider"
import Avatar from "@/components/Avatar"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import PasswordInput from "@/components/ui/PasswordInput"
import ColorPicker from "@/components/ui/ColorPicker"
import Select, { type SelectOption } from "@/components/ui/Select"
import { getDefaultTimezone } from "@/lib/formatters"
import type { User as UserType } from "@/types/models"

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

export default function UserSettingsPage() {
  const navigate = useNavigate()
  const { user, updateProfile, changePassword, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { showToast } = useToast()

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [isFormal, setIsFormal] = useState(user?.isFormal ?? true)
  const [gender, setGender] = useState<"female" | "male">(user?.gender || "female")
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "")
  const [color, setColor] = useState(user?.color || "#ec4899")
  const [timezone, setTimezone] = useState(() => user?.timezone || getDefaultTimezone())

  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [error, setError] = useState("")

  // Password Change State
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setIsFormal(user.isFormal ?? true)
      setGender(user.gender || "female")
      setAvatarUrl(user.avatarUrl || "")
      setColor(user.color || "#ec4899")
      setTimezone(user.timezone || getDefaultTimezone())
    }
  }, [user])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
    }
  }

  // Initial user values for diff comparison
  const initialFirstName = user?.firstName || ""
  const initialLastName = user?.lastName || ""
  const initialIsFormal = user?.isFormal ?? true
  const initialGender = user?.gender || "female"
  const initialAvatarUrl = user?.avatarUrl || ""
  const initialColor = user?.color || "#ec4899"
  const initialTimezone = user?.timezone || getDefaultTimezone()

  // Check if any field has actually changed
  const hasChanges =
    firstName.trim() !== initialFirstName ||
    lastName.trim() !== initialLastName ||
    isFormal !== initialIsFormal ||
    gender !== initialGender ||
    avatarUrl !== initialAvatarUrl ||
    color !== initialColor ||
    timezone !== initialTimezone

  const canSave = firstName.trim().length > 0 && lastName.trim().length > 0 && hasChanges

  const handleSave = async () => {
    if (!canSave || isSaving) return
    setIsSaving(true)
    setError("")
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
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2000)
    } catch (e: any) {
      setError(e.message || "Ошибка при сохранении")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePasswordSubmit = async () => {
    if (!currentPassword) {
      setPasswordError(isFormal ? "Пожалуйста, введите текущий пароль" : "Пожалуйста, введи текущий пароль")
      return
    }
    if (newPassword.length < 8) {
      setPasswordError("Новый пароль должен содержать минимум 8 символов")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают")
      return
    }

    setIsChangingPassword(true)
    setPasswordError("")
    try {
      await changePassword(currentPassword, newPassword)
      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      showToast("Пароль успешно обновлён!", "success")
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (e: any) {
      setPasswordError(e.message || "Ошибка при смене пароля")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/auth")
  }

  // Draft user object for live Avatar preview
  const draftUser: UserType | null = user
    ? {
        ...user,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`.trim(),
        shortName: firstName || lastName || "Пользователь",
        avatarUrl,
        color,
        gender,
        isFormal,
        timezone,
      }
    : null

  return (
    <div className="flex flex-col flex-1 bg-hub-base h-svh overflow-hidden">
      {/* White wizard panel */}
      <div className="flex flex-col flex-1 bg-panel-base rounded-t-[32px] mt-16 shadow-[0_-8px_32px_rgba(0,0,0,0.18)] overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-4 shrink-0 border-b border-panel-border-subtle">
          <h1 className="text-xl font-bold text-panel-text leading-tight truncate">
            Профиль
          </h1>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="p-2 -mr-2 rounded-full text-panel-text-muted hover:text-panel-text hover:bg-panel-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col relative">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* 1. Top Banner Card: Avatar Photo Left + ColorPicker Directly Right */}
          <div className="mb-6 bg-panel-surface border border-panel-border rounded-[32px] p-6 shadow-sm flex flex-row items-center gap-6">
            <div className="relative group shrink-0">
              {draftUser && (
                <Avatar
                  data={draftUser}
                  className="w-24 h-24 rounded-full text-2xl shadow-md border-2 border-panel-border transition-transform group-hover:scale-105"
                />
              )}
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

          {/* 2. Main Form Fields Card */}
          <div className="mb-6 bg-panel-surface border border-panel-border rounded-[32px] p-6 shadow-sm flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                label="Имя"
                theme="panel"
                type="text"
                placeholder="Имя"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setError("") }}
                inputClassName="py-3 text-base font-medium"
                containerClassName="flex-1"
              />
              <Input
                label="Фамилия"
                theme="panel"
                type="text"
                placeholder="Фамилия"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setError("") }}
                inputClassName="py-3 text-base font-medium"
                containerClassName="flex-1"
              />
            </div>

            {/* Read-only Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-panel-text-muted">
                Номер телефона
              </label>
              <input
                type="text"
                value={user?.phone || ""}
                disabled
                className="w-full px-3.5 py-3 rounded-2xl bg-panel-base/50 border border-panel-border-subtle text-base font-medium text-panel-text-muted cursor-not-allowed"
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
                  onClick={() => setGender("male")}
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

            {/* Formality Preference (isFormal) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-panel-text-muted">
                {isFormal ? "Как к вам обращаться?" : "Как к тебе обращаться?"}
              </label>
              <div className="flex bg-panel-base p-1 rounded-2xl border border-panel-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsFormal(true)}
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
                  onClick={() => setIsFormal(false)}
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
          </div>

          {/* 3. Theme Preference Card */}
          <div className="mb-6 bg-panel-surface border border-panel-border rounded-[32px] p-6 shadow-sm flex flex-col">
            <div className="flex bg-panel-base p-1 rounded-2xl border border-panel-border-subtle">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  theme === "light"
                    ? "bg-panel-surface text-panel-text shadow-xs border border-panel-border-subtle font-semibold"
                    : "text-panel-text-muted hover:text-panel-text"
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Светлая</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  theme === "dark"
                    ? "bg-panel-surface text-panel-text shadow-xs border border-panel-border-subtle font-semibold"
                    : "text-panel-text-muted hover:text-panel-text"
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Тёмная</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  theme === "system"
                    ? "bg-panel-surface text-panel-text shadow-xs border border-panel-border-subtle font-semibold"
                    : "text-panel-text-muted hover:text-panel-text"
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Авто</span>
              </button>
            </div>
          </div>

          {/* Sticky Save Bar (Padded & solid bg-panel-base with zero empty gap underneath) */}
          <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-panel-base border-t border-panel-border-subtle shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-20">
            <Button
              variant="primary"
              theme="panel"
              fullWidth
              disabled={!canSave || isSaving}
              onClick={handleSave}
            >
              {savedSuccess ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Сохранено!</span>
                </span>
              ) : isSaving ? (
                "Сохранение..."
              ) : (
                "Сохранить изменения"
              )}
            </Button>
          </div>

          {/* 4. Password Change Card */}
          <div className="mt-6 mb-6 bg-panel-surface border border-panel-border rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col min-w-0">
                <h2 className="text-sm font-semibold text-panel-text truncate">Смена пароля</h2>
                <span className="text-xs text-panel-text-muted truncate">
                  {isFormal ? "Для защиты вашего аккаунта" : "Для защиты твоего аккаунта"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(!showPasswordForm)
                  setPasswordError("")
                  setPasswordSuccess(false)
                }}
                className="px-3.5 py-2 rounded-xl bg-panel-base hover:bg-panel-surface-hover text-panel-text border border-panel-border-subtle text-xs font-semibold transition-colors shrink-0"
              >
                {showPasswordForm ? "Отмена" : "Изменить"}
              </button>
            </div>

            {showPasswordForm && (
              <div className="flex flex-col gap-4 pt-3 border-t border-panel-border-subtle animate-in fade-in slide-in-from-top-2 duration-200">
                {passwordError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Пароль успешно обновлён!</span>
                  </div>
                )}

                <PasswordInput
                  label="Текущий пароль"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError("") }}
                />

                <PasswordInput
                  label="Новый пароль"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordError("") }}
                  showRules
                />

                <PasswordInput
                  label={isFormal ? "Подтвердите пароль" : "Подтверди пароль"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError("") }}
                />

                <div className="pt-1 flex justify-end">
                  <Button
                    variant="secondary"
                    theme="panel"
                    disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                    onClick={handleChangePasswordSubmit}
                  >
                    {isChangingPassword ? "Сохранение..." : "Сохранить"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 5. Danger Zone / Logout (Placed cleanly below Password Change card) */}
          <div className="mb-6 bg-red-500/5 border border-red-500/10 rounded-[32px] p-6 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-red-500">Завершить сеанс</span>
              <span className="text-[11px] text-panel-text-muted">Выйти из текущего аккаунта на этом устройстве</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-medium transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
