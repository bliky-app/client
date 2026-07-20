import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Clock,
  Users,
  Package,
  UserCheck,
  BarChart2,
  ClipboardList,
  Home,
  Settings,
  X,
  List,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react"
import type { Workspace, WorkspaceSectionId, Permission } from "@/types/models"
import { usePermissions } from "@/lib/permissions"
import Avatar from "@/components/Avatar"

interface SectionConfig {
  id: WorkspaceSectionId
  label: string
  icon: LucideIcon
  permission: Permission | null
}

const SECTIONS: SectionConfig[] = [
  { id: "overview", label: "Обзор", icon: LayoutDashboard, permission: null },
  { id: "schedule", label: "Расписание", icon: Calendar, permission: "view_global_schedule" },
  { id: "appointments", label: "Записи", icon: ClipboardList, permission: null },
  { id: "work_schedule", label: "График", icon: Clock, permission: null },
  { id: "services", label: "Услуги", icon: List, permission: null }, // services doesn't require permission to view own services
  { id: "staff", label: "Сотрудники", icon: Users, permission: "manage_staff" },
  { id: "resources", label: "Ресурсы", icon: Package, permission: "manage_services" },
  { id: "analytics", label: "Аналитика", icon: BarChart2, permission: "view_analytics" },
  { id: "clients", label: "Клиенты", icon: UserCheck, permission: null },
  { id: "settings", label: "Настройки", icon: Settings, permission: "manage_workspace" },
]

interface WorkspaceDrawerProps {
  workspace: Workspace
  isOpen: boolean
  activeSection: WorkspaceSectionId
  onClose: () => void
  onSelectSection: (section: WorkspaceSectionId) => void
}

export default function WorkspaceDrawer({
  workspace,
  isOpen,
  activeSection,
  onClose,
  onSelectSection,
}: WorkspaceDrawerProps) {
  const navigate = useNavigate()
  const { can, user } = usePermissions(workspace.id)

  const visibleSections = SECTIONS.filter(section => {
    // Hide 'staff' and 'schedule' for individual workspaces entirely
    if ((section.id === "staff" || section.id === "schedule") && workspace.type === "individual") return false
    
    // Fallback to permission check
    return section.permission === null || can(section.permission)
  })

  // Determine user role in this workspace
  const staffMember = workspace.staff?.find(s => s.user?.id === user?.id)
  const roleName = staffMember?.workspaceRole.nameRu || "Сотрудник"

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-overlay/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-hub-base flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="text-xl font-semibold text-hub-text tracking-tight">Пространство</span>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-hub-text-muted hover:text-hub-text transition-colors rounded-full hover:bg-hub-surface-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {visibleSections.map(section => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  id={`workspace-nav-${section.id}`}
                  onClick={() => {
                    onSelectSection(section.id)
                    onClose()
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    activeSection === section.id
                      ? "bg-hub-surface text-hub-text"
                      : "text-hub-text-muted hover:bg-hub-surface-hover hover:text-hub-text"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="font-medium text-[15px]">{section.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* User profile at bottom */}
        <div className="px-3 pb-6 flex flex-col mt-auto pt-4 border-t border-hub-border">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                type="user"
                name={user?.shortName || "?"}
                avatarUrl={user?.avatarUrl}
                className="w-10 h-10 rounded-full border border-hub-border-light shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-hub-text truncate">{user?.shortName}</span>
                <span className="text-[11px] text-hub-text-subtle truncate">{roleName}</span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose()
                navigate("/")
              }}
              className="h-10 w-10 rounded-full hover:bg-hub-surface flex items-center justify-center transition-colors"
            >
              <Home className="h-4 w-4 text-hub-text-muted hover:text-hub-text-subtle" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
