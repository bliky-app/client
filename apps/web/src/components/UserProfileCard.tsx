import { ChevronRight } from "lucide-react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useAuth } from "@/lib/AuthProvider"
import { useWorkspaces } from "@/lib/permissions"
import Avatar from "@/components/Avatar"

interface UserProfileCardProps {
  onClose?: () => void
  workspaceId?: string
  className?: string
}

export default function UserProfileCard({ onClose, workspaceId: propWorkspaceId, className = "" }: UserProfileCardProps) {
  const { user } = useAuth()
  const { workspaces } = useWorkspaces()
  const navigate = useNavigate()
  const params = useParams<{ id?: string }>()
  const location = useLocation()

  if (!user) return null

  const activeWsId = propWorkspaceId || params.id || (location.pathname.startsWith("/workspace/") ? location.pathname.split("/")[2] : undefined)
  const activeWorkspace = workspaces.find(w => w.id === activeWsId)
  const staffMember = activeWorkspace?.staff?.find(s => s.user?.id === user.id)

  const roleName = staffMember?.workspaceRole.nameRu || "Сотрудник"
  const subtitleText = activeWorkspace ? roleName : (user.phone || "Профиль")

  const handleClick = () => {
    onClose?.()
    navigate("/settings")
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center justify-between p-3 rounded-2xl bg-hub-base/60 hover:bg-hub-surface-hover border border-hub-border/50 text-left gap-3 w-full group transition-all ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Avatar
          data={user}
          className="w-10 h-10 rounded-full shrink-0 border border-hub-border shadow-sm"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-medium text-hub-text truncate">
            {user.firstName ? `${user.firstName} ${user.lastName}`.trim() : "Пользователь"}
          </span>
          <span className="text-[11px] text-hub-text-muted truncate">
            {subtitleText}
          </span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-hub-text-subtle group-hover:text-hub-text-muted transition-transform group-hover:translate-x-0.5 shrink-0" />
    </button>
  )
}
