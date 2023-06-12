import { useWeb3React } from "@web3-react/core"
import { deleteKeyPairFromIdb, getKeyPairFromIdb } from "hooks/useKeyPair"
import useSWR, { mutate, unstable_serialize } from "swr"
import useSWRImmutable from "swr/immutable"
import { User } from "types"
import { useWeb3ConnectionManager } from "../../../Web3ConnectionManager"

const fetchShouldLinkToUser = async ([_, userId, connectParams]) => {
  const { userId: userIdToConnectTo } = connectParams ?? {}
  if (!userIdToConnectTo) return false

  if (
    typeof userId === "number" &&
    typeof userIdToConnectTo === "number" &&
    userIdToConnectTo !== userId
  ) {
    try {
      await deleteKeyPairFromIdb(userId).then(() =>
        mutate(unstable_serialize(["keyPair", userId]))
      )
    } catch {}
  }

  const keypair = await getKeyPairFromIdb(+userIdToConnectTo)

  return !!keypair
}

const useShouldLinkToUser = () => {
  const { account } = useWeb3React()
  const { data: user } = useSWRImmutable<User>(account ? `/user/${account}` : null)
  const { setAddressLinkParams, addressLinkParams } = useWeb3ConnectionManager()

  const { data: shouldLinkToUser } = useSWR(
    addressLinkParams?.userId
      ? ["shouldLinkToUser", user?.id, addressLinkParams]
      : null,
    fetchShouldLinkToUser,
    {
      shouldRetryOnError: false,
      onError: () => {
        setAddressLinkParams({ userId: null, address: null })
      },
    }
  )

  return shouldLinkToUser
}

export default useShouldLinkToUser
