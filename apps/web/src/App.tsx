import { createBrowserRouter, RouterProvider, useParams } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import MasterLayout from "@/layouts/MasterLayout"
import Hub from "@/pages/hub/Hub"
import WorkspacePage from "@/pages/workspace/WorkspacePage"
import { AuthProvider } from "@/lib/AuthProvider"

function WorkspaceRoute() {
  const { id } = useParams<{ id: string }>()
  if (!id) return null
  return <WorkspacePage id={id} />
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MasterLayout />,
    children: [
      {
        index: true,
        element: <Hub />
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

import { ThemeProvider } from "@/lib/ThemeProvider"

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
