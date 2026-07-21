import type {
  User, Client, Role, Workspace, StaffCategory, Member,
  Appointment, HubOverviewData, WorkspaceSchedule
} from "@/types/models"

// 1. Роли
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
  permissions: [
    "view_global_schedule", "manage_schedule",
    "view_global_clients", "manage_clients", "is_administrator"
  ],
  isSystem: true
}

export const ROLE_USER: Role = {
  id: "role-user",
  nameRu: "Пользователь",
  permissions: [],
  isSystem: true
}

// 2. Пользователи
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
    const rawSession = localStorage.getItem("bliky_auth_session")
    if (rawSession) {
      const parsedSession = JSON.parse(rawSession)
      const sessionUser = parsedSession?.user
      if (sessionUser) {
        if (sessionUser.firstName) { MOCK_USER.firstName = sessionUser.firstName }
        if (sessionUser.lastName) { MOCK_USER.lastName = sessionUser.lastName }
        if (sessionUser.fullName) { MOCK_USER.fullName = sessionUser.fullName }
        if (sessionUser.shortName || sessionUser.firstName) {
          MOCK_USER.shortName = sessionUser.shortName || sessionUser.firstName
        }
        MOCK_USER.avatarUrl = sessionUser.avatarUrl
        if (sessionUser.color) { MOCK_USER.color = sessionUser.color }
        if (sessionUser.gender) { MOCK_USER.gender = sessionUser.gender }
        if (sessionUser.isFormal !== undefined) { MOCK_USER.isFormal = sessionUser.isFormal }
        if (sessionUser.timezone) { MOCK_USER.timezone = sessionUser.timezone }
        if (sessionUser.id) { MOCK_USER.id = sessionUser.id }
        return sessionUser
      }
    }
  } catch {
    // Игнорируем ошибки парсинга localStorage
  }
  return MOCK_USER
}

const mockUserMasha: User = {
  id: "u-masha", phone: "+79991112233",
  fullName: "Мария Смирнова", shortName: "Маша",
  gender: "female", isFormal: false, color: "#ec4899", globalRole: ROLE_MASTER
}
const mockUserPasha: User = {
  id: "u-pasha", phone: "+79992223344",
  fullName: "Павел Иванов", shortName: "Павел",
  gender: "male", isFormal: true, color: "#14b8a6", globalRole: ROLE_MASTER
}
const mockUserAnya: User = {
  id: "u-anya", phone: "+79993334455",
  fullName: "Анна Петрова", shortName: "Аня",
  gender: "female", isFormal: false, color: "#f59e0b", globalRole: ROLE_ADMIN
}
const mockUserLena: User = {
  id: "u-lena", phone: "+79994445566",
  fullName: "Елена Кузнецова", shortName: "Лена",
  gender: "female", isFormal: false, color: "#8b5cf6", globalRole: ROLE_MASTER
}
const mockUserIgor: User = {
  id: "u-igor", phone: "+79995556677",
  fullName: "Игорь Макаров", shortName: "Игорь",
  gender: "male", isFormal: false, color: "#ef4444", globalRole: ROLE_MASTER
}

// 3. Категории специалистов
const categoryHair: StaffCategory = { id: "cat-1", name: "Стилист по волосам" }
const categoryNails: StaffCategory = { id: "cat-2", name: "Нейл-мастер" }
const categoryBarber: StaffCategory = { id: "cat-3", name: "Барбер" }
const categoryMassage: StaffCategory = { id: "cat-4", name: "Массажист" }
const categoryBrows: StaffCategory = { id: "cat-5", name: "Бровист" }

// 4. Клиенты
const clients: Record<string, Client> = {
  alina: { id: "c1", name: "Алина Смирнова", phone: "+7 (999) 123-45-67" },
  darya: { id: "c2", name: "Дарья В.", phone: "+7 (900) 111-22-33" },
  mikhail: { id: "c3", name: "Михаил Т.", phone: "+7 (960) 555-33-22" },
  olga: { id: "c4", name: "Ольга Д.", phone: "+7 (911) 222-33-44" },
  evgeny: { id: "c5", name: "Евгений Р.", phone: "+7 (999) 555-77-88" },
  victoria: { id: "c6", name: "Виктория К.", phone: "+7 (910) 999-88-77" },
}

