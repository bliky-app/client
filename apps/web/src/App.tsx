import { createBrowserRouter, RouterProvider, useParams, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import MasterLayout from "@/layouts/MasterLayout"
import Hub from "@/pages/hub/Hub"
import WorkspacePage from "@/pages/workspace/WorkspacePage"
import CreateWorkspacePage from "@/pages/workspace/CreateWorkspacePage"
import AuthPage from "@/pages/auth/AuthPage"
import AccountSetupPage from "@/pages/auth/AccountSetupPage"
import { AuthProvider, useAuth } from "@/lib/AuthProvider"
import { ThemeProvider } from "@/lib/ThemeProvider"

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  // If user is logged in but hasn't set their name, force setup
  if (!user.firstName || !user.lastName) {
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
    element: <AccountSetupPage />
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

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="bliky-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
