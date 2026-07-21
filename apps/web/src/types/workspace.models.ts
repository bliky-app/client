import type { Role, User } from "./auth.models"

export interface StaffCategory {
  id: string
  name: string
}

export interface Member {
  id: string
  user?: User
  firstName?: string
  lastName?: string
  color?: string
  workspaceRole: Role
  isOwner?: boolean
  isAdministrator?: boolean
  mainCategory: StaffCategory
  additionalCategories: StaffCategory[]
}

export type WorkspaceType = "individual" | "shared" | "coworking" | "hybrid"

/**
 * Расписание пространства: ключ — день недели (0=вс, 1=пн ... 6=сб),
 * значение — массив временных промежутков (поддерживает разрывы, напр. обед).
 */
export interface WorkspaceSchedule {
  [dayOfWeek: number]: { start: string; end: string }[]
}

export interface Workspace {
  id: string
  name: string
  type: WorkspaceType
  category: string
  additionalCategories?: string[]
  color: string
  timezone: string
  address?: string
  avatarUrl?: string
  staff?: Member[]
  schedule: WorkspaceSchedule
}

export type WorkspaceSectionId =
  | "overview"
  | "schedule"
  | "appointments"
  | "work_schedule"
  | "services"
  | "staff"
  | "resources"
  | "analytics"
  | "clients"
  | "settings"
