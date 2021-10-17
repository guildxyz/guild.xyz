import { useGroup } from "components/[group]/Context"
import useImmutableSWR from "swr/immutable"
import { useGuild } from "../Context"

const getIsOwner = async (_, ownerAddresses: Array<string>, checkAddress: string) =>
  ownerAddresses.includes(checkAddress?.toLowerCase())

const useIsOwner = (checkAddress: string) => {
  const group = useGroup()
  const guild = useGuild()

  const shouldFetch = (group?.owner || guild?.owner) && checkAddress

  const { data } = useImmutableSWR(
    shouldFetch
      ? ["isOwner", (group?.owner || guild?.owner)?.addresses, checkAddress]
      : null,
    getIsOwner
  )

  return data
}

export default useIsOwner
