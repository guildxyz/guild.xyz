import { ButtonProps } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chains } from "connectors"
import useBalance from "hooks/useBalance"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"
import useCollectNft from "../hooks/useCollectNft"
import { useCollectNftContext } from "./CollectNftContext"

const join = (signedValidation: SignedValdation) =>
  fetcher(`/user/join`, signedValidation)

type Props = {
  label?: string
} & ButtonProps

const CollectNftButton = ({
  label = "Collect NFT",
  ...rest
}: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const showErrorToast = useShowErrorToast()

  const { chain, address, alreadyCollected } = useCollectNftContext()
  const { urlName } = useGuild()

  const { chainId } = useWeb3React()
  const shouldSwitchNetwork = chainId !== Chains[chain]

  const {
    onSubmit: onMintSubmit,
    isLoading: isMinting,
    loadingText: mintLoadingText,
  } = useCollectNft()

  const { onSubmit: onJoinAndMintSubmit, isLoading: isJoinLoading } =
    useSubmitWithSign(join, {
      onSuccess: onMintSubmit,
      onError: () => showErrorToast("Couldn't check eligibility"),
    })

  const { data: nftDetails, isValidating: isNftDetailsValidating } = useNftDetails(
    chain,
    address
  )
  const { isLoading: isNftBalanceLoading } = useBalance(address, Chains[chain])
  const { coinBalance, isLoading: isBalanceLoading } = useBalance(
    undefined,
    Chains[chain]
  )
  const isSufficientBalance =
    nftDetails?.fee && coinBalance ? coinBalance.gt(nftDetails.fee) : undefined

  const isLoading =
    isJoinLoading || isMinting || isNftDetailsValidating || isBalanceLoading
  const loadingText =
    isNftBalanceLoading || isJoinLoading
      ? "Checking eligibility"
      : isMinting
      ? mintLoadingText
      : "Checking your balance"

  const isDisabled =
    shouldSwitchNetwork || alreadyCollected || !isSufficientBalance || isLoading

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
        /**
         * We're always sending a join request here, because if the user joined the
         * role before the admins added the reward to it, they won't have the
         * UserReward in our backend and then they wouldn't be able to claim the NFT.
         * This way, we can make sure that this won't happen
         */
        onJoinAndMintSubmit()
      }}
      {...rest}
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
