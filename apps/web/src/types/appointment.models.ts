import type { Member } from "./workspace.models"
import type { Workspace } from "./workspace.models"

export interface Client {
  id: string
  name: string
  phone: string
}

export interface AppointmentStage {
  id: string
  name: string
  durationMinutes?: number
  isActive: boolean
}

/** @deprecated Используй AppointmentStage. Алиас для обратной совместимости. */
export type ServiceStage = AppointmentStage

export interface Service {
  id: string
  name: string
  categoryId: string
  allowedStaffIds: string[]
  price: number
  totalDurationMinutes: number
  stages: AppointmentStage[]
}

export interface CustomService {
  id: string
  name: string
  price: number
  totalDurationMinutes: number
  stages: AppointmentStage[]
}

export interface Appointment {
  id: string
  startDateTime: string
  totalDurationMinutes: number
  color?: string
  client: Client
  service?: Service
  customService?: CustomService
  /** Отображаемое название — вычисляется из service или customService */
  serviceName: string
  price: number
  workspace: Workspace
  staff: Member
  stages: AppointmentStage[]
  notes?: string
  isConfirmed: boolean
}
