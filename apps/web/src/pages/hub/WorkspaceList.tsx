import { ChevronRight, User, Store, Layers, Plus, type LucideIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Workspace, WorkspaceType } from "@/types/models"
import Avatar from "@/components/Avatar"
import { usePermissions } from "@/lib/permissions"

interface WorkspaceListProps {
  workspaces: Workspace[]
}

interface WorkspaceConfig {
  label: string
  icon: LucideIcon
}

const WORKSPACE_CONFIGS: Record<WorkspaceType, WorkspaceConfig> = {
  individual: {
    label: "Кабинет",
    icon: User,
  },
  shared: {
    label: "Салон",
    icon: Store,
  },
  coworking: {
    label: "Коворкинг",
    icon: Layers,
  },
  hybrid: {
    label: "Гибрид",
    icon: Layers,
  },
}

export default function WorkspaceList({ workspaces }: WorkspaceListProps) {
  const navigate = useNavigate()
  const { user } = usePermissions()

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-6 pt-2 w-full scroll-pl-6 scrollbar-none">
      {workspaces.map((workspace) => {
        const config = WORKSPACE_CONFIGS[workspace.type] || { label: workspace.type, icon: Layers }

        const staffMember = workspace.staff?.find(s => s.user?.id === user?.id)
        const roleName = staffMember?.workspaceRole.nameRu || "Сотрудник"

        return (
          <div
            key={workspace.id}
            onClick={() => navigate(`/workspace/${workspace.id}`)}
            className="bg-panel-surface w-40 shrink-0 snap-start rounded-[32px] p-5 active:scale-[0.97] transition-all duration-150 flex flex-col justify-between h-40 shadow-sm border border-panel-border-subtle cursor-pointer"
          >
            <div className="flex justify-between items-start w-full gap-2">
              <h3 className="font-semibold text-panel-text text-base tracking-tight leading-tight max-w-[80%] line-clamp-2">
                {workspace.name}
              </h3>
              <ChevronRight className="h-5 w-5 text-panel-text-subtle shrink-0 translate-y-0.5" />
            </div>

            <div className="flex items-center gap-3 mt-auto">
              <Avatar
                type="workspace"
                name={workspace.name}
                avatarUrl={workspace.avatarUrl}
                color={workspace.color}
                className="h-9 w-9 rounded-xl text-[10px] shrink-0 border border-panel-border/50"
              />

              <div className="flex flex-col min-w-0 pb-0.5">
                <span className="text-[10px] text-panel-text-subtle font-bold uppercase tracking-wider line-clamp-1">
                  {workspace.category || config.label}
                </span>
                <span className="text-xs text-panel-text-muted-dark font-medium line-clamp-1 mt-0.5">
                  {roleName}
                </span>
              </div>
            </div>
          </div>
        )
      })}

      <div
        onClick={() => navigate("/workspace/new")}
        className="w-40 shrink-0 snap-start rounded-[32px] p-5 active:scale-[0.97] transition-all duration-150 flex flex-col items-center justify-center h-40 border-2 border-dashed border-panel-border bg-panel-base/50 cursor-pointer group hover:bg-panel-base hover:border-panel-border-subtle">
        <div className="p-3 bg-panel-base rounded-2xl border border-panel-border/50 mb-3 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Plus className="h-6 w-6 text-panel-text-muted group-hover:text-panel-text-muted-dark transition-colors" />
        </div>
        <span className="text-xs font-semibold text-panel-text-muted group-hover:text-panel-text-muted-dark transition-colors">
          Создать
        </span>
      </div>
      <div className="w-px shrink-0" />
    </div>
  )
}
