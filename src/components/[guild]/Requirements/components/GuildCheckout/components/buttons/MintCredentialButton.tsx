import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { Chains } from "connectors"
import useGuildCredentials from "hooks/useGuildCredentials"
import { GUILD_CREDENTIAL_CONTRACT } from "utils/guildCheckout/constants"
import useMintCredential from "../../hooks/useMintCredential"
import { useMintCredentialContext } from "../../MintCredentialContext"

const MintCredentialButton = (): JSX.Element => {
  const { error } = useMintCredentialContext()

  const { chainId } = useWeb3React()

  const { onSubmit, isLoading, loadingText } = useMintCredential()

  const { id } = useGuild()
  const { data, isValidating } = useGuildCredentials()
  const alreadyMintedOnChain = data?.find(
    (credential) =>
      credential.chainId === chainId &&
      +credential.attributes.find((attr) => attr.trait_type === "guildId").value ===
        id
  )

  const isDisabled =
    !GUILD_CREDENTIAL_CONTRACT[Chains[chainId]] ||
    error ||
    isValidating ||
    alreadyMintedOnChain

  return (
    <Button
      size="lg"
      isDisabled={isDisabled}
      isLoading={isValidating || isLoading}
      loadingText={isValidating ? "Checking your NFTs" : loadingText}
      colorScheme={!isDisabled ? "blue" : "gray"}
      w="full"
      onClick={onSubmit}
      data-dd-action-name="Mint credential (GuildCheckout)"
    >
      {!GUILD_CREDENTIAL_CONTRACT[Chains[chainId]]
        ? `Unsupported chain`
        : alreadyMintedOnChain
        ? "Already minted"
        : "Mint NFT"}
    </Button>
  )
}

export default MintCredentialButton
