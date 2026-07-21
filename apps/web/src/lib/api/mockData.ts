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
  phone: "+7 (999) 000-00-00",
  firstName: "Кирилл",
  lastName: "Олегов",
  fullName: "Кирилл Олегов",
  shortName: "Кирилл",
  gender: "male",
  isFormal: false,
  color: "#6366f1",
  timezone: "Europe/Moscow",
  globalRole: ROLE_USER
}

export function syncMockUserWithSession(): User {
  try {
    const raw = localStorage.getItem("bliky_auth_session")
    if (raw) {
      const parsed = JSON.parse(raw)
      const user = parsed?.user
      if (user) {
        if (user.firstName) MOCK_USER.firstName = user.firstName
        if (user.lastName) MOCK_USER.lastName = user.lastName
        if (user.fullName) MOCK_USER.fullName = user.fullName
        if (user.shortName || user.firstName) MOCK_USER.shortName = user.shortName || user.firstName
        MOCK_USER.avatarUrl = user.avatarUrl
        if (user.color) MOCK_USER.color = user.color
        if (user.gender) MOCK_USER.gender = user.gender
        if (user.isFormal !== undefined) MOCK_USER.isFormal = user.isFormal
        if (user.timezone) MOCK_USER.timezone = user.timezone
        if (user.id) MOCK_USER.id = user.id
        return user
      }
    }
  } catch {
    // ignore
  }
  return MOCK_USER
}

const u2: User = { id: "u-masha", phone: "+79991112233", fullName: "Мария Смирнова", shortName: "Маша", gender: "female", isFormal: false, color: "#ec4899", globalRole: ROLE_MASTER }
const u3: User = { id: "u-pasha", phone: "+79992223344", fullName: "Павел Иванов", shortName: "Павел", gender: "male", isFormal: true, color: "#14b8a6", globalRole: ROLE_MASTER }
const u4: User = { id: "u-anya", phone: "+79993334455", fullName: "Анна Петрова", shortName: "Аня", gender: "female", isFormal: false, color: "#f59e0b", globalRole: ROLE_ADMIN }
const u5: User = { id: "u-lena", phone: "+79994445566", fullName: "Елена Кузнецова", shortName: "Лена", gender: "female", isFormal: false, color: "#8b5cf6", globalRole: ROLE_MASTER }
const u6: User = { id: "u-igor", phone: "+79995556677", fullName: "Игорь Макаров", shortName: "Игорь", gender: "male", isFormal: false, color: "#ef4444", globalRole: ROLE_MASTER }

// 3. Categories
const catHair: StaffCategory = { id: "cat-1", name: "Стилист по волосам" }
const catNails: StaffCategory = { id: "cat-2", name: "Нейл-мастер" }
const catBarber: StaffCategory = { id: "cat-3", name: "Барбер" }
const catMassage: StaffCategory = { id: "cat-4", name: "Массажист" }
const catBrows: StaffCategory = { id: "cat-5", name: "Бровист" }

// 4. Clients
const clients: Record<string, Client> = {
  c1: { id: "c1", name: "Алина Смирнова", phone: "+7 (999) 123-45-67" },
  c2: { id: "c2", name: "Дарья В.", phone: "+7 (900) 111-22-33" },
  c3: { id: "c3", name: "Михаил Т.", phone: "+7 (960) 555-33-22" },
  c4: { id: "c4", name: "Ольга Д.", phone: "+7 (911) 222-33-44" },
  c5: { id: "c5", name: "Евгений Р.", phone: "+7 (999) 555-77-88" },
  c6: { id: "c6", name: "Виктория К.", phone: "+7 (910) 999-88-77" },
}

