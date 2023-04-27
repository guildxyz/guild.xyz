import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Chains } from "connectors"
import useMintCredential from "../../hooks/useMintCredential"
import { useMintCredentialContext } from "../../MintCredentialContext"

const MintCredentialButton = (): JSX.Element => {
  const { credentialChain } = useMintCredentialContext()

  const { chainId } = useWeb3React()
  const isDisabled = Chains[credentialChain] !== chainId

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
