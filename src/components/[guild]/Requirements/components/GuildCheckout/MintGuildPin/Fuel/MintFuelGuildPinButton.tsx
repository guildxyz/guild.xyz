import { useBalance } from "@fuel-wallet/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import { BaseAssetId } from "fuels"
import useAlreadyMinted from "./hooks/useAlreadyMinted"
import useFuelGuildPinFee from "./hooks/useFuelGuildPinFee"
import useMintFuelGuildPin from "./hooks/useMintFuelGuildPin"

const MintFuelGuildPinButton = () => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const { type } = useWeb3ConnectionManager()

  const { onSubmit, isLoading, loadingText } = useMintFuelGuildPin()

  const { data: fee, isValidating: isFeeValidating } = useFuelGuildPinFee()
  const { balance, isLoading: isBalanceValidating } = useBalance({
    address: BaseAssetId,
  })

  const { data: alreadyMinted, isValidating: isAlreadyMintedValidating } =
    useAlreadyMinted()
  const isSufficientBalance = fee && balance ? fee.lt(balance) : false
  const isDisabled = type === "EVM" || alreadyMinted || !isSufficientBalance

  return (
    <Button
      size="lg"
      isDisabled={isDisabled}
      isLoading={
        isFeeValidating ||
        isBalanceValidating ||
        isAlreadyMintedValidating ||
        isLoading
      }
      loadingText={
        isFeeValidating || isBalanceValidating || isAlreadyMintedValidating
          ? "Checking your balance"
          : loadingText
      }
      colorScheme={!isDisabled ? "blue" : "gray"}
      w="full"
      onClick={() => {
        captureEvent("Click: MintFuelGuildPinButton (GuildCheckout)", {
          guild: urlName,
        })
        onSubmit()
      }}
    >
      {type === "EVM"
        ? "Connect Fuel address"
        : alreadyMinted
        ? "Already minted"
        : !isSufficientBalance
        ? "Insufficient balance"
        : "Mint NFT"}
    </Button>
  )
}

export default MintFuelGuildPinButton
