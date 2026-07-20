import { useState } from "react"
import { Bell, Settings, ChevronDown, Calendar as CalendarIcon } from "lucide-react"
import Avatar from "@/components/Avatar"
import WorkspaceDropdown from "@/components/WorkspaceDropdown"

import type { User } from "@/types/models"

interface HubHeaderProps {
  user: User
  date: Date
}

import { MONTHS } from "@/lib/formatters"

export default function HubHeader({ user, date }: HubHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const dayOfMonth = date.getDate()
  const monthName = MONTHS[date.getMonth()]
  const year = date.getFullYear()

  return (
    <div className="flex justify-between items-center w-full relative z-30">
      <div className="relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
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
              <ChevronDown className={`w-4 h-4 text-hub-text-subtle transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </div>
            <span className="text-hub-text-subtle text-xs leading-tight mt-0.5 flex items-center gap-1 truncate">
              <CalendarIcon className="h-3 w-3 shrink-0" />
              {dayOfMonth} {monthName} {year}
            </span>
          </div>
        </button>

        <WorkspaceDropdown 
          isOpen={showDropdown} 
          onClose={() => setShowDropdown(false)}
          className="top-14 left-0 w-64"
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button className="h-11 w-11 rounded-full bg-hub-surface border border-hub-border flex items-center justify-center active:scale-95 transition-transform">
          <Bell className="h-5 w-5 text-hub-text-muted" />
        </button>
        <button className="h-11 w-11 rounded-full bg-hub-surface border border-hub-border flex items-center justify-center active:scale-95 transition-transform">
          <Settings className="h-5 w-5 text-hub-text-muted" />
        </button>
      </div>
    </div>
  )
}
