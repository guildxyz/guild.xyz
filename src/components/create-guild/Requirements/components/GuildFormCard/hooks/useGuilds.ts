import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"
import fetcher from "utils/fetcher"

const fetchGuilds = (_: string): Promise<SelectOption<number>[]> =>
  fetcher("/guild?sort=members")
    .then((list) =>
      list.map((guild) => ({
        img: guild.imageUrl,
        label: guild.name,
        value: guild.id,
      }))
    )
    .catch((_) => [])

const useGuilds = (): SWRResponse<SelectOption<number>[]> =>
  useSWRImmutable("guildsOptions", fetchGuilds)

export default useGuilds
