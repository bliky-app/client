
interface AvatarProps {
  type: "workspace" | "user"
  name: string
  avatarUrl?: string
  color?: string
  className?: string
}

export default function Avatar({ name, avatarUrl, color, className = "" }: AvatarProps) {
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
    .split(" ")
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
