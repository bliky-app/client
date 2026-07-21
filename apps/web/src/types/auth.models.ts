/**
 * Атомарные права доступа, которые можно назначать ролям.
 * Используются для проверки разрешений в usePermissions и RequirePermission.
 */
export type Permission =
  | "view_own_schedule"
  | "manage_own_schedule"
  | "view_all_schedule"
  | "manage_all_schedule"
  | "view_own_clients"
  | "manage_own_clients"
  | "view_all_clients"
  | "manage_all_clients"
  | "manage_services"
  | "view_staff"
  | "manage_staff"
  | "view_analytics"
  | "view_financials"
  | "manage_workspace_settings"

export interface Role {
  id: string
  nameRu: string
  permissions: Permission[]
  isSystem: boolean
}

export interface User {
  id: string
  phone: string
  firstName: string
  lastName: string
  gender: "male" | "female"
  isFormal: boolean
  color: string
  avatarUrl?: string
  timezone?: string
  globalRole: Role
}
