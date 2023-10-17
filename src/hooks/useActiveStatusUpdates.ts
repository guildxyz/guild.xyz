import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { useState } from "react"
import useSWR from "swr"
import { useFetcherWithSign } from "utils/fetcher"

type Status = {
  id: string
  guildId: number
  roleIds: number[]
  done: boolean
}

type Response = Status[]

const useActiveStatusUpdates = (roleId?: number, onSuccess?: () => void) => {
  const { id, mutateGuild } = useGuild()
  const [isActive, setIsActive] = useState(false)
  const { isAdmin } = useGuildPermission()

  const fetcherWithSign = useFetcherWithSign()

  const { data, isValidating, mutate } = useSWR<Response>(
    isAdmin ? `/v2/actions/status-update?guildId=${id}` : null,
    (url) =>
      fetcherWithSign([
        url,
        {
          method: "GET",
          body: {},
        },
      ]),
    {
      refreshInterval: isActive && 5000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (res) => {
        if (!res?.length) return

        if (roleId) {
          if (
            res
              .filter((chunk) => !chunk.done)
              .some((chunk) => chunk.roleIds.includes(roleId))
          ) {
            setIsActive(true)
          } else {
            setIsActive(false)
            mutateGuild()
            onSuccess?.()
          }

          return
        }

        if (res.some((chunk) => !chunk.done)) {
          setIsActive(true)
        } else {
          setIsActive(false)
          mutateGuild()
          onSuccess?.()
        }
      },
    }
  )

  return {
    data: data ?? [],
    status: data?.length > 0 ? (isActive ? "STARTED" : "DONE") : null,
    isValidating,
    mutate,
  }
}

export default useActiveStatusUpdates
