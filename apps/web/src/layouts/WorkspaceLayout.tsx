import type { ReactNode } from "react"
import type { Workspace, WorkspaceSectionId } from "@/types/models"
import WorkspaceHeader from "@/pages/workspace/WorkspaceHeader"
import WorkspaceDrawer from "@/pages/workspace/WorkspaceDrawer"

export interface WorkspaceLayoutProps {
  workspace: Workspace
  drawerOpen: boolean
  activeSection: WorkspaceSectionId
  onDrawerClose: () => void
  onMenuOpen: () => void
  onSelectSection: (section: WorkspaceSectionId) => void
  children: ReactNode
}

export default function WorkspaceLayout({
  workspace,
  drawerOpen,
  activeSection,
  onDrawerClose,
  onMenuOpen,
  onSelectSection,
  children,
}: WorkspaceLayoutProps) {
  return (
    <div className="flex flex-col flex-1 h-full w-full bg-hub-base select-none overflow-hidden animate-in fade-in duration-300">
      <WorkspaceDrawer
        workspace={workspace}
        isOpen={drawerOpen}
        activeSection={activeSection}
        onClose={onDrawerClose}
        onSelectSection={onSelectSection}
      />

      <div className="bg-hub-base px-6 py-8">
        <WorkspaceHeader workspace={workspace} onMenuOpen={onMenuOpen} />
      </div>

      <div className="flex-1 bg-panel-base rounded-t-[32px] overflow-y-auto flex flex-col">
        {children}
      </div>
    </div>
  )
}
