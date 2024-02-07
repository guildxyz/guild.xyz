import { ButtonProps } from "@chakra-ui/react"
import { Chains } from "chains"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useNftBalance from "hooks/useNftBalance"
import useShowErrorToast from "hooks/useShowErrorToast"
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
  const showErrorToast = useShowErrorToast()

  const { chain, nftAddress, alreadyCollected, roleId } = useCollectNftContext()
  const { id: guildId, urlName } = useGuild()

  const { isLoading: isAccessLoading, hasRoleAccess } = useRoleMembership(roleId)

  const chainId = useChainId()
  const shouldSwitchNetwork = chainId !== Chains[chain]

  const {
    onSubmit: onMintSubmit,
    isLoading: isMinting,
    loadingText: mintLoadingText,
  } = useCollectNft()

  const { triggerMembershipUpdate, isLoading: isMembershipUpdateLoading } =
    useMembershipUpdate(onMintSubmit, (error) =>
      showErrorToast({
        error: "Couldn't check eligibility",
        correlationId: error.correlationId,
      })
    )

  const { fee, isLoading: isNftDetailsLoading } = useNftDetails(chain, nftAddress)

  const { address } = useAccount()
  const { isLoading: isNftBalanceLoading } = useNftBalance({
    address,
    nftAddress,
    chainId: Chains[chain],
  })
  const { data: coinBalanceData, isLoading: isBalanceLoading } = useBalance({
    address,
  })

  const isSufficientBalance =
    typeof fee === "bigint" && coinBalanceData
      ? coinBalanceData.value > fee
      : undefined

  const isLoading =
    isAccessLoading ||
    isMembershipUpdateLoading ||
    isMinting ||
    isNftDetailsLoading ||
    isBalanceLoading
  const loadingText =
    isNftBalanceLoading || isMembershipUpdateLoading
      ? "Checking eligibility"
      : isMinting
      ? mintLoadingText
      : "Checking your balance"

  const isDisabled =
    shouldSwitchNetwork || !hasRoleAccess || alreadyCollected || !isSufficientBalance

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
        /**
         * We're always sending a join request here, because if the user joined the
         * role before the admins added the reward to it, they won't have the
         * UserReward in our backend and then they wouldn't be able to claim the NFT.
         * This way, we can make sure that this won't happen
         */
        triggerMembershipUpdate()
      }}
      {...rest}
      isDisabled={isDisabled || rest?.isDisabled}
    >
      {alreadyCollected
        ? "Already collected"
        : typeof isSufficientBalance === "boolean" && !isSufficientBalance
        ? "Insufficient balance"
        : label}
    </Button>
  )
}

export default CollectNftButton
