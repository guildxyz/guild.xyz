import useDebouncedState from "hooks/useDebouncedState"
import { useEffect } from "react"
import useSWR from "swr"
import fetcher from "utils/fetcher"

const fallbackData = {
  serverId: null,
  channels: [],
  isAdmin: null,
}

const useServerData = (invite: string) => {
  const debouncedInvite = useDebouncedState(invite)

  useEffect(() => {
    console.log("hook invite", debouncedInvite)
    console.log("hook invite.length", debouncedInvite?.length)
  }, [debouncedInvite])

  const shouldFetch = debouncedInvite?.length >= 5

  useEffect(() => {
    console.log("shouldFetch", shouldFetch)
  }, [shouldFetch])

  const { data, isValidating } = useSWR(
    shouldFetch
      ? `/role/discordChannels/${debouncedInvite.split("/").slice(-1)[0]}`
      : null,
    (_) =>
      // This is needed so we can tell, if there was no fetching before (serverId: null), or the invite is invalid (serverId: "")
      fetcher(_).catch(() => ({
        serverId: "",
        channels: [],
        isAdmin: null,
      })),
    {
      fallbackData,
    }
  )

  return { data, isLoading: isValidating }
}

export default useServerData
