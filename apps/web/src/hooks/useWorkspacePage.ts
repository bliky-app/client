/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { workspaceApi } from "@/lib/api/workspaceApi"
import type { WorkspaceSectionId } from "@/types/models"
import { usePermissions } from "@/lib/permissions"

export function useWorkspacePage(id: string) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<WorkspaceSectionId>("overview")
  
  const { can, user } = usePermissions(id)
  const isFormal = user?.isFormal ?? true

  useEffect(() => {
    setActiveSection("overview")
  }, [id])

  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace", id],
    queryFn: () => workspaceApi.getWorkspace(id),
  })

  return {
    drawerOpen,
    setDrawerOpen,
    activeSection,
    setActiveSection,
    can,
    isFormal,
    workspace,
    isLoading
  }
}
