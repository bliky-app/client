/**
 * Barrel-файл для обратной совместимости.
 * Все новые импорты должны использовать доменные файлы напрямую:
 *   import type { User } from "@/types/auth.models"
 *   import type { Workspace } from "@/types/workspace.models"
 *   и т.д.
 */
export type { Permission, Role, User } from "./auth.models"

export type {
  StaffCategory,
  Member,
  WorkspaceType,
  WorkspaceSchedule,
  Workspace,
  WorkspaceSectionId,
} from "./workspace.models"

export type {
  Client,
  AppointmentStage,
  ServiceStage,
  Service,
  CustomService,
  Appointment,
} from "./appointment.models"

export type {
  TimetableSlot,
  TimetableViewType,
  TimetableColumn,
} from "./timetable.models"

export type { HubOverviewData } from "./hub.models"
