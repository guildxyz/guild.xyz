import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chains } from "connectors"
import useBalance from "hooks/useBalance"
import useUsersGuildCredentials from "hooks/useUsersGuildCredentials"
import { GUILD_CREDENTIAL_CONTRACT } from "utils/guildCheckout/constants"
import useCredentialFee from "../../hooks/useCredentialFee"
import useMintCredential from "../../hooks/useMintCredential"
import { useMintCredentialContext } from "../../MintCredentialContext"

const MintCredentialButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { id, urlName } = useGuild()

  const { error, isInvalidImage, isTooSmallImage } = useMintCredentialContext()

  const { chainId } = useWeb3React()

  const { onSubmit, isLoading: isMinting, loadingText } = useMintCredential()

  const { data, isValidating } = useUsersGuildCredentials()
  const alreadyMintedOnChain = data?.find(
    (credential) =>
      credential.chainId === chainId &&
      +credential.attributes.find((attr) => attr.trait_type === "guildId").value ===
        id
  )

  const { credentialFee, isCredentialFeeLoading } = useCredentialFee()
  const { coinBalance, isLoading: isBalanceLoading } = useBalance()
  const isSufficientBalance =
    credentialFee && coinBalance ? coinBalance.gt(credentialFee) : false

  const isLoading =
    isCredentialFeeLoading || isBalanceLoading || isValidating || isMinting

  const isDisabled =
    isInvalidImage ||
    isTooSmallImage ||
    !GUILD_CREDENTIAL_CONTRACT[Chains[chainId]] ||
    !isSufficientBalance ||
    error ||
    isLoading ||
    alreadyMintedOnChain

  return (
    <Button
      size="lg"
      isDisabled={isDisabled}
      isLoading={isLoading}
      loadingText={isValidating ? "Checking your NFTs" : loadingText}
      colorScheme={!isDisabled ? "blue" : "gray"}
      w="full"
      onClick={() => {
        captureEvent("Click: MintCredentialButton (GuildCheckout)", {
          guild: urlName,
        })
        onSubmit()
      }}
      data-dd-action-name="Mint credential (GuildCheckout)"
    >
      {isInvalidImage || isTooSmallImage
        ? "Setup required"
        : !GUILD_CREDENTIAL_CONTRACT[Chains[chainId]]
        ? `Unsupported chain`
        : alreadyMintedOnChain
        ? "Already minted"
        : !isSufficientBalance
        ? "Insufficient balance"
        : "Mint NFT"}
    </Button>
  )
}

export default MintCredentialButton
