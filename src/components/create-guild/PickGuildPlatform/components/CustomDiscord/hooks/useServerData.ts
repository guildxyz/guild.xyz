import useSWR from "swr"

const fallbackData = {
  serverId: 0,
  categories: [],
}

const getServerData = (_, invite) =>
  fetch(
    `${process.env.NEXT_PUBLIC_API}/community/discordCategories/${invite
      .split("/")
      .at(-1)}`
  ).then((response) => (response.ok ? response.json() : fallbackData))

const useServerData = (invite: string) => {
  const shouldFetch = invite?.length >= 5

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
