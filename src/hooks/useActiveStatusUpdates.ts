import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { useState } from "react"
import useSWR from "swr"

type RoleStatus = {
  roleId: number
  status: "CREATED" | "STARTED" | "STOPPED" | "FINISHED" | "FAILED"
  progress: {
    total: number
    accessCheckDone: number
    actionsDone: number
    failed: number
  }
  params?: {
    guildify: boolean
    updateDb: boolean
    updatePlatforms: boolean
    forcePlatformUpdates: boolean
  }
}

type Response = RoleStatus[]

const defaultData: Omit<RoleStatus, "roleId"> = {
  status: null,
  progress: {
    total: 0,
    accessCheckDone: 0,
    actionsDone: 0,
    failed: 0,
  },
}

const isRoleSyncing = (role) =>
  role.status === "CREATED" || role.status === "STARTED"

const useActiveStatusUpdates = (roleId?: number, onSuccess?: () => void) => {
  const { id, mutateGuild } = useGuild()
  const [isActive, setIsActive] = useState(false)
  const { isAdmin } = useGuildPermission()

  const { data, isValidating } = useSWR<Response>(
    isAdmin ? `/statusUpdate/guild/${id}` : null,
    {
      refreshInterval: isActive && 5000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (res) => {
        if (res.some(isRoleSyncing)) {
          setIsActive(true)
        } else {
          setIsActive(false)
          mutateGuild()
          onSuccess?.()
        }
      },
    }
  )

  if (!data) return defaultData

  let res: Omit<RoleStatus, "roleId"> = null
  if (roleId) {
    res = data.find((role) => role.roleId === roleId)
  } else {
    const activeRoles = data.filter(isRoleSyncing)
    if (!activeRoles) return defaultData

    // we're returning the status of the role with the most members instead of aggregating them for now
    const largestRole = activeRoles.reduce(
      (prev, current) =>
        prev.progress.total > current.progress.total ? prev : current,
      defaultData
    )
    res = largestRole
  }

  return { ...defaultData, ...res }
}

export default useActiveStatusUpdates
