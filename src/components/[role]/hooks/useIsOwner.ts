import useGuild from "components/[guild]/hooks/useGuild"
import useRole from "components/[role]/hooks/useRole"
import useImmutableSWR from "swr/immutable"

const getIsOwner = async (_, ownerAddresses: Array<string>, checkAddress: string) =>
  ownerAddresses.includes(checkAddress?.toLowerCase())

const useIsOwner = (checkAddress: string) => {
  const guild = useGuild()
  const role = useRole()

  const shouldFetch = (guild?.owner || role?.owner) && checkAddress

  const { data } = useImmutableSWR(
    shouldFetch
      ? ["isOwner", (guild?.owner || role?.owner)?.addresses, checkAddress]
      : null,
    getIsOwner
  )

  return data
}

export default useIsOwner
