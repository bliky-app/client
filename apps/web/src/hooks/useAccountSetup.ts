import { useState, useRef } from "react"
import { useAuth } from "@/lib/AuthProvider"
import { getDefaultTimezone } from "@/lib/formatters"
import type { User } from "@/types/auth.models"

export function useAccountSetup() {
  const { user, updateProfile, logout, isLoading: isAuthLoading } = useAuth()

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [isFormal, setIsFormal] = useState(user?.isFormal ?? true)
  const [gender, setGender] = useState<"female" | "male">(user?.gender || "female")
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "")
  const [color, setColor] = useState(user?.color || "#ec4899")
  const [timezone, setTimezone] = useState(() => user?.timezone || getDefaultTimezone())

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Произошла ошибка при сохранении профиля"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const draftUser: User | null = user ? {
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
  } : null

  return {
    user,
    draftUser,
    isAuthLoading,
    firstName, setFirstName,
    lastName, setLastName,
    isFormal, setIsFormal,
    gender, setGender,
    color, setColor,
    timezone, setTimezone,
    avatarUrl,
    isLoading,
    error, setError,
    fileInputRef,
    handleAvatarChange,
    handleRemoveAvatar,
    handlePickAvatar,
    handleSubmit,
    logout,
  }
}
