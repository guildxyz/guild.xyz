import { useEffect } from "react"
import useSWR from "swr"

const fallbackData = {
  serverId: 0,
  categories: [],
}

const getServerData = (_, invite) => {
  console.log("fetch invite", invite, invite.split("/").at(-1))
  return fetch(`/api/discordCategories/${invite.split("/").at(-1)}`).then(
    (response) => (response.ok ? response.json() : fallbackData)
  )
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
    shouldFetch ? ["serverData", invite] : null,
    getServerData,
    {
      fallbackData,
    }
  )

  return [data, isValidating]
}

export default useServerData
