
import type { HubOverviewData } from "@/types/models"
import { usePermissions } from "@/lib/permissions"
import { formatCurrency, pluralize, formatTime, getGreeting } from "@/lib/formatters"
import { ClipboardList, Clock, CheckCircle2, Inbox, Layers } from "lucide-react"

interface HubOverviewProps {
  data: HubOverviewData
}

export default function HubOverview({ data }: HubOverviewProps) {
  const {
    requestAt,
    user,
    todayAppointments = 0,
    completeAppointments = 0,
    todayRevenue = 0,
    expectedRevenue = 0,
    lastAppointmentEndTime,
    totalWorkspaceAppointments = 0,
    totalWorkspaceRevenue = 0,
    unconfirmedAppointments = 0,
    totalWorkspaces = 0,
  } = data

  const clientDate = requestAt ? new Date(requestAt) : new Date()
  const { gender, isFormal } = user

  const { canInAnyWorkspace } = usePermissions()
  const canViewFinancials = canInAnyWorkspace("view_financials")
  const canViewAnalytics = canInAnyWorkspace("view_analytics")
  
  const isAdmin = canInAnyWorkspace("is_administrator")
  const isOwner = canInAnyWorkspace("is_owner")

  const greeting = getGreeting(clientDate, user.timezone)
  const remainingAppointments = todayAppointments - completeAppointments

  const pronounGenitive = isFormal ? "вас" : "тебя"
  const pronounPossessive = isFormal ? "вашим" : "твоим"
  const pronounDative = isFormal ? "Вам" : "Тебе"

  const verbEarned = isFormal
    ? "вы заработали"
    : gender === "female"
    ? "ты заработала"
    : "ты заработал"

  const verbCompleted = isFormal
    ? "вы выполнили"
    : gender === "female"
    ? "ты выполнила"
    : "ты выполнил"

  const verbFree = isFormal ? "Вы освободитесь" : "Ты освободишься"

  const renderMasterBlock = () => {
    // Only render master block if they have appointments
    if (todayAppointments === 0) return null

    if (completeAppointments === 0) {
      return (
        <span className="block mt-3 pt-3 border-t border-zinc-800/50 first:border-0 first:pt-0 first:mt-0 text-zinc-400 leading-normal">
          Сегодня предстоит{" "}
          <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4" />
            {todayAppointments} {pluralize(todayAppointments, ["запись", "записи", "записей"])}
          </span>{" "}
          на общую сумму{" "}
          <span className="text-hub-text font-semibold">
            ≈ {formatCurrency(expectedRevenue)}
          </span>
          .
          {lastAppointmentEndTime && (
            <>
              {" "}
              {verbFree} после{" "}
              <span className="whitespace-nowrap">
                <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatTime(lastAppointmentEndTime)}
                </span>
                .
              </span>
            </>
          )}
        </span>
      )
    }

    return (
      <span className="block mt-3 pt-3 border-t border-zinc-800/50 first:border-0 first:pt-0 first:mt-0 text-zinc-500 leading-relaxed">
        Сегодня {verbEarned}{" "}
        <span className="text-hub-text font-semibold">
          ≈ {formatCurrency(todayRevenue)}
        </span>
        . Из{" "}
        <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4" />
          {todayAppointments} {pluralize(todayAppointments, ["записи", "записей", "записей"])}
        </span>{" "}
        на сегодня {verbCompleted}{" "}
        <span className="whitespace-nowrap">
          <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            {completeAppointments}
          </span>
          {remainingAppointments > 0 ? "," : "."}
        </span>
        {remainingAppointments > 0 ? (
          <>
            {" "}осталось ещё{" "}
            <span className="whitespace-nowrap">
              <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
                <Inbox className="w-4 h-4" />
                {remainingAppointments}
              </span>
              .
            </span>
          </>
        ) : (
          " Все запланированные записи завершены!"
        )}
        {lastAppointmentEndTime && remainingAppointments > 0 && (
          <>
            {" "}
            {verbFree} после{" "}
            <span className="whitespace-nowrap">
              <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatTime(lastAppointmentEndTime)}
              </span>
              .
            </span>
          </>
        )}
      </span>
    )
  }

  const renderAdminBlock = () => {
    if (!isAdmin) return null

    if (unconfirmedAppointments === 0) {
      return (
        <span className="block mt-3 pt-3 border-t border-zinc-800/50 first:border-0 first:pt-0 first:mt-0 text-zinc-400">
          Все заявки от клиентов обработаны.
        </span>
      )
    }

    return (
      <span className="block mt-3 pt-3 border-t border-zinc-800/50 first:border-0 first:pt-0 first:mt-0 text-zinc-400 leading-normal">
        {pronounDative} нужно обработать{" "}
        <span className="whitespace-nowrap">
          <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
            <Inbox className="w-4 h-4" />
            {unconfirmedAppointments} {pluralize(unconfirmedAppointments, ["неподтвержденную заявку", "неподтвержденные заявки", "неподтвержденных заявок"])}
          </span>
          .
        </span>
      </span>
    )
  }

  const renderOwnerBlock = () => {
    if (!isOwner) return null

    if (totalWorkspaceAppointments === 0) {
      return (
        <span className="block mt-3 pt-3 border-t border-zinc-800/50 first:border-0 first:pt-0 first:mt-0 text-zinc-400 leading-normal">
          В <span className="text-hub-text font-semibold inline-flex items-center gap-1.5"><Layers className="w-4 h-4" /> {totalWorkspaces} {pluralize(totalWorkspaces, ["пространстве", "пространствах", "пространствах"])}</span> пока нет записей.
        </span>
      )
    }

    return (
      <span className="block mt-3 pt-3 border-t border-zinc-800/50 first:border-0 first:pt-0 first:mt-0 text-zinc-400 leading-normal">
        По {pronounPossessive} <span className="text-hub-text font-semibold inline-flex items-center gap-1.5"><Layers className="w-4 h-4" /> {totalWorkspaces} {pluralize(totalWorkspaces, ["пространству", "пространствам", "пространствам"])}</span>
        {canViewAnalytics ? (
          <>
            {" "}сегодня{" "}
            <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4" />
              {totalWorkspaceAppointments} {pluralize(totalWorkspaceAppointments, ["запись", "записи", "записей"])}
            </span>
          </>
        ) : (
          " сегодня"
        )}
        {canViewFinancials && (
          <>
            {" "}на общую сумму{" "}
            <span className="text-hub-text font-semibold">
              ≈ {formatCurrency(totalWorkspaceRevenue)}
            </span>
          </>
        )}
        .
      </span>
    )
  }

  const renderFallbackBlock = () => {
    if (todayAppointments > 0 || isAdmin || isOwner) return null
    
    const verbCreate = isFormal ? "Создайте" : "Создай"
    const verbTell = isFormal ? "расскажите" : "расскажи"

    return (
      <span className="block mt-3 pt-3 border-t border-zinc-800/50 first:border-0 first:pt-0 first:mt-0 text-zinc-400">
        У {pronounGenitive} пока нет активных ролей. {verbCreate} своё пространство или {verbTell} работодателю о нашей платформе.
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl text-white font-medium tracking-tight flex items-center gap-2.5">
        <span className="text-white">—</span> {greeting}
      </h1>
      <div className="text-lg font-normal leading-normal">
        {renderMasterBlock()}
        {renderAdminBlock()}
        {renderOwnerBlock()}
        {renderFallbackBlock()}
      </div>
    </div>
  )
}
