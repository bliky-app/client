/* eslint-disable react-refresh/only-export-components */
import { type ReactNode, createContext, useContext } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { PermissionsProvider } from "./permissions"
import { authApi } from "./api/authApi"
import { hubApi } from "./api/hubApi"
import type { User } from "@/types/models"

type AuthContextType = {
  user: User | null
  login: typeof authApi.login
  register: typeof authApi.register
  logout: typeof authApi.logout
  checkPhone: typeof authApi.checkPhone
  updateProfile: typeof authApi.updateProfile
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
  })

  // Only fetch workspaces if user is authenticated
  const { data: workspaces = [], isLoading: isWorkspacesLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: hubApi.getWorkspaces,
    enabled: !!user,
  })

  const login: typeof authApi.login = async (phone, password) => {
    const res = await authApi.login(phone, password)
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] })
    return res
  }

  const register: typeof authApi.register = async (phone, password) => {
    const res = await authApi.register(phone, password)
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] })
    return res
  }

  const logout: typeof authApi.logout = async () => {
    await authApi.logout()
    queryClient.setQueryData(["currentUser"], null)
    queryClient.setQueryData(["workspaces"], [])
  }

  const checkPhone = authApi.checkPhone

  const updateProfile: typeof authApi.updateProfile = async (data) => {
    const res = await authApi.updateProfile(data)
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] })
    return res
  }

  const isLoading = isUserLoading || (!!user && isWorkspacesLoading)

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-hub-base">
        <Loader2 className="w-8 h-8 animate-spin text-panel-muted" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user: user ?? null, login, register, logout, checkPhone, updateProfile, isLoading: isUserLoading }}>
      <PermissionsProvider user={user ?? null} workspaces={workspaces}>
        {children}
      </PermissionsProvider>
    </AuthContext.Provider>
  )
}
