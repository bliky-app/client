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

export function useWorkspaces() {
  const context = useContext(PermissionsContext)
  if (!context) {
    throw new Error("useWorkspaces must be used within a PermissionsProvider")
  }
  return { workspaces: context.workspaces, user: context.user }
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

      if (user.globalRole.permissions.includes(action)) {
        return true
      }

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

      return workspaces.some((workspace) => {
        if (!workspace.staff) return false
        const staffMember = workspace.staff.find((s) => s.user?.id === user.id)
        return staffMember && staffMember.workspaceRole.permissions.includes(action)
      })
    }
  }, [user, workspaces])

  // Backward compatibility: we still return user and workspaces, but ideally they should use useWorkspaces()
  return { can, canInAnyWorkspace, user, workspaces }
}

export function useWorkspacePermissions(workspaceId: string) {
  const { can, user } = usePermissions(workspaceId)
  return { can, user }
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
