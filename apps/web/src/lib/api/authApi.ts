import { MOCK_USER } from "./mockData"
import type { User } from "@/types/models"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const AUTH_STORAGE_KEY = "bliky_auth_session"

type SessionData = {
  user: User | null;
}

export const getSession = (): SessionData => {
  try {
    const rawData = localStorage.getItem(AUTH_STORAGE_KEY)
    if (rawData) {
      return JSON.parse(rawData)
    }
  } catch {

  }
  return { user: null }
}

const saveSession = (data: SessionData) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
}

export const authApi = {
  getCurrentUser: async (): Promise<User | null> => {
    await delay(300)
    return getSession().user
  },

  checkPhone: async (phone: string): Promise<boolean> => {
    await delay(300)
    const registeredPhones = [MOCK_USER.phone, "+7 (999) 000-00-00"]
    return registeredPhones.includes(phone)
  },

  login: async (phone: string, password: string): Promise<User> => {
    await delay(500)
    if (password !== "password") {
      throw new Error("Неверный пароль. Введите 'password' для теста.")
    }
    const authenticatedUser = { ...MOCK_USER, phone }
    saveSession({ user: authenticatedUser })
    return authenticatedUser
  },

  register: async (phone: string): Promise<User> => {
    await delay(500)
    const newUser: User = {
      id: "u-" + Date.now(),
      phone,
      firstName: "",
      lastName: "",
      isFormal: true,
      gender: "male",
      color: "#ec4899",
      globalRole: MOCK_USER.globalRole
    }
    saveSession({ user: newUser })
    return newUser
  },

  updateProfile: async (data: {
    firstName: string
    lastName: string
    isFormal: boolean
    gender?: "female" | "male"
    avatarUrl?: string
    color?: string
    timezone?: string
  }): Promise<User> => {
    await delay(400)
    const session = getSession()
    if (!session.user) {
      throw new Error("Not authenticated")
    }

    const updatedUser: User = {
      ...session.user,
      firstName: data.firstName,
      lastName: data.lastName,
      isFormal: data.isFormal,
      gender: data.gender ?? session.user.gender ?? "female",
      avatarUrl: data.avatarUrl ?? session.user.avatarUrl,
      color: data.color ?? session.user.color ?? "#ec4899",
      timezone: data.timezone ?? session.user.timezone ?? "Europe/Moscow",
    }
    saveSession({ user: updatedUser })
    return updatedUser
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
    await delay(400)
    if (currentPassword && currentPassword !== "password" && currentPassword !== "12345678") {
      throw new Error("Неверный текущий пароль")
    }
    if (newPassword.length < 8) {
      throw new Error("Пароль должен содержать минимум 8 символов")
    }
    return true
  },

  logout: async () => {
    await delay(200)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}
