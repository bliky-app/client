import type { User, Workspace, Member } from "@/types/models"

/** Минимальный набор данных для отображения аватара */
export interface AvatarDisplayData {
  id: string
  name?: string
  avatarUrl?: string
  color?: string
}

export type AvatarData = User | Workspace | Member | AvatarDisplayData

interface AvatarProps {
  data?: AvatarData | null
  className?: string
}

export default function Avatar({ data, className = "" }: AvatarProps) {
  if (!data) {
    return (
      <div
        className={`flex items-center justify-center bg-hub-surface-hover text-hub-text font-bold shrink-0 ${className}`}
      >
        ?
      </div>
    )
  }

  const target = "user" in data && data.user ? data.user : data

  const avatarUrl = "avatarUrl" in target ? (target as { avatarUrl?: string }).avatarUrl : undefined
  const color = "color" in target ? (target as { color?: string }).color : undefined

  let name = ""
  if ("shortName" in target && target.shortName) {
    name = target.shortName
  } else if ("fullName" in target && target.fullName) {
    name = target.fullName
  } else if ("firstName" in target && target.firstName) {
    name = `${target.firstName} ${target.lastName || ""}`.trim()
  } else if ("name" in target && target.name) {
    name = target.name
  }

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`object-cover shrink-0 ${className}`}
      />
    )
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={`flex items-center justify-center text-hub-text font-bold shrink-0 ${className}`}
      style={{ backgroundColor: color || "var(--color-hub-surface-hover)" }}
    >
      {initials || "?"}
    </div>
  )
}
