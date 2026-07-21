/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Info } from "lucide-react"

export type ToastType = "info" | "warning" | "success" | "error"

export interface ToastMessage {
  id: string
  text: string
  type?: ToastType
  duration?: number
}

interface ToastContextType {
  showToast: (text: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    return {
      showToast: (text: string) => console.log("[Toast]", text)
    }
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((text: string, type: ToastType = "info", duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5)
    setToasts((prev) => [...prev, { id, text, type, duration }].slice(-3))

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2.5 items-center pointer-events-none px-4 max-w-md w-full">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className="pointer-events-auto bg-hub-surface/90 border border-hub-border/60 text-hub-text px-4.5 py-2.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.18)] flex items-center justify-center gap-2 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-6 zoom-in-90 duration-300 ease-out"
              >
                <Info className="w-4 h-4 text-hub-text-muted shrink-0" />
                <span className="text-xs font-medium leading-tight text-center tracking-tight truncate">
                  {toast.text}
                </span>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  )
}
