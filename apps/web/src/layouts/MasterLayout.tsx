import { Outlet } from "react-router-dom"

export default function MasterLayout() {
  return (
    <div className="flex min-h-svh w-full overflow-hidden bg-hub-base">
      <main className="flex-1 min-w-0 flex flex-col h-svh">
        <Outlet />
      </main>
    </div>
  )
}
