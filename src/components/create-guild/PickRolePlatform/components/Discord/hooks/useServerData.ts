import { useEffect, useRef, useState } from "react"
import useSWR from "swr"

const fallbackData = {
  serverId: 0,
  channels: [],
}

const useServerData = (invite: string) => {
  const [delayedInvite, setDelayedInvite] = useState(invite)
  const inviteTimeout = useRef(null)

  useEffect(() => {
    if (inviteTimeout.current) window.clearTimeout(inviteTimeout.current)

    inviteTimeout.current = setTimeout(() => setDelayedInvite(invite), 500)
  }, [invite])

  useEffect(() => {
    console.log("hook invite", delayedInvite)
    console.log("hook invite.length", delayedInvite?.length)
  }, [delayedInvite])

  const shouldFetch = delayedInvite?.length >= 5

  useEffect(() => {
    console.log("shouldFetch", shouldFetch)
  }, [shouldFetch])

  const { data, isValidating } = useSWR(
    shouldFetch
      ? `/role/discordChannels/${delayedInvite.split("/").slice(-1)[0]}`
      : null,
    {
      fallbackData,
    }
  )

  return { data, isLoading: isValidating }
}

export default useServerData
