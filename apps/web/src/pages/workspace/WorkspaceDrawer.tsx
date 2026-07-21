import {
  Calendar,
  Clock,
  Users,
  Package,
  UserCheck,
  BarChart2,
  ClipboardList,
  Settings,
  X,
  List,
  LayoutDashboard,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
import type { Workspace, WorkspaceSectionId, Permission } from "@/types/models"
import { usePermissions } from "@/lib/permissions"
import UserProfileCard from "@/components/UserProfileCard"

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
  { id: "services", label: "Услуги", icon: List, permission: null },
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
  const { can } = usePermissions(workspace.id)

  const visibleSections = SECTIONS.filter((section) => {
    if ((section.id === "staff" || section.id === "schedule") && workspace.type === "individual") return false
    return section.permission === null || can(section.permission)
  })

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
        <div className="flex items-center justify-between px-5 py-4 border-b border-hub-border/50">
          <span className="text-lg font-semibold text-hub-text tracking-tight">Пространство</span>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-hub-text-muted hover:text-hub-text transition-colors rounded-full hover:bg-hub-surface-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {visibleSections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  id={`workspace-nav-${section.id}`}
                  onClick={() => {
                    onSelectSection(section.id)
                    onClose()
                  }}
                  className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors group ${
                    isActive
                      ? "bg-hub-surface text-hub-text font-semibold shadow-xs"
                      : "text-hub-text-muted hover:bg-hub-surface-hover hover:text-hub-text"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                        isActive
                          ? "bg-hub-surface border-hub-border text-hub-text"
                          : "bg-hub-surface-hover/60 border-hub-border-light/50 text-hub-text-muted group-hover:text-hub-text group-hover:bg-hub-surface-hover"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium truncate">{section.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform shrink-0 ${
                      isActive
                        ? "text-hub-text"
                        : "text-hub-text-subtle group-hover:text-hub-text-muted group-hover:translate-x-0.5"
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </nav>

        {/* User profile at bottom */}
        <div className="p-3 pb-6 flex flex-col mt-auto pt-3 border-t border-hub-border">
          <UserProfileCard onClose={onClose} />
        </div>
      </div>
    </>
  )
}
