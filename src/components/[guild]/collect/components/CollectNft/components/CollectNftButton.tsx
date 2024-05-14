import { ButtonProps } from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useGuildFee from "components/[guild]/collect/hooks/useGuildFee"
import useGuildRewardNftBalanceByUserId from "components/[guild]/collect/hooks/useGuildRewardNftBalanceByUserId"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useWatch } from "react-hook-form"
import { useAccount, useBalance } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import useCollectNft from "../../../hooks/useCollectNft"
import { CollectNftForm, useCollectNftContext } from "../../CollectNftContext"

type Props = {
  label?: string
} & ButtonProps

const CollectNftButton = ({
  label = "Collect NFT",
  ...rest
}: Props): JSX.Element => {
  const { captureEvent, startSessionRecording } = usePostHogContext()

  const { chain, nftAddress, alreadyCollected, roleId } = useCollectNftContext()
  const { urlName } = useGuild()

  const { isLoading: isAccessLoading, hasRoleAccess } = useRoleMembership(roleId)

  const { isConnected, address, chainId } = useAccount()
  const shouldSwitchNetwork = chainId !== Chains[chain]

  const {
    onSubmit: onMintSubmit,
    isLoading: isMinting,
    loadingText: mintLoadingText,
  } = useCollectNft()

  const showErrorToast = useShowErrorToast()
  const { triggerMembershipUpdate, isLoading: isMembershipUpdateLoading } =
    useMembershipUpdate({
      onSuccess: () => onMintSubmit(),
      onError: (err) =>
        showErrorToast({
          error: "Couldn't check eligibility",
          correlationId: err.correlationId,
        }),
    })

  const amount = useWatch<CollectNftForm>({ name: "amount" })
  const { guildFee } = useGuildFee(chain)
  const { fee, isLoading: isNftDetailsLoading } = useNftDetails(chain, nftAddress)

  const { isLoading: isNftBalanceLoading } = useGuildRewardNftBalanceByUserId({
    nftAddress,
    chainId: Chains[chain],
  })
  const { data: coinBalanceData, isLoading: isBalanceLoading } = useBalance({
    address,
  })

  const isSufficientBalance =
    typeof guildFee === "bigint" &&
    typeof fee === "bigint" &&
    typeof coinBalanceData?.value === "bigint"
      ? coinBalanceData.value > (fee + guildFee) * BigInt(amount ?? 0)
      : undefined

  const isLoading =
    isAccessLoading ||
    isMembershipUpdateLoading ||
    isMinting ||
    isNftDetailsLoading ||
    isBalanceLoading
  const loadingText = isNftBalanceLoading
    ? "Checking your balance"
    : isMinting
    ? mintLoadingText
    : "Checking eligibility"

  const isDisabled =
    !isConnected || shouldSwitchNetwork || alreadyCollected || !isSufficientBalance

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
        startSessionRecording()

        if (hasRoleAccess) {
          onMintSubmit()
        } else {
          triggerMembershipUpdate({
            roleIds: [roleId],
          })
        }
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
