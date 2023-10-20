import { Chains } from "chains"
import { CONTRACT_CALL_ARGS_TO_SIGN } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useToastWithTweetButton } from "hooks/useToast"
import { useState } from "react"
import { useFetcherWithSign } from "utils/fetcher"
import { useAccount, useBalance, useChainId } from "wagmi"
import useSubmitTransaction from "../../Requirements/components/GuildCheckout/hooks/useSubmitTransaction"
import { useCollectNftContext } from "../components/CollectNftContext"
import useGuildFee from "./useGuildFee"
import useTopCollectors from "./useTopCollectors"

type ClaimData = {
  // signed value which we need to send in the contract call
  uniqueValue: string
}

const useCollectNft = () => {
  const { captureEvent } = usePostHogContext()
  const { id: guildId, urlName } = useGuild()
  const { id: userId } = useUser()
  const postHogOptions = { guild: urlName }

  const tweetToast = useToastWithTweetButton()
  const showErrorToast = useShowErrorToast()

  const { address } = useAccount()
  const chainId = useChainId()
  const { chain, nftAddress, roleId, rolePlatformId, guildPlatform } =
    useCollectNftContext()
  const { guildFee } = useGuildFee(chain)
  const { fee, name, refetch: refetchNftDetails } = useNftDetails(chain, nftAddress)
  const { mutate: mutateTopCollectors } = useTopCollectors()

  const shouldSwitchChain = chainId !== Chains[chain]

  const [loadingText, setLoadingText] = useState("")
  const fetcherWithSign = useFetcherWithSign()

  // WAGMI TODO
  // const contract = useContract(nftAddress, guildRewardNftAbi, true)
  const contract = null

  const { refetch: refetchBalance } = useBalance({
    address,
    token: nftAddress,
    chainId: Chains[chain],
  })

  const mint = async () => {
    if (shouldSwitchChain)
      return Promise.reject("Please switch network before minting")

    setLoadingText("Claiming NFT")

    const { uniqueValue }: ClaimData = await fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`,
      {
        body: {
          args: CONTRACT_CALL_ARGS_TO_SIGN[
            guildPlatform?.platformGuildData?.function
          ],
        },
      },
    ])

    const claimFee =
      typeof guildFee === "bigint" && typeof fee === "bigint"
        ? guildFee + fee
        : BigInt(0)

    // WAGMI TODO: claim flow
    const claimParams = [
      address,
      userId,
      uniqueValue,
      {
        value: claimFee,
      },
    ]

    try {
      await contract.callStatic.claim(...claimParams)
    } catch (callstaticError) {
      return Promise.reject(
        callstaticError.errorName ?? callstaticError.reason ?? "Contract error"
      )
    }

    return contract.claim(...claimParams)
  }

  return {
    ...useSubmitTransaction<null>(mint, {
      onSuccess: (txReceipt) => {
        setLoadingText("")

        if (txReceipt.status !== 1) {
          showErrorToast("Transaction failed")
          captureEvent("Mint NFT error (GuildCheckout)", {
            ...postHogOptions,
            txReceipt,
          })
          captureEvent("claim error (GuildCheckout)", {
            ...postHogOptions,
            txReceipt,
          })
          return
        }

        refetchBalance()
        refetchNftDetails()

        mutateTopCollectors(
          (prevValue) => ({
            topCollectors: [
              ...(prevValue?.topCollectors ?? []),
              address?.toLowerCase(),
            ],
            uniqueCollectors: (prevValue?.uniqueCollectors ?? 0) + 1,
          }),
          {
            revalidate: false,
          }
        )

        captureEvent("Minted NFT (GuildCheckout)", postHogOptions)

        tweetToast({
          title: "Successfully collected NFT!",
          tweetText: `Just collected my ${name} NFT!\nguild.xyz/${urlName}/collect/${chain.toLowerCase()}/${nftAddress.toLowerCase()}`,
        })
      },
      onError: (error) => {
        showErrorToast(error)
        setLoadingText("")

        captureEvent("Mint NFT error (GuildCheckout)", postHogOptions)
        captureEvent("mint nft pre-call error (GuildCheckout)", {
          ...postHogOptions,
          error,
        })
      },
    }),
    loadingText,
  }
}

export default useCollectNft
