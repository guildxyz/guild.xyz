import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { CONTRACT_CALL_ARGS_TO_SIGN } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chains } from "connectors"
import useBalance from "hooks/useBalance"
import useContract from "hooks/useContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useToastWithTweetButton } from "hooks/useToast"
import { useState } from "react"
import GUILD_REWARD_NFT_ABI from "static/abis/guildRewardNft.json"
import { useFetcherWithSign } from "utils/fetcher"
import useSubmitTransaction from "../../Requirements/components/GuildCheckout/hooks/useSubmitTransaction"
import { useCollectNftContext } from "../components/CollectNftContext"
import useGuildFee from "./useGuildFee"

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

  const { chainId, account } = useWeb3React()
  const { chain, address, roleId, rolePlatformId, guildPlatform } =
    useCollectNftContext()
  const { guildFee } = useGuildFee()
  const { data } = useNftDetails(chain, address)
  const shouldSwitchChain = chainId !== Chains[chain]

  const [loadingText, setLoadingText] = useState("")
  const fetcherWithSign = useFetcherWithSign()

  const contract = useContract(address, GUILD_REWARD_NFT_ABI, true)

  const { mutateTokenBalance } = useBalance(address, Chains[chain])

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
      guildFee && data.fee ? guildFee.add(data.fee) : BigNumber.from(0)

    const claimParams = [
      account,
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
