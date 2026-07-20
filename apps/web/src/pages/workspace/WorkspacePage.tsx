import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Users, Package, UserCheck, BarChart2, Clock, ClipboardList, List } from "lucide-react"
import WorkspaceHeader from "./WorkspaceHeader"
import WorkspaceDrawer from "./WorkspaceDrawer"
import WorkspaceSchedule from "./WorkspaceSchedule"
import WorkspaceStub from "./WorkspaceStub"
import { workspaceApi } from "@/lib/api/workspaceApi"
import type { WorkspaceSectionId } from "@/types/models"
import { usePermissions } from "@/lib/permissions"

interface WorkspacePageProps {
  id: string
}

export default function WorkspacePage({ id }: WorkspacePageProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<WorkspaceSectionId>("overview")
  const { can } = usePermissions(id)

  useEffect(() => {
    setActiveSection("overview")
  }, [id])

  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace", id],
    queryFn: () => workspaceApi.getWorkspace(id),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 bg-hub-base items-center justify-center h-full w-full">
        <Loader2 className="w-8 h-8 animate-spin text-panel-text-muted-dark" />
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="flex flex-col flex-1 bg-hub-base items-center justify-center h-full w-full">
        <p className="text-hub-text-muted">Пространство не найдено</p>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <WorkspaceSchedule workspace={workspace} forcedViewType="personal" />
      case "schedule":
        return <WorkspaceSchedule workspace={workspace} forcedViewType="team" />
      case "appointments":
        return <WorkspaceStub icon={ClipboardList} title="Записи" description="История всех записей, подтверждение и управление визитами." />
      case "work_schedule":
        return <WorkspaceStub icon={Clock} title="График" description="Управление графиком работы мастеров." />
      case "services": {
        const hasFullAccess = can("manage_services")
        return (
          <WorkspaceStub 
            icon={List} 
            title="Услуги" 
            description={hasFullAccess 
              ? "Управление прайс-листом и категориями услуг всего пространства."
              : "Здесь отображаются ваши доступные услуги и цены."} 
          />
        )
      }
      case "staff":
        return <WorkspaceStub icon={Users} title="Сотрудники" description="Управление мастерами, их графиком и правами." />
      case "resources":
        return <WorkspaceStub icon={Package} title="Ресурсы" description="Управление рабочими местами, кабинетами и оборудованием." />
      case "clients":
        return <WorkspaceStub icon={UserCheck} title="Клиенты" description="База клиентов пространства, история визитов и контакты." />
      case "analytics":
        return <WorkspaceStub icon={BarChart2} title="Аналитика" description="Выручка, загрузка, конверсия и другие ключевые метрики." />
      default:
        return <WorkspaceStub icon={Package} title="Раздел" description="Раздел в разработке" />
    }
  }

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-hub-base select-none overflow-hidden animate-in fade-in duration-300">
      <WorkspaceDrawer
        workspace={workspace}
        isOpen={drawerOpen}
        activeSection={activeSection}
        onClose={() => setDrawerOpen(false)}
        onSelectSection={setActiveSection}
      />

      <div className="bg-hub-base px-6 py-8">
        <WorkspaceHeader workspace={workspace} onMenuOpen={() => setDrawerOpen(true)} />
      </div>

      <div className="flex-1 bg-panel-base rounded-t-[32px] overflow-hidden flex flex-col">
        {renderSection()}
      </div>
    </div>
  )
}