// 5. Staff Members
const staffMasha: Member = { id: "s-masha", user: u2, workspaceRole: ROLE_MASTER, mainCategory: catNails, additionalCategories: [catBrows] }
const staffPasha: Member = { id: "s-pasha", user: u3, workspaceRole: ROLE_MASTER, mainCategory: catBarber, additionalCategories: [catHair] }
const staffAnya: Member = { id: "s-anya", user: u4, workspaceRole: ROLE_ADMIN, mainCategory: catHair, additionalCategories: [] }
const staffLena: Member = { id: "s-lena", user: u5, workspaceRole: ROLE_MASTER, mainCategory: catMassage, additionalCategories: [] }
const staffIgor: Member = { id: "s-igor", user: u6, workspaceRole: ROLE_MASTER, mainCategory: catBarber, additionalCategories: [] }

// Kirill's roles in different workspaces
const staffKirillShared: Member = { id: "s-kirill-1", user: MOCK_USER, workspaceRole: ROLE_OWNER, mainCategory: catHair, additionalCategories: [catBarber] }
const staffKirillIndividual: Member = { id: "s-kirill-2", user: MOCK_USER, workspaceRole: ROLE_OWNER, mainCategory: catHair, additionalCategories: [] }
const staffKirillCoworking: Member = { id: "s-kirill-3", user: MOCK_USER, workspaceRole: ROLE_MASTER, mainCategory: catBarber, additionalCategories: [] }

const staffOwnerOther: Member = { id: "s-owner-other", user: u3, workspaceRole: ROLE_OWNER, mainCategory: catBarber, additionalCategories: [] }

// Default Schedules
const DEFAULT_WORKSPACE_HOURS: WorkspaceSchedule = {
  0: [{ start: "10:00", end: "20:00" }],
  1: [{ start: "09:00", end: "21:00" }],
  2: [{ start: "09:00", end: "21:00" }],
  3: [{ start: "09:00", end: "21:00" }],
  4: [{ start: "09:00", end: "21:00" }],
  5: [{ start: "10:00", end: "21:00" }],
  6: [{ start: "10:00", end: "20:00" }],
}

// 6. Workspaces
export const WS_SHARED: Workspace = {
  id: "ws-1",
  name: "bliky Покровка",
  type: "shared",
  category: "Салон",
  color: "#6366f1",
  timezone: "Europe/Moscow",
  address: "Большая Покровская ул., 22",
  staff: [staffKirillShared, staffMasha, staffPasha, staffAnya, staffLena],
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
  staff: [staffKirillIndividual],
  schedule: {
    ...DEFAULT_WORKSPACE_HOURS,
    1: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }], // Обеденный перерыв
    2: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    3: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    4: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    5: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }]
  }
}

export const WS_COWORKING: Workspace = {
  id: "ws-3",
  name: "Beauty Coworking",
  type: "coworking",
  category: "Коворкинг",
  color: "#f43f5e",
  timezone: "Europe/Moscow",
  address: "ул. Рождественская, 15",
  staff: [staffOwnerOther, staffKirillCoworking, staffMasha, staffIgor],
  schedule: DEFAULT_WORKSPACE_HOURS
}

export const MOCK_WORKSPACES: Workspace[] = [WS_SHARED, WS_INDIVIDUAL, WS_COWORKING]

// 7. Dynamic Date Utilities
const getOffsetDate = (daysOffset: number): Date => {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  return d
}

// Ensure 2-digit format
const pad = (n: number) => n.toString().padStart(2, "0")

// Date string: YYYY-MM-DD
const getDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// ISO 8601 helper
const makeISO = (d: Date, timeStr: string, tz: string = "+03:00") => {
  return `${getDateStr(d)}T${timeStr}:00${tz}`
}

const today = new Date()
const tomorrow = getOffsetDate(1)
const yesterday = getOffsetDate(-1)
const nextWeek = getOffsetDate(7)

