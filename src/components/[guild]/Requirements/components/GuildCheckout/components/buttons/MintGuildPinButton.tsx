import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import useUsersGuildPins from "@/hooks/useUsersGuildPins"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { useAccount, useBalance } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import { useMintGuildPinContext } from "../../MintGuildPinContext"
import useGuildPinFee from "../../hooks/useGuildPinFee"
import useMintGuildPin from "../../hooks/useMintGuildPin"

const MintGuildPinButton = (): JSX.Element => {
  const { captureEvent, startSessionRecording } = usePostHogContext()
  const { id, urlName, guildPin } = useGuild()

  const { error, isInvalidImage, isTooSmallImage } = useMintGuildPinContext()

  const { address, chainId } = useAccount()

  const {
    onSubmit,
    isLoading: isMinting,
    loadingText: mintLoadingText,
  } = useMintGuildPin()

  const { data, isValidating } = useUsersGuildPins()
  const alreadyMintedOnChain = data?.find(
    (pin) =>
      pin.chainId === chainId &&
      +pin.attributes.find((attr) => attr.trait_type === "guildId").value === id
  )

  const { guildPinFee, isGuildPinFeeLoading } = useGuildPinFee()
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
    chainId: Chains[guildPin?.chain],
  })
  const isSufficientBalance =
    guildPinFee && balanceData ? balanceData.value > guildPinFee : false

  const isLoading =
    isMinting || isValidating || isGuildPinFeeLoading || isBalanceLoading
  const loadingText = isMinting
    ? mintLoadingText
    : isValidating
      ? "Checking your NFTs"
      : "Checking your balance"

  const isDisabled =
    isInvalidImage ||
    isTooSmallImage ||
    chainId !== Chains[guildPin.chain] ||
    !isSufficientBalance ||
    error ||
    isLoading ||
    alreadyMintedOnChain

  return (
    <Button
      data-testid="big-mint-guild-pin-button"
      size="lg"
      isDisabled={isDisabled}
      isLoading={isLoading}
      loadingText={loadingText}
      colorScheme={!isDisabled ? "blue" : "gray"}
      w="full"
      onClick={() => {
        captureEvent("Click: MintGuildPinButton (GuildCheckout)", {
          guild: urlName,
        })
        startSessionRecording()
        onSubmit()
      }}
    >
      {isInvalidImage || isTooSmallImage
        ? "Setup required"
        : alreadyMintedOnChain
          ? "Already minted"
          : !isSufficientBalance
            ? "Insufficient balance"
            : "Mint NFT"}
    </Button>
  )
}

export default MintGuildPinButton
