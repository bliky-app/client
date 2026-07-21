/**
 * Атомарные права доступа, которые можно назначать ролям.
 * Используются для проверки разрешений в usePermissions и RequirePermission.
 */
export type Permission =
  | "view_analytics"
  | "view_global_schedule"
  | "manage_schedule"
  | "view_global_clients"
  | "manage_clients"
  | "manage_services"
  | "manage_staff"
  | "view_financials"
  | "manage_workspace"
  | "is_administrator"
  | "is_owner"

export interface Role {
  id: string
  nameRu: string
  permissions: Permission[]
  isSystem: boolean
}

export interface User {
  id: string
  phone: string
  firstName?: string
  lastName?: string
  fullName?: string
  shortName?: string
  gender: "male" | "female"
  isFormal: boolean
  color: string
  avatarUrl?: string
  timezone?: string
  globalRole: Role
}
