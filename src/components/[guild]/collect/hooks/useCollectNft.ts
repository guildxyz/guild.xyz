import { useWeb3React } from "@web3-react/core"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chains } from "connectors"
import useBalance from "hooks/useBalance"
import useContract from "hooks/useContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useToastWithTweetButton } from "hooks/useToast"
import { useState } from "react"
import GUILD_REWARD_NFT_ABI from "static/abis/guildRewardNft.json"
import { useFetcherWithSign } from "utils/fetcher"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import useSubmitTransaction from "../../Requirements/components/GuildCheckout/hooks/useSubmitTransaction"
import { useCollectNftContext } from "../components/CollectNftContext"

type ClaimData = {
  // signed value which we need to send in the contract call
  uniqueValue: string
}

const useCollectNft = () => {
  const { captureEvent } = usePostHogContext()
  const { id: guildId, urlName } = useGuild()
  const postHogOptions = { guild: urlName }

  const tweetToast = useToastWithTweetButton()
  const showErrorToast = useShowErrorToast()

  const { chainId, account } = useWeb3React()
  const { chain, address, roleId, rolePlatformId } = useCollectNftContext()
  const { data } = useNftDetails(chain, address)
  const shouldSwitchChain = chainId !== Chains[chain]

  const [loadingText, setLoadingText] = useState("")
  const fetcherWithSign = useFetcherWithSign()

  const contract = useContract(address, GUILD_REWARD_NFT_ABI, true)

  const { mutateTokenBalance } = useBalance(address, Chains[chain])

  // Still WIP, no need to review
  const mint = async () => {
    if (shouldSwitchChain)
      return Promise.reject("Please switch network before minting")

    setLoadingText("Claiming NFT")

    const { uniqueValue }: ClaimData = await fetcherWithSign([
      `/FORCE_V2/guilds/${guildId}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`,
      {
        body: {
          args: [],
        },
      },
    ])

    const claimParams = [
      NULL_ADDRESS,
      account,
      uniqueValue,
      {
        value: data.fee,
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

        mutateTokenBalance()

        captureEvent("Minted NFT (GuildCheckout)", postHogOptions)

        tweetToast({
          title: "Successfully collected NFT!",
          tweetText: `Just collected my ${
            data?.name
          } NFT!\nguild.xyz/${urlName}/collect/${chain.toLowerCase()}/${address.toLowerCase()}`,
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
