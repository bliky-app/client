import { Loader2, Users, Package, UserCheck, BarChart2, Clock, ClipboardList, List } from "lucide-react"
import WorkspaceSchedule from "./WorkspaceSchedule"
import WorkspaceStub from "./WorkspaceStub"
import WorkspaceLayout from "@/layouts/WorkspaceLayout"
import { useWorkspacePage } from "@/hooks/workspace/useWorkspacePage"

interface WorkspacePageProps {
  id: string
}

export default function WorkspacePage({ id }: WorkspacePageProps) {
  const {
    drawerOpen,
    setDrawerOpen,
    activeSection,
    setActiveSection,
    can,
    isFormal,
    workspace,
    isLoading
  } = useWorkspacePage(id)

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
              : (isFormal ? "Здесь отображаются ваши доступные услуги и цены." : "Здесь отображаются твои доступные услуги и цены.")}
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
    <WorkspaceLayout
      workspace={workspace}
      drawerOpen={drawerOpen}
      activeSection={activeSection}
      onDrawerClose={() => setDrawerOpen(false)}
      onMenuOpen={() => setDrawerOpen(true)}
      onSelectSection={setActiveSection}
    >
      {renderSection()}
    </WorkspaceLayout>
  )
}
