import { createBrowserRouter, RouterProvider, useParams, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import MasterLayout from "@/layouts/MasterLayout"
import Hub from "@/pages/hub/Hub"
import WorkspacePage from "@/pages/workspace/WorkspacePage"
import CreateWorkspacePage from "@/pages/workspace/CreateWorkspacePage"
import AuthPage from "@/pages/auth/AuthPage"
import AccountSetupPage from "@/pages/auth/AccountSetupPage"
import { AuthProvider, useAuth } from "@/lib/AuthProvider"
import { ThemeProvider } from "@/lib/ThemeProvider"

import UserSettingsPage from "@/pages/settings/UserSettingsPage"

function RequireAuth({ children, requireName = true }: { children: React.ReactNode; requireName?: boolean }) {
  const { user, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-hub-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-hub-text-muted" />
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  // If user is logged in but hasn't set their name, force setup
  if (requireName && (!user.firstName || !user.lastName)) {
    return <Navigate to="/setup" replace />
  }
  return <>{children}</>
}

function WorkspaceRoute() {
  const { id } = useParams<{ id: string }>()
  if (!id) return null
  return <WorkspacePage id={id} />
}

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />
  },
  {
    path: "/setup",
    element: (
      <RequireAuth requireName={false}>
        <AccountSetupPage />
      </RequireAuth>
    )
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <MasterLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Hub />
      },
      {
        path: "workspace/new",
        element: <CreateWorkspacePage />
      },
      {
        path: "settings",
        element: <UserSettingsPage />
      },
      {
        path: "workspace/:id",
        element: <WorkspaceRoute />
      },
    ],
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

import { ToastProvider } from "@/lib/ToastProvider"

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="bliky-ui-theme">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
