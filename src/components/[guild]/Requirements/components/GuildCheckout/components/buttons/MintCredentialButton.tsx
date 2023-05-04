import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Chains } from "connectors"
import { GUILD_CREDENTIAL_CONTRACT } from "utils/guildCheckout/constants"
import useMintCredential from "../../hooks/useMintCredential"
import { useMintCredentialContext } from "../../MintCredentialContext"

const MintCredentialButton = (): JSX.Element => {
  const { error } = useMintCredentialContext()

  const { chainId } = useWeb3React()
  const isDisabled = !GUILD_CREDENTIAL_CONTRACT[Chains[chainId]] || error

  const { onSubmit, isLoading, loadingText } = useMintCredential()

  return (
    <Button
      size="lg"
      isDisabled={isDisabled}
      isLoading={isLoading}
      loadingText={loadingText}
      colorScheme={!isDisabled ? "blue" : "gray"}
      w="full"
      onClick={onSubmit}
      data-dd-action-name="Mint credential (GuildCheckout)"
    >
      {!GUILD_CREDENTIAL_CONTRACT[Chains[chainId]]
        ? `Unsupported chain`
        : "Mint NFT"}
    </Button>
  )
}

export default MintCredentialButton
