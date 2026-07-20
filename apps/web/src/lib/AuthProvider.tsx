import { type ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { PermissionsProvider } from "./permissions"
import { authApi } from "./api/authApi"
import { hubApi } from "./api/hubApi"

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
  })

  const { data: workspaces = [], isLoading: isWorkspacesLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: hubApi.getWorkspaces,
  })

  if (isUserLoading || isWorkspacesLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-hub-base">
        <Loader2 className="w-8 h-8 animate-spin text-panel-muted" />
      </div>
    )
  }

  return (
    <PermissionsProvider user={user ?? null} workspaces={workspaces}>
      {children}
    </PermissionsProvider>
  )
}
