import useImmutableSWR from "swr/immutable"
import { useGuild } from "../Context"

const getIsOwner = async (_, ownerAddresses: Array<string>, checkAddress: string) =>
  ownerAddresses.includes(checkAddress?.toLowerCase())

const useIsOwner = (checkAddress: string) => {
  const { owner } = useGuild()

  const shouldFetch = owner && checkAddress

  const { data } = useImmutableSWR(
    shouldFetch ? ["isOwner", owner?.addresses, checkAddress] : null,
    getIsOwner
  )

  return data
}

export default useIsOwner
