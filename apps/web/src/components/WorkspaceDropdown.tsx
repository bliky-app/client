import { useNavigate, useLocation } from "react-router-dom"
import { Check, Home, Plus } from "lucide-react"
import { createPortal } from "react-dom"
import Avatar from "@/components/Avatar"
import { usePermissions } from "@/lib/permissions"

interface WorkspaceDropdownProps {
  isOpen: boolean
  onClose: () => void
  activeWorkspaceId?: string
  className?: string
  onSelect?: () => void
  // When provided, dropdown is positioned via fixed coords (portal mode).
  // Pass the DOMRect of the trigger button, captured synchronously on click.
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
  const { workspaces, user } = usePermissions()
  const isHub = location.pathname === "/"

  if (!isOpen) return null

  const content = (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[200]" onClick={onClose} />

      {/* Dropdown */}
      <div
        className={`z-[201] bg-hub-surface border border-hub-border rounded-2xl shadow-xl py-2 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${triggerRect ? "fixed w-64" : `absolute ${className}`}`}
        style={triggerRect ? {
          top: triggerRect.bottom + 8,
          left: Math.min(triggerRect.left, window.innerWidth - 272),
        } : undefined}
      >
        <button
          onClick={() => {
            onClose()
            if (onSelect) onSelect()
            navigate("/")
          }}
          className="flex items-center justify-between px-4 py-3 hover:bg-hub-surface-hover transition-colors text-left gap-3 w-full"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-hub-surface-hover flex items-center justify-center shrink-0 border border-hub-border-light/50">
              <Home className="w-5 h-5 text-hub-text-muted" />
            </div>
            <span className={`text-sm truncate ${isHub ? "text-hub-text font-medium" : "text-hub-text-subtle"}`}>
              Главная страница
            </span>
          </div>
          {isHub && <Check className="w-4 h-4 text-hub-text shrink-0" />}
        </button>

        <div className="h-px bg-hub-border mx-4 my-1" />

        {workspaces.map(w => (
          <button
            key={w.id}
            onClick={() => {
              onClose()
              if (onSelect) onSelect()
              navigate(`/workspace/${w.id}`)
            }}
            className="flex items-center justify-between px-4 py-3 hover:bg-hub-surface-hover transition-colors text-left gap-3 w-full"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                type="workspace"
                name={w.name}
                avatarUrl={w.avatarUrl}
                color={w.color}
                className="h-10 w-10 rounded-xl text-xs shadow-sm"
              />
              <div className="flex flex-col min-w-0">
                <span className={`text-sm truncate ${w.id === activeWorkspaceId ? "text-hub-text font-medium" : "text-hub-text-subtle"}`}>
                  {w.name}
                </span>
                <span className="text-hub-text-muted text-[11px] truncate">
                  {w.staff?.find(s => s.user?.id === user?.id)?.workspaceRole.nameRu || "Сотрудник"}
                </span>
              </div>
            </div>
            {w.id === activeWorkspaceId && <Check className="w-4 h-4 text-hub-text shrink-0" />}
          </button>
        ))}

        <div className="h-px bg-hub-border mx-4 my-1" />

        <button
          onClick={() => {
            onClose()
            if (onSelect) onSelect()
            navigate("/workspace/new")
          }}
          className="flex items-center px-4 py-3 hover:bg-hub-surface-hover transition-colors text-left gap-3 w-full group"
        >
          <div className="w-10 h-10 rounded-xl bg-hub-surface-hover group-hover:bg-hub-border flex items-center justify-center shrink-0 border border-hub-border-light/50 transition-colors">
            <Plus className="w-5 h-5 text-hub-text-muted group-hover:text-hub-text transition-colors" />
          </div>
          <span className="text-sm text-hub-text-subtle group-hover:text-hub-text font-medium transition-colors">
            Создать пространство
          </span>
        </button>
      </div>
    </>
  )

  // If we have triggerRect, render in a portal to escape any stacking context
  if (triggerRect) {
    return createPortal(content, document.body)
  }

  return <>{content}</>
}
