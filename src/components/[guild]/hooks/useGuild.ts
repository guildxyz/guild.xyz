import useKeyPair from "hooks/useKeyPair"
import { useRouter } from "next/router"
import useSWR from "swr"
import { Guild } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"

const useGuild = (guildId?: string | number) => {
  const router = useRouter()

  const fetcherWithSign = useFetcherWithSign()

  const id = guildId ?? router.query.guild

  const { ready, keyPair } = useKeyPair()

  const swrKey =
    ready && keyPair
      ? [`/guild/details/${id}`, { method: "POST", body: {} }]
      : `/guild/${id}`

  const fetcherFunction = ready && keyPair ? fetcherWithSign : fetcher

  const { data, isValidating } = useSWR<Guild>(id ? swrKey : null, fetcherFunction)

  return {
    ...data,
    isLoading: !data && isValidating,
  }
}

export default useGuild
