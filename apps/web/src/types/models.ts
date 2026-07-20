// 1. Права и Роли
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

// 2. Пользователь и Клиент
export interface User {
  id: string
  fullName: string
  shortName: string
  gender: "male" | "female"
  isFormal: boolean
  color: string
  avatarUrl?: string
  timezone?: string
  globalRole: Role
}

export interface Client {
  id: string
  name: string
  phone: string
}

// 3. Сотрудники и Пространства
export interface StaffCategory {
  id: string
  name: string // например: "Колорист", "Массажист"
}

export interface Member {
  id: string
  user?: User
  fullName?: string
  shortName?: string
  color?: string
  workspaceRole: Role
  mainCategory: StaffCategory
  additionalCategories: StaffCategory[]
}

export type WorkspaceType = "individual" | "shared" | "coworking" | "hybrid"

export interface WorkspaceSchedule {
  [dayOfWeek: number]: { start: string; end: string }[]
}

export interface Workspace {
  id: string
  name: string
  type: WorkspaceType
  category: string // "Салон", "Частная практика" и т.д.
  color: string
  timezone: string // IANA timezone, например "Europe/Moscow"
  address?: string
  avatarUrl?: string
  staff?: Member[] // undefined, если нет прав на просмотр стафа
  schedule: WorkspaceSchedule
}

// 4. Дашборд
export interface HubOverviewData {
  user: User
  requestAt: string // ISO 8601 (заменили requestTime: Date)
  todayAppointments: number
  completeAppointments: number
  todayRevenue: number
  expectedRevenue: number
  lastAppointmentEndTime: string | null // Можно оставить ISO 8601 для единообразия
  totalWorkspaceAppointments: number
  totalWorkspaceRevenue: number
  unconfirmedAppointments: number
  totalWorkspaces: number
}

// 5. Расписание (Timetable)
export interface AppointmentStage {
  id: string
  name: string
  durationMinutes: number
  isActive: boolean
}

export interface Appointment {
  id: string
  startDateTime: string // ISO 8601 (заменили date и startTime)
  color?: string
  client: Client
  serviceName: string
  price: number
  workspace: Workspace
  staff: Member
  stages: AppointmentStage[]
  isConfirmed: boolean
}

export interface TimetableSlot {
  startDateTime: string // ISO 8601
  endDateTime: string   // ISO 8601
}

export type TimetableViewType = "personal" | "team"

export interface TimetableColumn {
  id: string
  label: string
  subLabel?: string
  dateString?: string // YYYY-MM-DD для UI (идентификатор дня для personal view)
  staff?: Member // Для team view
  isToday?: boolean
  schedule: TimetableSlot[] // Открытые рабочие часы в формате ISO
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