// 5. Сотрудники
const staffMasha: Member = {
  id: "s-masha", user: mockUserMasha,
  workspaceRole: ROLE_MASTER, mainCategory: categoryNails,
  additionalCategories: [categoryBrows]
}
const staffPasha: Member = {
  id: "s-pasha", user: mockUserPasha,
  workspaceRole: ROLE_MASTER, mainCategory: categoryBarber,
  additionalCategories: [categoryHair]
}
const staffAnya: Member = {
  id: "s-anya", user: mockUserAnya,
  workspaceRole: ROLE_ADMIN, mainCategory: categoryHair,
  additionalCategories: []
}
const staffLena: Member = {
  id: "s-lena", user: mockUserLena,
  workspaceRole: ROLE_MASTER, mainCategory: categoryMassage,
  additionalCategories: []
}
const staffIgor: Member = {
  id: "s-igor", user: mockUserIgor,
  workspaceRole: ROLE_MASTER, mainCategory: categoryBarber,
  additionalCategories: []
}

// Кирилл в разных ролях по пространствам
const staffKirillInSharedWorkspace: Member = {
  id: "s-kirill-1", user: MOCK_USER,
  workspaceRole: ROLE_OWNER, mainCategory: categoryHair,
  additionalCategories: [categoryBarber]
}
const staffKirillInIndividualWorkspace: Member = {
  id: "s-kirill-2", user: MOCK_USER,
  workspaceRole: ROLE_OWNER, mainCategory: categoryHair,
  additionalCategories: []
}
const staffKirillInCoworkingWorkspace: Member = {
  id: "s-kirill-3", user: MOCK_USER,
  workspaceRole: ROLE_MASTER, mainCategory: categoryBarber,
  additionalCategories: []
}
const staffOwnerOfCoworking: Member = {
  id: "s-owner-other", user: mockUserPasha,
  workspaceRole: ROLE_OWNER, mainCategory: categoryBarber,
  additionalCategories: []
}

// 6. Расписания
const DEFAULT_WORKSPACE_HOURS: WorkspaceSchedule = {
  0: [{ start: "10:00", end: "20:00" }],
  1: [{ start: "09:00", end: "21:00" }],
  2: [{ start: "09:00", end: "21:00" }],
  3: [{ start: "09:00", end: "21:00" }],
  4: [{ start: "09:00", end: "21:00" }],
  5: [{ start: "10:00", end: "21:00" }],
  6: [{ start: "10:00", end: "20:00" }],
}

