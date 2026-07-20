import { MOCK_USER } from "./mockData"
import type { User } from "@/types/models"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const authApi = {
  getCurrentUser: async (): Promise<User> => {
    await delay(300)
    return MOCK_USER
  }
}
