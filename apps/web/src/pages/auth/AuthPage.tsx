import { Navigate } from "react-router-dom"
import { ChevronLeft, Loader2, Sun, Moon } from "lucide-react"
import { useTheme } from "@/lib/ThemeProvider"
import { useAuth } from "@/lib/AuthProvider"
import Button from "@/components/ui/Button"
import PhoneInput from "@/components/ui/PhoneInput"
import PasswordInput, { validatePassword } from "@/components/ui/PasswordInput"
import { getGreeting } from "@/lib/formatters"
import { useAuthForm } from "@/hooks/auth/useAuthForm"

export default function AuthPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const {
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
  } = useAuthForm()

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full bg-hub-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-hub-text-muted" />
      </div>
    )
  }

  if (user) {
    if (user.firstName && user.lastName) {
      return <Navigate to="/" replace />
    } else {
      return <Navigate to="/setup" replace />
    }
  }

  return (
    <div className="min-h-screen w-full bg-hub-base flex justify-center items-start pt-16 sm:pt-24 p-6 font-sans relative">
      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-6 right-6 p-3 rounded-full bg-panel-surface border border-panel-border text-panel-text hover:bg-panel-surface-hover shadow-lg transition-all active:scale-95 z-50"
        title="Сменить тему"
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-md">
        <div className="flex flex-col mb-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-2xl font-medium tracking-tight text-hub-text mb-2 flex items-center gap-2.5">
            <span>—</span> {getGreeting(new Date())}
          </h1>
          <p className="text-hub-text-muted font-medium text-sm">
            Войдите или зарегистрируйтесь, чтобы продолжить
          </p>
        </div>

        <div className="bg-panel-surface border border-panel-border rounded-[32px] p-8 shadow-xl animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-6">
              <PhoneInput
                theme="panel"
                label="Номер телефона"
                autoFocus
                value={phone}
                onChange={(val) => { setPhone(val); setError("") }}
                inputClassName="py-3.5 text-base font-medium"
              />
              <Button
                type="submit"
                variant="primary"
                theme="panel"
                loading={isLoading}
                disabled={!phone || phone.replace(/\D/g, "").length < 10}
                fullWidth
              >
                Продолжить
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
              <button
                type="button"
                onClick={goBackToPhone}
                className="flex items-center gap-1.5 text-sm font-medium text-panel-text-muted hover:text-panel-text transition-colors w-fit -ml-1 p-1 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
                {phone}
              </button>

              <PasswordInput
                theme="panel"
                label={isLoginFlow ? "Введите пароль" : "Придумайте пароль"}
                autoFocus
                placeholder="••••••••"
                value={password}
                onChange={(event) => { setPassword(event.target.value); setError("") }}
                showRules={!isLoginFlow}
                inputClassName="py-3.5 text-base font-medium"
              />

              {!isLoginFlow && (
                <PasswordInput
                  theme="panel"
                  label="Повторите пароль"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(event) => { setConfirmPassword(event.target.value); setError("") }}
                  error={
                    confirmPassword.length > 0 && confirmPassword !== password
                      ? "Пароли не совпадают"
                      : undefined
                  }
                  inputClassName="py-3.5 text-base font-medium"
                />
              )}

              <Button
                type="submit"
                variant="primary"
                theme="panel"
                loading={isLoading}
                disabled={
                  isLoginFlow
                    ? !password
                    : !password || !validatePassword(password).isValid || password !== confirmPassword
                }
                fullWidth
              >
                {isLoginFlow ? "Войти" : "Зарегистрироваться"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
