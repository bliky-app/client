import type { HubOverviewData } from "@/types/models"
import { usePermissions } from "@/lib/permissions"
import { formatCurrency, formatTime, getGreeting } from "@/lib/formatters"
import {
  pluralizeAppointment,
  pluralizeAppointmentGenitive,
  pluralizeWorkspaceDative,
  pluralizeWorkspacePrepositional,
  pluralizeUnconfirmedRequest,
} from "@/utils/pluralize"

export function useHubOverviewLogic(data: HubOverviewData) {
  const {
    requestAt,
    user,
    todayAppointments = 0,
    completeAppointments = 0,
    todayRevenue = 0,
    expectedRevenue = 0,
    lastAppointmentEndTime,
    totalWorkspaceAppointments = 0,
    totalWorkspaceRevenue = 0,
    unconfirmedAppointments = 0,
    totalWorkspaces = 0,
  } = data

  const clientDate = requestAt ? new Date(requestAt) : new Date()
  const { gender, isFormal } = user

  const { canInAnyWorkspace, workspaces, user: contextUser } = usePermissions()
  const canViewFinancials = canInAnyWorkspace("view_financials")
  const canViewAnalytics = canInAnyWorkspace("view_analytics")
  
  const isAdmin = workspaces.some((w) => w.staff?.some((s) => s.user?.id === contextUser?.id && s.isAdministrator))
  const isOwner = workspaces.some((w) => w.staff?.some((s) => s.user?.id === contextUser?.id && s.isOwner))

  const greeting = getGreeting(clientDate, user.timezone)
  const remainingAppointments = todayAppointments - completeAppointments

  const pronounGenitive = isFormal ? "вас" : "тебя"
  const pronounPossessive = isFormal ? "вашим" : "твоим"
  const pronounDative = isFormal ? "Вам" : "Тебе"
  const verbFree = isFormal ? "Вы освободитесь" : "Ты освободишься"

  const verbEarned = isFormal
    ? "вы заработали"
    : gender === "female"
    ? "ты заработала"
    : "ты заработал"

  const verbCompleted = isFormal
    ? "вы выполнили"
    : gender === "female"
    ? "ты выполнила"
    : "ты выполнил"

  const verbCreate = isFormal ? "Создайте" : "Создай"
  const verbTell = isFormal ? "расскажите" : "расскажи"

  const formattedExpectedRevenue = formatCurrency(expectedRevenue)
  const formattedTodayRevenue = formatCurrency(todayRevenue)
  const formattedWorkspaceRevenue = formatCurrency(totalWorkspaceRevenue)
  const formattedLastEndTime = lastAppointmentEndTime ? formatTime(lastAppointmentEndTime) : null

  const todayAppointmentsWord = pluralizeAppointment(todayAppointments)
  const todayAppointmentsWordGenitive = pluralizeAppointmentGenitive(todayAppointments)
  const workspacesDativeWord = pluralizeWorkspaceDative(totalWorkspaces)
  const workspacesPrepositionalWord = pluralizeWorkspacePrepositional(totalWorkspaces)
  const workspaceAppointmentsWord = pluralizeAppointment(totalWorkspaceAppointments)
  const unconfirmedWord = pluralizeUnconfirmedRequest(unconfirmedAppointments)

  return {
    todayAppointments,
    completeAppointments,
    remainingAppointments,
    totalWorkspaces,
    totalWorkspaceAppointments,
    unconfirmedAppointments,
    isAdmin,
    isOwner,
    canViewAnalytics,
    canViewFinancials,
    greeting,
    pronounGenitive,
    pronounPossessive,
    pronounDative,
    verbFree,
    verbEarned,
    verbCompleted,
    verbCreate,
    verbTell,
    formattedExpectedRevenue,
    formattedTodayRevenue,
    formattedWorkspaceRevenue,
    formattedLastEndTime,
    todayAppointmentsWord,
    todayAppointmentsWordGenitive,
    workspacesDativeWord,
    workspacesPrepositionalWord,
    workspaceAppointmentsWord,
    unconfirmedWord,
  }
}
