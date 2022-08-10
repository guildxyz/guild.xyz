import useIsSuperAdmin from "hooks/useIsSuperAdmin"
import useKeyPair from "hooks/useKeyPair"
import { useRouter } from "next/router"
import useSWR from "swr"
import { Guild } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import useUser from "./useUser"

const useGuild = (guildId?: string | number) => {
  const router = useRouter()

  const { addresses } = useUser()
  const isSuperAdmin = useIsSuperAdmin()

  const id = guildId ?? router.query.guild

  const { ready, keyPair } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()

  const { data: basicData, mutate } = useSWR<Guild>(id ? `/guild/${id}` : null)

  const isAdmin = !!basicData?.admins?.some(
    (admin) => admin.address === addresses?.[0].toLowerCase()
  )

  const {
    data,
    isValidating,
    mutate: mutateDetails,
  } = useSWR<Guild>(
    id && ready && keyPair && (isAdmin || isSuperAdmin)
      ? [`/guild/details/${id}`, { method: "POST", body: {} }]
      : null,
    fetcherWithSign
  )

  return {
    ...(data ?? basicData),
    isDetailed: !!data,
    isLoading: !data && isValidating,
    mutateGuild: data ? mutateDetails : mutate,
  }
}

export default useGuild
