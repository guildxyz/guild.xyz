import useGuild from "components/[guild]/hooks/useGuild"
import useHall from "components/[hall]/hooks/useHall"
import useImmutableSWR from "swr/immutable"

const getIsOwner = async (_, ownerAddresses: Array<string>, checkAddress: string) =>
  ownerAddresses.includes(checkAddress?.toLowerCase())

const useIsOwner = (checkAddress: string) => {
  const hall = useHall()
  const guild = useGuild()

  const shouldFetch = (hall?.owner || guild?.owner) && checkAddress

  const { data } = useImmutableSWR(
    shouldFetch
      ? ["isOwner", (hall?.owner || guild?.owner)?.addresses, checkAddress]
      : null,
    getIsOwner
  )

  return data
}

export default useIsOwner
