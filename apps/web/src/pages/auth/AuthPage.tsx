import { useState } from "react"
import { Navigate } from "react-router-dom"
import { ArrowRight, Loader2, Sparkles, ChevronLeft } from "lucide-react"
import { useAuth } from "@/lib/AuthProvider"

export default function AuthPage() {
  const { user, login, register, checkPhone, isLoading: isAuthLoading } = useAuth()
  
  const [step, setStep] = useState<"phone" | "password">("phone")
  const [isLoginFlow, setIsLoginFlow] = useState(true)
  
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // If already authenticated and setup complete, go to Hub
  if (!isAuthLoading && user) {
    if (user.firstName) {
      return <Navigate to="/" replace />
    } else {
      return <Navigate to="/setup" replace />
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length < 10) {
      setError("Введите корректный номер телефона")
      return
    }
    setError("")
    setIsLoading(true)
    try {
      const exists = await checkPhone(phone)
      setIsLoginFlow(exists)
      setStep("password")
    } catch (err) {
      setError("Произошла ошибка при проверке номера")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError("Введите пароль")
      return
    }
    setError("")
    setIsLoading(true)
    try {
      if (isLoginFlow) {
        await login(phone, password)
      } else {
        await register(phone, password)
      }
      // AuthProvider will update context and RequireAuth will handle redirect
    } catch (err: any) {
      setError(err.message || "Неверный пароль")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-hub-base flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-gradient-to-br from-panel-border to-panel-border-subtle rounded-[24px] flex items-center justify-center shadow-sm mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-panel-text/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="w-8 h-8 text-panel-text" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-hub-text mb-3">
            Добро пожаловать
          </h1>
          <p className="text-hub-text-muted font-medium">
            Войдите или зарегистрируйтесь, чтобы продолжить
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-panel-surface border border-panel-border rounded-[32px] p-8 shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-panel-text-subtle uppercase tracking-widest pl-1">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  autoFocus
                  placeholder="+7 (999) 000-00-00"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError("") }}
                  className="w-full bg-panel-base border border-panel-border focus:border-panel-text outline-none rounded-2xl px-5 py-4 text-panel-text font-medium text-lg transition-colors placeholder:text-panel-text-muted"
                />
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-panel-text text-panel-base rounded-2xl px-5 py-4 font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Продолжить
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
              <button 
                type="button" 
                onClick={() => { setStep("phone"); setError(""); setPassword("") }}
                className="flex items-center gap-2 text-sm font-semibold text-panel-text-muted hover:text-panel-text transition-colors w-fit -ml-2 p-2 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
                {phone}
              </button>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-panel-text-subtle uppercase tracking-widest pl-1">
                  {isLoginFlow ? "Введите пароль" : "Придумайте пароль"}
                </label>
                <input
                  type="password"
                  autoFocus
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError("") }}
                  className="w-full bg-panel-base border border-panel-border focus:border-panel-text outline-none rounded-2xl px-5 py-4 text-panel-text font-medium text-lg transition-colors placeholder:text-panel-text-muted"
                />
                {!isLoginFlow && (
                  <p className="text-xs font-medium text-panel-text-subtle pl-1 mt-1">
                    Пароль должен быть не менее 6 символов
                  </p>
                )}
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-panel-text text-panel-base rounded-2xl px-5 py-4 font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  isLoginFlow ? "Войти" : "Зарегистрироваться"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
