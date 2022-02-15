import { useEffect } from "react"
import useSWR from "swr"

const fallbackData = {
  serverId: 0,
  channels: [],
}

const useServerData = (invite: string) => {
  useEffect(() => {
    console.log("hook invite", invite)
    console.log("hook invite.length", invite?.length)
  }, [invite])

  const shouldFetch = invite?.length >= 5

  useEffect(() => {
    console.log("shouldFetch", shouldFetch)
  }, [shouldFetch])

  const { data, isValidating } = useSWR(
    shouldFetch ? `/role/discordChannels/${invite.split("/").slice(-1)[0]}` : null,
    {
      fallbackData,
    }
  )

  return { data, isLoading: isValidating }
}

export default useServerData
