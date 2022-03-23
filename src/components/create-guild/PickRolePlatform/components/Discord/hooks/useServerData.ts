import useDebouncedState from "hooks/useDebouncedState"
import { useEffect } from "react"
import useSWR from "swr"

const fallbackData = {
  serverId: "",
  channels: [],
  isAdmin: null,
}

const useServerData = (invite: string, swrOptions = {}) => {
  const debouncedInvite = useDebouncedState(invite)

  useEffect(() => {
    console.log("hook invite", debouncedInvite)
    console.log("hook invite.length", debouncedInvite?.length)
  }, [debouncedInvite])

  const shouldFetch = debouncedInvite?.length >= 5

  useEffect(() => {
    console.log("shouldFetch", shouldFetch)
  }, [shouldFetch])

  const { data, isValidating, error } = useSWR(
    shouldFetch
      ? `/discord/server/${debouncedInvite.split("/").slice(-1)[0]}`
      : null,
    {
      fallbackData,
      ...swrOptions,
    }
  )

  return { data, isLoading: isValidating, error }
}

export default useServerData
