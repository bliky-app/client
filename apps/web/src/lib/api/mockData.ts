import type {
  User, Client, Role, Workspace, StaffCategory, Member,
  Appointment, HubOverviewData, WorkspaceSchedule
} from "@/types/models"

// 1. Roles
export const ROLE_OWNER: Role = {
  id: "role-owner",
  nameRu: "Владелец",
  permissions: [
    "view_analytics", "view_global_schedule", "manage_schedule",
    "view_global_clients", "manage_clients", "manage_services",
    "manage_staff", "view_financials", "manage_workspace", "is_owner"
  ],
  isSystem: true
}

export const ROLE_MASTER: Role = {
  id: "role-master",
  nameRu: "Мастер",
  permissions: ["manage_schedule"],
  isSystem: true
}

export const ROLE_ADMIN: Role = {
  id: "role-admin",
  nameRu: "Администратор",
  permissions: ["view_global_schedule", "manage_schedule", "view_global_clients", "manage_clients", "is_administrator"],
  isSystem: true
}

export const ROLE_USER: Role = {
  id: "role-user",
  nameRu: "Пользователь",
  permissions: [],
  isSystem: true
}

// 2. Users
export const MOCK_USER: User = {
  id: "u-kirill",
  fullName: "Кирилл Волычев",
  shortName: "Кирилл",
  gender: "male",
  isFormal: false,
  color: "#6366f1",
  timezone: "Europe/Moscow",
  globalRole: ROLE_USER
}

const u2: User = { id: "u-masha", fullName: "Мария Смирнова", shortName: "Маша", gender: "female", isFormal: false, color: "#ec4899", globalRole: ROLE_MASTER }
const u3: User = { id: "u-pasha", fullName: "Павел Иванов", shortName: "Павел", gender: "male", isFormal: true, color: "#14b8a6", globalRole: ROLE_MASTER }
const u4: User = { id: "u-anya", fullName: "Анна Петрова", shortName: "Аня", gender: "female", isFormal: false, color: "#f59e0b", globalRole: ROLE_ADMIN }

// 3. Categories
const catHair: StaffCategory = { id: "cat-1", name: "Стилист по волосам" }
const catNails: StaffCategory = { id: "cat-2", name: "Нейл-мастер" }
const catBarber: StaffCategory = { id: "cat-3", name: "Барбер" }

// 4. Clients
const clients: Record<string, Client> = {
  c1: { id: "c1", name: "Алина Смирнова", phone: "+7 (999) 123-45-67" },
  c2: { id: "c2", name: "Дарья В.", phone: "+7 (900) 111-22-33" },
  c3: { id: "c3", name: "Михаил Т.", phone: "+7 (960) 555-33-22" },
  c4: { id: "c4", name: "Ольга Д.", phone: "+7 (911) 222-33-44" },
}

// 5. Staff Members (For shared workspace)
const staffMasha: Member = { id: "s-masha", user: u2, workspaceRole: ROLE_MASTER, mainCategory: catNails, additionalCategories: [] }
const staffPasha: Member = { id: "s-pasha", user: u3, workspaceRole: ROLE_MASTER, mainCategory: catBarber, additionalCategories: [catHair] }
const staffAnya: Member = { id: "s-anya", user: u4, workspaceRole: ROLE_ADMIN, mainCategory: catHair, additionalCategories: [] }
const staffKirillShared: Member = { id: "s-kirill-1", user: MOCK_USER, workspaceRole: ROLE_OWNER, mainCategory: catHair, additionalCategories: [catBarber] }

const staffKirillIndividual: Member = { id: "s-kirill-2", user: MOCK_USER, workspaceRole: ROLE_OWNER, mainCategory: catHair, additionalCategories: [] }
const staffKirillEmployee: Member = { id: "s-kirill-3", user: MOCK_USER, workspaceRole: ROLE_MASTER, mainCategory: catBarber, additionalCategories: [] }
const staffOwnerOther: Member = { id: "s-owner-other", user: u3, workspaceRole: ROLE_OWNER, mainCategory: catBarber, additionalCategories: [] }

