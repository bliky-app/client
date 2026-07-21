import { Camera, Trash2 } from "lucide-react"
import { type RefObject } from "react"
import Avatar from "@/components/Avatar"
import ColorPicker from "@/components/ui/ColorPicker"
import type { User } from "@/types/auth.models"

interface ProfileAvatarCardProps {
  draftUser: User | null
  avatarUrl: string
  color: string
  fileInputRef: RefObject<HTMLInputElement | null>
  onPickAvatar: () => void
  onRemoveAvatar: () => void
  onAvatarFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onColorChange: (color: string) => void
}

/**
 * Карточка с превью аватара, кнопками загрузки/удаления и цветовым пикером.
 */
export default function ProfileAvatarCard({
  draftUser,
  avatarUrl,
  color,
  fileInputRef,
  onPickAvatar,
  onRemoveAvatar,
  onAvatarFileChange,
  onColorChange,
}: ProfileAvatarCardProps) {
  return (
    <div className="mb-6 bg-panel-surface border border-panel-border rounded-[32px] p-6 shadow-sm flex flex-row items-center gap-6">
      <div className="relative group shrink-0">
        {draftUser && (
          <Avatar
            data={draftUser}
            className="w-24 h-24 rounded-full text-2xl shadow-md border-2 border-panel-border transition-transform group-hover:scale-105"
          />
        )}
        {avatarUrl ? (
          <button
            type="button"
            onClick={onRemoveAvatar}
            className="absolute bottom-0 right-0 p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all active:scale-95"
            title="Удалить фото"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onPickAvatar}
            className="absolute bottom-0 right-0 p-2 rounded-full bg-panel-text text-panel-base shadow-lg hover:opacity-90 transition-all active:scale-95"
            title="Загрузить фото"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onAvatarFileChange}
          className="hidden"
        />
      </div>

      <div className="h-12 w-px bg-panel-border-subtle shrink-0" />

      <div className="flex-1 min-w-0 flex justify-start">
        <ColorPicker value={color} onChange={onColorChange} />
      </div>
    </div>
  )
}
