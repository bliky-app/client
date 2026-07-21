import { useState, useEffect, useRef } from "react"
import { ChevronUp, ChevronDown, X } from "lucide-react"

interface PreciseTimePickerProps {
  x: number
  y: number
  initialHour: number
  initialMinute: number
  onConfirm: (hour: number, minute: number) => void
  onCancel: () => void
}

export function PreciseTimePicker({ x, y, initialHour, initialMinute, onConfirm, onCancel }: PreciseTimePickerProps) {
  const [hour, setHour] = useState(initialHour)
  const [minute, setMinute] = useState(initialMinute)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleDown = (e: MouseEvent | TouchEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onCancel()
      }
    }
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleDown)
      document.addEventListener("touchstart", handleDown)
    }, 100)
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener("mousedown", handleDown)
      document.removeEventListener("touchstart", handleDown)
    }
  }, [onCancel])

  const [style, setStyle] = useState<React.CSSProperties>({ 
    top: y, 
    left: x, 
    opacity: 0,
    transform: "translate(-50%, -100%) scale(0.95)"
  })

  useEffect(() => {
    if (popoverRef.current) {
      const rect = popoverRef.current.getBoundingClientRect()
      let newX = x
      let newY = y - 12

      if (newX - rect.width / 2 < 10) newX = rect.width / 2 + 10
      if (newX + rect.width / 2 > window.innerWidth - 10) newX = window.innerWidth - rect.width / 2 - 10
      if (newY - rect.height < 10) newY = y + rect.height + 12

      setStyle({
        top: newY,
        left: newX,
        opacity: 1,
        transform: newY > y ? "translate(-50%, 0) scale(1)" : "translate(-50%, -100%) scale(1)",
        transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)"
      })
    }
  }, [x, y])

  const pad = (n: number) => n.toString().padStart(2, "0")

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div 
        ref={popoverRef}
        style={style}
        className="absolute bg-panel-surface border border-panel-border shadow-xl rounded-2xl p-3.5 flex flex-col gap-3 w-52 pointer-events-auto relative"
      >
        <button 
          onClick={onCancel} 
          className="absolute top-2.5 right-2.5 p-1 hover:bg-panel-base rounded-full text-panel-text-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="flex flex-col items-center">
            <button 
              onClick={() => setHour(h => (h + 1) % 24)} 
              className="p-1 hover:bg-panel-base rounded-lg text-panel-text-muted transition-colors active:scale-95"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <div className="text-3xl font-extrabold text-panel-text w-14 text-center py-0.5">
              {pad(hour)}
            </div>
            <button 
              onClick={() => setHour(h => (h - 1 + 24) % 24)} 
              className="p-1 hover:bg-panel-base rounded-lg text-panel-text-muted transition-colors active:scale-95"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="text-3xl font-extrabold text-panel-text-muted pb-1">:</div>

          <div className="flex flex-col items-center">
            <button 
              onClick={() => setMinute(m => (m + 5) % 60)} 
              className="p-1 hover:bg-panel-base rounded-lg text-panel-text-muted transition-colors active:scale-95"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <div className="text-3xl font-extrabold text-panel-text w-14 text-center py-0.5">
              {pad(minute)}
            </div>
            <button 
              onClick={() => setMinute(m => (m - 5 + 60) % 60)} 
              className="p-1 hover:bg-panel-base rounded-lg text-panel-text-muted transition-colors active:scale-95"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button 
          onClick={() => onConfirm(hour, minute)}
          className="w-full bg-panel-text text-panel-base py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
        >
          Выбрать
        </button>
      </div>
    </div>
  )
}
