import { Contract } from "@ethersproject/contracts"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chain, Chains } from "connectors"
import useShowErrorToast from "hooks/useShowErrorToast"
import useTweetToast from "hooks/useTweetToast"
import { useState } from "react"
import ERC_721_ABI from "static/abis/erc721Abi.json"
import { useCollectNftContext } from "../components/CollectNftContext"
import useSubmitTransaction from "./useSubmitTransaction"

type ClaimData = {
  // signed value which we need to send in the contract call
  uniqueValue: string
}

const mint = async (
  chain: Chain,
  contractAddress: string,
  userAddress: string,
  provider: Web3Provider
) => {
  return Promise.resolve({ status: 1 })
  if (Chains[chain] !== provider.network.chainId)
    return Promise.reject("Please switch network before minting")

  const contract = new Contract(
    contractAddress,
    ERC_721_ABI,
    provider.getSigner(userAddress).connectUnchecked()
  )

  try {
    await contract.callStatic.claim()
  } catch (callstaticError) {
    return Promise.reject(
      callstaticError.errorName ?? callstaticError.reason ?? "Contract error"
    )
  }

  return contract.claim()
}

const useCollectNft = () => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()
  const postHogOptions = { guild: urlName }

  const tweetToast = useTweetToast()
  const showErrorToast = useShowErrorToast()

  const { chainId, account, provider } = useWeb3React()
  const { chain, address } = useCollectNftContext()
  const { data } = useNftDetails(chain, address)
  const shouldSwitchChain = chainId !== Chains[chain]

  const [loadingText, setLoadingText] = useState("")

  return {
    ...useSubmitTransaction<null>(() => mint(chain, address, account, provider), {
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
