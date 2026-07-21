import { User, Store } from "lucide-react"
import type { WorkspaceType } from "@/types/models"
import { usePermissions } from "@/lib/permissions"

export function useStep1Type() {
  const { user } = usePermissions()
  const isFormal = user?.isFormal ?? true

  const TYPE_OPTIONS = [
    {
      type: "individual" as WorkspaceType,
      label: "Индивидуальное",
      tagline: "Для себя",
      icon: User,
      description: isFormal
        ? "Вы работаете как самостоятельный мастер. Простое расписание, клиенты и услуги в одном месте."
        : "Ты работаешь как самостоятельный мастер. Простое расписание, клиенты и услуги в одном месте.",
      bullets: [
        "Простое управление расписанием",
        isFormal ? "Ваша собственная база клиентов" : "Твоя собственная база клиентов",
        "Идеально для частной практики",
      ],
    },
    {
      type: "shared" as WorkspaceType,
      label: "Совместное",
      tagline: "Для команды",
      icon: Store,
      description: "Общее пространство для команды. Управление расписанием всего пространства, ролями и доступами.",
      bullets: [
        "Расписание нескольких мастеров",
        "Разделение ролей и прав доступа",
        "Общая клиентская база",
      ],
    },
  ]

  return {
    TYPE_OPTIONS,
  }
}
