import { MOCK_USER } from "./mockData"
import type { User } from "@/types/models"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Local storage key for auth session
const AUTH_KEY = "bliky_auth_session"

type SessionData = {
  user: User | null;
}

export const getSession = (): SessionData => {
  try {
    const data = localStorage.getItem(AUTH_KEY)
    if (data) return JSON.parse(data)
  } catch (e) {
    // ignore
  }
  return { user: null }
}

const setSession = (data: SessionData) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data))
}

export const authApi = {
  getCurrentUser: async (): Promise<User | null> => {
    await delay(300)
    return getSession().user
  },
  
  checkPhone: async (phone: string): Promise<boolean> => {
    await delay(300)
    // For mock purposes, treat any phone ending with '0000' as existing, or specifically MOCK_USER's phone.
    const existingPhones = [MOCK_USER.phone, "+7 (999) 000-00-00"]
    return existingPhones.includes(phone)
  },

  login: async (phone: string, password: string):Promise<User> => {
    await delay(500)
    if (password !== "password") { // Hardcoded password for mock
      throw new Error("Неверный пароль. Введите 'password' для теста.")
    }
    const user = { ...MOCK_USER, phone }
    setSession({ user })
    return user
  },

  register: async (phone: string, _password: string):Promise<User> => {
    await delay(500)
    const newUser: User = {
      id: "u-" + Date.now(),
      phone,
      isFormal: true, // default
      gender: "male",
      color: "#ec4899",
      globalRole: MOCK_USER.globalRole
    }
    setSession({ user: newUser })
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
    if (!session.user) throw new Error("Not authenticated")

    const updatedUser: User = {
      ...session.user,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      shortName: data.firstName,
      isFormal: data.isFormal,
      gender: data.gender ?? session.user.gender ?? "female",
      avatarUrl: data.avatarUrl ?? session.user.avatarUrl,
      color: data.color ?? session.user.color ?? "#ec4899",
      timezone: data.timezone ?? session.user.timezone ?? "Europe/Moscow",
    }
    setSession({ user: updatedUser })
    return updatedUser
  },

  logout: async () => {
    await delay(200)
    localStorage.removeItem(AUTH_KEY)
  }
}
