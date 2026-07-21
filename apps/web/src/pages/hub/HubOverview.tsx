
import type { HubOverviewData } from "@/types/models"
import { ClipboardList, Clock, CheckCircle2, Inbox, Layers } from "lucide-react"
import { useHubOverviewLogic } from "@/hooks/hub/useHubOverviewLogic"

interface HubOverviewProps {
  data: HubOverviewData
}

export default function HubOverview({ data }: HubOverviewProps) {
  const {
    todayAppointments,
    completeAppointments,
    remainingAppointments,
    totalWorkspaces,
    totalWorkspaceAppointments,
    unconfirmedAppointments,
    isAdmin,
    isOwner,
    canViewAnalytics,
    canViewFinancials,
    greeting,
    pronounGenitive,
    pronounPossessive,
    pronounDative,
    verbFree,
    verbEarned,
    verbCompleted,
    verbCreate,
    verbTell,
    formattedExpectedRevenue,
    formattedTodayRevenue,
    formattedWorkspaceRevenue,
    formattedLastEndTime,
    todayAppointmentsWord,
    todayAppointmentsWordGenitive,
    workspacesDativeWord,
    workspacesPrepositionalWord,
    workspaceAppointmentsWord,
    unconfirmedWord,
  } = useHubOverviewLogic(data)

  const renderMasterBlock = () => {
    if (todayAppointments === 0) {
      return null
    }

    if (completeAppointments === 0) {
      return (
        <span className="block mt-3 pt-3 border-t border-hub-border/30 text-hub-text-muted leading-normal">
          Сегодня предстоит{" "}
          <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4" />
            {todayAppointments} {todayAppointmentsWord}
          </span>{" "}
          на общую сумму{" "}
          <span className="text-hub-text font-semibold">
            ≈ {formattedExpectedRevenue}
          </span>
          .
          {formattedLastEndTime && (
            <>
              {" "}
              {verbFree} после{" "}
              <span className="whitespace-nowrap">
                <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formattedLastEndTime}
                </span>
                .
              </span>
            </>
          )}
        </span>
      )
    }

    return (
      <span className="block mt-3 pt-3 border-t border-hub-border/30 text-hub-text-muted leading-relaxed">
        Сегодня {verbEarned}{" "}
        <span className="text-hub-text font-semibold">
          ≈ {formattedTodayRevenue}
        </span>
        . Из{" "}
        <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4" />
          {todayAppointments} {todayAppointmentsWordGenitive}
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
        {formattedLastEndTime && remainingAppointments > 0 && (
          <>
            {" "}
            {verbFree} после{" "}
            <span className="whitespace-nowrap">
              <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formattedLastEndTime}
              </span>
              .
            </span>
          </>
        )}
      </span>
    )
  }

  const renderAdminBlock = () => {
    if (!isAdmin) {
      return null
    }

    if (unconfirmedAppointments === 0) {
      return (
        <span className="block mt-3 pt-3 border-t border-hub-border/30 text-hub-text-muted">
          Все заявки от клиентов обработаны.
        </span>
      )
    }

    return (
      <span className="block mt-3 pt-3 border-t border-hub-border/30 text-hub-text-muted leading-normal">
        {pronounDative} нужно обработать{" "}
        <span className="whitespace-nowrap">
          <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
            <Inbox className="w-4 h-4" />
            {unconfirmedAppointments} {unconfirmedWord}
          </span>
          .
        </span>
      </span>
    )
  }

  const renderOwnerBlock = () => {
    if (!isOwner) {
      return null
    }

    if (totalWorkspaceAppointments === 0) {
      return (
        <span className="block mt-3 pt-3 border-t border-hub-border/30 text-hub-text-muted leading-normal">
          В{" "}
          <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> {totalWorkspaces} {workspacesPrepositionalWord}
          </span>{" "}
          пока нет записей.
        </span>
      )
    }

    return (
      <span className="block mt-3 pt-3 border-t border-hub-border/30 text-hub-text-muted leading-normal">
        По {pronounPossessive}{" "}
        <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
          <Layers className="w-4 h-4" /> {totalWorkspaces} {workspacesDativeWord}
        </span>
        {canViewAnalytics ? (
          <>
            {" "}сегодня{" "}
            <span className="text-hub-text font-semibold inline-flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4" />
              {totalWorkspaceAppointments} {workspaceAppointmentsWord}
            </span>
          </>
        ) : (
          " сегодня"
        )}
        {canViewFinancials && (
          <>
            {" "}на общую сумму{" "}
            <span className="text-hub-text font-semibold">
              ≈ {formattedWorkspaceRevenue}
            </span>
          </>
        )}
        .
      </span>
    )
  }

  const renderFallbackBlock = () => {
    if (todayAppointments > 0 || isAdmin || isOwner) {
      return null
    }

    return (
      <span className="block mt-3 pt-3 border-t border-hub-border/30 text-hub-text-muted">
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