// 8. Appointments Factory
export const MOCK_APPOINTMENTS: Appointment[] = [
  // --- TODAY ---
  
  // Shared Workspace (Kirill)
  {
    id: "apt-1",
    startDateTime: makeISO(today,"10:00"),
    totalDurationMinutes: 120,
    client: clients.c1,
    serviceName: "Сложное окрашивание (Балаяж)",
    price: 12000,
    workspace: WS_SHARED,
    staff: staffKirillShared,
    stages: [
      { id: "stg1", name: "Консультация и разделение", durationMinutes: 30, isActive: true },
      { id: "stg2", name: "Ожидание осветления", isActive: false },
      { id: "stg3", name: "Тонирование и укладка", durationMinutes: 45, isActive: true },
    ],
    isConfirmed: true
  },
  {
    id: "apt-2",
    startDateTime: makeISO(today,"15:00"),
    totalDurationMinutes: 60,
    client: clients.c2,
    serviceName: "Женская стрижка",
    price: 3500,
    workspace: WS_SHARED,
    staff: staffKirillShared,
    stages: [
      { id: "stg4", name: "Мытье и уход", isActive: true },
      { id: "stg5", name: "Стрижка", durationMinutes: 45, isActive: true },
    ],
    isConfirmed: true
  },
  
  // Shared Workspace (Other staff)
  {
    id: "apt-3",
    startDateTime: makeISO(today,"11:00"),
    totalDurationMinutes: 60,
    client: clients.c3,
    serviceName: "Аппаратный маникюр",
    price: 2500,
    workspace: WS_SHARED,
    staff: staffMasha,
    stages: [
      { id: "stg6", name: "Маникюр", durationMinutes: 60, isActive: true }
    ],
    isConfirmed: true
  },
  {
    id: "apt-4",
    startDateTime: makeISO(today,"16:00"),
    totalDurationMinutes: 105,
    client: clients.c4,
    serviceName: "Массаж спины",
    price: 4000,
    workspace: WS_SHARED,
    staff: staffLena,
    stages: [
      { id: "stg7", name: "Массаж", durationMinutes: 60, isActive: true }
    ],
    isConfirmed: false // Для проверки бейджа неподтвержденных
  },

  // Individual Workspace (Kirill)
  {
    id: "apt-5",
    startDateTime: makeISO(today,"18:00"),
    totalDurationMinutes: 105,
    client: clients.c5,
    serviceName: "Мужская стрижка",
    price: 3000,
    workspace: WS_INDIVIDUAL,
    staff: staffKirillIndividual,
    stages: [
      { id: "stg8", name: "Стрижка", durationMinutes: 45, isActive: true }
    ],
    isConfirmed: true
  },

  // Coworking (Kirill Employee)
  {
    id: "apt-6",
    startDateTime: makeISO(today,"12:00"),
    totalDurationMinutes: 45,
    client: clients.c6,
    serviceName: "Оформление бороды",
    price: 1500,
    workspace: WS_COWORKING,
    staff: staffKirillCoworking,
    stages: [
      { id: "stg9", name: "Борода", durationMinutes: 45, isActive: true }
    ],
    isConfirmed: false
  },

  // --- YESTERDAY ---
  {
    id: "apt-7",
    startDateTime: makeISO(yesterday,"14:00"),
    totalDurationMinutes: 30,
    client: clients.c1,
    serviceName: "Консультация",
    price: 1000,
    workspace: WS_SHARED,
    staff: staffKirillShared,
    stages: [
      { id: "stg10", name: "Осмотр", durationMinutes: 30, isActive: true }
    ],
    isConfirmed: true
  },

  // --- TOMORROW ---
  {
    id: "apt-8",
    startDateTime: makeISO(tomorrow,"11:30"),
    totalDurationMinutes: 60,
    client: clients.c2,
    serviceName: "Окрашивание корней",
    price: 5000,
    workspace: WS_SHARED,
    staff: staffKirillShared,
    stages: [
      { id: "stg11", name: "Нанесение", durationMinutes: 30, isActive: true },
      { id: "stg12", name: "Смывание", durationMinutes: 30, isActive: true }
    ],
    isConfirmed: true
  },

  // --- NEXT WEEK ---
  {
    id: "apt-9",
    startDateTime: makeISO(nextWeek,"15:00"),
    totalDurationMinutes: 90,
    client: clients.c3,
    serviceName: "Маникюр с дизайном",
    price: 3500,
    workspace: WS_SHARED,
    staff: staffMasha,
    stages: [
      { id: "stg13", name: "Снятие и маникюр", durationMinutes: 60, isActive: true },
      { id: "stg14", name: "Дизайн", durationMinutes: 30, isActive: true }
    ],
    isConfirmed: true
  }
]

