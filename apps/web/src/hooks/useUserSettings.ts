import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthProvider"
import { useToast } from "@/lib/ToastProvider"
import { getDefaultTimezone } from "@/lib/formatters"
import type { User } from "@/types/auth.models"

interface ProfileFormState {
  firstName: string
  lastName: string
  isFormal: boolean
  gender: "female" | "male"
  avatarUrl: string
  color: string
  timezone: string
}

/**
 * Инкапсулирует всю логику формы настроек профиля:
 * редактирование полей, смена пароля, аватар, выход.
 */
export function useUserSettings() {
  const navigate = useNavigate()
  const { user, updateProfile, changePassword, logout } = useAuth()
  const { showToast } = useToast()

  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- Форма профиля ---
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [isFormal, setIsFormal] = useState(user?.isFormal ?? true)
  const [gender, setGender] = useState<"female" | "male">(user?.gender || "female")
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "")
  const [color, setColor] = useState(user?.color || "#ec4899")
  const [timezone, setTimezone] = useState(() => user?.timezone || getDefaultTimezone())

  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [profileError, setProfileError] = useState("")

  // --- Форма смены пароля ---
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)

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

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile)
      setAvatarUrl(objectUrl)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePickAvatar = () => {
    fileInputRef.current?.click()
  }

  const initialValues: ProfileFormState = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    isFormal: user?.isFormal ?? true,
    gender: user?.gender || "female",
    avatarUrl: user?.avatarUrl || "",
    color: user?.color || "#ec4899",
    timezone: user?.timezone || getDefaultTimezone(),
  }

  const hasProfileChanges =
    firstName.trim() !== initialValues.firstName ||
    lastName.trim() !== initialValues.lastName ||
    isFormal !== initialValues.isFormal ||
    gender !== initialValues.gender ||
    avatarUrl !== initialValues.avatarUrl ||
    color !== initialValues.color ||
    timezone !== initialValues.timezone

  const canSaveProfile = firstName.trim().length > 0 && lastName.trim().length > 0 && hasProfileChanges

  const handleSaveProfile = async () => {
    if (!canSaveProfile || isSaving) {
      return
    }
    setIsSaving(true)
    setProfileError("")
    try {
      await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim(), isFormal, gender, avatarUrl, color, timezone })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2000)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ошибка при сохранении"
      setProfileError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async () => {
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ошибка при смене пароля"
      setPasswordError(message)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleTogglePasswordForm = () => {
    setShowPasswordForm(previousValue => !previousValue)
    setPasswordError("")
    setPasswordSuccess(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate("/auth")
  }

  const draftUser: User | null = user
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

  return {
    // Данные
    user,
    draftUser,
    fileInputRef,
    // Поля профиля
    firstName, setFirstName,
    lastName, setLastName,
    isFormal, setIsFormal,
    gender, setGender,
    color, setColor,
    timezone, setTimezone,
    avatarUrl,
    // Статус сохранения
    isSaving,
    savedSuccess,
    profileError, setProfileError,
    canSaveProfile,
    // Аватар
    handleAvatarFileChange,
    handleRemoveAvatar,
    handlePickAvatar,
    // Смена пароля
    showPasswordForm,
    handleTogglePasswordForm,
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    isChangingPassword,
    passwordError, setPasswordError,
    passwordSuccess,
    handlePasswordSubmit,
    // Профиль и сессия
    handleSaveProfile,
    handleLogout,
  }
}
