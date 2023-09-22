import useSWRImmutable from "swr/immutable"
import { Poap } from "types"
import fetcher from "utils/fetcher"

const fetchData = async (fancyIds: Array<string>) => {
  const promises = fancyIds.map((fancyId) =>
    fetcher(`/v2/third-party/poaps/${fancyId}`)
  )
  return Promise.all(promises)
}

const useGuildsPoaps = (
  fancyIds: Array<string>
): { guildsPoaps: Array<Poap>; isGuildsPoapsLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable(
    fancyIds?.length ? fancyIds : null,
    fetchData
  )

  return { guildsPoaps: data, isGuildsPoapsLoading: isValidating }
}

export default useGuildsPoaps