// 9. Calculate HubOverviewData dynamically based on TODAY's appointments
const todayDateStr = getDateStr(today)

const todayKirillApts = MOCK_APPOINTMENTS.filter(a => 
  a.startDateTime.startsWith(todayDateStr) && 
  a.staff.user?.id === MOCK_USER.id
)

const todayWorkspaceApts = MOCK_APPOINTMENTS.filter(a => 
  a.startDateTime.startsWith(todayDateStr)
)

const todayKirillRevenue = todayKirillApts.reduce((sum, a) => sum + a.price, 0)
const expectedKirillRevenue = todayKirillRevenue
const todayWorkspaceRevenue = todayWorkspaceApts.reduce((sum, a) => sum + a.price, 0)
const unconfirmed = todayWorkspaceApts.filter(a => !a.isConfirmed).length

// Mocking some completed state (e.g. 1 appointment is completed if Kirill has any)
const completeCount = todayKirillApts.length > 0 ? 1 : 0
const todayRevenueCount = todayKirillApts.length > 0 ? todayKirillApts[0].price : 0

// Find Kirill's last appointment end time
let lastEndTime: string | null = null
if (todayKirillApts.length > 0) {
  const sorted = [...todayKirillApts].sort((a, b) => a.startDateTime.localeCompare(b.startDateTime))
  const lastApt = sorted[sorted.length - 1]
  const totalDuration = lastApt.totalDurationMinutes
  
  const endD = new Date(lastApt.startDateTime)
  endD.setMinutes(endD.getMinutes() + totalDuration)
  lastEndTime = makeISO(endD, `${pad(endD.getHours())}:${pad(endD.getMinutes())}`)
}

export const MOCK_HUB_OVERVIEW: HubOverviewData = {
  user: MOCK_USER,
  requestAt: new Date().toISOString(),
  todayAppointments: todayKirillApts.length,
  completeAppointments: completeCount,
  todayRevenue: todayRevenueCount,
  expectedRevenue: expectedKirillRevenue,
  lastAppointmentEndTime: lastEndTime,
  totalWorkspaceAppointments: todayWorkspaceApts.length,
  totalWorkspaceRevenue: todayWorkspaceRevenue,
  unconfirmedAppointments: unconfirmed,
  totalWorkspaces: MOCK_WORKSPACES.length
}

// 10. Schedules (More realistic broken schedules)
export const STAFF_SCHEDULE_HOURS: Record<string, Record<number, { start: string; end: string }[]>> = {
  "s-kirill-1": {
    1: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "20:00" }],
    2: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "20:00" }],
    3: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "20:00" }],
    4: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "20:00" }],
    5: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "20:00" }],
    6: [{ start: "10:00", end: "16:00" }],
  },
  "s-kirill-3": { // Coworking (Part time)
    1: [{ start: "12:00", end: "18:00" }],
    2: [{ start: "12:00", end: "18:00" }],
    3: [{ start: "12:00", end: "18:00" }],
    4: [{ start: "12:00", end: "18:00" }],
    5: [{ start: "12:00", end: "18:00" }],
  },
  "s-masha": {
    1: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "19:00" }],
    2: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "19:00" }],
    3: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "19:00" }],
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
  "s-kirill-2": { // Individual
    1: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    2: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    3: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    4: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    5: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
  },
  "s-lena": {
    1: [{ start: "12:00", end: "16:00" }, { start: "17:00", end: "20:00" }],
    3: [{ start: "12:00", end: "16:00" }, { start: "17:00", end: "20:00" }],
    5: [{ start: "12:00", end: "16:00" }, { start: "17:00", end: "20:00" }],
  },
  "s-igor": {
    2: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "18:00" }],
    4: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "18:00" }],
    6: [{ start: "10:00", end: "16:00" }],
  }
}
