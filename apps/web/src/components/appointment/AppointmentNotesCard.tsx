import ColorPicker from "@/components/ui/ColorPicker"

interface AppointmentNotesCardProps {
  color: string
  onColorChange: (color: string) => void
  notes: string
  onNotesChange: (notes: string) => void
  isEditable?: boolean
}

export function AppointmentNotesCard({
  color,
  onColorChange,
  notes,
  onNotesChange,
  isEditable = true,
}: AppointmentNotesCardProps) {
  return (
    <div className="p-5 bg-panel-surface border border-panel-border-subtle rounded-2xl shadow-sm flex flex-col gap-4 w-full">
      {isEditable ? (
        <>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-panel-text-muted">Цвет метки</span>
            <ColorPicker
              value={color}
              onChange={onColorChange}
              size="sm"
            />
          </div>

          <div className="h-px w-full bg-panel-border-subtle" />

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-panel-text-muted">Заметка</span>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Добавить заметку..."
              rows={3}
              className="w-full bg-panel-base border border-panel-border-subtle rounded-xl p-3 text-sm text-panel-text placeholder:text-panel-text-subtle outline-none focus:border-panel-text transition-colors resize-none"
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-panel-text-muted">Заметка</span>
            {color && (
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0 border border-panel-border-subtle shadow-xs"
                style={{ backgroundColor: color }}
              />
            )}
          </div>
          <p className="text-sm font-medium text-panel-text whitespace-pre-wrap leading-relaxed">
            {notes || "Заметка отсутствует"}
          </p>
        </div>
      )}
    </div>
  )
}
export default AppointmentNotesCard
