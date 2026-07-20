import { useState } from "react"
import { Bell, Settings, ChevronDown, Calendar as CalendarIcon } from "lucide-react"
import Avatar from "@/components/Avatar"
import WorkspaceDropdown from "@/components/WorkspaceDropdown"
import SettingsDropdown from "@/components/SettingsDropdown"
import type { User } from "@/types/models"
import { MONTHS } from "@/lib/formatters"

interface HubHeaderProps {
  user: User
  date: Date
}

export default function HubHeader({ user, date }: HubHeaderProps) {
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  
  // Capture rects for portal positioning
  const [workspaceTriggerRect, setWorkspaceTriggerRect] = useState<DOMRect | undefined>()
  const [settingsTriggerRect, setSettingsTriggerRect] = useState<DOMRect | undefined>()

  const dayOfMonth = date.getDate()
  const monthName = MONTHS[date.getMonth()]
  const year = date.getFullYear()

  const handleWorkspaceToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!showWorkspaceDropdown) {
      setWorkspaceTriggerRect(e.currentTarget.getBoundingClientRect())
    }
    setShowWorkspaceDropdown(prev => !prev)
  }

  const handleSettingsToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!showSettingsDropdown) {
      setSettingsTriggerRect(e.currentTarget.getBoundingClientRect())
    }
    setShowSettingsDropdown(prev => !prev)
  }

  return (
    <div className="flex justify-between items-center w-full">
      <div className="relative">
        <button
          onClick={handleWorkspaceToggle}
          className="flex items-center gap-3 text-left group"
        >
          <Avatar
            type="user"
            name={user.shortName}
            avatarUrl={user.avatarUrl}
            className="h-11 w-11 rounded-full border border-hub-border text-lg group-hover:border-hub-border-light transition-colors"
          />
          <div className="flex flex-col min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-hub-text font-semibold text-lg leading-tight truncate group-hover:text-hub-text-muted transition-colors">
                {user.shortName}
              </span>
              <ChevronDown className={`w-4 h-4 text-hub-text-subtle transition-transform ${showWorkspaceDropdown ? "rotate-180" : ""}`} />
            </div>
            <span className="text-hub-text-subtle text-xs leading-tight mt-0.5 flex items-center gap-1 truncate">
              <CalendarIcon className="h-3 w-3 shrink-0" />
              {dayOfMonth} {monthName} {year}
            </span>
          </div>
        </button>

        <WorkspaceDropdown
          isOpen={showWorkspaceDropdown}
          onClose={() => setShowWorkspaceDropdown(false)}
          triggerRect={workspaceTriggerRect}
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button className="h-11 w-11 rounded-full bg-hub-surface border border-hub-border flex items-center justify-center active:scale-95 transition-transform">
          <Bell className="h-5 w-5 text-hub-text-muted" />
        </button>
        
        <div className="relative">
          <button 
            onClick={handleSettingsToggle} 
            className="h-11 w-11 rounded-full bg-hub-surface border border-hub-border flex items-center justify-center active:scale-95 transition-transform"
          >
            <Settings className="h-5 w-5 text-hub-text-muted" />
          </button>
          
          <SettingsDropdown 
            isOpen={showSettingsDropdown} 
            onClose={() => setShowSettingsDropdown(false)} 
            triggerRect={settingsTriggerRect}
          />
        </div>
      </div>
    </div>
  )
}
