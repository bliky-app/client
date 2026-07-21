import type { User } from "./auth.models"

export interface HubOverviewData {
  user: User
  requestAt: string
  todayAppointments: number
  completeAppointments: number
  todayRevenue: number
  expectedRevenue: number
  lastAppointmentEndTime: string | null
  totalWorkspaceAppointments: number
  totalWorkspaceRevenue: number
  unconfirmedAppointments: number
  totalWorkspaces: number
}
