import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chains } from "connectors"
import useBalance from "hooks/useBalance"
import useUsersGuildPins from "hooks/useUsersGuildPins"
import useGuildPinContractsData from "../../hooks/useGuildPinContractsData"
import useGuildPinFee from "../../hooks/useGuildPinFee"
import useMintGuildPin from "../../hooks/useMintGuildPin"
import { useMintGuildPinContext } from "../../MintGuildPinContext"

const MintGuildPinButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { id, urlName } = useGuild()

  const guildPinContractsData = useGuildPinContractsData()

  const { error, isInvalidImage, isTooSmallImage } = useMintGuildPinContext()

  const { chainId } = useWeb3React()

  const {
    onSubmit,
    isLoading: isMinting,
    loadingText: mintLoadingText,
  } = useMintGuildPin()

  const { data, isValidating } = useUsersGuildPins()
  const alreadyMintedOnChain = data?.find(
    (guildPin) =>
      guildPin.chainId === chainId &&
      +guildPin.attributes.find((attr) => attr.trait_type === "guildId").value === id
  )

  const { guildPinFee, isGuildPinFeeLoading } = useGuildPinFee()
  const { coinBalance, isLoading: isBalanceLoading } = useBalance()
  const isSufficientBalance =
    guildPinFee && coinBalance ? coinBalance.gt(guildPinFee) : false

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
    !guildPinContractsData[Chains[chainId]] ||
    !isSufficientBalance ||
    error ||
    isLoading ||
    alreadyMintedOnChain

  return (
    <Button
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
        onSubmit()
      }}
      data-dd-action-name="Mint Guild Pin (GuildCheckout)"
    >
      {isInvalidImage || isTooSmallImage
        ? "Setup required"
        : !guildPinContractsData[Chains[chainId]]
        ? `Unsupported chain`
        : alreadyMintedOnChain
        ? "Already minted"
        : !isSufficientBalance
        ? "Insufficient balance"
        : "Mint NFT"}
    </Button>
  )
}

export default MintGuildPinButton
