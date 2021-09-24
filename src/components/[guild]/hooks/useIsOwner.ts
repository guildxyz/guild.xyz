import { useWeb3React } from "@web3-react/core"
import useImmutableSWR from "swr/immutable"
import { useGuild } from "../Context"

const getIsOwner = async (_, ownerAddresses, account) =>
  ownerAddresses.some(({ address }) => address === account?.toLowerCase())

const useIsOwner = () => {
  const { account } = useWeb3React()
  const { owner } = useGuild()

  const shouldFetch = owner && account

  const { data } = useImmutableSWR(
    shouldFetch ? ["isOwner", owner?.addresses, account] : null,
    getIsOwner
  )

  return data
}

export default useIsOwner