const DEFAULT_WORKSPACE_HOURS: WorkspaceSchedule = {
  0: [{ start: "10:00", end: "20:00" }],
  1: [{ start: "09:00", end: "21:00" }],
  2: [{ start: "09:00", end: "21:00" }],
  3: [{ start: "09:00", end: "21:00" }],
  4: [{ start: "09:00", end: "21:00" }],
  5: [{ start: "10:00", end: "21:00" }],
  6: [{ start: "10:00", end: "20:00" }],
}

// 6. Workspaces (Nizhny Novgorod)
export const WS_SHARED: Workspace = {
  id: "ws-1",
  name: "bliky Покровка",
  type: "shared",
  category: "Салон",
  color: "#6366f1",
  timezone: "Europe/Moscow",
  address: "Большая Покровская ул., 22",
  staff: [staffKirillShared, staffMasha, staffPasha, staffAnya],
  schedule: DEFAULT_WORKSPACE_HOURS
}

export const WS_INDIVIDUAL: Workspace = {
  id: "ws-2",
  name: "Частная практика Кирилла",
  type: "individual",
  category: "Кабинет",
  color: "#10b981",
  timezone: "Europe/Moscow",
  address: "Варварская ул., 10",
  staff: [staffKirillIndividual], // User is the only staff
  schedule: DEFAULT_WORKSPACE_HOURS
}

export const WS_SHARED_2: Workspace = {
  id: "ws-3",
  name: "Салон Beauty",
  type: "shared",
  category: "Салон",
  color: "#f43f5e",
  timezone: "Europe/Moscow",
  address: "ул. Рождественская, 15",
  staff: [staffOwnerOther, staffKirillEmployee, staffMasha],
  schedule: DEFAULT_WORKSPACE_HOURS
}

export const MOCK_WORKSPACES: Workspace[] = [WS_SHARED, WS_INDIVIDUAL, WS_SHARED_2]

// 7. Appointments (Using ISO 8601 strings)
// Current day context: 2026-07-20
const DATE_STR = "2026-07-20"
const TZ = "+03:00"

export const MOCK_APPOINTMENTS: Appointment[] = [
  // Shared Workspace Appointments
  {
    id: "apt-1",
    startDateTime: `${DATE_STR}T10:00:00${TZ}`,
    client: clients.c1,
    serviceName: "Сложное окрашивание (Балаяж)",
    price: 12000,
    workspace: WS_SHARED,
    staff: staffKirillShared,
    stages: [
      { id: "stg1", name: "Консультация и разделение", durationMinutes: 30, isActive: true },
      { id: "stg2", name: "Ожидание осветления", durationMinutes: 45, isActive: false },
      { id: "stg3", name: "Тонирование и укладка", durationMinutes: 45, isActive: true },
    ],
    isConfirmed: true
  },
  {
    id: "apt-2",
    startDateTime: `${DATE_STR}T11:00:00${TZ}`,
    client: clients.c2,
    serviceName: "Аппаратный маникюр с покрытием",
    price: 3500,
    workspace: WS_SHARED,
    staff: staffMasha,
    stages: [
      { id: "stg4", name: "Снятие и маникюр", durationMinutes: 45, isActive: true },
      { id: "stg5", name: "Покрытие", durationMinutes: 45, isActive: true },
    ],
    isConfirmed: true
  },
  {
    id: "apt-3",
    startDateTime: `${DATE_STR}T15:00:00${TZ}`,
    client: clients.c3,
    serviceName: "Мужская стрижка + борода",
    price: 3000,
    workspace: WS_SHARED,
    staff: staffPasha,
    stages: [
      { id: "stg6", name: "Стрижка", durationMinutes: 45, isActive: true },
      { id: "stg7", name: "Оформление бороды", durationMinutes: 30, isActive: true },
    ],
    isConfirmed: false // Для теста админского вида
  },

  // Individual Workspace Appointments
  {
    id: "apt-4",
    startDateTime: `${DATE_STR}T14:30:00${TZ}`,
    client: clients.c4,
    serviceName: "Мужская стрижка",
    price: 2500,
    workspace: WS_INDIVIDUAL,
    staff: staffKirillIndividual,
    stages: [
      { id: "stg8", name: "Мытье и стрижка", durationMinutes: 45, isActive: true },
      { id: "stg9", name: "Укладка", durationMinutes: 15, isActive: true },
    ],
    isConfirmed: true
  },
  {
    id: "apt-5",
    startDateTime: `${DATE_STR}T17:00:00${TZ}`,
    client: clients.c1,
    serviceName: "Уход для волос",
    price: 4500,
    workspace: WS_INDIVIDUAL,
    staff: staffKirillIndividual,
    stages: [
      { id: "stg10", name: "Нанесение состава", durationMinutes: 30, isActive: true },
      { id: "stg11", name: "Выдержка под теплом", durationMinutes: 30, isActive: false },
      { id: "stg12", name: "Смывание и сушка", durationMinutes: 30, isActive: true },
    ],
    isConfirmed: true
  },


  // Employee Workspace Appointments (WS_SHARED_2)
  {
    id: "apt-6",
    startDateTime: `${DATE_STR}T13:00:00${TZ}`,
    client: clients.c2,
    serviceName: "Оформление бороды",
    price: 1500,
    workspace: WS_SHARED_2,
    staff: staffKirillEmployee,
    stages: [
      { id: "stg13", name: "Оформление бороды", durationMinutes: 45, isActive: true }
    ],
    isConfirmed: false // Для теста админского вида
  }
]

