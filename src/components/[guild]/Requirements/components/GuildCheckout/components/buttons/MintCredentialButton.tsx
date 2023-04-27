import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Chains } from "connectors"
import { useMintCredentialContext } from "../../MintCredentialContext"
import useMintCredential from "../../hooks/useMintCredential"

const MintCredentialButton = (): JSX.Element => {
  const { credentialChain, error } = useMintCredentialContext()

  const { chainId } = useWeb3React()
  const isDisabled = Chains[credentialChain] !== chainId || error

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
      {"Mint credential"}
    </Button>
  )
}

export default MintCredentialButton
