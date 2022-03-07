import useDebouncedState from "hooks/useDebouncedState"
import { useEffect } from "react"
import useSWR from "swr"

const fallbackData = {
  serverId: "",
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
    {
      fallbackData,
    }
  )

  return { data, isLoading: isValidating }
}

export default useServerData
