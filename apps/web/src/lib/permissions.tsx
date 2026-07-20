/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode, useMemo } from "react"
import { type Permission, type User, type Workspace } from "@/types/models"

interface PermissionsContextValue {
  user: User | null
  workspaces: Workspace[]
}

const PermissionsContext = createContext<PermissionsContextValue>({
  user: null,
  workspaces: [],
})

export function PermissionsProvider({
  children,
  user,
  workspaces,
}: {
  children: ReactNode
  user: User | null
  workspaces: Workspace[]
}) {
  return (
    <PermissionsContext.Provider value={{ user, workspaces }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions(workspaceId?: string) {
  const context = useContext(PermissionsContext)
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider")
  }

  const { user, workspaces } = context

  const can = useMemo(() => {
    return (action: Permission): boolean => {
      if (!user) return false

      // Check global permissions first
      if (user.globalRole.permissions.includes(action)) {
        return true
      }

      // If a specific workspace is provided, check permissions for that workspace
      if (workspaceId) {
        const workspace = workspaces.find((w) => w.id === workspaceId)
        if (!workspace || !workspace.staff) return false
        
        const staffMember = workspace.staff.find((s) => s.user?.id === user.id)
        if (staffMember && staffMember.workspaceRole.permissions.includes(action)) {
          return true
        }
      }

      return false
    }
  }, [user, workspaces, workspaceId])

  const canInAnyWorkspace = useMemo(() => {
    return (action: Permission): boolean => {
      if (!user) return false

      if (user.globalRole.permissions.includes(action)) {
        return true
      }

      // Check if the user has the permission in ANY workspace
      return workspaces.some((workspace) => {
        if (!workspace.staff) return false
        const staffMember = workspace.staff.find((s) => s.user?.id === user.id)
        return staffMember && staffMember.workspaceRole.permissions.includes(action)
      })
    }
  }, [user, workspaces])

  return { can, canInAnyWorkspace, user, workspaces }
}

export function RequirePermission({
  action,
  workspaceId,
  fallback = null,
  children,
}: {
  action: Permission
  workspaceId?: string
  fallback?: ReactNode
  children: ReactNode
}) {
  const { can, canInAnyWorkspace } = usePermissions(workspaceId)

  const hasAccess = workspaceId ? can(action) : canInAnyWorkspace(action)

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
