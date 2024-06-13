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
  totalChunks: number
  doneChunks: number
}

type Response = Status[]

const useActiveStatusUpdates = (roleId?: number, onSuccess?: () => void) => {
  const { id, mutateGuild } = useGuild()
  const [isActive, setIsActive] = useState(false)
  const { isAdmin } = useGuildPermission()

  const fetcherWithSign = useFetcherWithSign()

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
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

        if (res.some((job) => !job.done)) {
          setIsActive(true)
        } else {
          setIsActive(false)
          mutateGuild()
          onSuccess?.()
        }
      },
    }
  )

  const dataToReturn = roleId
    ? data?.filter((job) => job.roleIds?.includes(roleId))
    : data?.filter((job) => !!job.roleIds)

  return {
    data: dataToReturn?.[0],
    status:
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      dataToReturn?.length > 0
        ? // @ts-expect-error TODO: fix this error originating from strictNullChecks
          dataToReturn.every((job) => job.done)
          ? "DONE"
          : "STARTED"
        : null,
    isValidating,
    mutate,
  }
}

export default useActiveStatusUpdates
