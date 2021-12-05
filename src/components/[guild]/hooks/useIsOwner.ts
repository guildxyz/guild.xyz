import useGuild from "components/[guild]/hooks/useGuild"
import useImmutableSWR from "swr/immutable"

const getIsOwner = async (_, ownerAddresses: Array<string>, checkAddress: string) =>
  ownerAddresses.includes(checkAddress?.toLowerCase())

const useIsOwner = (checkAddress: string) => {
  const guild = useGuild()

  const shouldFetch = guild?.owner && checkAddress

  const { data } = useImmutableSWR(
    shouldFetch ? ["isOwner", guild?.owner?.addresses, checkAddress] : null,
    getIsOwner
  )

  return data
}

export default useIsOwner