// 8. Hub Overview
export const MOCK_HUB_OVERVIEW: HubOverviewData = {
  user: MOCK_USER,
  requestAt: new Date().toISOString(), // Use current time so greeting logic reflects reality
  todayAppointments: 2, // Kirill's appointments across all workspaces
  completeAppointments: 1,
  todayRevenue: 14500,
  expectedRevenue: 19000,
  lastAppointmentEndTime: `${DATE_STR}T18:30:00${TZ}`,
  totalWorkspaceAppointments: 5,
  totalWorkspaceRevenue: 25500,
  unconfirmedAppointments: 2,
  totalWorkspaces: 2
}

// 9. Schedules
export const STAFF_SCHEDULE_HOURS: Record<string, Record<number, { start: string; end: string }[]>> = {
  "s-kirill-1": {
    1: [{ start: "10:00", end: "13:00" }, { start: "14:00", end: "20:00" }],
    2: [{ start: "10:00", end: "13:00" }, { start: "14:00", end: "20:00" }],
    3: [{ start: "10:00", end: "13:00" }, { start: "14:00", end: "20:00" }],
    4: [{ start: "10:00", end: "13:00" }, { start: "14:00", end: "20:00" }],
    5: [{ start: "10:00", end: "13:00" }, { start: "14:00", end: "20:00" }],
    6: [{ start: "10:00", end: "16:00" }],
  },
  "s-kirill-3": {
    1: [{ start: "12:00", end: "18:00" }],
    2: [{ start: "12:00", end: "18:00" }],
    3: [{ start: "12:00", end: "18:00" }],
    4: [{ start: "12:00", end: "18:00" }],
    5: [{ start: "12:00", end: "18:00" }],
  },
  "s-masha": {
    1: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "19:00" }],
    2: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "19:00" }],
    4: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "19:00" }],
    5: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "19:00" }],
    6: [{ start: "09:00", end: "15:00" }],
  },
  "s-pasha": {
    1: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "21:00" }],
    2: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "21:00" }],
    3: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "21:00" }],
    4: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "21:00" }],
    5: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "21:00" }],
  },
  "s-kirill-2": {
    1: [{ start: "10:00", end: "20:00" }],
    2: [{ start: "10:00", end: "20:00" }],
    3: [{ start: "10:00", end: "20:00" }],
    4: [{ start: "10:00", end: "20:00" }],
    5: [{ start: "10:00", end: "20:00" }],
  },
}