// 7. Пространства
export const WS_SHARED: Workspace = {
  id: "ws-1",
  name: "bliky Покровка",
  type: "shared",
  category: "Салон",
  color: "#6366f1",
  timezone: "Europe/Moscow",
  address: "Большая Покровская ул., 22",
  staff: [staffKirillInSharedWorkspace, staffMasha, staffPasha, staffAnya, staffLena],
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
  staff: [staffKirillInIndividualWorkspace],
  schedule: {
    ...DEFAULT_WORKSPACE_HOURS,
    // Обед — пн-пт
    1: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    2: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    3: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    4: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    5: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
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
  staff: [staffOwnerOfCoworking, staffKirillInCoworkingWorkspace, staffMasha, staffIgor],
  schedule: DEFAULT_WORKSPACE_HOURS
}

export const MOCK_WORKSPACES: Workspace[] = [WS_SHARED, WS_INDIVIDUAL, WS_COWORKING]

// 8. Утилиты для динамических дат
const getDateWithOffset = (daysOffset: number): Date => {
  const offsetDate = new Date()
  offsetDate.setDate(offsetDate.getDate() + daysOffset)
  return offsetDate
}

const padToTwoDigits = (value: number) => value.toString().padStart(2, "0")

const formatDateToYMD = (date: Date) =>
  `${date.getFullYear()}-${padToTwoDigits(date.getMonth() + 1)}-${padToTwoDigits(date.getDate())}`

const buildIsoDateTime = (date: Date, timeString: string, tzOffset: string = "+03:00") =>
  `${formatDateToYMD(date)}T${timeString}:00${tzOffset}`

const today = new Date()
const tomorrow = getDateWithOffset(1)
const yesterday = getDateWithOffset(-1)
const nextWeek = getDateWithOffset(7)

// 9. Записи (Appointments)
export const MOCK_APPOINTMENTS: Appointment[] = [

  // --- СЕГОДНЯ ---

  // Общее пространство — Кирилл
  {
    id: "apt-1",
    startDateTime: buildIsoDateTime(today, "10:00"),
    totalDurationMinutes: 120,
    client: clients.alina,
    serviceName: "Сложное окрашивание (Балаяж)",
    price: 12000,
    workspace: WS_SHARED,
    staff: staffKirillInSharedWorkspace,
    stages: [
      { id: "stg1", name: "Консультация и разделение", durationMinutes: 30, isActive: true },
      { id: "stg2", name: "Ожидание осветления", isActive: false },
      { id: "stg3", name: "Тонирование и укладка", durationMinutes: 45, isActive: true },
    ],
    isConfirmed: true
  },
  {
    id: "apt-2",
    startDateTime: buildIsoDateTime(today, "15:00"),
    totalDurationMinutes: 60,
    client: clients.darya,
    serviceName: "Женская стрижка",
    price: 3500,
    workspace: WS_SHARED,
    staff: staffKirillInSharedWorkspace,
    stages: [
      { id: "stg4", name: "Мытье и уход", isActive: true },
      { id: "stg5", name: "Стрижка", durationMinutes: 45, isActive: true },
    ],
    isConfirmed: true
  },

  // Общее пространство — другие мастера
  {
    id: "apt-3",
    startDateTime: buildIsoDateTime(today, "11:00"),
    totalDurationMinutes: 60,
    client: clients.mikhail,
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
    startDateTime: buildIsoDateTime(today, "16:00"),
    totalDurationMinutes: 105,
    client: clients.olga,
    serviceName: "Массаж спины",
    price: 4000,
    workspace: WS_SHARED,
    staff: staffLena,
    stages: [
      { id: "stg7", name: "Массаж", durationMinutes: 60, isActive: true }
    ],
    isConfirmed: false
  },

  // Частная практика — Кирилл
  {
    id: "apt-5",
    startDateTime: buildIsoDateTime(today, "18:00"),
    totalDurationMinutes: 105,
    client: clients.evgeny,
    serviceName: "Мужская стрижка",
    price: 3000,
    workspace: WS_INDIVIDUAL,
    staff: staffKirillInIndividualWorkspace,
    stages: [
      { id: "stg8", name: "Стрижка", durationMinutes: 45, isActive: true }
    ],
    isConfirmed: true
  },

  // Коворкинг — Кирилл как мастер
  {
    id: "apt-6",
    startDateTime: buildIsoDateTime(today, "12:00"),
    totalDurationMinutes: 45,
    client: clients.victoria,
    serviceName: "Оформление бороды",
    price: 1500,
    workspace: WS_COWORKING,
    staff: staffKirillInCoworkingWorkspace,
    stages: [
      { id: "stg9", name: "Борода", durationMinutes: 45, isActive: true }
    ],
    isConfirmed: false
  },

  // --- ВЧЕРА ---
  {
    id: "apt-7",
    startDateTime: buildIsoDateTime(yesterday, "14:00"),
    totalDurationMinutes: 30,
    client: clients.alina,
    serviceName: "Консультация",
    price: 1000,
    workspace: WS_SHARED,
    staff: staffKirillInSharedWorkspace,
    stages: [
      { id: "stg10", name: "Осмотр", durationMinutes: 30, isActive: true }
    ],
    isConfirmed: true
  },

  // --- ЗАВТРА ---
  {
    id: "apt-8",
    startDateTime: buildIsoDateTime(tomorrow, "11:30"),
    totalDurationMinutes: 60,
    client: clients.darya,
    serviceName: "Окрашивание корней",
    price: 5000,
    workspace: WS_SHARED,
    staff: staffKirillInSharedWorkspace,
    stages: [
      { id: "stg11", name: "Нанесение", durationMinutes: 30, isActive: true },
      { id: "stg12", name: "Смывание", durationMinutes: 30, isActive: true }
    ],
    isConfirmed: true
  },

  // --- СЛЕДУЮЩАЯ НЕДЕЛЯ ---
  {
    id: "apt-9",
    startDateTime: buildIsoDateTime(nextWeek, "15:00"),
    totalDurationMinutes: 90,
    client: clients.mikhail,
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

// 10. Вычисление HubOverviewData на основе сегодняшних записей
const todayDateString = formatDateToYMD(today)

const todayKirillAppointments = MOCK_APPOINTMENTS.filter(appointment =>
  appointment.startDateTime.startsWith(todayDateString) &&
  appointment.staff.user?.id === MOCK_USER.id
)

const todayWorkspaceAppointments = MOCK_APPOINTMENTS.filter(appointment =>
  appointment.startDateTime.startsWith(todayDateString)
)

const todayKirillRevenue = todayKirillAppointments.reduce((sum, appointment) => sum + appointment.price, 0)
const todayWorkspaceRevenue = todayWorkspaceAppointments.reduce((sum, appointment) => sum + appointment.price, 0)
const unconfirmedCount = todayWorkspaceAppointments.filter(appointment => !appointment.isConfirmed).length

const completedCount = todayKirillAppointments.length > 0 ? 1 : 0
const todayRevenueDisplay = todayKirillAppointments.length > 0 ? todayKirillAppointments[0].price : 0

// Время окончания последней записи Кирилла сегодня
let lastAppointmentEndTime: string | null = null
if (todayKirillAppointments.length > 0) {
  const sortedAppointments = [...todayKirillAppointments].sort((a, b) =>
    a.startDateTime.localeCompare(b.startDateTime)
  )
  const lastAppointment = sortedAppointments[sortedAppointments.length - 1]
  const endDate = new Date(lastAppointment.startDateTime)
  endDate.setMinutes(endDate.getMinutes() + lastAppointment.totalDurationMinutes)
  lastAppointmentEndTime = buildIsoDateTime(
    endDate,
    `${padToTwoDigits(endDate.getHours())}:${padToTwoDigits(endDate.getMinutes())}`
  )
}

export const MOCK_HUB_OVERVIEW: HubOverviewData = {
  user: MOCK_USER,
  requestAt: new Date().toISOString(),
  todayAppointments: todayKirillAppointments.length,
  completeAppointments: completedCount,
  todayRevenue: todayRevenueDisplay,
  expectedRevenue: todayKirillRevenue,
  lastAppointmentEndTime,
  totalWorkspaceAppointments: todayWorkspaceAppointments.length,
  totalWorkspaceRevenue: todayWorkspaceRevenue,
  unconfirmedAppointments: unconfirmedCount,
  totalWorkspaces: MOCK_WORKSPACES.length
}

// 11. Графики работы сотрудников
export const STAFF_SCHEDULE_HOURS: Record<string, Record<number, { start: string; end: string }[]>> = {
  "s-kirill-1": {
    1: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "20:00" }],
    2: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "20:00" }],
    3: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "20:00" }],
    4: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "20:00" }],
    5: [{ start: "10:00", end: "14:00" }, { start: "15:00", end: "20:00" }],
    6: [{ start: "10:00", end: "16:00" }],
  },
  "s-kirill-2": {
    1: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    2: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    3: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    4: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
    5: [{ start: "10:00", end: "14:00" }, { start: "16:00", end: "20:00" }],
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
