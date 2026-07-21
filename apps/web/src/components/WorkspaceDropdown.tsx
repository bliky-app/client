import { useNavigate, useLocation } from "react-router-dom"
import { Check, Home, Plus } from "lucide-react"
import { createPortal } from "react-dom"
import Avatar from "@/components/Avatar"
import { useWorkspaces } from "@/lib/permissions"

interface WorkspaceDropdownProps {
  isOpen: boolean
  onClose: () => void
  activeWorkspaceId?: string
  className?: string
  onSelect?: () => void


  triggerRect?: DOMRect
}

export default function WorkspaceDropdown({
  isOpen,
  onClose,
  activeWorkspaceId,
  className = "",
  onSelect,
  triggerRect,
}: WorkspaceDropdownProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { workspaces, user } = useWorkspaces()
  const isHub = location.pathname === "/"

  if (!isOpen) return null

  const content = (
    <>
      <div className="fixed inset-0 z-[200]" onClick={onClose} />
      <div
        className={`z-[201] bg-hub-surface border border-hub-border rounded-2xl shadow-xl py-2 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
          triggerRect ? "fixed w-64" : `absolute ${className}`
        }`}
        style={
          triggerRect
            ? {
                top: triggerRect.bottom + 8,
                left: Math.min(triggerRect.left, window.innerWidth - 272),
              }
            : undefined
        }
      >
        <button
          onClick={() => {
            onClose()
            if (onSelect) onSelect()
            navigate("/")
          }}
          className={`flex items-center justify-between px-3 py-2.5 transition-colors text-left gap-3 w-full rounded-xl mx-1.5 ${
            isHub ? "bg-hub-surface-hover border border-hub-border-light/50" : "hover:bg-hub-surface-hover/60"
          }`}
          style={{ width: "calc(100% - 12px)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {user ? (
              <Avatar
                data={user}
                className="h-10 w-10 rounded-full text-xs shadow-sm border border-hub-border shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-hub-surface-hover flex items-center justify-center shrink-0 border border-hub-border-light/50">
                <Home className="w-5 h-5 text-hub-text-muted" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className={`text-sm truncate ${isHub ? "text-hub-text font-semibold" : "text-hub-text font-medium"}`}>
                Личная страница
              </span>
              <span className="text-hub-text-muted text-[11px] truncate">
                {user?.firstName || "Обзор"}
              </span>
            </div>
          </div>
          {isHub && <Check className="w-4 h-4 text-hub-text shrink-0" />}
        </button>

        <div className="h-px bg-hub-border mx-3 my-1" />

        {workspaces.map((w) => {
          const isActive = w.id === activeWorkspaceId
          return (
            <button
              key={w.id}
              onClick={() => {
                onClose()
                if (onSelect) onSelect()
                navigate(`/workspace/${w.id}`)
              }}
              className={`flex items-center justify-between px-3 py-2.5 transition-colors text-left gap-3 w-full rounded-xl mx-1.5 ${
                isActive ? "bg-hub-surface-hover border border-hub-border-light/50" : "hover:bg-hub-surface-hover/60"
              }`}
              style={{ width: "calc(100% - 12px)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  data={w}
                  className="h-10 w-10 rounded-xl text-xs shadow-sm shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className={`text-sm truncate ${isActive ? "text-hub-text font-semibold" : "text-hub-text font-medium"}`}>
                    {w.name}
                  </span>
                  <span className="text-hub-text-muted text-[11px] truncate">
                    {w.staff?.find((s) => s.user?.id === user?.id)?.workspaceRole.nameRu || "Сотрудник"}
                  </span>
                </div>
              </div>
              {isActive && <Check className="w-4 h-4 text-hub-text shrink-0" />}
            </button>
          )
        })}

        <div className="h-px bg-hub-border mx-3 my-1" />

        <button
          onClick={() => {
            onClose()
            if (onSelect) onSelect()
            navigate("/workspace/new")
          }}
          className="flex items-center px-3 py-2.5 hover:bg-hub-surface-hover/60 transition-colors text-left gap-3 w-full rounded-xl mx-1.5 group"
          style={{ width: "calc(100% - 12px)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-hub-surface-hover group-hover:bg-hub-border flex items-center justify-center shrink-0 border border-hub-border-light/50 transition-colors">
            <Plus className="w-5 h-5 text-hub-text-muted group-hover:text-hub-text transition-colors" />
          </div>
          <span className="text-sm text-hub-text font-medium transition-colors">
            Создать пространство
          </span>
        </button>
      </div>
    </>
  )

  if (triggerRect) {
    return createPortal(content, document.body)
  }

  return <>{content}</>
}
