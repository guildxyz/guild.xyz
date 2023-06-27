import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chains } from "connectors"
import useBalance from "hooks/useBalance"
import useCollectNft from "../../hooks/useCollectNft"
import { useCollectNftContext } from "../CollectNftContext"

const CollectNftButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const { chain, address } = useCollectNftContext()
  const { chainId } = useWeb3React()
  const shouldSwitchNetwork = chainId !== Chains[chain]

  const {
    onSubmit,
    isLoading: isMinting,
    loadingText: mintLoadingText,
  } = useCollectNft()

  const { data: nftDetails, isValidating: isNftDetailsValidating } = useNftDetails(
    chain,
    address
  )
  const { coinBalance, isLoading: isBalanceLoading } = useBalance(
    undefined,
    Chains[chain]
  )
  const isSufficientBalance =
    nftDetails?.fee && coinBalance ? coinBalance.gt(nftDetails.fee) : undefined

  const isLoading = isMinting || isNftDetailsValidating || isBalanceLoading
  const loadingText = isMinting ? mintLoadingText : "Checking your balance"

  const isDisabled = shouldSwitchNetwork || !isSufficientBalance || isLoading

  return (
    <Button
      size="lg"
      isDisabled={isDisabled}
      isLoading={isLoading}
      loadingText={loadingText}
      colorScheme={!isDisabled ? "blue" : "gray"}
      w="full"
      onClick={() => {
        captureEvent("Click: CollectNftButton (GuildCheckout)", {
          guild: urlName,
        })
        onSubmit()
      }}
    >
      {typeof isSufficientBalance === "boolean" && !isSufficientBalance
        ? "Insufficient balance"
        : "Collect NFT"}
    </Button>
  )
}

export default CollectNftButton
