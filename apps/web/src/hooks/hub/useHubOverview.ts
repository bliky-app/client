import { useQuery } from "@tanstack/react-query"
import { hubApi } from "@/lib/api/hubApi"

/**
 * Загружает обзорные данные дашборда и список пространств текущего пользователя.
 */
export function useHubOverview() {
  const {
    data: overview,
    isLoading: isOverviewLoading,
  } = useQuery({
    queryKey: ["hubOverview"],
    queryFn: hubApi.getOverview,
  })

  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces"],
    queryFn: hubApi.getWorkspaces,
  })

  return { overview, isOverviewLoading, workspaces }
}
