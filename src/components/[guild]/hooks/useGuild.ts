import useIsSuperAdmin from "hooks/useIsSuperAdmin"
import useKeyPair from "hooks/useKeyPair"
import { useRouter } from "next/router"
import useSWRImmutable from "swr/immutable"
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

  const { data, mutate, isValidating } = useSWRImmutable<Guild>(
    id ? `/guild/${id}` : null
  )

  const isAdmin = !!data?.admins?.some(
    (admin) => admin.address === addresses?.[0].toLowerCase()
  )

  const { data: dataDetails, mutate: mutateDetails } = useSWRImmutable<Guild>(
    id && ready && keyPair && (isAdmin || isSuperAdmin)
      ? [`/guild/details/${id}`, { method: "POST", body: {} }]
      : null,
    fetcherWithSign
  )

  return {
    ...(dataDetails ?? data),
    isDetailed: !!dataDetails,
    isLoading: !data && isValidating,
    mutateGuild: data ? mutateDetails : mutate,
  }
}

export default useGuild
