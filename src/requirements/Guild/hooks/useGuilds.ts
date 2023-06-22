import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"
import fetcher from "utils/fetcher"

const fetchGuilds = ([_, search]): Promise<SelectOption<number>[]> => {
  const searchParams = new URLSearchParams({
    sort: "members",
    search: search ?? "",
  }).toString()

  return fetcher(`/v2/guilds?${searchParams}`)
    .then((list) =>
      list.map((guild) => ({
        img: guild.imageUrl,
        label: guild.name,
        value: guild.id,
        details: guild.urlName,
      }))
    )
    .catch((_) => [])
}

const useGuilds = (search?: string): SWRResponse<SelectOption<number>[]> =>
  useSWRImmutable(["guildsOptions", search], fetchGuilds)

export default useGuilds
