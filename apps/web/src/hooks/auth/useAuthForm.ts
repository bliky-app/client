import { useState } from "react"
import { useAuth } from "@/lib/AuthProvider"
import { validatePassword } from "@/components/ui/PasswordInput"

export function useAuthForm() {
  const { login, register, checkPhone } = useAuth()

  const [step, setStep] = useState<"phone" | "password">("phone")
  const [isLoginFlow, setIsLoginFlow] = useState(true)

  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePhoneSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const rawDigits = phone.replace(/\D/g, "")
    if (!phone || rawDigits.length < 10) {
      setError("Введите корректный номер телефона")
      return
    }
    setError("")
    setIsLoading(true)
    try {
      const exists = await checkPhone(phone)
      setIsLoginFlow(exists)
      setStep("password")
    } catch {
      setError("Произошла ошибка при проверке номера")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!password) {
      setError("Введите пароль")
      return
    }

    if (!isLoginFlow) {
      if (password !== confirmPassword) {
        setError("Пароли не совпадают")
        return
      }
      const validationResult = validatePassword(password)
      if (!validationResult.isValid) {
        setError(`Пароль не соответствует требованиям: ${validationResult.errors.join(", ")}`)
        return
      }
    }

    setError("")
    setIsLoading(true)
    try {
      if (isLoginFlow) {
        await login(phone, password)
      } else {
        await register(phone)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Неверный пароль"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const goBackToPhone = () => {
    setStep("phone")
    setError("")
    setPassword("")
    setConfirmPassword("")
  }

  return {
    step,
    isLoginFlow,
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    setError,
    handlePhoneSubmit,
    handlePasswordSubmit,
    goBackToPhone,
  }
}
