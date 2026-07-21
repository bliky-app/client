import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { X, ArrowLeft } from "lucide-react"

export interface ModalSheetLayoutProps {
  title: string
  subtitle?: string
  onClose?: () => void
  onBack?: () => void
  showBack?: boolean
  children: ReactNode
  footer?: ReactNode
  progressBar?: ReactNode
}

export default function ModalSheetLayout({
  title,
  subtitle,
  onClose,
  onBack,
  showBack = false,
  children,
  footer,
  progressBar,
}: ModalSheetLayoutProps) {
  const navigate = useNavigate()
  const handleClose = onClose ?? (() => navigate("/"))

  return (
    <div className="flex flex-col flex-1 bg-hub-base h-svh overflow-hidden">
      {/* White wizard panel */}
      <div className="flex flex-col flex-1 bg-panel-base rounded-t-[32px] mt-16 shadow-[0_-8px_32px_rgba(0,0,0,0.18)] overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 shrink-0 border-b border-panel-border-subtle">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2 rounded-full text-panel-text-muted hover:text-panel-text hover:bg-panel-surface-hover transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex-1 min-w-0">
            {subtitle && (
              <p className="text-xs font-semibold text-panel-text-subtle mb-0.5">
                {subtitle}
              </p>
            )}
            <h1 className="text-xl font-bold text-panel-text leading-tight truncate">
              {title}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 -mr-2 rounded-full text-panel-text-muted hover:text-panel-text hover:bg-panel-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Optional Progress bar */}
        {progressBar}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 relative flex flex-col">
          {children}

          {/* Footer (e.g. Sticky Save Bar / Step Buttons) */}
          {footer}
        </div>
      </div>
    </div>
  )
}
