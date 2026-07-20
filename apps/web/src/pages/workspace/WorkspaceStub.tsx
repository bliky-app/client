import type { LucideIcon } from "lucide-react"

interface WorkspaceStubProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function WorkspaceStub({ icon: Icon, title, description }: WorkspaceStubProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 py-24 text-center gap-4">
      <div className="w-16 h-16 rounded-3xl bg-panel-border-subtle flex items-center justify-center mb-2">
        <Icon className="h-7 w-7 text-panel-text-subtle" />
      </div>
      <h3 className="text-xl font-semibold text-panel-text tracking-tight">{title}</h3>
      <p className="text-panel-text-subtle text-sm leading-relaxed max-w-[260px]">{description}</p>
      <span className="mt-2 text-[11px] font-bold uppercase tracking-widest text-panel-text-muted bg-panel-border-subtle px-3 py-1.5 rounded-full">
        Скоро
      </span>
    </div>
  )
}
