import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"
import fetcher from "utils/fetcher"

const fetchGuilds = (_: string): Promise<SelectOption[]> =>
  fetcher("/guild?sort=members")
    .then((list) =>
      list.map((guild) => ({
        img: guild.imageUrl,
        label: guild.name,
        value: guild.urlName,
      }))
    )
    .catch((_) => [])

const useGuilds = (): SWRResponse<SelectOption[]> =>
  useSWRImmutable("guildsOptions", fetchGuilds)

export default useGuilds
