import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { addressLinkParamsAtom } from "@/components/Providers/atoms"
import { AddressLinkParams } from "@/components/Providers/types"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useUserPublic } from "@/hooks/useUserPublic"
import { UserProfile } from "@guildxyz/types"
import { useMutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import useSubmit from "hooks/useSubmit"
import { SignProps } from "hooks/useSubmit/types"
import { useAtom } from "jotai"
import randomBytes from "randombytes"
import { useEffect } from "react"
import { useSWRConfig } from "swr"
import { fetcherWithSign } from "utils/fetcher"
import { deleteKeyPairFromIdb, getKeyPairFromIdb } from "utils/keyPair"
import { WalletClient } from "viem"

const getAddressLinkProof = async (
  address: `0x${string}`,
  signMessage: (message: string) => Promise<string>,
  walletClient?: WalletClient
) => {
  const addr = address.toLowerCase()
  const timestamp = Date.now()
  const nonce = randomBytes(32).toString("hex")
  const message = `Address: ${addr}\nNonce: ${nonce}\n Timestamp: ${timestamp}`
  const signature = walletClient
    ? walletClient?.account?.type === "local"
      ? await walletClient.account.signMessage({ message })
      : await walletClient.signMessage({
          message,
          account: walletClient.account,
        })
    : await signMessage(message)

  return { address: addr, nonce, timestamp, signature }
}

const checkAndDeleteKeys = async (userId: number) => {
  const keys = await getKeyPairFromIdb(userId)
  if (!keys) return

  await deleteKeyPairFromIdb(userId)
}
const useLinkAddress = () => {
  const { signMessage, address: addressToLink } = useWeb3ConnectionManager()
  const [addressLinkParams, setAddressLinkParams] = useAtom(addressLinkParamsAtom)
  const { id: currentUserId, deleteKeys } = useUserPublic()

  const { captureEvent } = usePostHogContext()

  // When we link an address, that has a registered keypair, we need to delete that keypair to trigger the modal. Plus that keys are invalidated anyway, and would end up sitting in the indexeddb util they are manually deleted
  useEffect(() => {
    if (
      !addressLinkParams?.userId ||
      !currentUserId ||
      addressLinkParams.userId === currentUserId
    )
      return

    captureEvent("useLinkAddress - checkAndDeleteKeys called", {
      addressLinkParamsUserId: addressLinkParams?.userId,
      currentUserId,
    })
    checkAndDeleteKeys(currentUserId).then(() => deleteKeys())
  }, [addressLinkParams, currentUserId, deleteKeys])

  const { mutate } = useSWRConfig()
  const mutateOptionalAuthSWRKey = useMutateOptionalAuthSWRKey()

  return useSubmit(
    async ({
      userId,
      address,
      signProps = {},
    }: AddressLinkParams & { signProps?: Partial<SignProps> }) => {
      const keys = await getKeyPairFromIdb(userId)
      if (!keys || !keys.keyPair) {
        throw new Error(
          "Failed to link address, please refresh the page and try again"
        )
      }

      const body = await getAddressLinkProof(
        (signProps?.walletClient?.account?.address?.toLowerCase() as `0x${string}`) ??
          addressToLink,
        signMessage,
        signProps?.walletClient
      )
      const newAddress = await fetcherWithSign(
        {
          address,
          keyPair: keys.keyPair,

          // TODO: Proper method-based typing would be nice, so we wouldn't have to pass these
          walletClient: undefined,
          publicClient: undefined,
        },
        `/v2/users/${userId}/addresses`,
        { method: "POST", body }
      )

      // Update signed profile data with new address
      await mutateOptionalAuthSWRKey<UserProfile>(
        `/v2/users/${userId}/profile`,
        (prev) => ({
          ...prev,
          addresses: [...(prev?.addresses ?? []), newAddress],
        }),
        { revalidate: false }
      )

      const newPublicProfile = {
        id: userId,
        publicKey: keys.pubKey,
        captchaVerifiedSince: new Date().toISOString(), // We don't necessarily know this, but the user has to be verified because of the main user. So we are just setting this to the current date, so the app knows the user is verified
        keyPair: keys,
      }

      // The address is now associated with the other user
      await mutate(
        `/v2/users/${addressToLink?.toLowerCase()}/profile`,
        newPublicProfile,
        {
          revalidate: false,
        }
      )

      setAddressLinkParams({ userId: undefined, address: undefined })

      return newPublicProfile
    }
  )
}

export default useLinkAddress
