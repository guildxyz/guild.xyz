import { ButtonProps } from "@chakra-ui/react"
import { Chains } from "chains"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useNftBalance from "hooks/useNftBalance"
import { useAccount, useBalance, useChainId } from "wagmi"
import useCollectNft from "../hooks/useCollectNft"
import { useCollectNftContext } from "./CollectNftContext"

type Props = {
  label?: string
} & ButtonProps

const CollectNftButton = ({
  label = "Collect NFT",
  ...rest
}: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  const { chain, nftAddress, alreadyCollected, roleId } = useCollectNftContext()
  const { urlName } = useGuild()

  const { isLoading: isAccessLoading, hasRoleAccess } = useRoleMembership(roleId)

  const chainId = useChainId()
  const shouldSwitchNetwork = chainId !== Chains[chain]

  const {
    onSubmit: onMintSubmit,
    isLoading: isMinting,
    loadingText: mintLoadingText,
  } = useCollectNft()

  const { fee, isLoading: isNftDetailsLoading } = useNftDetails(chain, nftAddress)

  const { address } = useAccount()
  const { isLoading: isNftBalanceLoading } = useNftBalance({
    address,
    nftAddress,
    chainId: Chains[chain],
  })
  const { data: coinBalanceData, isLoading: isBalanceLoading } = useBalance()

  const isSufficientBalance =
    typeof fee === "bigint" && coinBalanceData
      ? coinBalanceData.value > fee
      : undefined

  const isLoading =
    isAccessLoading || isMinting || isNftDetailsLoading || isBalanceLoading
  const loadingText = isNftBalanceLoading
    ? "Checking your balance"
    : isMinting
    ? mintLoadingText
    : "Checking eligibility"

  const isDisabled = shouldSwitchNetwork || alreadyCollected || !isSufficientBalance

  return (
    <Button
      data-test="collect-nft-button"
      size="lg"
      isLoading={isLoading}
      loadingText={loadingText}
      colorScheme={!isDisabled ? "blue" : "gray"}
      w="full"
      onClick={() => {
        captureEvent("Click: CollectNftButton (GuildCheckout)", {
          guild: urlName,
        })
        onMintSubmit()
      }}
      {...rest}
      isDisabled={isDisabled || rest?.isDisabled}
    >
      {alreadyCollected
        ? "Already collected"
        : typeof isSufficientBalance === "boolean" && !isSufficientBalance
        ? "Insufficient balance"
        : !hasRoleAccess
        ? "Check access & collect"
        : label}
    </Button>
  )
}

export default CollectNftButton
