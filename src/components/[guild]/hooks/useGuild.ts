import useKeyPair from "hooks/useKeyPair"
import { useRouter } from "next/router"
import useSWR from "swr"
import { Guild } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import useUser from "./useUser"

const useGuild = (guildId?: string | number) => {
  const router = useRouter()

  const { addresses } = useUser()

  const id = guildId ?? router.query.guild

  const { ready, keyPair } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()

  const { data: basicData } = useSWR<Guild>(id ? `/guild/${id}` : null)

  const isAdmin = !!basicData.admins?.some(
    (admin) => admin.address === addresses?.[0].toLowerCase()
  )

  const { data, isValidating } = useSWR<Guild>(
    id && ready && keyPair && isAdmin
      ? [`/guild/details/${id}`, { method: "POST", body: {} }]
      : null,
    fetcherWithSign
  )

  return {
    ...(data ?? basicData),
    isLoading: !data && isValidating,
  }
}

export default useGuild
