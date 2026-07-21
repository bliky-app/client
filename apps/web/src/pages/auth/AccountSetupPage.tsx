import { useState } from "react"
import { Navigate } from "react-router-dom"
import { Loader2, Sparkles, User as UserIcon } from "lucide-react"
import { useAuth } from "@/lib/AuthProvider"

export default function AccountSetupPage() {
  const { user, updateProfile, isLoading: isAuthLoading } = useAuth()
  
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [isFormal, setIsFormal] = useState(user?.isFormal ?? true)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // If not logged in, go to auth
  if (!isAuthLoading && !user) {
    return <Navigate to="/auth" replace />
  }

  // If setup is already complete, go to hub
  if (!isAuthLoading && user && user.firstName && user.lastName) {
    return <Navigate to="/" replace />
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
      await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim(), isFormal })
      // RequireAuth will redirect to Hub automatically once query invalidates
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при сохранении профиля")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-hub-base flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl">
        <div className="flex flex-col mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-gradient-to-br from-panel-border to-panel-border-subtle rounded-[24px] flex items-center justify-center shadow-sm mb-6">
            <UserIcon className="w-8 h-8 text-panel-text" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-hub-text mb-3">
            Расскажите о себе
          </h1>
          <p className="text-hub-text-muted font-medium">
            Эти данные будут использоваться в вашем профиле и для общения с клиентами
          </p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-panel-surface border border-panel-border rounded-[32px] p-8 shadow-xl flex flex-col gap-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both"
        >
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-bold text-panel-text-subtle uppercase tracking-widest pl-1">
                  Имя
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="Иван"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setError("") }}
                  className="w-full bg-panel-base border border-panel-border focus:border-panel-text outline-none rounded-2xl px-5 py-4 text-panel-text font-medium text-lg transition-colors placeholder:text-panel-text-muted"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-bold text-panel-text-subtle uppercase tracking-widest pl-1">
                  Фамилия
                </label>
                <input
                  type="text"
                  placeholder="Иванов"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setError("") }}
                  className="w-full bg-panel-base border border-panel-border focus:border-panel-text outline-none rounded-2xl px-5 py-4 text-panel-text font-medium text-lg transition-colors placeholder:text-panel-text-muted"
                />
              </div>
            </div>

            <div className="h-px w-full bg-panel-border-subtle" />

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-panel-text-subtle uppercase tracking-widest pl-1">
                Стиль общения с клиентами
              </label>
              <p className="text-sm text-panel-text-muted pl-1 mb-2">
                Это повлияет на тексты системных уведомлений и интерфейс, который видят ваши клиенты.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setIsFormal(true)}
                  className={`flex-1 p-5 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    isFormal 
                      ? "border-panel-text bg-panel-surface shadow-sm" 
                      : "border-panel-border bg-panel-base hover:border-panel-border-subtle hover:bg-panel-surface opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className="font-semibold text-panel-text">На Вы (Формальный)</span>
                  <span className="text-xs font-medium text-panel-text-muted">«Выберите время», «Ваша запись подтверждена»</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsFormal(false)}
                  className={`flex-1 p-5 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    !isFormal 
                      ? "border-panel-text bg-panel-surface shadow-sm" 
                      : "border-panel-border bg-panel-base hover:border-panel-border-subtle hover:bg-panel-surface opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className="font-semibold text-panel-text">На Ты (Дружеский)</span>
                  <span className="text-xs font-medium text-panel-text-muted">«Выбери время», «Твоя запись подтверждена»</span>
                </button>
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-panel-text text-panel-base rounded-2xl px-5 py-4 font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all mt-4 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Начать работу
                <Sparkles className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
