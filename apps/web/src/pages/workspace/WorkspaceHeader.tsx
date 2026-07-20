import { useState } from "react"
import { Bell, Menu, MapPin, ChevronDown, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Workspace } from "@/types/models"
import Avatar from "@/components/Avatar"
import WorkspaceDropdown from "@/components/WorkspaceDropdown"

interface WorkspaceHeaderProps {
  workspace: Workspace
  onMenuOpen: () => void
}

const WORKSPACE_TYPE_LABEL: Record<string, string> = {
  studio: "Салон",
  master: "Мастер",
}

export default function WorkspaceHeader({ workspace, onMenuOpen }: WorkspaceHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex justify-between items-center w-full relative z-30">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate("/")}
          className="h-11 w-11 rounded-full bg-hub-surface border border-hub-border flex items-center justify-center active:scale-95 transition-transform shrink-0"
          title="Вернуться в Хаб"
        >
          <ArrowLeft className="h-5 w-5 text-hub-text-muted" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 w-full text-left group"
          >
          <Avatar
            type="workspace"
            name={workspace.name}
            avatarUrl={workspace.avatarUrl}
            color={workspace.color}
            className="h-11 w-11 rounded-2xl text-sm shadow-lg group-hover:opacity-90 transition-opacity"
          />
          <div className="flex flex-col min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-hub-text font-semibold text-[17px] leading-tight truncate group-hover:text-hub-text-muted transition-colors">
                {workspace.name}
              </span>
              <ChevronDown className={`w-4 h-4 text-hub-text-subtle transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </div>
            <span className="text-hub-text-subtle text-xs leading-tight mt-0.5 flex items-center gap-1 truncate">
              {workspace.address ? (
                <>
                  <MapPin className="h-3 w-3 shrink-0" />
                  {workspace.address}
                </>
              ) : (
                WORKSPACE_TYPE_LABEL[workspace.type] ?? workspace.type
              )}
            </span>
          </div>
        </button>

        <WorkspaceDropdown
          isOpen={showDropdown}
          onClose={() => setShowDropdown(false)}
          activeWorkspaceId={workspace.id}
          className="top-14 left-0 w-64"
        />
      </div>
    </div>

      <div className="flex items-center gap-2 shrink-0">
        <button className="h-11 w-11 rounded-full bg-hub-surface border border-hub-border flex items-center justify-center active:scale-95 transition-transform shrink-0">
          <Bell className="h-5 w-5 text-hub-text-muted" />
        </button>
        <button
          id="workspace-menu-button"
          onClick={onMenuOpen}
          className="h-11 w-11 rounded-full bg-hub-surface border border-hub-border flex items-center justify-center active:scale-95 transition-transform shrink-0"
        >
          <Menu className="h-5 w-5 text-hub-text-muted" />
        </button>
      </div>
    </div>
  )
}
